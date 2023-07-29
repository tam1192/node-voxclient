'use strict';
const {REST, routes, headers} = require('../rest/index');

exports.query = class {
	/**
	 * @member {REST} rest
	 */
	rest;

	/**
	 * @member {String} text
	 */
	text;

	/**
	 * @member {Number} speaker
	 */
	speaker;

	/**
	 * @member {String} query
	 */
	#query;

	/**
	 * @param {REST} rest
	 * @param {String} text
	 * @param {Number} speaker
	 */
	constructor(rest, text, speaker) {
		if (rest instanceof REST ||
			typeof text == 'string' ||
			typeof speaker == 'number'){
				this.rest = rest;
				this.text = text;
				this.speaker = speaker;
			}
		else {
			throw new TypeError('parameter is missing.');
		}
	}

	/**
	 * クエリを取得します。
	 * @returns {Object} クエリ
	 */
	getQuery = async () => {
		try {
			// できてないなら
			if(this.#query == undefined){
				const response = await this.rest.post(routes.query({
					text: this.text,
					speaker: this.speaker,
				}), headers.json);
				this.#query = await response.json();
			}
			return this.#query;
		}
		catch(e) {
			e.message = 'Error: getQuery did not succeed.';
			throw e;
		}
	}

	/**
	 * @param {boolean} enable_interrogative_upspeak 疑問系のテキストが与えられたら語尾を自動調整する
	 */
	getSynthesis = async (enable_interrogative_upspeak) => {
		try {
			const response = await this.rest.post(routes.synthesis({
				speaker: this.speaker,
				enable_interrogative_upspeak: enable_interrogative_upspeak ?? true,
			}), headers.wav, JSON.stringify(await this.getQuery()));
			return await response.arrayBuffer();
		}
		catch(e) {
			e.message = 'Error: Synthesis did not succeed.';
			throw e;
		}
	}
}