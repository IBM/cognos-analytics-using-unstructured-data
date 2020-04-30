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

const productJson = require('../data/product.json');

module.exports = {

  // PRODUCT DATA
  getProductData: () => {
    let data = [];
    productJson.forEach((product) => {
      let amt = randomIntFromInterval(50, 100);
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

  // Get review data from Discovery
  extractEnrichedData: (enrichedDatas) => {
    let data = [];
    let currentDate = new Date();

    enrichedDatas.forEach(function (enrichedData) {
      // console.log(JSON.stringify(enrichedData, null, 2));

      //
      // first get review data
      //

      // convert timestamp to string
      let dd = new Date(enrichedData.Time * 1000);
      let month = dd.getMonth() + 1;
      let day = dd.getDate();
      // all reviews are 2012 or older, so making them all CurrentYear -1
      let year = currentDate.getFullYear() - 1;

      // hack for leap year months.
      if (month === 2 && day === 29) {
        day = day - 1;
      }

      let monthStr = '' + month;
      let dayStr = '' + day;
      if (month < 10) monthStr = '0' + month;
      if (day < 10) dayStr = '0' + day;

      let reviewDate = [year, monthStr, dayStr].join('-');
      let summary = enrichedData.Summary.substring(0, 120);
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

  // return array of reviews from disco results
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

  // return array of keywords from disco results
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

// generate a random number between min/max
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// return the index in the array of product IDs
function getProductObject(data, productId) {
  // get object for this product
  for (var idx = 0; idx < data.length; idx++) {
    if (data[idx].productId === productId) {
      return idx;
    }
  }

  return -1;
}
