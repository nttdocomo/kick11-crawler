/**
 * @author nttdocomo
 */
var Crawler = require("simplecrawler"),
Promise = require('rsvp').Promise;
module.exports = function (crawler){
	return new Promise(function(resolve,reject){
		crawler.on("fetchcomplete",resolve)
	})
}