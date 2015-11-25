function get_header()
{
	return'<html>'+
	'<head>'+
		'<title>Team Center</title>'+
		'<link rel="stylesheet" type="text/css" href="css/style.css" />'+
		'<meta  charset="utf-8"/>'+
		'</head>'+
	'<body>  '+
		'<div id="container">'+
			'<div id="header">'+
				'<div style="float:left; width:300px;">'+
					'<a href="/"><img id="logo" src="img/logo.png" alt="Widget News" /></a>'+
				'</div>'+
				'<div class="topsidebar">'+
					'<div class="menu">'+
						'<ul>'+							
							'<div class="buttons">'+
								'<a href="/result">'+
									'<li>Ответы</li>'+
								'</a>'+
							'</div>'+
							'<div class="buttons">'+
								'<a href="/uploadQuestions">'+
									'<li>Загрузить вопросы</li>'+
								'</a>'+
							'</div>'+
							'<div class="buttons">'+
								'<a href="/addQuestion">'+
									'<li>Добавить вопрос</li>'+
								'</a>'+
							'</div>'+
							'<div class="buttons">'+
								'<a href="/start">'+
									'<li>Вопросы</li>'+
								'</a>'+
							'</div>'+
						'</ul>'+
					'</div>'+
				'</div>'+
			'</div>' 
} 

function get_footer()
{
	return '<div id="footer">'+
				'DukuuKoT &copy; 2015. All rights reserved.'+
			'</div>'+
		'</div>'+
	'</body>'+
'</html>'
}	   

function get_textForm(action, textButton)
{
	return '<form action="'+action+'" method="post" class="textForm">'+
    '<textarea name="text"></textarea><br>'+
    '<input type="submit" value="'+textButton+'" />'+
    '</form>';
}

function get_loadForm(action)
{
	return '<form action="'+action+'" enctype="multipart/form-data" '+
		'method="post" class="uploadForm">'+
		'<input type="file" name="upload" multiple="multiple">'+
		'<input type="submit" value="Загрузить" />'+
		'</form>';
}

exports.get_header = get_header;
exports.get_footer = get_footer;
exports.get_textForm = get_textForm;
exports.get_loadForm = get_loadForm;