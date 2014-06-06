;(function() {

	var frag = create('<div id="sr-toast" style="position: fixed; bottom: 20px; right: 20px; z-index: 500; padding: 10px; background: rgba(0,0,0,.7); color: #FFF; cursor: pointer;">Speed read</div>');

	document.body.insertBefore(frag, document.body.childNodes[0]);

	var elem = document.getElementById('sr-toast');

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