function getCookies (request) {
	var cookies = [];
	if(request.headers.cookie!=null){
		var cookie = request.headers.cookie.split(';');
		for(var i in cookie)
		{
			var parts = cookie[i].split('=');
			if(i>0){
				cookies[parts[0].substr(1, parts[0].length)]=parts[1];
			}
			else{
				cookies[parts[0]]=parts[1];
			}
		}
	}
	return cookies;
}

exports.getCookies = getCookies;