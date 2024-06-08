// server.js
require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getMenuItems = async () => {
  const params = {
    TableName: 'MKitchenMenu',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.error('Error retrieving menu items: ', error);
    return [];
  }
};

module.exports = { getMenuItems };
