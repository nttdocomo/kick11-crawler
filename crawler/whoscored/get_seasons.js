/**
 * @author nttdocomo
 */
var fs = require('fs'), cheerio = require('cheerio'),excute = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),moment_tz = require('moment-timezone'),
pool  = require('../transfermarkt.co.uk/pool'),moment = require('moment'),
input_match_id = process.argv[2];
module.exports = function($){
    var options = $('#seasons > option');
    return options.map(function(){
        return this.attribs.value;
    })
};