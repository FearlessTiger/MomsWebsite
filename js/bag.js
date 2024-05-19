// frontend/script.js
document.addEventListener('DOMContentLoaded', async function() {
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems'));
    await displayItems(selectedItems);
});

async function fetchMenuItems() {
    try {
        const response = await fetch('http://localhost:3000/menu-items');
        return await response.json();
    } catch (error) {
        console.error('Error fetching menu items:', error);
    }
}

async function getItemPrice(itemName, itemSize) {
    const menuItems = await fetchMenuItems();
    let price;
    menuItems.forEach(item => {
        if (item.itemName.S === itemName) {
            const itemPrices = item.itemPrices.NS.map(Number).sort((a, b) => a - b);
            if (itemSize === "small") {
                price = itemPrices[0];
            } else if (itemSize === "medium") {
                price = itemPrices[1];
            } else if (itemSize === "large") {
                price = itemPrices[2];
            }
        }
    });
    return price;
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
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems'));
    const date = new Date().toLocaleDateString();
    const orders = Object.entries(selectedItems).map(([key, value]) => ({
        TableName: 'MKitchenOrders',
        Item: {
            itemName: { S: key },
            creationDate: { S: date },
            itemSize: { S: value[0] },
            itemQuantity: { S: value[1].toString() }
        }
    }));

    orders.forEach(order => {
        fetch('http://localhost:3000/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(response => response.json())
        .then(data => console.log('Order placed:', data))
        .catch(error => console.error('Error placing order:', error));
    });

    alert('Order placed successfully!');
}
