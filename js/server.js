const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

app.get('/menu-items', (req, res) => {
    const params = {
        TableName: 'MKitchenMenu'
    };

    dynamodb.scan(params, function(err, data) {
        if (err) {
            res.status(500).send("Error fetching data from DynamoDB");
        } else {
            res.json(data.Items);
        }
    });
});

app.post('/place-order', (req, res) => {
    const { TableName, Item } = req.body;
    const params = { TableName, Item };

    dynamodb.putItem(params, function(err, data) {
        if (err) {
            res.status(500).send("Error placing order");
        } else {
            res.json({ message: "Order placed successfully", data });
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
