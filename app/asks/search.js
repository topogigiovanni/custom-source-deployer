// jshint node:true es6:true
'use strict';

const chalk = require('chalk');
const _ = require('lodash');

function colorize(query, directory) {
    let result = directory;
    let indexOf = directory.toLowerCase().indexOf(query.toLowerCase());
    let length = query.length;
    if (!!~indexOf ) {
        result = directory.substr(0, indexOf) + chalk.cyan.bgBlack(directory.substr(indexOf, length)) + directory.substr(indexOf + length);
    }
    return result;
}

function filter(query) {
    return this.filter( directory => {
        return !!~directory.toLowerCase().indexOf(query.toLowerCase());
    });
}

const ask = {
    type: 'input',
    name: 'query',
    message: 'Filtrar por:',
    default: ''
};

module.exports = {
    ask: ask,
    colorize: colorize,
    filter: filter
};
