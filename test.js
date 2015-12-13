$.ajax({
	url:'/matchesfeed/?d=20151210',
	success:function(resp){
		var len = 0;
		resp = eval(resp);
		resp[1].forEach(function(item){
			if(item[7].length > len){
				len = item[7].length
			}
		})
		console.log(len)
	}
})
