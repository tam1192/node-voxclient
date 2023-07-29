'use strict';

exports.REST = class {
	/**
	 * @member {URL} engine
	 */
	#engine;
	
	/**
	 * @param {(String | URL)} address voicevoxのアドレス
	 */
	constructor(address) {
		// 引数エラー
		// 引数の型が違うなら
		if(typeof address == 'string'){
			this.#engine = new URL(address);
		}
		else if(address instanceof URL) {
			this.#engine = address;

		}
		else {
			throw new TypeError('Invalid argument');
		}
	}

	/**
	 * @param {('GET'|'POST'|'PUT'|'DELETE')} method 
	 * @param {URL} route 
	 * @param {Headers} header 
	 * @param {*} body
	 * @returns {Promise<Response>}
	 */
	#request = (method, route, header, body) => {
		// urlを書き換える。
		route.protocol = this.#engine.protocol;
		route.host = this.#engine.host;
		// fetch用option
		const options = {
			method: method,
			headers: header
		}
		// bodyが存在すれば追加
		if(body!=undefined){
			options.body = body;
		}

		//fetchオブジェクト生成
		return new Promise((resolve, reject) => {
			fetch(route, options).then(Response => {
				switch (Response.status) {
					// success
					case 200:
						resolve(Response);
						break;
					// success
					case 204:
						resolve(Response);
						break;
					default:
						reject(new Error(Response.statusText, {cause: Response}));
						break;
				}
			}).catch(reason => reject(new Error('request error (Perhaps the server address is incorrect.)', {cause: reason})));
		});
	}

	/**
	 * @param {URL} route 
	 * @param {Header} header 
	 * @returns {Promise<Response>}
	 */
	get(route, header) {
		if(route instanceof URL ||
			header instanceof Headers){
			return this.#request('GET', route, header);
		}
		else {
			throw new TypeError('Invalid argument');
		}
	}

	/**
	 * @param {URL} route 
	 * @param {Header} header 
	 * @param {*} body 
	 * @returns {Promise<Response>}
	 */
	post(route, header, body){
		if(route instanceof URL ||
			header instanceof Headers){
			return this.#request('POST', route, header, body);
		}
		else {
			throw new TypeError('Invalid argument');
		}
	}

	/**
	 * @param {URL} route 
	 * @param {Header} header 
	 * @param {*} body 
	 * @returns {Promise<Response>}
	 */
	put(route, header, body){
		if(route instanceof URL ||
			header instanceof Headers){
			return this.#request('PUT', route, header, body);
		}
		else {
			throw new TypeError('Invalid argument');
		}
	}

	/**
	 * @param {URL} route 
	 * @param {Header} header 
	 * @param {*} body 
	 * @returns {Promise<Response>}
	 */
	delete(route, header, body){
		if(route instanceof URL ||
			header instanceof Headers){
			return this.#request('DELETE', route, header, body);
		}
		else {
			throw new TypeError('Invalid argument');
		}
	}
}