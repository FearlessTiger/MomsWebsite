var myData = JSON.parse(data);
var accessKeyId = myData[0].accessKeyId;
var secretAccessKey = myData[1].secretAccessKey;



AWS.config.update({
    region: 'us-east-2',
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

var dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

var selectedItems = JSON.parse(localStorage.getItem('selectedItems'));

document.addEventListener('DOMContentLoaded', async function () {
    await displayItems(selectedItems);
});

function getItemPrice(itemName, itemSize) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'MKitchenMenu'
        };

        dynamodb.scan(params, function (err, data) {
            if (err) {
                console.error("Unable to get item price. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                var price;
                var menuItems = data.Items;
                menuItems.forEach(function (item) {
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
        input.addEventListener('change', async function (event) {
            const newQuantity = event.target.value;
            const itemName = event.target.getAttribute('data-item-name');
            const itemSize = event.target.getAttribute('data-item-size');
            const newPrice = await getItemPrice(itemName, itemSize);

            const priceElement = document.querySelector(`.item-price[data-item-name="${itemName}"][data-item-size="${itemSize}"]`);
            priceElement.textContent = `$${(newPrice * newQuantity).toFixed(2)}`;
        });
    });
}

function getCurrentDate() {
    return new Date().toISOString();
}

function generateUUID() {
    // Generate a simple UUID for unique identification
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getOrderName() {
    return document.getElementById('orderNameInput').value;
}

function getPhoneNumber() {
    return document.getElementById('phoneNumberInput').value;
}

async function placeOrder() {
    console.log(Object.entries(selectedItems));
    console.log(selectedItems);
    console.log(typeof selectedItems);

    const itemsArray = Object.entries(selectedItems).map(([itemName, itemSize]) => {
        // Retrieve the quantity from the corresponding input element
        const quantityInput = document.querySelector(`input[data-item-name="${itemName}"][data-item-size="${itemSize}"]`);
        const itemQuantity = quantityInput ? quantityInput.value : 1; 

        return {
            PutRequest: {
                Item: {
                    'orderId': { S: getCurrentDate() }, 
                    'itemName': { S: itemName },
                    'creationDate': { S: generateUUID() },
                    'itemSize': { S: itemSize.toString() },
                    'itemQuantity': { N: itemQuantity.toString() }, 
                    'orderName': { S: getOrderName() },
                    'phoneNumber': { S: getPhoneNumber() }
                }
            }
        };
    });

    const batchSize = 25;
    for (let i = 0; i < itemsArray.length; i += batchSize) {
        const batch = itemsArray.slice(i, i + batchSize);

        var params = {
            RequestItems: {
                'MKitchenOrders': batch
            }
        };

        dynamodb.batchWriteItem(params, function (err, data) {
            if (err) {
                console.error("Unable to add items. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Items added:", JSON.stringify(data, null, 2));
            }
        });

        // Delay for 1000ms
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    alert('Order placed successfully!');
    window.location.replace("confirmation.html");

}

document.getElementById('placeOrderButton').addEventListener('click', placeOrder);