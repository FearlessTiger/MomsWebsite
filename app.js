const express = require('express');
const app = express();
const path = require('path');
const { fetchMenuItems, placeOrder } = require('./js/server');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/menu-items', (req, res) => {
    fetchMenuItems((menuItems) => {
        res.json(menuItems);
    });
});

app.post('/api/place-order', (req, res) => {
    placeOrder(req.body.items, (err) => {
        if (err) {
            res.status(500).send('Failed to place order');
            console.log(err);
        } else {
            res.status(200).send('Order placed successfully');
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
