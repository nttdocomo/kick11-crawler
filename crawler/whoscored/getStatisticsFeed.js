var StringDecoder = require('string_decoder').StringDecoder,
decoder = new StringDecoder('utf8'),
getMatchCentrePlayerStatistics = require('../../model/whoscored/statistics').getMatchCentrePlayerStatistics,
statistic = require('../../model/kick11/statistic');
module.exports = function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),content = decoder.write(responseBuffer);
    if(/^\/StatisticsFeed\/1\/GetMatchCentrePlayerStatistics.*?/.test(queueItem.path) && content && content !== null && content != 'null'){
        return getMatchCentrePlayerStatistics(queueItem, content).then(function(){
            return statistic.save_from_whoscored(queueItem, content)
        })
    }
    return Promise.resolve();
}