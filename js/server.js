require('dotenv').config();
const AWS = require('aws-sdk');
const express = require('express');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

const { DynamoDB } = require('@aws-sdk/client-dynamodb');

const dynamodb = new DynamoDB({ apiVersion: '2012-08-10' });

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.


function getMenuItems() {
    var params = {
        TableName: 'MKitchenMenu'
    };

    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
            var menuItems = data.Items;
            return menuItems;
        }
    });
}

export { getMenuItems };

