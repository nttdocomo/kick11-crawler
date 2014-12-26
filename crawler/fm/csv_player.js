var fs = require('fs'),StringDecoder = require('string_decoder').StringDecoder;
fs.readFile('./1111.csv',function(err,data){
	var decoder = new StringDecoder('utf8');
	var lines = decoder.write(data).split(/\r\n/);
	lines.forEach(function(line,i){
		if(i>0 && line){
			var result = line.split(/\;/),
			name = result[0].replace(/"/g,'').replace(/(\w+?),\s(\w+)/g,'$2 $1'),
			id = result[2].replace(/"/g,'');
			console.log([name,id].join('-'))
		}
	})
})