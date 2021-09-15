/**
 * Copyright 2020 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * This script provides utility functions to support the main scripts.
 */

const storeJson = require('../data/store.json');
const productJson = require('../data/product.json');

module.exports = {
  // STORE DATA
  getStoreData: () => {
    let data = [];
    storeJson.forEach((store) => {
      data.push(store);
    });
    return data;
  },

  // PRODUCT DATA
  getProductData: () => {
    let data = [];
    productJson.forEach((product) => {
      let amt = randomIntFromInterval(4000, 6000);
      data.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        restockAmt: amt,
        restockInt: 'monthly',
      });
    });
    return data;
  },

  // KEYWORD DATA
  extractKeywordData: (enrichedDatas) => {
    let data = [];
    let keywords = []; // array of objects, one for each product

    enrichedDatas.forEach(function (enrichedData) {
      // get object for this product
      let found = false;
      let keywordObj;
      keywords.forEach(function (keyword) {
        if (keyword.productId === enrichedData.ProductId) {
          keywordObj = keyword;
          found = true;
        }
      });
      if (!found) {
        keywordObj = {
          productId: enrichedData.ProductId,
          keywords: [],
        };
      }

      // iterate through all keywords for a single review
      enrichedData.enriched_text[0].keywords.forEach(function () {
        // determine if we have started collecting keywords for this product
        keywords.forEach(function (keyword) {
          // find out if this keyword has been used before
          found = false;
          for (var i = 0; i < keywordObj.keywords.length; i++) {
            if (keywordObj.keywords[i].keyword === keyword) {
              keywordObj.keywords[i].count += 1;
              found = true;
            }
          }
          if (!found) {
            keywordObj.keywords.push({
              keyword: keyword,
              count: 1,
            });
          }
        });
      });
    });    
    return data;
  },

  // Get review data from Discovery
  extractEnrichedData: (enrichedDatas) => {
    let data = [];

    enrichedDatas.forEach(function (enrichedData) {
      // console.log('Enriched Data: ' + JSON.stringify(enrichedData, null, 2));

      //
      // first get review data
      //

      // create a new date for review to match sales, between 7/1 and 12/31
      let reviewDate = randomDate();
      let monthStr = reviewDate.split('/')[0];
      let dayStr = reviewDate.split('/')[1];
      if (monthStr.length == 1) monthStr = '0' + monthStr;
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      reviewDate = ['2019', monthStr, dayStr].join('-');
      
      let summary = enrichedData.Summary.substring(0, 120);
      // console.log('Summary: ' + summary);
      let score = enrichedData.enriched_text[0].sentiment.score.toFixed(6);
      // console.log(JSON.stringify(enrichedData.enriched_text[0], null, 2));

      let idx = getProductObject(data, enrichedData.ProductId);
      if (idx < 0) {
        // not found, so create
        let obj = {
          productId: enrichedData.ProductId,
          reviews: [
            {
              time: reviewDate,
              rating: enrichedData.Score,
              score: score,
              label: enrichedData.enriched_text[0].sentiment.label,
              summary: summary,
            },
          ],
          keywords: [],
        };
        data.push(obj);
      } else {
        data[idx].reviews.push({
          time: reviewDate,
          rating: enrichedData.Score,
          score: score,
          label: enrichedData.enriched_text[0].sentiment.label,
          summary: summary,
        });
      }

      //
      // now get keyword data
      //

      // iterate through all keywords for the review
      idx = getProductObject(data, enrichedData.ProductId);
      enrichedData.enriched_text[0].keywords.forEach(function (keyword) {
        // find out if this keyword has been used before
        let found = false;
        for (var i = 0; i < data[idx].keywords.length; i++) {
          if (data[idx].keywords[i].text === keyword.text) {
            data[idx].keywords[i].count += 1;
            found = true;
          }
        }
        if (!found) {
          data[idx].keywords.push({
            text: keyword.text,
            count: 1,
          });
        }
      });
    });

    // keep only the most popular keywords
    let popularKeywords = [];
    data.forEach(function (entry) {
      entry.keywords.forEach(function (keyword) {
        if (keyword.count > 5) {
          popularKeywords.push({
            text: keyword.text,
            count: keyword.count,
          });
        }
      });

      entry.keywords = popularKeywords;
    });

    // console.log(JSON.stringify(data[0].keywords, null, 2));
    return data;
  },

  getReviewsFromEnrichedData: (results) => {
    let reviews = [];
    results.forEach(function (result) {
      result.reviews.forEach(function (review) {
        reviews.push({
          productId: result.productId,
          time: review.time,
          rating: review.rating,
          score: review.score,
          label: review.label,
          summary: review.summary,
        });
      });
    });

    return reviews;
  },

  getKeywordsAndCountFromEnrichedData: (results) => {
    let keywords = [];
    results.forEach(function (result) {
      result.keywords.forEach(function (keyword) {
        keywords.push({
          productId: result.productId,
          keyword: keyword.text,
          count: keyword.count,
        });
      });
    });

    return keywords;
  },
};

// generate a random date
function randomDate() {
  function randomValueBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
  let date1 = '07-01-2019';
  let date2 = '12-31-2019';
  date1 = new Date(date1).getTime();
  date2 = new Date(date2).getTime();
  if (date1 > date2) {
    return new Date(randomValueBetween(date2, date1)).toLocaleDateString();
  } else {
    return new Date(randomValueBetween(date1, date2)).toLocaleDateString();
  }
}

// generate a random number between min/max
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getProductObject(data, productId) {
  // get object for this product
  for (var idx = 0; idx < data.length; idx++) {
    if (data[idx].productId === productId) {
      return idx;
    }
  }

  return -1;
}
