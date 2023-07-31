'use strict';

module.exports = {
	/**
	 * accept: json
	 * @return {Headers}
	 */
	json: () => {
		return new Headers({
			'Accept': 'application/json'
		});
	},
	/**
	 * accept: none
	 * @return {Headers}
	 */
	noContent: () => {
		return new Headers({
			'Accept': '*/*'
		});
	},
	/**
	 * accept: wav
	 * @return {Headers}
	 */
	wav: () => {
		return new Headers({
			'Accept': 'audio/wav',
			'Content-Type': 'application/json',
		});
	},
}