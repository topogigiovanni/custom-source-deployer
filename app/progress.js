// jshint node:true es6:true
'use strict';

const chalk = require('chalk');
const _ = require('lodash');
const ProgressBar = require('progress');

module.exports = (message, config) => {
    return new ProgressBar(message, _.defaults(config, {
        complete:chalk.green('#'),
        incomplete:chalk.white('#')
    }))
};
