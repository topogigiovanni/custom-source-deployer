var ncp = require('ncp').ncp;
var fs = require('fs');
var commandLineArgs = require('command-line-args');
var _ = require('lodash');

var originPath = './origin';
var destPath = 'C:/Users/Giovanni/Desktop/destino';


var optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'hlg', type: Boolean },
  { name: 'include', alias: 'i' , type: String, multiple: true, defaultOption: true },
  { name: 'exclude', alias: 'e' , type: String, multiple: true, defaultOption: false }
];

var args = _.assignIn({ 'include': [], 'exclude': [] }, commandLineArgs(optionDefinitions));

function doCopy(destination) {
	ncp(originPath, destination, function (err) {
	 if (err) {
	   return console.error(err);
	 }
	 console.log(destination + ' copiado!');
	});
};

function isValidItem(item) {
	if(!!~args.exclude.indexOf(item)){
		return false;
	}
	
	if(args.include.length){
		if(!!~args.include.indexOf(item)){
			return true;
		}
		return false;
	}else{
		return true;
	}
};

console.log('args', args);

fs.readdir(destPath, function(err, items) {
	//console.log('items', items, err);
	if(!items) return;
    for (var i=0; i < items.length; i++) {
        var file = destPath + '/' + items[i];
        //console.log("Start: " + file);
		
		if(isValidItem(items[i])){
			doCopy(file);
		}

    }
});