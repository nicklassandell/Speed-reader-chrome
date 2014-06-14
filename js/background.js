
var appUrl = 'http://localhost/speed-reader/',
	appUrlSubmit = appUrl + 'text/';


var contextMenuAdded = false;

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {

	// If not complete or invalid URL
	if (change.status !== 'complete' || !tab.url.match(/^https?:\/\//)) {
		return false;
	}

	// Try to ping tab to check if script has already been injected
	chrome.tabs.sendMessage(tabId, {action: 'ping'}, function(response) {

		// Already injected, let's bail
		if(response) {
			return false;
		}

		// Check if domain is blacklisted
		isBlacklisted(tab.url, function(isBlacklisted) {
			if(isBlacklisted) {
				return false;
			}

			// Show or hide toast for this tab
			getOption('hideToast', function(hideToast) {
				if(!hideToast) {
					chrome.tabs.insertCSS(tabId, {file: 'css/content.css'}, function() {
						chrome.tabs.executeScript(tabId, {file: 'js/content.js'});
					});
				}
			});
		});
	});

});

// When the toolbar icon is clicked
chrome.browserAction.onClicked.addListener(function(tab) {
	if (tab.url.match(/^https?:\/\//)) {
		openApp(tab.url);
	}
});



// Litsen for callbacks from injected code
chrome.extension.onMessage.addListener(function(data) {
	if(typeof data === 'object') {

		// Open URL in app
		if(data.action === 'openUrl') {
			openApp(data.url);

		// Add domain to blacklist
		} else if(data.action == 'blacklist') {
			var domain = new URL(data.url).hostname;

			// Get current value and append domain to it
			getOption('toastBlacklist', function(currVal) {
				var newVal = currVal + "\r\n" + domain;
				chrome.storage.sync.set({
					toastBlacklist: newVal
				});
			});
			
		}
	}
});

// Sometimes they stay in memory after extension reload
// so let's just make sure we remove it completely on load.
chrome.contextMenus.removeAll();

function updateContextMenu() {
	getOption('hideContextMenu', function(hideContextMenu) {

		// Show menu
		if(!hideContextMenu) {

			// If already added, do nothing
			if(contextMenuAdded) {
				return false;
			}

			chrome.contextMenus.create({
				id: 'contextSelection',
				title : 'Speed Read selected text',
				contexts : ['selection']
			});

			chrome.contextMenus.onClicked.addListener(function() {
				chrome.tabs.executeScript( {
					code: "window.getSelection().toString();"
				}, function(selection) {
					var selected = selection[0];
					openApp(selected);
				});
			});

			contextMenuAdded = true;

		// Hide menu if added
		} else {
			if(contextMenuAdded) {
				chrome.contextMenus.remove('contextSelection');
			}
			contextMenuAdded = false;
		}
	});
}


function openApp(text) {

	// If not URL
	if(!text.match(/^https?:\/\//)) {
		var text = betterEncodeURI(text);
	}

	window.openText = text;

	chrome.windows.create({
		url: 'post.html',
		type: 'popup'
	});
}


function betterEncodeURI(text) {
	var text = text.replace(/\r|\n/g, '%0A'),
		text = encodeURI(text),
		text = text.replace('+', '%20');
	return text;
}



function getOption(option, callback) {
	chrome.storage.sync.get(option, function(obj) {
		if(obj[option] !== undefined) {
			callback(obj[option]);
		} else {
			callback(false);
		}
	});
}

function isBlacklisted(url, callback) {
	var currDom = new URL(url).hostname;
	var stored = getOption('toastBlacklist', function(stored) {
		var split = stored.split(/\r|\n/g);
		
		if(split.length > 0) {
			for(var i=0; i < split.length; ++i) {
				var dom = split[i];
				if(dom.indexOf(currDom) !== -1) {
					callback(true);
					return true; // Prevent loop from continuing
				}
			}
		}
		callback(false);
	});
}