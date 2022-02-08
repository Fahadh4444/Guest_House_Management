'use strict';

const app = require('./serverlessApp');
const serverless = require('serverless-http')
module.exports.apiapp = serverless(app);