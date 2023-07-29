'use strict';

const {REST} = require('../rest/index');
const {query} = require('./query');
const {speakerlist} = require('./speaker');
const {dict} = require('./dict');

exports.client = class {
	/**
	 * @member {REST} rest
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
		this.#rest = new REST(address, max);
	}

	/**
	 * create Query
	 * @param {String} text
	 * @param {Number} speaker
	 * @param {Boolean} autoSynthesis 合成のみする。
	 * @param {Boolean} enable_interrogative_upspeak 疑問系のテキストが与えられたら語尾を自動調整する
	 * @return {(query|ArrayBuffer)} Queryクラスか、wavファイル
	 */
	async createQuery(text, speaker, autoSynthesis=false, enable_interrogative_upspeak) {
		const query_data = new query(this.#rest, text, speaker);
		await query_data.get();
		// 自動合成
		if(autoSynthesis ?? false){
			return await query_data.synthesis(enable_interrogative_upspeak);
		}
		// クラスを返す
		else{
			return query_data;
		}
	}

	/**
	 * create Speaker list
	 */
	async createSpeaker() {
		// 一回のみ
		if(this.#Speaker == undefined){
			this.#Speaker = new speakerlist(this.#rest);
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
			this.#Dict = new dict(this.#rest);
			await this.#Dict.get();
		}
		return this.#Dict;
	}

}