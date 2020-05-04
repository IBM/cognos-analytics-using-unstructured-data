# Visualize customer insights with business data for product performance analysis

In this section, we will walk you through the process of creating sales, store and inventory data to support our coffee company products and upload these business data into Db2 Warehouse schema, then use Cognos Analytics to connect to IBM Db2 Warehouse on cloud and dynamically create additional Cognos Analytics dashboards to visualize the business data loaded from IBM Db2 Warehouse.

## Flow


## Included components

* [Cognos Analytics](https://www.ibm.com/products/cognos-analytics): A business intelligence solution that empowers users with AI-infused self-service capabilities that accelerate data preparation, analysis, and repot creation.
* [Watson Discovery](https://www.ibm.com/watson/services/discovery/): A cognitive search and content analytics engine for applications to identify patterns, trends, and actionable insights.
* [IBM Db2 Warehouse](https://www.ibm.com/products/db2-warehouse): A client-managed, highly flexible operational data warehouse for private clouds and containerized deployments.

## Featured technologies

* [Node.js](https://nodejs.org/): An open-source JavaScript run-time environment for executing server-side JavaScript code.

## Steps

1. [Create IBM Db2 Warehouse service on IBM Cloud](#1-create-ibm-db2-warehouse-service-on-ibm-cloud)
1. [Add db2 service credentials to environment file](#2-add-db2-service-credentials-to-environment-file)
1. [Run the script to load data to the database](#3-run-the-script-to-load-data-to-the-database)
1. [Create database connection in Cognos Analytics](#4-create-database-connection-in-cognos-analytics)
1. [Load metadata from the connected Database](#5-load-metadata-from-the-connected-database)
1. [Create a new data module](#6-create-a-new-data-module)
1. [Create a new dashboard and select datasource](#7-create-a-new-dashboard-and-select-datasource)
1. [Run Cognos Analytics to visualize data](#6-run-cognos-analytics-to-visualize-data)

>If you have come here without completing the first tutorial please click [here](doc/source/discovery-data.md) to begin.


## 1. Create IBM Db2 Warehouse service on IBM Cloud

Create the IBM Db2 Warehouse on Cloud service and make sure to note the credentials using the following link:

* [**IBM Db2 Warehouse on Cloud**](https://cloud.ibm.com/catalog/services/db2-warehouse)

## 2. Add db2 service credentials to environment file

At this point you must already have a `.env` file in your project directory. Change the value of `DB2wh_DSN` in the `.env` file as shown below:

```bash
DB2WH_DSN=<value of ssldsn>

# Optional settings
WRITE_TO_CSV_FILE=false
WRITE_TO_DB=true

```

![db2warehouse-credentials](images/db2wh-service-creds.png)

Also there are optional parameters `WRITE_TO_DB` and `WRITE_TO_CSV_FILE` where you can toggle between on and off for writing to the database and/or CSV. `WRITE_TO_DB` parameter needs to be set to `true` for this tutorial. `WRITE_TO_CSV_FILE` can be set to `false` as in the first part you have already generated the csv files.

## 3. Run the script to load data to the database

From the command prompt go to the `lib` folder in your project directory. And run the following command to load business data to IBM Db2 Warehous on cloud:

```bash
node load-product-data-to-db.js
```



