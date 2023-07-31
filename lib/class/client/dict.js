'use strict';
const routes = require('../../routes/index');
const headers = require('../../headers/index');

const timeout = 500;

function wait(msec = timeout) {
	return new Promise(resolve => {
		setTimeout(()=>resolve(), msec);
	});
}

/**
 * @class vox dict class
 */
module.exports = class Dict {
	/**
	 * @member {Map} speaker
	 */
	#dict;

	/**
	 * @member {REST} rest
	 */
	#rest;

	/**
	 * @member {Boolean} lock 二重アップデート防止用
	 */
	#lock = false;

	constructor(rest){
		this.#rest = rest;
	}

	#dictupdate = async () =>{
		try{
			this.#dict.clear();
			const response = await this.#rest.get(routes.user_dict(), headers.json());
			const dictlist = await response.json();
			// mapに置き換えて保存
			for(const uuid in dictlist){
				// 多重map
				const data = new Map();
				for(const item in dictlist[uuid]){
					data.set(item , dictlist[uuid][item]);
				}
				// 登録
				this.#dict.set(uuid, data);
			}
		}
		catch(e) {
			throw e;
		}
	}

	/**
	 * @returns {Map} dict
	 */
	get = async () => {
		try {
			// できてないなら
			if(this.#dict == undefined){
				this.#dict = new Map();
				await this.#dictupdate();
			}
			return this.#dict;
		}
		catch(e) {
			e.message = 'Error: getSpeaker did not succeed.';
			throw e;
		}
	}

	/**
	 * Search by surface
	 * @param {String} surface 単語
	 * @returns {Array}
	 */
	searchSurface = async(surface) => {
		const datas = [];
		return new Promise((resolve, reject)=>{
			this.#dict.forEach((word, name) => {
				if(word.get('surface')==surface) {
					const data = [name, word]
					datas.push(data);
				}
			});
			if(datas.length!=0){
				resolve(datas);
			}
			else{
				reject(new Error('not found.'));
			}
		});
	}

	/**
	 * Search by yomi
	 * @param {String} yomi 読み
	 * @returns {Array}
	 */
	searchYomi = async(yomi) => {
		const datas = [];
		return new Promise((resolve, reject)=>{
			this.#dict.forEach((word, name) => {
				if(word.get('yomi')==yomi) {
					const data = [name, word]
					datas.push(data);
				}
			});
			if(datas.length!=0){
				resolve(datas);
			}
			else{
				reject(new Error('not found.'));
			}
		});
	}


	/**
	 * Search by uuid
	 * @param {String} uuid
	 * @returns {Map}
	 */
	searchUuid = (uuid) => {
		if(this.#dict.has(uuid)){
			return this.#dict.get(uuid);
		}
		else {
			throw new Error('not found.');
		}
	}

	/**
	 * Register a word in the dictionary 
	 * @param {user_dict_word_params} option
	 */
	regist = async(option = {}) => {
		while(true){
			if(!this.#lock){
				this.#lock = true;
				try{
					await this.#rest.post(routes.user_dict_word(null, option), headers.json());
					await this.#dictupdate();
					this.#lock = false;
					return;
				}
				catch(e){
					this.#lock = false;
					throw e.message('Dictionary was not registered.');
				}
			}
			else {
				await wait();
			}
		}
	}

	/**
	 * Update dictionaty words
	 * @param {String} uuid
	 * @param {user_dict_word_params} option
	 */
	update = async(uuid = '', option = {}) => {
		while(true){
			if(!this.#lock){
				this.#lock = true;
				try{
					if(this.#dict.uuid(uuid)){
						await this.#rest.put(routes.user_dict_word(uuid, option), headers.noContent());
						await this.#dictupdate();
					}
					this.#lock = false;
					return;
				}
				catch(e){
					this.#lock = false;
					throw e.message('Dictionary was not registered.');
				}
			}
			else {
				await wait();
			}
		}
	}

	/**
	 * Delete dictionary words
	 * @param {String} uuid
	 */
	delete = async(uuid = '') => {
		while(true){
			if(!this.#lock){
				this.#lock = true;
				try{
					await this.#rest.delete(routes.user_dict_word(uuid), headers.noContent());
					await this.#dictupdate();
					this.#lock = false;
					return;
				}
				catch(e){
					e.message = 'Dictionary was not registered.';
					this.#lock = false;
					throw e;
				}
			}
			else {
				await wait();
			}
		}
	}
}