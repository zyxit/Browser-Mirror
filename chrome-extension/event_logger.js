// Sends event to backend

function sendEvent(payload) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8081/command.json", true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(payload);
}


if (window.jQuery) {
	console.info("Sending spies");

	// Click
	document.addEventListener("click", function(event) {
		var elementXPath = getXPath(event.target);
		console.log('Clicked on : ' + elementXPath);
		sendEvent("{\"path\":\"" + elementXPath + "\", \"action\":\"click\"}");
	}, true);


	// Type
	document.addEventListener("keypress", function(event) {
		var elementXPath = getXPath(event.target);
		var keyIdentifier = String.fromCharCode(event.which);
		console.log('Pressed: ' + keyIdentifier + ' on ' + elementXPath + ' alt: ' + event.ctrlKey + ' meta: ' + event.metaKey + ' shift: ' + event.shiftKey);
		sendEvent("{\"path\":\"" + elementXPath + "\", \"action\":\"type\", \"content\":\"" + keyIdentifier + "\"}");
	}, true);

	// Key down – that's for special keys
	document.addEventListener("keydown", function(event) {
		var elementXPath = getXPath(event.target);
		var keyIdentifier;
		if (String.fromCharCode(event.which)!="") {
			keyIdentifier = String.fromCharCode(event.which);
		} else{
			keyIdentifier = event.which;
		};
		
		console.log('Pressed down: ' + keyIdentifier + ' on ' + elementXPath + ' alt: ' + event.altKey + ' meta: ' + event.metaKey + ' shift: ' + event.shiftKey);
		sendEvent("{\"path\":\"" + elementXPath + "\", \"action\":\"keydown\", \"keyIdentifier\":\"" + keyIdentifier + "\", \"metaKey\":\"" + event.metaKey + "\", \"ctrlKey\":\"" + event.ctrlKey + "\", \"altKey\":\"" + event.altKey + "\", \"shiftKey\":\"" + event.shiftKey + "\"}");
	}, true);



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
		//Detecting whether it's programmatically or not
		if (e.hasOwnProperty('originalEvent')) {
			var scrollTop = $(window).scrollTop();
			var scrollLeft = $(window).scrollLeft();
			console.log("Scrolling top: " + scrollTop + " left: " + scrollLeft);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "http://localhost:8081/command.json", true);
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send("{\"top\":\"" + scrollTop + "\", \"action\":\"scroll\", \"left\":\"" + scrollLeft + "\"}");
		};
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