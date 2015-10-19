/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
Model = require('../../model'),
moment = require('moment'),
_ = require('underscore'),
mysql = require('mysql'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Kick11Transfer = require('../../model/kick11/transfer'),
Transfer = Model.extend({
	table:'transfermarket_transfer',
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
Transfer.table = 'transfermarket_transfer';
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
		transfer_sum = /\d/.test(transfer_sum) ? transfer_sum.replace(/\./g,'') : 0;
		contract_period = /\d{4}\-\d{2}\-\d{2}/.test(contract_period) ? contract_period : undefined,
		transfer = new Transfer({
			'id':id,
			'contract_period':contract_period
		})
	    return sequence.then(function(){
	    	return transfer.save()
	    }).then(function(){
	    	return excute(mysql.format('SELECT player_ref_id FROM transfermarkt_player WHERE id = ? LIMIT 1',[player_id]))
	    }).then(function(row){
	    	player_id = row[0].player_ref_id;
	    }).then(function(){
	    	return excute(mysql.format('SELECT team_ref_id FROM transfermarket_team WHERE id = ? LIMIT 1',[releasing_team_id]))
	    }).then(function(row){
	    	releasing_team_id = row[0].team_ref_id;
	    }).then(function(){
	    	return excute(mysql.format('SELECT team_ref_id FROM transfermarket_team WHERE id = ? LIMIT 1',[taking_team_id]))
	    }).then(function(row){
	    	taking_team_id = row[0].team_ref_id;
	    }).then(function(){
	    	return excute(mysql.format('SELECT 1 FROM transfer WHERE season = ? AND player_id = ? AND releasing_team_id = ? AND taking_team_id = ? LIMIT 1',[season,player_id,releasing_team_id,taking_team_id]))
	    }).then(function(row){
	    	var kick11transfer;
    		kick11transfer = new Kick11Transfer(_.extend(row[0],{
				'contract_period':contract_period
			}))
	    }).catch(function(){
	    	return Promise.resolve()
	    });
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
		transfer_sum = $el.children().eq(12).text(),
		transfer = new Transfer({
			'id':id,
			'season':season,
			'transfer_date':transfer_date.format('YYYY-MM-DD'),
			'transfer_sum':transfer_sum,
			'player_id':player_id,
    		'loan':loan,
    		'releasing_team_id':releasing_team_id,
    		'taking_team_id':taking_team_id
		})
	    return sequence.then(function(){
	    	return transfer.save();
	    }).then(function(){
	    	return excute(mysql.format('SELECT player_ref_id FROM transfermarkt_player WHERE id = ? LIMIT 1',[player_id]))
	    }).then(function(row){
	    	player_id = row[0].player_ref_id;
	    }).then(function(){
	    	return excute(mysql.format('SELECT team_ref_id FROM transfermarket_team WHERE id = ? LIMIT 1',[releasing_team_id]))
	    }).then(function(row){
	    	releasing_team_id = row[0].team_ref_id;
	    }).then(function(){
	    	return excute(mysql.format('SELECT team_ref_id FROM transfermarket_team WHERE id = ? LIMIT 1',[taking_team_id]))
	    }).then(function(row){
	    	taking_team_id = row[0].team_ref_id;
	    }).then(function(){
	    	return excute(mysql.format('SELECT 1 FROM transfer WHERE season = ? AND player_id = ? AND releasing_team_id = ? AND taking_team_id = ? LIMIT 1',[season,player_id,releasing_team_id,taking_team_id]))
	    }).then(function(row){
	    	var kick11transfer;
	    	if(row.length){
	    		kick11transfer = new Kick11Transfer(_.extend(row[0],{
	    			'season':season,
					'transfer_date':transfer_date.format('YYYY-MM-DD'),
					'transfer_sum':transfer_sum,
					'player_id':player_id,
		    		'loan':loan,
		    		'releasing_team_id':releasing_team_id,
		    		'taking_team_id':taking_team_id
	    		}))
	    	} else {
	    		kick11transfer = new Kick11Transfer({
	    			'season':season,
					'transfer_date':transfer_date.format('YYYY-MM-DD'),
					'transfer_sum':transfer_sum,
					'player_id':player_id,
		    		'loan':loan,
		    		'releasing_team_id':releasing_team_id,
		    		'taking_team_id':taking_team_id
	    		})
	    	}
	    	return kick11transfer.save();
	    }).catch(function(err){
	    	console.log(err)
	    	return Promise.resolve()
	    })
	},Promise.resolve())
};
Transfer.get_transfer_by_id = function(id){
    return excute(mysql.format('SELECT * FROM ?? WHERE id = ?',[this.table,id]));
};
module.exports = Transfer;