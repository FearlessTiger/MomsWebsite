AWS.config.update({
    region: 'us-east-2',
    accessKeyId: 'AKIAZI2LEHSIN7P3JYJ6',
    secretAccessKey: '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'
});
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var selectedItems = JSON.parse(localStorage.getItem('selectedItems'));

document.addEventListener('DOMContentLoaded', async function() {
    await displayItems(selectedItems);
});

function getItemPrice(itemName, itemSize) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'MKitchenMenu'
        };

        dynamodb.scan(params, function(err, data) {
            if (err) {
                console.error("Unable to get item price. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                var price;
                var menuItems = data.Items;
                menuItems.forEach(function(item) {
                    if (item.itemName.S == itemName) {
                        var itemPrices = item.itemPrices.NS;
                        var itemPriceArray = itemPrices.map(Number).sort((a, b) => a - b);

                        if (itemSize.toString() == "small") {
                            price = itemPriceArray[0];
                        } else if (itemSize.toString() == "medium") {
                            price = itemPriceArray[1];
                        } else if (itemSize.toString() == "large") {
                            price = itemPriceArray[2];
                        }
                    }
                });
                console.log(price);
                resolve(price);
            }
        });
    });
}

async function displayItems(items) {
    const bagItemsElement = document.getElementById('bag-items');
    bagItemsElement.innerHTML = '';

    for (const [key, value] of Object.entries(items)) {
        const [size, quantity] = value;
        const price = await getItemPrice(key, size);
        const itemElement = document.createElement('div');
        itemElement.classList.add('menu-item');
        itemElement.innerHTML = `
            <span>${key}</span>
            <span>${size}</span>
            <span>Quantity: <input type="number" value="${quantity}" min="1" class="quantity-input" data-item-name="${key}" data-item-size="${size}"></span>
            <span class="item-price" data-item-name="${key}" data-item-size="${size}">$${(price * quantity).toFixed(2)}</span>
        `;
        bagItemsElement.appendChild(itemElement);
    }

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', async function(event) {
            const newQuantity = event.target.value;
            const itemName = event.target.getAttribute('data-item-name');
            const itemSize = event.target.getAttribute('data-item-size');
            const newPrice = await getItemPrice(itemName, itemSize);

            const priceElement = document.querySelector(`.item-price[data-item-name="${itemName}"][data-item-size="${itemSize}"]`);
            priceElement.textContent = `$${(newPrice * newQuantity).toFixed(2)}`;
        });
    });
}

function placeOrder() {
    let date = new Date().toLocaleDateString();
    Object.entries(selectedItems).forEach(function([key, value]) {
        var params = {
            TableName: 'MKitchenOrders',
            Item: {
                'itemName': {S: key},
                'creationDate': {S: date},
                'itemSize': {S: value.toString()},
                'itemQuantity': {S: value.toString()}
            }
        }
        dynamodb.putItem(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Item added:", JSON.stringify(data, null, 2));
            }
        });
    });

    alert('Order placed successfully!');
}
