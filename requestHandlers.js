var mysql = require("mysql");
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var url = require("url");
var templater = require("./templater.js");

function ups(response)
{
	response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  
	response.write(templater.get_header()+"Ups!!!"+templater.get_footer());
	response.end();  
}

function start(response, request) {
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : '',
	    database : 'node'
	});

  	var postData = "";
	
	function selectAllQuestions(){
		connection.query('SELECT * FROM questions', function(err, rows, fields) {
	    	if (err) throw err;

	   		var cont = "";
	   		cont+=templater.get_header();
			for (var i in rows)
			{
				cont+='<a href="ans?q='+rows[i].id+'">'+rows[i].q_text+'</a><br>';
			}
			connection.end();

			cont+=templater.get_textForm("/start")
			+templater.get_loadForm("/upload")
			+'<a href="./result">Результаты</a>'
			+templater.get_footer();      	

			response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});  
	      	response.write(cont);
	      	response.end();    
	    });
	}
  	
  	request.addListener("data", function(postDataChunk) {
    		postData += postDataChunk;
  	});

  	request.addListener("end", function() {    	    
		var question = querystring.parse(postData).text;
		connection.connect;
	    if(question!=null&&question!="")
	    {
			connection.query('INSERT INTO questions SET ?', {q_text: question}, function(err, result) {
	  			selectAllQuestions();	 
			});		
	    }
	    else
	    	selectAllQuestions();
  	});
}

function upload(response, request) {
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : '',
	    database : 'node'
	});

	var form = new formidable.IncomingForm();
	var cont = templater.get_header();

  	form.parse(request, function(error, fields, files) {
		/* Возможна ошибка в Windows: попытка переименования уже существующего файла */
		fs.rename(files.upload.path, "tmp/test.txt", function(err) {
		  	if (err) {
				fs.unlink("tmp/test.txt");
				fs.rename(files.upload.path, "tmp/test.txt");
		  	}

		  	fs.readFile("tmp/test.txt", "utf8", function(err, data){
				lines = data.split('\n');
				connection.connect;
				for (i in lines)
				{
					if(lines[i]!="")
					{
						connection.query('INSERT INTO questions SET ?', {q_text: lines[i]}, function(err, result) {
							// Neat!
						});
					}
				}
				connection.end();

				cont+="Файл принят! :)"+
		  		templater.get_footer();

				response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
				response.write(cont);
				response.end();
			});
		});			
  	});
}

function commit(response, request) {
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : '',
	    database : 'node'
	});  
  	var postData = "";
  	var question = "";
  	var _get = url.parse(request.url, true).query;

	request.setEncoding("utf8");

  	request.addListener("data", function(postDataChunk) {
    	postData += postDataChunk;
  	});

	request.addListener("end", function() {	
		connection.connect;
		var answer = querystring.parse(postData).text;
	    if(answer!=null&&answer!="")
	    {
	      	var post  = {q_id: _get['q'], a_text: querystring.parse(postData).text};
			var query = connection.query('INSERT INTO answers SET ?', post, function(err, result) {
	  		// Neat!
			});		
	    }
		response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
		response.write("Answer OK");
		response.end();
	});
	
}

function ans(response, request) {	
	var _get = url.parse(request.url, true).query;
	
	if(_get['q']!="undefined")
	{
		var connection = mysql.createConnection({
		    host     : 'localhost',
		    user     : 'root',
		    password : '',
		    database : 'node'
		});

		connection.query("SELECT * FROM questions WHERE ?", {id: _get['q']}, function(err, rows, fields){
			if(rows.length>0)
			{
				var cont = templater.get_header()
				+rows[0].q_text+'<br>'
				+templater.get_textForm('/commit?q='+_get['q']);
				+templater.get_footer();		
			  	connection.end();

				response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
				response.write(cont);
			  	response.end();
		  	}
		  	else
			{
				ups(response);
			}
		});	
	}
	else
	{
		ups(response);
	}
}

function result(response, request) {
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : '',
	    database : 'node'
	});

	connection.query('SELECT * FROM questions, answers WHERE questions.id=answers.q_id', function(err, rows, fields) {
    	if (err) throw err;

   		var cont = templater.get_header();
		for (var i in rows)
		{
			cont+=rows[i].q_text+"<br><textarea>"+rows[i].a_text+"</textarea><br>";
		}
		connection.end();
		cont+=templater.get_footer();
		response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  
      	response.write(cont);  	
      	response.end();    
    });  	
}


exports.start = start;
exports.upload = upload;
exports.commit = commit;
exports.ans = ans;
exports.result = result;