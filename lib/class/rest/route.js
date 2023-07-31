'use strict';

/**
 * @class Management of PATH information.
 * @extends URL
 */
class Route extends URL{
	constructor(path, parameter){
		super('http://example.com/');
		if(typeof path == 'string'){
			this.pathname = path;
		}
		else {
			throw new TypeError('path is not string.');
		}

		// parameter
		if(typeof parameter == 'object'){
			this.search = new URLSearchParams(parameter);
		}
		else if(parameter != undefined){
			throw new TypeError('parameter is missing.');
		}
	}
}
module.exports = Route;