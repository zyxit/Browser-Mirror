// Provides functionality for extension popup that controls actual extension functionality
var slaveBrowserAddressInputField;
var slaveBrowserTypeInputField;
var nativeEventsCheckbox;
var startButton;
var stopButton;
var banner;

document.addEventListener('DOMContentLoaded', function() {
	// Initialise elements
	slaveBrowserAddressInputField = document.getElementById('slave-browser-address');
	slaveBrowserTypeInputField = document.getElementById('slave-browser-type');
	nativeEventsCheckbox = document.getElementById('native-events');
	startButton = document.getElementById('start');
	stopButton = document.getElementById('stop');
	banner = document.getElementById('banner');

	//Bind event listeners
	slaveBrowserAddressInputField.addEventListener('keypress', saveState);
	slaveBrowserTypeInputField.addEventListener('keypress', saveState);
	nativeEventsCheckbox.addEventListener('change', saveState);
	startButton.addEventListener('click', startMirroring);
	stopButton.addEventListener('click', stopMirroring);

	// Restore popup state from local storage or default values
	restoreState();

});


// Populate elements with values from local storage or default

function restoreState() {
	slaveBrowserAddressInputField.value = localStorage.slaveBrowserAddress || "http://localhost:4444/wd/hub";
	slaveBrowserTypeInputField.value = localStorage.slaveBrowserType || "ie";
	nativeEventsCheckbox.checked = localStorage.nativeEvents === "true" || false;

	if (localStorage.browserMirrorRunning === "true") {
		disableControls();
	} else {
		enableControls();
	};
}

// Saves current state of popup in local storage

function saveState() {
	localStorage.slaveBrowserAddress = slaveBrowserAddressInputField.value;
	localStorage.slaveBrowserType = slaveBrowserTypeInputField.value;
	localStorage.nativeEvents = nativeEventsCheckbox.checked;
};


function startMirroring() {
	localStorage.browserMirrorRunning = true;
	disableControls();
	saveState();

	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {
			action: "start",
			configuration: {
				slaveBrowserAddress: slaveBrowserAddressInputField.value,
				slaveBrowserType: slaveBrowserTypeInputField.value,
				nativeEvents: nativeEventsCheckbox.checked
			}
		}, function(){});
	});
}

function stopMirroring() {
	localStorage.browserMirrorRunning = false;
	enableControls();
	saveState();
	
	// Call backend to stop listening to events	
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {action: "stop"}, function(){});
	});
}

function disableControls() {
	slaveBrowserAddressInputField.disabled = true;
	slaveBrowserTypeInputField.disabled = true;
	nativeEventsCheckbox.disabled = true;
	startButton.disabled = true;
	stopButton.disabled = false;
	banner.textContent = "Browser Mirror is running";
	banner.className = "running";
}

function enableControls() {
	slaveBrowserAddressInputField.disabled = false;
	slaveBrowserTypeInputField.disabled = false;
	nativeEventsCheckbox.disabled = false;
	startButton.disabled = false;
	stopButton.disabled = true;
	banner.textContent = "Browser Mirror is not running";
	banner.className = "not_running";

}