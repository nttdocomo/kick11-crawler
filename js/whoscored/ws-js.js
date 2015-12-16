$.ajax({
  url:'/matchesfeed/?d=20151213',
  success:function(res){
    res = eval(res);
    res[2].forEach(function(item,i){
      if(item[1] == 969706){
        console.log(i)
      }
    })
  }
})