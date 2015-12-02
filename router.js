var mysql = require("mysql");
var secrets = require("./secrets.js");
var cookieParser = require("./cookieParser.js");
var dateParser = require("./dateParser.js");


var mysqlAccess = secrets.mysqlAccess;
var publicPages = ["/img/logo.png","/css/style.css","/js/script.js","/checkPass","/signUp"];

function notFound(response)
{
	response.writeHead(404, {"Content-Type": "text/plain"});
	response.write("404 Not Found");
	response.end();
}

function sendPage(handle, pathname, response, request)
{
	if (typeof handle[pathname] == 'function'){
		handle[pathname](response, request);		
	}
	else{
		var substr = pathname.split('.');
		if(substr.length>0)
		{
			var file = substr[substr.length-1];
			if (typeof handle[file] == 'function'){
				handle[file](response, request);		
			}
			else{			
				notFound(response);
			}
		}
	}
}

function route(handle, pathname, response, request){	
	console.log("Route:"+pathname);

	var isPublic = false;

	for(var page in publicPages){
		if(publicPages[page]==pathname){
			isPublic = true;
			sendPage(handle, pathname, response, request);		
		}
	}

	if(!isPublic)
	{
		cookies=cookieParser.getCookies(request);

		if(cookies["id"]!=null){
			var connection = mysql.createConnection(mysqlAccess);
			connection.connect;
			connection.query('SELECT * FROM sessions WHERE ?', {id: cookies["id"]}, function(err, rows, fields) {
				if(rows.length>0){					
					connection.query("UPDATE sessions SET date='"+dateParser.getMySQLDate(new Date())+"' WHERE ?", {id: cookies["id"]}, function(err, rows, fields){
						
						connection.end();
					});
					if(pathname!="/login"){
						sendPage(handle, pathname, response, request);
					}
					else{
						handle["/"](response, request);					
					}
				}
				else{
					handle["/login"](response, request);
					connection.end();
				}
			});			
		}
		else{
			handle["/login"](response, request);
		}
	}
}

exports.route = route;