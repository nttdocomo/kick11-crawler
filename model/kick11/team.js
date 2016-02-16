/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
Model = require('../../model'),
moment = require('moment'),
_ = require('underscore'),
mysql = require('mysql'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
trim = require('../../crawler/transfermarkt.co.uk/utils').trim,
save = function(transfermarkt_team){
    return excute(mysql.format('INSERT INTO `team` SET ?',{
        name:transfermarkt_team.team_name
    })).then(function(result){
        console.log(result)
        return result.insertId
    })
};
module.exports.save = save;
