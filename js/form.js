
document.addEventListener('DOMContentLoaded', function() {

	var form = document.getElementById('mainForm'),
		input = document.getElementById('textInput'),

		bg = chrome.extension.getBackgroundPage();

	input.value = bg.openText;
	form.action = bg.appUrlSubmit;

	form.submit();
});