if (window.jQuery) {
	console.info("Binding to all events");

	//Click
	$(window).click(function(e) {
		console.log('clicked on : ' + getXPath(event.target));
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:8081/command.json", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send("{\"path\":\"" + getXPath(event.target) + "\", \"action\":\"click\"}");
	});

	//Type
	$(window).keypress(function(e) {
		console.log('typed ' + e.which + ' in : ' + getXPath(event.target));
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:8081/command.json", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send("{\"path\":\"" + getXPath(event.target) + "\", \"action\":\"type\", \"content\":\"" + e.which + "\"}");
	});

	// //Navigate
	// chrome.webNavigation.onBeforeNavigate.addListener(function(details){
	// 	console.log('navigating to '+details.url);
	// 	var xhr = new XMLHttpRequest();
	// 	xhr.open("POST", "http://localhost:8081/command.json", true);
	// 	xhr.setRequestHeader("Content-type", "application/json");
	// 	xhr.send("{\"path\":\""+details.url+"\", \"action\":\"open\"}");		
	// });

	//Scroll
	$(window).scroll(function(e) {
		var scrollTop = $(window).scrollTop();
		var scrollLeft = $(window).scrollLeft();
		console.log("Scrolling top: " + scrollTop + " left: " + scrollLeft);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:8081/command.json", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send("{\"top\":\"" + scrollTop + "\", \"action\":\"scroll\", \"left\":\"" + scrollLeft + "\"}");
	});

	//Resize
	$(window).resize(function(e) {
		var width = $(window).width();
		var height = $(window).height();
		console.log("Resizing width: " + width + " height: " + height);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:8081/command.json", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send("{\"width\":\"" + width + "\", \"action\":\"resize\", \"height\":\"" + height + "\"}");
	});

} else {
	console.error('No jQuery installed.');
};