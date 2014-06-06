;(function() {

	var frag = create('<a id="sr-toast">Speed read</a>');

	document.body.insertBefore(frag, document.body.childNodes[0]);

	var elem = document.getElementById('sr-toast');

	setTimeout(function() {
		elem.className = 'visible';
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