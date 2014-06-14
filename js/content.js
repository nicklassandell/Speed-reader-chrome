;(function() {

	var html = '';

	html += '<div id="sr-toast-container" class="sr-toolbar">';
	html += 	'<a title="Read with Champ" id="sr-toast" class="sr-toast-button">';
	html +=	 		'<img src="'+ chrome.extension.getURL('img/read.png') +'" alt="Read with Champ" />';
	html +=		'</a>';
	html += 	'<a title="Hide" id="sr-toast-hide" class="sr-toast-button">';
	html += 		'<span>X</span>';
	html += 	'</a>';
	html += '</div>';

	document.body.innerHTML += html;


	var toastBtn = document.getElementById('sr-toast'),
		hideToastBtn = document.getElementById('sr-toast-hide'),
		toastContainer = document.getElementById('sr-toast-container');

	// Make button visible on load
	setTimeout(function() {
		toastBtn.className += ' visible';
	}, 20);


	toastBtn.onclick = function(e) {
		e.preventDefault();
		chrome.extension.sendMessage({
			action: 'openUrl',
			url: window.location.href
		});
	};

	hideToastBtn.onclick = function(e) {
		e.preventDefault();
		chrome.extension.sendMessage({
			action: 'blacklist',
			url: window.location.href
		});
		toastContainer.remove();
	}


	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(request.action === 'ping') {
			sendResponse({
				message: true
			});
		}
	});

})();