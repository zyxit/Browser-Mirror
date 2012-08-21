// Sends event to backend

function sendEvent(payload) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8081/command.json", true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(payload);
}

// Checks if key is one of control or non-printable keys


function isCharacterKeyPress(event) {
	if (typeof event.which == "undefined") {
		// This is IE, which only fires keypress events for printable keys
		return true;
	} else if (typeof event.which == "number" && event.which > 0) {
		// In other browsers except old versions of WebKit, evt.which is
		// only greater than zero if the keypress is a printable key.
		// We need to filter out control keys
		var control_keys = {
			"17": "control",
			"91": "meta",
			"93": "meta",
			"18": "alt",
			"16": "shift",
			"9": "tab",
			"8": "backspace",
			"13": "enter",
			"27": "escape",
			"46": "delete",
			"37": "left",
			"39": "right",
			"40": "down",
			"38": "up",
			"33": "page_up",
			"34": "page_down",
			"36": "home",
			"35": "end"
		};
		return control_keys[event.which] == null;
	}
	return false;
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

	// Keydown – that's for special keys
	document.addEventListener("keydown", function(event) {		
		var elementXPath = getXPath(event.target);
		var keyIdentifier;
		if (isCharacterKeyPress(event)) {
			// For charcter keys return printable character instead of code
			keyIdentifier = String.fromCharCode(event.which);
		} else {
			keyIdentifier = event.which;
		};

		if (isCharacterKeyPress(event) && ((!event.altKey && !event.metaKey && !event.shiftKey && !event.ctrlKey)||(!event.altKey && !event.metaKey && event.shiftKey && !event.ctrlKey)))  {
			// Ignore as it's just normal key press and will be sent via "keypress event" or someone did Shift+key to make it capital – again will be sent via keypress event
		} else {
			console.log('Pressed down: ' + keyIdentifier + ' on ' + elementXPath + ' alt: ' + event.altKey + ' meta: ' + event.metaKey + ' shift: ' + event.shiftKey + ' ctrl: ' + event.ctrlKey);
			sendEvent("{\"path\":\"" + elementXPath + "\", \"action\":\"keydown\", \"keyIdentifier\":\"" + keyIdentifier + "\", \"metaKey\":\"" + event.metaKey + "\", \"ctrlKey\":\"" + event.ctrlKey + "\", \"altKey\":\"" + event.altKey + "\", \"shiftKey\":\"" + event.shiftKey + "\"}");
		};
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