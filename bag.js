document.addEventListener('DOMContentLoaded', function() {
    displayItems();
});

function displayItems() {
    // Get items from local storage
    let items = JSON.parse(localStorage.getItem('items')) || [];

    // Display items in the bag
    const bagItemsElement = document.getElementById('bag-items');
    bagItemsElement.innerHTML = '';
    items.forEach(function(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('menu-item');
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price}</span>
        `;
        bagItemsElement.appendChild(itemElement);
    });
}

function placeOrder() {
    // Clear items from local storage
    localStorage.removeItem('items');

    // Notify the user and redirect to menu page
    alert('Order placed successfully!');
    window.location.href = 'menu.html';
}
