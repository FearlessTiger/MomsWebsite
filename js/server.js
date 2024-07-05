const express = require('express');
const AWS = require('aws-sdk');
const app = express();
require('dotenv').config();
const port = 3000;

AWS.config.update({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

app.get('/menu/fetchMenuItems', (req, res) => {
    const params = {
        TableName: 'MKitchenMenu'
    };

    dynamodb.scan(params, (err, data) => {
        if (err) {
            res.status(500).send({ error: 'Unable to fetch the menu' });
        } else {
            res.send(data);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
