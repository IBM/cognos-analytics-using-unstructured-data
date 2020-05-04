!!!! WORK IN PROGRESS !!!

# Cognos Analytics

Cognos Analytics is a tool that includes data modeling and dashboards that provide users the ability to prepare, visualize, and analyze their data. Data can come from both structured and unstructured sources, and in multiple formats.

In this code pattern, we will provide examples of how to incorporate data from multiple sources, as well as how to create the visualizations to best represent the data.

The theme of this code pattern is built around data for a small coffee manufacturing company, which produces several types of coffee that they sell in local markets. The data will consist of reviews and ratings for their different coffee flavors, as well as associated sales and inventory data.

This code pattern is divided into the following sections:

## Visualize unstructured data from Watson Discovery in the Cognos Analytics Dashboard

In this section, we walk through the steps to:

* Build product review data
* Upload the data into Watson Discovery for enrichment and analysis
* Query the Watson Discovery results to capture keywords and enrichments
* Upload the data into Cognos Analytics to create data modules and dashboard visualizations

Click [here](doc/source/discovery-data.md) to begin.

## Visualize customer insights with business data for product performance analysis

In this section, we build on the first section by adding:

* Create sales, store and inventory data to support our coffee company product data
* Upload all product and business data into Db2 Warehouse tables
* Connect the Db2 Warehouse to Cognos Analytics
* Create additional Cognos Analytics dashboards to visualize business data

Click [here](doc/source/business-data.md) to begin.

# License

This code pattern is licensed under the Apache Software License, Version 2.  Separate third party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1 (DCO)](https://developercertificate.org/) and the [Apache Software License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache Software License (ASL) FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
