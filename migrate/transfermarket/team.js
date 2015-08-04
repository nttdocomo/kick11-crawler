var excute = require('../../promiseExcute'),
_ = require('underscore'),
difference = require('../../utils').difference,
keysMap = {
	'since':'foundation'
	'club':'club'
	'national':'national'
	'team_name':'team_name'
},
migrate = function(cb){
	console.log('start to migrate teams');
	return excute('SELECT * FROM transfermarket_team').then(function(transfermarket_teams){
		if(transfermarket_teams.length){
			return transfermarket_teams.reduce(function(sequence, transfermarket_team){
				var diff,result,id;
				return sequence.then(function(){
					if(transfermarket_team.team_ref_id == '0'){
						result = keysTranslate(transfermarket_team)
						return excute(mysql.format('INSERT INTO team SET ?', result)).then(function(result){
							return excute(mysql.format("UPDATE transfermarket_team SET team_ref_id = ? WHERE id = ?", [result.insertId,transfermarket_team.id]))
						})
					} else {
						return excute(mysql.format('SELECT * FROM team WHERE id = ?', [transfermarket_team.team_ref_id])).then(function(team){
							result = keysTranslate(transfermarket_team);
							id = team.id;
							delete team.id;
							if(!_.isEqual(result,team)){
								diff = difference(data,result);
								return excute(mysql.format('UPDATE team SET ? WHERE id = ?', [diff,id])
							}
						})
					}
				}
			},Promise.resolve())
		}
	})
},
keysTranslate =  function(data){
	var result = {};
	_.each(keysMap,function(value,key){
		result[key] = data[value];
	});
	return result
};
module.exports.migrate = migrate;