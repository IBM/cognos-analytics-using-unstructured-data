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

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const dataUtil = require('./data-util');

module.exports = {
  // STORE DATA
  buildStoreFile: async () => {
    console.log('Build Store File');

    const csvWriter = createCsvWriter({
      path: '../data/out-stores.csv',
      header: [
        { id: 'storeId', title: 'StoreId' },
        { id: 'name', title: 'Store Name' },
        { id: 'address', title: 'Address' },
        { id: 'city', title: 'City' },
        { id: 'state', title: 'State' },
        { id: 'zip', title: 'Zip Code' },
        { id: 'lat', title: 'Latitude' },
        { id: 'long', title: 'Longitude' },
      ],
    });

    let data = dataUtil.getStoreData();
    csvWriter
      .writeRecords(data)
      .then(() => console.log('The store CSV file was written successfully'));

    return true;
  },

  // PRODUCT DATA
  buildProductFile: async () => {
    console.log('Build Product File');

    const csvWriter = createCsvWriter({
      path: '../data/out-products.csv',
      header: [
        { id: 'productId', title: 'ProductId' },
        { id: 'name', title: 'Product Name' },
        { id: 'price', title: 'Price' },
        { id: 'restockAmt', title: 'Restock Amount' },
        { id: 'restockInt', title: 'Restock Interval' },
      ],
    });

    let data = dataUtil.getProductData();
    csvWriter
      .writeRecords(data)
      .then(() =>
        console.log('The product CSV file was written successfully')
      );

    return true;
  },

  // SALES DATA from stores
  buildSalesfile: async () => {
    console.log('Build Sales File');

    const csvWriter = createCsvWriter({
      path: '../data/out-sales.csv',
      header: [
        { id: 'storeId', title: 'StoreId' },
        { id: 'productId', title: 'ProductId' },
        { id: 'date', title: 'Date' },
        { id: 'amount', title: 'Quantity' },
      ],
    });

    let data = dataUtil.getSalesData();

    csvWriter
      .writeRecords(data)
      .then(() => console.log('The sales CSV file was written successfully'));

    return true;
  },
};
