// jshint node:true es6:true
'use strict';

const prettyjson = require('prettyjson');
const chalk = require('chalk');

module.exports = {
    type: 'confirm',
    name: 'confirm',
    message: answers => {
        return prettyjson.render(answers) + '\n\n\n\n' + chalk.yellow('Está correto?');
    }
};
