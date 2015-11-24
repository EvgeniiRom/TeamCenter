function get_header()
{
	return '<html>'+
	    '<head>'+
	    '<meta charset="utf-8"/>'+
	    '</head>'+
	    '<body>';
} 

function get_footer()
{
	return '</body>'+
	    '</html>';
}	   

function get_textForm(action)
{
	return '<form action="'+action+'" method="post">'+
    '<textarea name="text" rows="1" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>';
}

function get_loadForm(action)
{
	return '<form action="'+action+'" enctype="multipart/form-data" '+
		'method="post">'+
		'<input type="file" name="upload" multiple="multiple">'+
		'<input type="submit" value="Upload file" />'+
		'</form>';
}

exports.get_header = get_header;
exports.get_footer = get_footer;
exports.get_textForm = get_textForm;
exports.get_loadForm = get_loadForm;