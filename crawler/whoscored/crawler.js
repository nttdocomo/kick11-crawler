var Crawler = require("simplecrawler"),
queue = Crawler.queue;

queue.prototype.clear = function(){
	this.splice(0,this.length)
}
var crawler = new Crawler("www.whoscored.com", "/");
module.exports = crawler;