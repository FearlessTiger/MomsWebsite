const express = require('express');
const app = express();
const path = require('path');
const { fetchMenuItems } = require('./js/server');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/menu-items', (req, res) => {
    fetchMenuItems((menuItems) => {
        res.json(menuItems);
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
