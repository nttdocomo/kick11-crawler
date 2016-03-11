var mysql = require('mysql'),
_ = require('underscore'),
excute = require('../../promiseExcute'),
get_missing_ids = function(table){
	return excute(mysql.format('SELECT id FROM ?? ORDER BY id ASC',[table])).then(function(rows){
        console.log(rows.length)
        return rows.reduce(function(sequence,row,i){
            return sequence.then(function(){
                var oldId = row.id,
                id = i+1;
                return excute(mysql.format('UPDATE ?? SET id = ? WHERE id = ?',[table,id,oldId]))
            })
        },Promise.resolve())
    }).then(function(){
    	process.exit();
    }).catch(function(err){
    	console.log(err)
    	process.exit();
    })
};
get_missing_ids('match_player_statistics');
module.exports = get_missing_ids;