'use strict';

const app = require('./app');
const serverless = require('serverless-http')
module.exports.hello = serverless(app);

// module.exports.hello = (req, res) => {
//     return res.send("HI");
// }