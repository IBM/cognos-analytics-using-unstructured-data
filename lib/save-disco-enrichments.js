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
 * To Run:
 * cd scripts
 * node store-disco-enrichments.js
 *
 * Queries Watson Discovery to retrieve all reviews which include sentiment data.
 * That data is then written out to build a new csv file - 'data/Reviews-with-sentiment.csv'.
 * Each record is also written to a Db2 instance. Instructions for how to do this:
 * https://developer.ibm.com/mainframe/2019/08/07/accessing-ibm-db2-on-node-js/
 * https://github.com/ibmdb/node-ibm_db/blob/master/APIDocumentation.md
 */

require('dotenv').config({
  silent: true,
  path: '../.env',
});

const dataUtil = require('./data-util');
const DiscoveryV2 = require('ibm-watson/discovery/v2');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const discovery = new DiscoveryV2({
  version: '2019-04-30',
});

const queryParams = {
  projectId: process.env.DISCOVERY_PROJECT_ID,
  count: 1000,
};

module.exports = {
  discoEnrichAndSave: () => {
    discovery
      .query(queryParams)
      .then((queryResponse) => {
        // console.log(JSON.stringify(queryResponse, null, 2));
        return queryResponse.result;
      })
      .then((result) => {
        return dataUtil.extractEnrichedData(result.results);
      })
      .then((result) => {        
        buildReviewFile(result);
        return result;
      })
      .catch((err) => {
        console.log('error:', err);
      });
  },
};

// write out each review as a row into a csv file
function buildReviewFile(results) {
  console.log('Build product review and keyword CSV Files');
  // console.log(JSON.stringify(results, null, 2));

  const csvReviewWriter = createCsvWriter({
    path: '../data/out-reviews.csv',
    header: [
      { id: 'productId', title: 'ProductId' },
      { id: 'time', title: 'Time' },
      { id: 'rating', title: 'Rating' },
      { id: 'score', title: 'Sentiment Score' },
      { id: 'label', title: 'Sentiment Label' },
      { id: 'summary', title: 'Summary' },
    ],
  });

  const csvKeywordWriter = createCsvWriter({
    path: '../data/out-keywords.csv',
    header: [
      { id: 'productId', title: 'ProductId' },
      { id: 'keyword', title: 'Keyword' },
      { id: 'count', title: 'Count' },
    ],
  });

  let reviews = dataUtil.getReviewsFromEnrichedData(results);
  let keywords = dataUtil.getKeywordsAndCountFromEnrichedData(results);

  csvReviewWriter
    .writeRecords(reviews)
    .then(() => console.log('The product review CSV file was written successfully'));

  csvKeywordWriter
    .writeRecords(keywords)
    .then(() => console.log('The product keyword CSV file was written successfully'));
}
