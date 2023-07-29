'use strict';
const URLParams = require('./urlParams');

/**
 * @returns {URL}
 */
exports.speaker = () => {
	return URLParams('speakers');
}

/**
 * @returns {URL}
 */
exports.user_dict = () => {
	return URLParams('user_dict');
}
