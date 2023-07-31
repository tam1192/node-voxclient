'use strict';

const Rest = require('./../rest/rest');
const Query = require('./query');
const Speakerlist = require('./speakerlist');
const Dict = require('./dict');

/**
 * @class vox client class
 */
module.exports = class Client{
	/**
	 * @member {Rest} rest
	 */
	#rest;

	/**
	 * @member {speakerlist} Speaker
	 */
	#Speaker

	/**
	 * @member {dict} Dict
	 */
	#Dict

	/**
	 * @param {String} url
	 * @param {Number} max 一度にアクセスする量を制限します。
	 */
	constructor(address, max) {
		this.#rest = new Rest(address, max);
	}

	/**
	 * create Query
	 * @param {String} text
	 * @param {Number} speaker
	 * @return {Query} Queryクラスか、wavファイル
	 */
	async createQuery(text, speaker) {
		const query_data = new Query(this.#rest, text, speaker);
		await query_data.get();
		return query_data;
	}

	/**
	 * create Voice
	 * @param {String} text
	 * @param {Number} speaker
	 * @param {Boolean} enable_interrogative_upspeak 疑問系のテキストが与えられたら語尾を自動調整する
	 * @returns {Promise<ArrayBuffer>}
	 */
	async createVoice(text, speaker, enable_interrogative_upspeak) {
		const q = await this.createQuery(text, speaker);
		return await q.synthesis(enable_interrogative_upspeak);
	}

	/**
	 * create Speaker list
	 */
	async createSpeaker() {
		// 一回のみ
		if(this.#Speaker == undefined){
			this.#Speaker = new Speakerlist(this.#rest);
			await this.#Speaker.get();
		}
		return this.#Speaker;
	}

	/**
	 * create Dict
	 */
	async createDict() {
		// 一回のみ
		if(this.#Dict == undefined){
			this.#Dict = new Dict(this.#rest);
			await this.#Dict.get();
		}
		return this.#Dict;
	}
}