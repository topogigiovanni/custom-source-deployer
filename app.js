/**
 *  ARGS:
 *  	-include (Array) Include stores
 *  	-exclude (Array) Exclude stores
 *  	-prd (Boolean) Define environment path
 *
 *  USAGE: - node app -i corpoideal ciadoslivros -e biroshop -prd
 *
 *  @Author: Giovanni Mansueto(topogigiovanni@gmail.com)
 *  @Company: DCG - Digital Commerce Group
 *
 */

// vars
var ncp = require('ncp').ncp;
var fs = require('fs');
var commandLineArgs = require('command-line-args');
var _ = require('lodash');
var appPaths = require('./path_config').path;
var _prompt = require('prompt');

var optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'prd', type: Boolean },
  { name: 'include', alias: 'i' , type: String, multiple: true, defaultOption: true },
  { name: 'exclude', alias: 'e' , type: String, multiple: true, defaultOption: false }
];
var _baseArgs = { 
	'include': [], 
	'exclude': [], 
	'prd': false ,
	'verbose': false
};
var args = _.assignIn(_baseArgs, commandLineArgs(optionDefinitions));

var originPath = appPaths.origin;
var destPath = args.prd ? appPaths.prd : appPaths.hlg;
//

// methods
function doCopy(destination) {
	ncp(originPath, destination, function (err) {
	 if (err) {
	   return console.error(err);
	 }
	 console.log(destination + ' copiado!');
	});
};
function arrayContains(items, term) {
	return !!~_.findIndex(items, function(o) { return !!~term.indexOf(o)});
}
function isValidItem(item) {
	//if(!!~args.exclude.indexOf(item)){
	if(arrayContains(args.exclude, item)){
		return false;
	}
	
	if(args.include.length){
		//if(!!~args.include.indexOf(item)){
		if(arrayContains(args.include, item)){
			return true;
		}
		return false;
	}else{
		return true;
	}
};
function start() {
	fs.readdir(destPath, function(err, items) {
		//console.log('items', items, err);
		if(!items){
			console.log(err);
			return;
		}
		for (var i=0; i < items.length; i++) {
			var file = destPath + '/' + items[i];
			//console.log("Start: " + file);
			
			if(isValidItem(items[i])){
				doCopy(file);
			}

		}
	});
};
//


// logic
// user confirmation required!
_prompt.start();

// disable prefix message & colors
_prompt.message = '';
_prompt.delimiter = '';
_prompt.colors = false;

// wait for user confirmation
_prompt.get({
    properties: {
        
        // setup the dialog
        confirm: {
            // allow yes, no, y, n, YES, NO, Y, N as answer
            pattern: /^(yes|no|y|n|s|sim|nao|não)$/gi,
            description: 'Deseja executar a copia(s/n)?',
            message: 'Digite s/n',
            required: true,
            default: 'n'
        }
    }
}, function (err, result){
    // transform to lower case
    var c = result.confirm.toLowerCase();
	
	if(!c){
		return;
	}
	
    // yes or y typed ? otherwise abort
    if (c!='y' && c!='yes' && c!='s' && c!='sim'){
        console.log('Cancelado');
        return;
    }
    
    if(args.verbose){
		console.log('[VERBOSE] - ','args', args);
	}
	start();
    
});
//
