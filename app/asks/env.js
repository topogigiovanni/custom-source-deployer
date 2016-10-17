// jshint node:true es6:true
'use strict';

const fs = require('fs');
const globby = require('globby');
const path = require('path');
const chalk = require('chalk');
const ProgressBar = require('progress');
const _ = require('lodash');

const config = require('../../config.json');
const appSearch = require('./search.js');
const appProgress = require('../progress.js');

exports.ask = {
    type: 'list',
    name: 'env',
    message: 'Quer enviar esses arquivos para qual embiente ?',
    choices: ['TESTE', 'HLG', 'PRD']
};

function validate(input) {
    if( input.length <= 0 ){
        return 'Selecione ao menos um';
    }
    return true;
}

exports.clients = {
    type: 'checkbox',
    name: 'clients',
    message: 'Quais os Clientes',
    choices: answers => {
        let list = fs.readdirSync( config.remote[answers.env] );
        let filtrated = appSearch.filter.call(list, answers.query);
        let bar  = appProgress('Buscando diretórios dos clientes [:bar] :percent :etas', {
            total:filtrated.length
        });
        let result = filtrated.filter( file => {
            let fullPath = path.resolve( config.remote[answers.env], file );
            let indexOf = file.toLowerCase().indexOf('corecommerce.com.br');
            bar.tick();
            if( !!~indexOf ) {
                let stats = fs.statSync(fullPath);
                return stats.isDirectory();
            }else {
                return false;
            }
        }).map( directory => {
            return appSearch.colorize(answers.query, path.resolve(config.remote[answers.env], directory));
        });
        if( _.isEmpty(result) ) {
            console.error('Nenhum cliente encontrado');
            process.exit();
        }
        return result;
    },
    validate: validate
};
