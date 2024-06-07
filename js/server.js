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

// Route to fetch menu items
app.get('/menu-items', async (req, res) => {
    const params = {
        TableName: 'MKitchenMenu'
    };

    try {
        const data = await dynamodb.scan(params).promise();
        res.json(data.Items);
    } catch (err) {
        console.error("Error fetching menu items:", err);
        res.status(500).json({ error: "Error fetching menu items" });
    }
});

// Route to place order
app.post('/place-order', async (req, res) => {
    const { orders } = req.body;

    const promises = Object.entries(orders).map(([key, order]) => {
        const params = {
            TableName: 'MKitchenOrders',
            Item: AWS.DynamoDB.Converter.marshall({
                itemName: {S: key},
                creationDate: {S: order.creationDate},
                itemSize: {S: order.itemSize},
                itemQuantity: {N: order.itemQuantity}
            })
        };
        return dynamodb.putItem(params).promise();
    });

    try {
        await Promise.all(promises);
        res.json({ message: "Orders placed successfully" });
    } catch (err) {
        console.error("Error placing orders:", err);
        res.status(500).json({ error: "Error placing orders", details: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
