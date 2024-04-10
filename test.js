var AWS = require('aws-sdk');
// Initialize the AWS SDK
let awsConfig = {
    region: 'us-east-2', 
    accessKeyId: 'AKIAZI2LEHSIN7P3JYJ6', 
    secretAccessKey: '5V8fREt5HofDTKj5Afb+T/PMDtgoHitkUdD95GSj' // Replace 'your-secret-access-key' with your AWS secret access key
};

AWS.config.update(awsConfig);

// Create DynamoDB service object
var dynamodb = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: "MKitchenMenu"
}
// Function to fetch menu items from DynamoDB
dynamodb.scan(params, function(err, data) {
    if(err){
        console.log("Error", JSON.stringify(err, null, 2));
    }
    else{
        console.log("Success" + JSON.stringify(data, null, 2));
    }
})