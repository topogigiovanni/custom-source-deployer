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


var optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'prd', type: Boolean },
  { name: 'include', alias: 'i' , type: String, multiple: true, defaultOption: true },
  { name: 'exclude', alias: 'e' , type: String, multiple: true, defaultOption: false }
];
var _baseArgs = { 
	'include': [], 
	'exclude': [], 
	'prd': false  
};
var args = _.assignIn(_baseArgs, commandLineArgs(optionDefinitions));

var originPath = appPaths.origin;
var destPath = args.prd ? appPaths.prd : appPaths.hlg;


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
//

console.log('args', args);

// logic
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