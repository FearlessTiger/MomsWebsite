require('dotenv').config();

console.log(process.env.AWS_REGION, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

const reigon = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

console.log(reigon, accessKeyId, secretAccessKey);

module.exports = { AWS_REGION: reigon,
    AWS_ACCESS_KEY_ID: accessKeyId, 
    AWS_SECRET_ACCESS_KEY: secretAccessKey 

};

// Initialize the AWS SDK
// AWS.config.update({
//     region: process.env.AWS_REGION,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

// module.exports = AWS;