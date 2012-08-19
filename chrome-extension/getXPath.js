// Retrieves XPath for specified element, depends on jQuery
function getXPath(element) {
	if (window.jQuery) {
		var xpath = '';
		for (; element && element.nodeType == 1; element = element.parentNode) {
			var id = $(element.parentNode).children(element.tagName).index(element) + 1;
			id > 1 ? (id = '[' + id + ']') : (id = '');
			xpath = '/' + element.tagName.toLowerCase() + id + xpath;
		}
		return xpath;
	} else {
		console.error('No jQuery installed.');
		return;
	};
}