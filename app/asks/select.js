// jshint node:true es6:true
'use strict';


const fs = require('fs');
const path = require('path');
const globby = require('globby');
const _ = require('lodash');
const parseString = require('xml2js').parseString;

// local modules require
const config = require('../../config.json');
const appSearch = require('./search.js');

function dirName(filePath) {
    return path.basename(filePath);
}

function readXml(manifest) {
    return new Promise(function (resolve, reject) {
        let fullPath = path.join(config.path.local, manifest)
        let fileString = fs.readFileSync(fullPath, 'utf8');
        parseString(fileString, (err, xmlResult) => {
            let widgetName = _.get(xmlResult, 'package.widgets[0].widget[0].$.widgetName', _.get(xmlResult, 'package.snippets[0].snippet[0].$.title'));
            if( !widgetName ) {
                console.error('widget dados %s', dirName(manifest));
            }
            resolve(widgetName);
        });
    });
}

function mountPatterns(pattern, origin, query) {
    let originPattern = path.resolve(origin, pattern, '*');
    return [ originPattern ].concat(config.blacklist);
}

function checkDirectories (name, origin, query) {
    return (resolve, reject) => {
        let pattern = mountPatterns(config.resources[name], origin, query);
        return globby(pattern).then(paths => {
            return resolve( appSearch.filter.call(paths, query) ); //.map(dirName) );
        }).catch(reject);
    };
}

function validate(input) {
    if( input.length <= 0 ){
        return 'Selecione ao menos um';
    }
    return true;
}

const widgetsList = {
    type: 'checkbox',
    name: 'selected',
    message: 'Qual Widget você quer enviar ?',
    choices: function (answers) {
        console.log('procurando pelos widgets ...');
        return new Promise(checkDirectories( answers.type, answers.origin, answers.query)).then(function (found) {
            let results = _.compact(found.map( directory => {
                return appSearch.colorize(answers.query, directory);
            }));
            if( results.length >0 ) {
                return results;
            } else {
                console.error('Nenhum widget encontrado');
                process.exit();
            }
        });
    },
    when: function (answers) {
        return answers.type === 'Widgets';
    },
    validate: validate
};

const themesList = {
    type: 'checkbox',
    name: 'selected',
    message: 'Qual Tema você quer enviar ?',
    choices: function (answers) {
        console.log('procurando pelos temas ...');
        return new Promise(checkDirectories(answers.type, answers.origin, answers.query)).then(function (found) {
            let results = _.compact(found.map( directory => {
                return appSearch.colorize(answers.query, directory);
            }));
            if( results.length >0 ) {
                return results;
            } else {
                console.error('Nenhum tema encontrado');
                process.exit();
            }
        });
    },
    when: function (answers) {
        return answers.type === 'Themes';
    },
    validate: validate
};

exports.themes = widgetsList;
exports.widgets = themesList;
