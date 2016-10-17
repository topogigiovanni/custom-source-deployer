// jshint node:true es6:true
'use strict';
// node modules require
const commandLineArgs = require('command-line-args');
const inquirer = require('inquirer');

// local modules require
const config = require('../config.json');


const optionDefinitions = [
	{ name: 'widgets', alias: 'w', type: String, multiple: true }
];

const asksSelect = require('./asks/select.js');
const asksEnv = require('./asks/env.js');
const asksSearch = require('./asks/search.js');

inquirer.prompt([
    require('./asks/type.js'),
    require('./asks/origin.js'),
    asksSearch.ask,
    asksSelect.widgets,
    asksSelect.themes,
    asksEnv.ask,
    asksSearch.ask,
    asksEnv.clients,
    require('./asks/confirm.js'),
])
.then( answers => {
    return require('./copy.js')(answers);
})
.then( done => {
	console.log('done');
	process.exit();
})
.catch( err => {
    console.trace(err);
    process.exit();
});
