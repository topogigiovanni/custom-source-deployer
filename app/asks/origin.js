// jshint node:true es6:true
'use strict';

const config = require('../../config.json');
const _ = require('lodash');

const ask = {
    type: 'list',
    name: 'origin',
    message: 'Qual a origem dos arquivos',
    choices: config.origin
};
module.exports = ask;
