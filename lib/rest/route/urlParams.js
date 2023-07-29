'use strict';

module.exports = function(path, parameter){
	//url
	const url = new URL('http://example.com/');

	// path
	if(typeof path == 'string'){
		url.pathname = path;
	}
	else {
		throw new TypeError('path is not string.');
	}

	// parameter
	if(typeof parameter == 'object'){
		url.search = new URLSearchParams(parameter);
	}
	else if(parameter != undefined){
		throw new TypeError('parameter is missing.');
	}

	return url;
}