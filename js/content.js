;(function() {

	var html = '';

	html += '<div class="sr-toolbar">';
	html += 	'<a title="Read with Champ" id="sr-toast" class="sr-toast-button">';
	html +=	 		'<img src="'+ chrome.extension.getURL('img/read.png') +'" alt="Read with Champ" />';
	html +=		'</a>';
	html += 	'<a title="Hide" id="sr-toast-hide" class="sr-toast-button">';
	html += 		'<span>X</span>';
	html += 	'</a>';
	html += '</div>';

	var frag = create(html);

	document.body.insertBefore(frag, document.body.childNodes[0]);

	var elem = document.getElementById('sr-toast');

	setTimeout(function() {
		elem.className += ' visible';
	}, 20);

	elem.onclick = function() {
		chrome.extension.sendMessage({
			openUrl: window.location.href
		});
	};

	function create(htmlStr) {
	    var frag = document.createDocumentFragment(),
	        temp = document.createElement('div');
	    temp.innerHTML = htmlStr;
	    while (temp.firstChild) {
	        frag.appendChild(temp.firstChild);
	    }
	    return frag;
	}

})();