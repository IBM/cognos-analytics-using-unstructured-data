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
 * node load-product-data-to-db.js
 *
 * Queries Watson Discovery to retrieve all reviews which include sentiment data.
 * That data is then written out to build a new csv file - 'data/Reviews-with-sentiment.csv'.
 * Each record is also written to a Db2 instance. Instructions for how to do this:
 * https://developer.ibm.com/mainframe/2019/08/07/accessing-ibm-db2-on-node-js/
 * https://github.com/ibmdb/node-ibm_db/blob/master/APIDocumentation.md
 */

const salesData = require('./create-product-data');
const enrichData = require('./save-disco-enrichments');

salesData
  .buildStoreFile()
  .then((done) => {
    return salesData.buildProductFile();
  })
  .then((done) => {
    return salesData.buildWarehouseFile();
  })
  .then((done) => {
    return salesData.buildOrderFile();
  })
  .then((done) => {
    return salesData.buildSalesfile();
  })
  .then((done)=>{
      enrichData.discoEnrichAndSave();
  })
  .catch((err) => {
    console.log(err);
    return;
  });