/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Model = require('../../model'),
Player = Model.extend({
    tableName:'whoscored_player',
    needToUpdate:function(data,row){
        this._super(data,row);
        var diff;
        if(!_.isEqual(data,row)){
            diff = difference(row,data);
            return diff;
            //return excute(mysql.format('UPDATE `transfermarket_team` SET ? WHERE id = ?',[diff,id]))
        }
        return false;
    }
});
Player.excute = excute;
Player.table = 'whoscored_player';
Player.all = function(){
    return excute('SELECT * FROM whoscored_player ORDER BY play_at ASC');
};
Player.get_player = function(matchCentre2){
    var matchCentre2 = JSON.parse(matchCentre2),
    away = matchCentre2.away,
    home = matchCentre2.home,
    players = home.players.concat(away.players);
    return players.reduce(function(sequence, player){
        var data = {
            id :player.playerId,
            name:player.name,
            height:player.height,
            weight:player.weight
        },
        person = new Player(data);
        return sequence.then(function(){
          return excute(mysql.format('SELECT 1 FROM `whoscored_player` WHERE id = ? LIMIT 1',[player.playerId]));
            //return person.save();
        })
    },Promise.resolve())
};
Player.get_player_from_matchcenter = function(matchCentre2,crawler){
    var away = matchCentre2.away,
    host = crawler.initialProtocol + '://' + crawler.host,
    home = matchCentre2.home,
    players = home.players.concat(away.players);
    return players.reduce(function(sequence, player){
        var data = {
            id :player.playerId,
            name:player.name,
            height:player.height,
            weight:player.weight
        };
        //person = new Player(data);
        return sequence.then(function(){
            return excute(mysql.format('SELECT date_of_birth FROM `whoscored_player` WHERE id = ? LIMIT 1',[player.playerId]));
        }).then(function(row){
          if(!row.length){
            crawler.queueURL(host + '/Players/'+player.playerId);
            return excute(mysql.format('INSERT INTO `whoscored_player` SET ?',data));
          } else {
            if(row[0].date_of_birth === null){
              crawler.queueURL(host + '/Players/'+player.playerId);
            }
          }
          return Promise.resolve();
        })
    },Promise.resolve())
}
Player.get_player_info = function($,id){
    var date_of_birth = $("dt:contains('Age:')").next().find('i').text(),
    name = $("dt:contains('Name:')").eq(0).next().text(),
    height = $("dt:contains('Height:')").next().text(),
    weight = $("dt:contains('Weight:')").next().text(),
    data={};
    console.log(name)
    if(date_of_birth){
      date_of_birth = date_of_birth.replace(/(\d{2})\-(\d{2})\-(\d{4})/,'$3-$2-$1');
      data.date_of_birth = date_of_birth
    }
    if(name){
      data.name = name
    }
    if(height){
      data.height = height.replace('cm','')
    }
    if(weight){
      data.weight = weight.replace('kg','')
    }
    return excute(mysql.format('SELECT 1 FROM `whoscored_player` WHERE id = ? LIMIT 1',[id])).then(function(row){
      if(row.length){
        return excute(mysql.format('UPDATE `whoscored_player` SET ? WHERE id = ?',[data,id]))
      } else {
        data.id = id;
        return excute(mysql.format('INSERT INTO `whoscored_player` SET ?',data))
      }
    }).then(function(row){
      return excute(mysql.format('SELECT id FROM `player` WHERE name = ? AND date_of_birth = ? LIMIT 1',[name,date_of_birth]))
    }).then(function(player){
      if(player.length){
        return excute(mysql.format('SELECT 1 FROM `whoscored_player_player` WHERE whoscored_player_id = ? AND player_id = ? LIMIT 1',[id,player[0].id])).then(function(row){
          if(!row.length){
            return excute(mysql.format('INSERT INTO `whoscored_player_player` SET ?',{
              whoscored_player_id:id,
              player_id:player[0].id
            }))
          }
          return Promise.resolve();
        })
      }
      return Promise.resolve();
    }).catch(function(err){
      console.log(err)
      return Promise.resolve();
    })
    /*return excute(mysql.format('UPDATE `whoscored_player` SET ? WHERE id = ?',[{
      date_of_birth:date_of_birth
    },id])).then(function(){
      return excute(mysql.format('SELECT name FROM `whoscored_player` WHERE id = ? LIMIT 1',[id]))
    }).then(function(row){
      return excute(mysql.format('SELECT id FROM `player` WHERE name = ? AND date_of_birth = ? LIMIT 1',[row[0].name,date_of_birth]))
    }).then(function(player){
      if(player.length){
        return excute(mysql.format('SELECT 1 FROM `whoscored_player_player` WHERE whoscored_player_id = ? AND player_id = ? LIMIT 1',[id,player[0].id])).then(function(row){
          if(!row.length){
            return excute(mysql.format('INSERT INTO `whoscored_player_player` SET ?',{
              whoscored_player_id:id,
              player_id:player[0].id
            }))
          }
          return Promise.resolve();
        })
      }
      return Promise.resolve();
    }).catch(function(err){
      console.log(err)
      return Promise.resolve();
    })
    return Promise.resolve();*/
}
module.exports = Player;
