var mysql = require("mysql");
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var url = require("url");
var templater = require("./templater.js");

function ups(response)
{
	response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  
	response.write(templater.get_header()+'<div class="message">А туда ли ты зашёл?</div>'+templater.get_footer());
	response.end();  
}

function png(response, request) {
	var pathname = url.parse(request.url).pathname;
	fs.readFile(pathname.substring(1, pathname.length), "binary", function(err, file){		
		if(err) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(err + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}

function css(response, request) {
	var pathname = url.parse(request.url).pathname;
	fs.readFile(pathname.substring(1, pathname.length), "utf8", function(err, data){
		if(err) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(err + "\n");
			response.end();
		} else {		
			response.writeHead(200, {"Content-Type": "text/css; charset=utf-8"});
			response.write(data);
			response.end();
		}
	});
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
	   		if(rows.length>0)
	   		{
	   			cont+='<table class="questionTable"><tbody>'
				for (var i in rows)
				{
					cont+='<tr><td><div class="question"><a href="ans?q='+rows[i].id+'">'+rows[i].q_text+'</a></div></td>'+
					'<td><div class="delButton"><a href="/delQuestion?q='+rows[i].id+'">Удалить</a></div></td></tr>';
				}
			}
			else
			{
				cont+='<div class="message">Вопросов нет. Пожалуйста, загрузите вопросы.</div>';
			}
			connection.end();

			cont+='</tbody></table>'+templater.get_footer();      	

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
		var cont = templater.get_header()+
		'<div class="message">Ответ принят</div>'+
		templater.get_footer();
	    if(answer!=null&&answer!="")
	    {	
	    	var post  = {q_id: _get["q"], a_text: answer};
	    	connection.query('SELECT * FROM questions, answers WHERE questions.id=answers.q_id', function(err, rows, fields) {
		    	if(rows.length>0)
		    	{
		    		var query = connection.query('UPDATE answers SET ? WHERE q_id='+parseInt(_get["q"], 10), post, function(err, result) {
						connection.end();
					});	
		    	}
		    	else
		    	{		    		
					var query = connection.query('INSERT INTO answers SET ?', post, function(err, result) {
						connection.end();
					});	
		    	}		    	
		    });      	
	      		
	    }
		response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
		response.write(cont);
		response.end();
	});
	
}

function ans(response, request) {
	var _get = url.parse(request.url, true).query;
	
	if(_get['q']!=null)
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
				+rows[0].q_text+'<br>';
				connection.query("SELECT * FROM answers WHERE ?", {q_id: _get['q']}, function(err, rows, fields){
					if(rows.length>0)
					{
						cont+=templater.get_textForm('/commit?q='+_get['q'], rows[0].a_text, "Отправить");
					}
					else
					{
						cont+=templater.get_textForm('/commit?q='+_get['q'], "", "Отправить");
					}
				  	connection.end();
					cont+=templater.get_footer();
					response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
					response.write(cont);
				  	response.end();
				});
		  	}
		  	else
			{
				ups(response);		
			  	connection.end();
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

function addQuestion(response, request) {
	var cont = templater.get_header()+
	templater.get_textForm("/start", "", "Добавить")+
	templater.get_footer();
	response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  
  	response.write(cont);  	
  	response.end();   
}

function delQuestion(response, request) {
	var _get = url.parse(request.url, true).query;
	if(_get['q']!=null)
	{
		console.log(_get['q']);
		var connection = mysql.createConnection({
		    host     : 'localhost',
		    user     : 'root',
		    password : '',
		    database : 'node'
		});

		connection.query("DELETE FROM questions WHERE ?", {id: _get['q']}, function(err, rows, fields){
			var cont = templater.get_header()+
			'<div class="message">Что-то было удалено :)</div>'+
			templater.get_footer();
			response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
			response.write(cont);
		  	response.end();
		});
	}
	else
	{
		ups(response);
	} 
}

function uploadQuestions(response, request) {
	var cont = templater.get_header()+
	templater.get_loadForm("/upload")+
	templater.get_footer();
	response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  
  	response.write(cont);  	
  	response.end();   
}

function login(response, request) {
	var cont = templater.get_header()+
	templater.get_loginForm("/login")+
	templater.get_footer();
	response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  
	response.write(cont);
	response.end();
}

exports.png = png;
exports.css = css;
exports.start = start;
exports.upload = upload;
exports.commit = commit;
exports.ans = ans;
exports.result = result;
exports.addQuestion = addQuestion;
exports.delQuestion = delQuestion;
exports.uploadQuestions = uploadQuestions;
exports.login = login;