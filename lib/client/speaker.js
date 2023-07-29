'use strict';
const {REST, routes, headers} = require('../rest/index');

exports.speakerlist = class {
	/**
	 * @member {Map} speaker
	 */
	#speaker;

	/**
	 * @member {REST} rest
	 */
	#rest;

	constructor(rest){
		if (rest instanceof REST){
				this.#rest = rest;
			}
		else {
			throw new TypeError('parameter is missing.');
		}
	}

	/**
	 * @returns {Object} speakerlist
	 */
	get = async () => {
		try {
			// できてないなら
			if(this.#speaker == undefined){
				this.#speaker = new Map();
				const response = await this.#rest.get(routes.speaker(), headers.json);
				const speakerlist = await response.json();
				// mapに置き換えて保存
				for(const chara of speakerlist){
					// 多重map
					const data = new Map();
					for(const style of chara.styles){
						data.set(style.name , style.id);
					}
					// 登録
					this.#speaker.set(chara.name, data);
				}
			}
			return this.#speaker;
		}
		catch(e) {
			e.message = 'Error: getSpeaker did not succeed.';
			throw e;
		}
	}

	/**
	 * @param {String} name キャラ名
	 * @returns {Array<String>}
	 */
	listSpeakerStyle = (name) => {
		if(this.#speaker.has(name)){
			const speaker = this.#speaker.get(name);
			const data = [];
			for(const style of speaker){
				data.push(style[0]);
			}
			return data;
		}
		else {
			throw new Error('Speaker is not found');
		}
	}

	/**
	 * @param {String} speaker キャラ名
	 * @param {String} style タイプ
	 * @returns {Array}
	 */
	searchId = (speaker, style) => {
		if(this.#speaker.has(speaker)){
			const sp = this.#speaker.get(speaker)
			if(sp.has(style)){
				return sp.get(style);
			}
		}
		else{
			throw new Error('not found');
		}
	}

	/**
	 * @param {Number} id id
	 */
	searchSpeaker = (id) => {
		return new Promise((resolve, reject) => {
			const data = []; this.#speaker.forEach((styles, speaker) => {
				styles.forEach((styleid, style) => {
					if(styleid == id){
						data.push(speaker);
						data.push(style);
						resolve(data);
					}
				});
				reject(new Error('not found'));
			});
		});
	}


}