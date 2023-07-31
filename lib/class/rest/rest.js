'use strict';

const Route = require('./route');

const timeout = 500;

function wait(msec = timeout) {
	return new Promise(resolve => {
		setTimeout(()=>resolve(), msec);
	});
}

/**
 * @class rest API.
 */
class Rest {
	/**
	 * @member {URL} engine
	 */
	#engine;

	/**
	 * @member {Number} connection 同時接続数管理
	 */
	#connection = 0;

	/**
	 * @member {Number} max 最大同時接続数(0は無限)
	 */
	max = 0;

	/**
	 * @param {(String | URL)} address Address of voicevox engine.
	 * @param {Number} maxConnection Maximum simultaneous connections.(0 is infinite)
	 */
	constructor(address, maxConnection=0) {
		// 引数エラー
		// 引数の型が違うなら
		if(typeof address == 'string'){
			this.#engine = new URL(address);
			if(typeof maxConnection == 'number'){this.max = maxConnection}
		}
		else if(address instanceof URL) {
			this.#engine = address;

		}
		else {
			throw new TypeError('Invalid argument');
		}
	}

	/*
	 * @param {('GET'|'POST'|'PUT'|'DELETE')} method 
	 * @param {URL} route 
	 * @param {Headers} header 
	 * @param {*} body
	 * @returns {Promise<Response>}
	 */
	#request = async(method, route, header, body) => {
		// 引数改変を避ける
		// // urlを書き換える。
		// route.protocol = this.#engine.protocol;
		// route.host = this.#engine.host;
		// urlをクローン
		const url = new URL(this.#engine);
		// urlにroute情報登録
		url.pathname = route.pathname;
		url.search = route.search;
		// fetch用option
		const options = {
			method: method,
			headers: header
		}
		// bodyが存在すれば追加
		if(body!=undefined){
			options.body = body;
		}

		while(true){
			// 接続管理
			if(this.max==0 || this.#connection < this.max){
				// 接続数増加
				this.#connection++;
				try{
					// fetchオブジェクト生成
					const Response = await fetch(url, options);
					// 接続数減少
					this.#connection--;
					switch (Response.status) {
						// success
						case 200:
							return(Response);
						// success
						case 204:
							return(Response);
						default:
							throw(new Error(Response.statusText, {cause: Response}));
					}
				}
				catch(e){
					console.debug(url);
					throw new Error('request error (Perhaps the server address is incorrect.)', {cause: e})
				}
			}
			else {
				await wait();
			}
		}
	}

	/**
	 * Get request
	 * @param {Routes} route
	 * @param {Headers} header
	 * @returns {Promise<Response>}
	 */
	get(route, header) {
		if(route instanceof Route ||
			header instanceof Headers){
			return this.#request('GET', route, header);
		}
		else {
			throw new TypeError('Invalid argument');
		}
	}

	/**
	 * Post request
	 * @param {Routes} route
	 * @param {Headers} header
	 * @param {*} body
	 * @returns {Promise<Response>}
	 */
	post(route, header, body){
		if(route instanceof Route ||
			header instanceof Headers){
			return this.#request('POST', route, header, body);
		}
		else {
			throw new TypeError('Invalid argument');
		}
	}

	/**
	 * Put request
	 * @param {Routes} route
	 * @param {Header} header
	 * @param {*} body
	 * @returns {Promise<Response>}
	 */
	put(route, header, body){
		if(route instanceof Route ||
			header instanceof Headers){
			return this.#request('PUT', route, header, body);
		}
		else {
			throw new TypeError('Invalid argument');
		}
	}

	/**
	 * Delete request
	 * @param {Routes} route
	 * @param {Header} header
	 * @param {*} body
	 * @returns {Promise<Response>}
	 */
	delete(route, header, body){
		if(route instanceof Route ||
			header instanceof Headers){
			return this.#request('DELETE', route, header, body);
		}
		else {
			throw new TypeError('Invalid argument');
		}
	}
}
module.exports = Rest;