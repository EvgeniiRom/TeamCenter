function route(handle, pathname, response, request){	
	console.log("Route:"+pathname);
	if (typeof handle[pathname] == 'function') {
		handle[pathname](response, request);		
	}
	else 
	{
		var substr = pathname.split('.');
		if(substr.length>0)
		{
			var file = substr[substr.length-1];
			if (typeof handle[file] == 'function') {
				handle[file](response, request);		
			}
		}		
		else{			
			console.log("No request handler found for " + pathname);
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found");
			response.end();
		}
	}
}

exports.route = route;