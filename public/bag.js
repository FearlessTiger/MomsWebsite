document.addEventListener('DOMContentLoaded', async function () {
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems'));
    await displayItems(selectedItems);
});

async function fetchMenuItems() {
    const response = await fetch('/api/menu-items');
    if (!response.ok) {
        throw new Error('Failed to fetch menu items');
    }
    return await response.json();
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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
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
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems'));
    const itemsArray = Object.entries(selectedItems).map(([itemName, itemSize]) => {
        const quantityInput = document.querySelector(`input[data-item-name="${itemName}"][data-item-size="${itemSize}"]`);
        const itemQuantity = quantityInput ? quantityInput.value : 1;

        return {
            itemName,
            itemSize: itemSize.toString(),
            itemQuantity: itemQuantity.toString(),
            orderName: getOrderName(),
            phoneNumber: getPhoneNumber()
        };
    });

    const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: itemsArray })
    });

    if (response.ok) {
        alert('Order placed successfully!');
        window.location.replace("confirmation.html");
    } else {
        alert('Failed to place order');
    }
}
