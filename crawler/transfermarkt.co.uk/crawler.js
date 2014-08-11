/**
 * @author nttdocomo
 */
var Crawler = require("simplecrawler"),
crawler = new Crawler("www.transfermarkt.co.uk");
crawler.maxConcurrency = 10;
crawler.interval = 600;
crawler.timeout = 5000;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
module.exports = crawler;