/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
Model = require('../../model'),
moment = require('moment'),
_ = require('underscore'),
mysql = require('mysql'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
TeamPlayer = require('./team_player');
Transfer = Model.extend({
	table:'transfer',
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
})
Transfer.table = 'transfer';
Transfer.insert = function(id,season,transfer_date,player_id,releasing_team_id,taking_team_id){
	var season_id;
	return excute(mysql.format('SELECT player_id FROM transfermarkt_player_player WHERE transfermarkt_player_id = ? LIMIT 1',[player_id])).then(function(row){
		if(row.length){
			player_id = row[0].player_id;
	    	return excute(mysql.format('SELECT team_id FROM transfermarkt_team_team WHERE transfermarkt_team_id = ? LIMIT 1',[releasing_team_id])).then(function(row){
	    		if(row.length){
				    releasing_team_id = row[0].team_id;
				   	return excute(mysql.format('SELECT team_id FROM transfermarkt_team_team WHERE transfermarkt_team_id = ? LIMIT 1',[taking_team_id])).then(function(row){
				   		if(row.length){
						    taking_team_id = row[0].team_id;
						    return excute(mysql.format('SELECT id FROM `season` WHERE title = ? LIMIT 1',[season])).then(function(row){
						    	if(row.length){
						    		season_id = row[0].id;
						    	}
						    	return excute(mysql.format('SELECT transfer_id FROM transfermarkt_transfer_transfer WHERE transfermarkt_transfer_id = ? LIMIT 1',[id]))
						    }).then(function(row){
						    	var data = {
									'season':season,
									'transfer_date':transfer_date.format('YYYY-MM-DD'),
									'player_id':player_id,
						    		'releasing_team_id':releasing_team_id,
						    		'taking_team_id':taking_team_id
								}
								if(season_id){
									data.season_id = season_id;
								}
						    	if(!row.length){
						    		return excute(mysql.format('INSERT INTO `transfer` SET ?',data)).then(function(result){
						    			return excute(mysql.format('INSERT INTO `transfermarkt_transfer_transfer` SET ?',{
						    				transfermarkt_transfer_id:id,
						    				transfer_id:result.insertId
						    			}))
						    		})
						    	} else {
						    		return excute(mysql.format('UPDATE `transfer` SET ? WHERE id = ?',[data,row[0].transfer_id]))
						    	}
						    })
				   		}
						return Promise.resolve();
				    })
	    		}
				return Promise.resolve();
		    })
		}
		return Promise.resolve();
    })/*.then(function(){
    	console.log('update_team_player_by_player_id')
    	//根据球员最新的转会更新teamplayer表
    	return TeamPlayer.update_team_player_by_player_id(player_id)
    })*/.catch(function(err){
    	console.log(err)
    	return Promise.resolve()
    })
}
Transfer.get_trasfer_from_korrektur = function($){
	var transfer_table = $('#transfers'),transfer_tbody = transfer_table.find('>tbody'),transfers_id = [];
	transfer_tbody.find(' > input[id$="trans_id"]').each(function(i,tr){
		transfers_id.push(tr);
	});
	return transfers_id.reduce(function(sequence, el){
		var $el = $(el),
		id = $el.val(),
		player_id = $('#submenue > li').eq(1).find('> a').attr('href').replace(/\S+?\/(\d{1,9})$/,'$1'),
		season = $el.next().children().eq(0).find('select').val(),
		transfer_date = $el.next().children().eq(3).find('input').val(),
		month = $el.next().children().eq(4).find('select').val(),
		loan = $el.next().children().eq(5).find('select').val(),
		transfer_sum = $el.next().children().eq(7).find('input').val(),
		contract_period = [$el.next().next().children().eq(0).find('input').eq(2).val(),$el.next().next().children().eq(0).find('input').eq(1).val(),$el.next().next().children().eq(0).find('input').eq(0).val()].join('-'),
		transfer_date = /\d{2}\.\d{2}\.\d{4}/.test(transfer_date) ? transfer_date.replace(/(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1') : moment(month + ' 1,' + season).format('YYYY-MM-DD'),
		contract_period = /\d{4}\-\d{2}\-\d{2}/.test(contract_period) ? contract_period : undefined,
		transfer = new Transfer({
			'id':id,
			'contract_period':contract_period
		})
		transfer_sum = /\d/.test(transfer_sum) ? transfer_sum.replace(/\./g,'') : 0;
	  return transfer.save();
	},Promise.resolve())
};
Transfer.get_trasfer_from_transfers = function($){
	var transfer_table = $('.responsive-table > table'),transfer_tbody = transfer_table.find('>tbody'),transfers_tr = [];
	transfer_tbody.find(' > tr.zeile-transfer').each(function(i,tr){
		transfers_tr.push(tr);
	});
	return transfers_tr.reduce(function(sequence, el){
		var $el = $(el),
		match = $el.children().last().find('a').attr('href').match(/^\/\S+\/transfers\/spieler\/(\d{1,9})\/\S+\/(\d{1,9})$/),
		id = match[2],//$el.children().last().find('a').attr('href').replace(/\S+?\/(\d+)$/,'$1')
		player_id = match[1],
		transfer_date = moment($el.children().eq(1).text(),'MMM D, YYYY'),
		season = transfer_date.year(),
		loan = $el.children().eq(11).text(),
		releasing_team_id = $el.children().eq(5).find('a').attr('href').replace(/^\/\S+?\/transfers\/verein\/(\d+?)(\/\S+)?$/,'$1'),
		taking_team_id = $el.children().eq(9).find('a').attr('href').replace(/^\/\S+?\/transfers\/verein\/(\d+?)(\/\S+)?$/,'$1'),
		//transfer_sum = $el.children().eq(12).text(),
		transfer = new Transfer({
			'id':id,
			'season':season,
			'transfer_date':transfer_date.format('YYYY-MM-DD'),
			//'transfer_sum':transfer_sum,
			'player_id':player_id,
  		'loan':loan,
  		'releasing_team_id':releasing_team_id,
  		'taking_team_id':taking_team_id
		})
	    return sequence.then(function(){
	    	transfer.save();
	    })
	},Promise.resolve())
};
Transfer.get_transfer_by_id = function(id){
    return excute(mysql.format('SELECT * FROM ?? WHERE id = ?',[this.table,id]));
};
module.exports = Transfer;
