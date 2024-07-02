// Initialize the AWS SDK
AWS.config.update({
    region: 'us-east-2',
    accessKeyId: 'AKIAZI2LEHSIP5TGRRUK',
    secretAccessKey: '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'
});

// Create DynamoDB service object
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

// Function to fetch menu items from DynamoDB
function fetchMenuItems() {
    var params = {
        TableName: 'MKitchenMenu'
    };

    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
            var menuItems = data.Items;
            displayMenu(menuItems);
        }
    });
}

// Function to display menu items on the HTML page
function displayMenu(menuItems) {
    var menuContainer = document.getElementById('menu');

    menuItems.forEach(function(item) {
        var itemName = item.itemName.S;
        var itemPrices = item.itemPrices.NS.map(Number).sort((a, b) => a - b);

        var itemHTML = `
            <div class="menu-item">${itemName}</div>
            <div class="menu-item">$${itemPrices[0]}<input type="checkbox" data-name="${itemName}" data-size="small"></div>
            <div class="menu-item">$${itemPrices[1]}<input type="checkbox" data-name="${itemName}" data-size="medium"></div>
            <div class="menu-item">$${itemPrices[2]}<input type="checkbox" data-name="${itemName}" data-size="large"></div>
        `;

        menuContainer.innerHTML += itemHTML;
    });
}

// Fetch menu items when the page loads
window.onload = fetchMenuItems;

function getSelectedItems() {
    var selectedItems = {};
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(function(checkbox) {
        var itemName = checkbox.getAttribute('data-name');
        var itemSize = checkbox.getAttribute('data-size');
        if (!selectedItems[itemName]) {
            selectedItems[itemName] = [];
        }
        selectedItems[itemName].push(itemSize);
    });
    return selectedItems;
}

function onSubmit() {
    var selectedItems = getSelectedItems();
    console.log(selectedItems);
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    window.location.href = 'bag.html';
}