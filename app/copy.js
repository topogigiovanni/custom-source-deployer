// jshint node:true es6:true
'use strict';

const path = require('path');
const globby = require('globby');
const prettyjson = require('prettyjson');
const du = require('du');
const fs = require('fs-extra');
const _ = require('lodash');

const config = require('../config.json');
const appProgress = require('./progress.js');

function copy(answers) {

    fs.writeFileSync('./copy.yml', prettyjson.render(answers, {noColor:true}));
    const basePath =  path.join(config.resources[answers.type]).replace(/\\/gi,'/');

    var patterns = answers.selected.map( selected => {
        return path.join(path.resolve(answers.origin, basePath, selected), '/**/*');
    });

    let files = globby.sync(patterns.concat(config.blacklist));

    // return new Promise( (resolve, reject) => {
    // });

    const bar  = appProgress('Copiando [:bar] :percent :etas', {
        total: files.length * answers.clients.length
    });
    let allCopying = [];
    answers.clients.forEach( client => {
        let dest = path.resolve( config.remote[answers.env], client, basePath );
        let copying = files.map( file => {
            let destFile = file.substr( file.indexOf(basePath) + basePath.length );
            bar.tick();
            return new Promise( (resolve, reject) => {
                fs.copy(file, path.join(dest, destFile), function (err) {
                    if(err) reject(err);
                    resolve([path.join(dest, destFile), file]);
                });
            });
        });
        allCopying = allCopying.concat(copying);
    });
    return Promise.all(allCopying);
}

module.exports = copy;
