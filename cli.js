var fs = require('fs'),
    jsdom = require('jsdom'),

    extractDepVars = require('./index.js');

var code = fs.readFileSync(process.argv[2], 'utf8');

console.log(
  extractDepVars(code)
);