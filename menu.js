// document.addEventListener('DOMContentLoaded', function() {
//   fetchMenuItems();
// });

// // Initialize the AWS SDK
// let awsConfig = {
//     region: 'us-east-2', 
//     accessKeyId: 'AKIAZI2LEHSIN7P3JYJ6', 
//     secretAccessKey: '5V8fREt5HofDTKj5Afb+T/PMDtgoHitkUdD95GSj' // Replace 'your-secret-access-key' with your AWS secret access key
// };

// AWS.config.update(awsConfig);

// var dynamodb = new AWS.DynamoDB.DocumentClient();


// function fetchMenuItems() {
//   var params = {
//     TableName: "MKitchenMenu"
//   };

//   dynamodb.scan(params, function(err, data) {
//       if (err) {
//           console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
//       } else {
//           console.log("Scan succeeded.");
//           var menuItems = data.Items;
//           displayMenu(menuItems);
//       }
//   });
// }

// // Function to display menu items on the HTML page
// function displayMenu(menuItems) {
//   console.log('programrunning');
//   var menuContainer = document.getElementById('menu');

//   menuItems.forEach(function(item) {
//       var itemName = item.itemName.S;
//       var itemPrices = item.itemPrices; // Assuming itemPrices is a map with 'small', 'medium', and 'large' keys

//       var itemHTML = `<div>
//                           <h3>${itemName}</h3>
//                           <ul>
//                               <li>itemPrices: $${itemPrices}</li>
//                           </ul>
//                       </div>`;
      
//       menuContainer.innerHTML += itemHTML;
//   });
// }

