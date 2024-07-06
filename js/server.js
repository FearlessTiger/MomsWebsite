const AWS_details = require('./awsConfig');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2',
    accessKeyId: AWS_details.AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_details.AWS_SECRET_ACCESS_KEY
 });
 
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

// Function to fetch menu items from DynamoDB
function fetchMenuItems(callback) {
    var params = {
        TableName: 'MKitchenMenu'
    };

    dynamodb.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
            var menuItems = data.Items;
            callback(menuItems);
        }
    });
}

module.exports = { fetchMenuItems };
