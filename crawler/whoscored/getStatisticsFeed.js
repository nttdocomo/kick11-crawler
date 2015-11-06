var StringDecoder = require('string_decoder').StringDecoder,
decoder = new StringDecoder('utf8'),
getMatchCentrePlayerStatistics = require('../../model/whoscored/statistics').getMatchCentrePlayerStatistics,
statistic = require('../../model/kick11/statistic');
module.exports = function(queueItem, content, response){
    return getMatchCentrePlayerStatistics(queueItem, content)
    //return Promise.resolve();
}