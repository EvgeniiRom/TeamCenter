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