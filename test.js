Promise.resolve().then(function(){
	console.log('1')
	return Promise.resolve()
}).then(function(){
	console.log('2')
	throw {};
	return Promise.resolve()
}).then(function(){
	console.log('3')
	throw {};
	//return Promise.resolve()
}).catch(function(){
	console.log('err')
})