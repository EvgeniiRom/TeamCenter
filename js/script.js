function getXmlHttp(){
	var xmlhttp;
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (E) {
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

function delQuestion(data) {
	var req = getXmlHttp();
	var delElem = document.getElementById('q'+data);


	req.onreadystatechange = function() {
		if (req.readyState == 4) { 			
			if(req.status == 200) {
				delElem.parentNode.removeChild(delElem);
			}
		}
	}

	req.open('GET', '/delQuestion?q='+data, true);  
	req.send();
}

function checkPass() {
	var req = getXmlHttp();
	var login = document.getElementById('login');
	var pass = document.getElementById('pass');
	var status = document.getElementById('checkStatus');

	var body = 'login=' + encodeURIComponent(login.value)+
  	'&pass=' + encodeURIComponent(pass.value);
	req.onreadystatechange = function() {
		if (req.readyState == 4)
		{
			if (req.status = 200)
			{				
				if(req.responseText=="ОК"){
					document.location.replace("/");
				}
				else{
					status.innerHTML = req.responseText;
				}
			}
			else
			{
				status.innerHTML = 'Неизвестная ошибка.';
			}
		}
	}

	req.open('POST', '/checkPass', true);  
	req.send(body);
}

function signUp() {
	var req = getXmlHttp();
	var login = document.getElementById('login');
	var pass = document.getElementById('pass');
	var status = document.getElementById('checkStatus');

	var body = 'login=' + encodeURIComponent(login.value)+
  	'&pass=' + encodeURIComponent(pass.value);
	req.onreadystatechange = function() {
		if (req.readyState == 4)
		{
			if (req.status = 200)
			{
				if(req.responseText=="ОК"){
					document.location.replace("/");
				}
				else{
					status.innerHTML = req.responseText;
				}
			}			
			else
			{
				status.innerHTML = 'Неизвестная ошибка.';
			}
		}
	}

	req.open('POST', '/signUp', true);  
	req.send(body);
}