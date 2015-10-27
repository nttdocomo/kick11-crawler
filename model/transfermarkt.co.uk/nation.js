/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
Model = require('../../model'),
moment = require('moment'),
_ = require('underscore'),
mysql = require('mysql'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Nation = Model.extend({
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
Nation.table = 'transfermarkt_nation';
Nation.get_nation = function($){
	var nation_img = $("th:contains('Nationality:')").next().find('img'),
	nation_name;
	if(nation_img.length){
		nation_id = nation_img.attr('src').replace(/^\S+?\/(\d+?)(\/\S+)?\.png$/,'$1');
		nation_name = nation_img.attr('title');
		var nation = new Nation({
			id:nation_id,
			name:nation_name
		})
	    return nation.save().then(function(){
	    	return excute(mysql.format('SELECT 1 FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ? LIMIT 1',[nation_id]))
	    }).then(function(row){
	    	if(!row.length){
	    		return excute(mysql.format('INSERT INTO `nation` SET ?',{
	    			name:nation_name
	    		})).then(function(result){
	    			return excute(mysql.format('INSERT INTO `transfermarkt_nation_nation` SET ?',{
	    				transfermarkt_nation_id:nation_id,
	    				nation_id:result.insertId
	    			}))
	    		})
	    	} else {
	    		return Promise.resolve();
	    	}
	    }).catch(function(err){
	    	console.log('nation')
	    	console.log(err)
	    	return Promise.resolve();
	    })
	} else {
		return Promise.resolve();
	}
};
Nation.get_nation_by_competition = Nation.get_nation_by_team = function($){
	var nation_id = $("select[name='land_select_breadcrumb']").find("option:selected").val(),
	nation_name = $("select[name='land_select_breadcrumb']").find("option:selected").text(),
	nation = new Nation({
		id:nation_id,
		name:nation_name
	})
    return nation.save().then(function(){
    	return excute(mysql.format('SELECT 1 FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ? LIMIT 1',[nation_id]))
    }).then(function(row){
    	if(!row.length){
    		return excute(mysql.format('INSERT INTO `nation` SET ?',{
    			name:nation_name
    		})).then(function(result){
    			return excute(mysql.format('INSERT INTO `transfermarkt_nation_nation` SET ?',{
    				transfermarkt_nation_id:nation_id,
    				nation_id:result.insertId
    			}))
    		})
    	} else {
    		return Promise.resolve();
    	}
    }).catch(function(err){
    	return Promise.resolve();
    })
};

module.exports = Nation;