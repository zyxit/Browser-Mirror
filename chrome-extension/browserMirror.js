// Listen for messages from popup
chrome.extension.onMessage.addListener(

function(request, sender, sendResponse) {
	if (request.action === "start") {
		startBrowserMirror(request.configuration);
	};
	if (request.action === "stop") {
		stopBrowserMirror();
	};
});

function startBrowserMirror(configuration) {
	console.log('Starting...');

	sendEvent("\{"+
		"\"action\":\"start\","+
		"\"slaveBrowserType\":\""+configuration["slaveBrowserType"]+"\","+
		"\"slaveBrowserAddress\":\""+configuration["slaveBrowserAddress"]+"\","+
		"\"slaveBrowserStartUrl\":\""+configuration["slaveBrowserStartUrl"]+"\","+
		"\"nativeEvents\":\""+configuration["nativeEvents"]+"\"\}");
	
	bindEventListeners();
}

function stopBrowserMirror() {
	console.log('Stopping...');
	sendEvent("\{\"action\":\"stop\"\}");

	unbindEventListeners();
}

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

//////// Event Listeners ///////

function clickEventListener(event) {
	var elementXPath = getXPath(event.target);
	console.log('Clicked on : ' + elementXPath);
	sendEvent("{\"path\":\"" + elementXPath + "\", \"action\":\"click\"}");
}

function keypressEventListener(event) {
	var elementXPath = getXPath(event.target);
	var keyIdentifier = String.fromCharCode(event.which);
	console.log('Pressed: ' + keyIdentifier + ' on ' + elementXPath + ' alt: ' + event.ctrlKey + ' meta: ' + event.metaKey + ' shift: ' + event.shiftKey);
	sendEvent("{\"path\":\"" + elementXPath + "\", \"action\":\"type\", \"content\":\"" + keyIdentifier + "\"}");
}

// Thats for special keys

function keydownEventListener(event) {
	var elementXPath = getXPath(event.target);
	var keyIdentifier;
	if (isCharacterKeyPress(event)) {
		// For charcter keys return printable character instead of code
		keyIdentifier = String.fromCharCode(event.which);
	} else {
		keyIdentifier = event.which;
	};

	if (isCharacterKeyPress(event) && ((!event.altKey && !event.metaKey && !event.shiftKey && !event.ctrlKey) || (!event.altKey && !event.metaKey && event.shiftKey && !event.ctrlKey))) {
		// Ignore as it's just normal key press and will be sent via "keypress event" or someone did Shift+key to make it capital – again will be sent via keypress event
	} else {
		console.log('Pressed down: ' + keyIdentifier + ' on ' + elementXPath + ' alt: ' + event.altKey + ' meta: ' + event.metaKey + ' shift: ' + event.shiftKey + ' ctrl: ' + event.ctrlKey);
		sendEvent("{\"path\":\"" + elementXPath + "\", \"action\":\"keydown\", \"keyIdentifier\":\"" + keyIdentifier + "\", \"metaKey\":\"" + event.metaKey + "\", \"ctrlKey\":\"" + event.ctrlKey + "\", \"altKey\":\"" + event.altKey + "\", \"shiftKey\":\"" + event.shiftKey + "\"}");
	};
}

function mouseoverEventListener(event) {
	var elementXPath = getXPath(event.target);
	console.log('Mouseover : ' + elementXPath);
	sendEvent("{\"path\":\"" + elementXPath + "\", \"action\":\"mouseover\"}");
}

function mouseoutEventListener(event) {
	var elementXPath = getXPath(event.target);
	console.log('Mouseover : ' + elementXPath);
	sendEvent("{\"path\":\"" + elementXPath + "\", \"action\":\"mouseout\"}");
}

function scrollEventListener(event) {
	var scrollTop = window.scrollY;
	var scrollLeft = window.scrollX;
	console.log("Scrolling top: " + scrollTop + " left: " + scrollLeft);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8081/command.json", true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send("{\"top\":\"" + scrollTop + "\", \"action\":\"scroll\", \"left\":\"" + scrollLeft + "\"}");
}


function resizeEventListener(event) {
	var width = window.innerWidth;
	var height = window.innerHeight;
	console.log("Resizing width: " + width + " height: " + height);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8081/command.json", true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send("{\"width\":\"" + width + "\", \"action\":\"resize\", \"height\":\"" + height + "\"}");
}


function bindEventListeners() {
	console.info("Sending spies");

	document.addEventListener("click", clickEventListener, true);
	document.addEventListener("keypress", keypressEventListener, true);
	document.addEventListener("keydown", keydownEventListener, true);
	document.addEventListener("mouseover", mouseoverEventListener, true);
	document.addEventListener("mouseout", mouseoutEventListener, true);
	window.addEventListener("scroll", scrollEventListener, true);
	window.addEventListener("resize", resizeEventListener, true);
}


function unbindEventListeners() {
	console.info("Calling spies back");

	document.removeEventListener("click", clickEventListener, true);
	document.removeEventListener("keypress", keypressEventListener, true);
	document.removeEventListener("keydown", keydownEventListener, true);
	document.removeEventListener("mouseover", mouseoverEventListener, true);
	document.removeEventListener("mouseout", mouseoutEventListener, true);
	window.removeEventListener("scroll", scrollEventListener, true);
	window.removeEventListener("resize", resizeEventListener, true);
}