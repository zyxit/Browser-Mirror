if (window.jQuery) {
	console.info("Binding to all events");
	
	//Click
	$(window).click(function(e) {
		console.log('clicked on : ' + getXPath(event.target));
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:8081/command.json", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send("{\"path\":\""+getXPath(event.target)+"\", \"action\":\"click\"}");
	});

	//Type
	$(window).keypress(function(e) {
		console.log('typed '+e.which+' in : ' + getXPath(event.target));
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:8081/command.json", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send("{\"path\":\""+getXPath(event.target)+"\", \"action\":\"type\", \"content\":\""+e.which+"\"}");
	});

	//Navigate
	chrome.webNavigation.onBeforeNavigate.addListener(function(details){
		console.log('navigating to '+details.url);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:8081/command.json", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send("{\"path\":\""+details.url+"\", \"action\":\"open\"}");		
	});

} else {
	console.error('No jQuery installed.');
};