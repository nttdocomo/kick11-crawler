var event_standing_entries = [{
	"pts":42,
	"played":20,
	"won":13,
	"lost":4,
	"drawn":3,
	"goals_for":34,
	"goals_against":18
},{
	"pts":39,
	"played":20,
	"won":12,
	"lost":3,
	"drawn":5,
	"goals_for":39,
	"goals_against":21
},{
	"pts":39,
	"played":20,
	"won":11,
	"lost":2,
	"drawn":7,
	"goals_for":37,
	"goals_against":25
}];
event_standing_entries.sort(function(a, b) {
	if(a.pts < b.pts){
		return 1;
	}
	if(a.pts == b.pts){
		if(a.goals_for - a.goals_against < b.goals_for - b.goals_against){
			return 1;
		}
		if(a.goals_for - a.goals_against == b.goals_for - b.goals_against){
			if(a.goals_for > b.goals_for){
				return 1;
			}
			return -1;
		}
		return -1;
	}
	return -1;
});
console.log(event_standing_entries)