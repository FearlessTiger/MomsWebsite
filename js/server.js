const AWS_details = require('./awsConfig');
const AWS = require('aws-sdk');
AWS.config.update({ 
    region: AWS_details.AWS_REGION,
    accessKeyId: AWS_details.AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_details.AWS_SECRET_ACCESS_KEY 
});

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

function fetchMenuItems(callback) {
    const params = {
        TableName: 'MKitchenMenu'
    };

    dynamodb.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
            callback(data.Items);
        }
    });
}

function placeOrder(items, callback) {
    const itemsArray = items.map(item => ({
        PutRequest: {
            Item: {
                'orderId': { S: getCurrentDate() },
                'itemName': { S: item.itemName },
                'creationDate': { S: generateUUID() },
                'itemSize': { S: item.itemSize },
                'itemQuantity': { N: item.itemQuantity },
                'orderName': { S: item.orderName },
                'phoneNumber': { S: item.phoneNumber }
            }
        }
    }));

    const batchSize = 25;
    const promises = [];
    for (let i = 0; i < itemsArray.length; i += batchSize) {
        const batch = itemsArray.slice(i, i + batchSize);
        const params = {
            RequestItems: {
                'MKitchenOrders': batch
            }
        };
        promises.push(dynamodb.batchWriteItem(params).promise());
    }

    Promise.all(promises)
        .then(() => callback(null))
        .catch(err => callback(err));
}

function getCurrentDate() {
    return new Date().toISOString();
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = { fetchMenuItems, placeOrder };
