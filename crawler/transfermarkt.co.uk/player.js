var host = 'http://www.transfermarkt.co.uk',
fetchedUrls = [],
input_url = process.argv[2],
crawler = require("./config");
if(input_url){
  crawler.queueURL(host + '/bersant-celina/profil/spieler/229695');
  crawler.start();
}