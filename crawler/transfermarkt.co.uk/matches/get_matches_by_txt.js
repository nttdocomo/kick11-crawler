/**
 * @author nttdocomo
 */
var fs = require('fs'), dirpath = '../../../../openfootball/en-england/2014-15/', files = ['1-premierleague-ii.txt','1-premierleague-i.txt'];
var matchdays = [];
for (var i = files.length - 1; i >= 0; i--) {
	var filename = dirpath + files[i];
	fs.readFile(filename, 'utf8', function(err, data) {
		if (err) throw err;
		//console.log('OK: ' + filename);
		//console.log(data)
		/*var matchdays = data.match(/(Matchday\s\d{1,2})/);
		for (var i = matchdays.length - 1; i >= 0; i--) {
			console.log(matchdays[i][0]);
		};*/
		console.log(data.match(/(Matchday\s\d{1,2})[\n\r]+(\[[a-zA-Z]{3}\s[a-zA-Z]{3}\/\d{1,2}\])([\n\r]+(\s+?(\d{1,2}\.{1,2})?\s+(([a-zA-Z]+?\s?)\s[a-zA-Z]+)(\s+\-\s+)?(([a-zA-Z]+?\s?)\s[a-zA-Z]+))+?)/ig))
		//matchdays = matchdays.concat(data.match(/(Matchday\s\d{1,2})\n\r+(\[[a-zA-Z]{3}\s[a-zA-Z]{3}\/\d{1,2}\])/g));
		//console.log(data.match(/(\[[a-zA-Z]{3}\s[a-zA-Z]{3}\/\d{1,2}\])/g));
		//console.log(matchdays)
	});
};