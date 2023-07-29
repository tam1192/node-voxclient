'use strict';

const {REST, routes, headers} = require('../rest/index');
const {user_dict, user_dict_word, user_dict_word_params, speaker} = require('../rest/index').routes;
const {query} = require('./query');

exports.client = class {
	/**
	 * @member {REST} rest
	 */
	#rest;

	/**
	 * @param {String} url
	 */
	constructor(address) {
		this.#rest = new REST(address);
	}

	/**
	 * create Query class
	 * @param {String} text
	 * @param {Number} speaker
	 */
	async createQuery(text, speaker) {
		const query_data = new query(this.#rest, text, speaker);
		await query_data.getQuery();
		return query_data;
	}

	/**
	 * @member {Promise} getSpeaker
	 */
	getSpeaker = () => {
		return new Promise((resolve, reject) => {
			this.#rest.get(speaker(), headers.json)
				.then(value => {
				value.json().then(value => {
					resolve(value);
				});
			}).catch(reason => {
				reject(reason);
			});
		});
	}

	/**
	 * @member {Promise} getDict
	 */
	async getDict() {
		try{
			const data = await this.#rest.get(user_dict(), headers.json);
			return await data.json();
		}
		catch(e) {
			throw e;
		}
	}

	/**
	 * dictに単語を追加します。
	 * @param {user_dict_word_params} options
	 */
	setDict = async (options = user_dict_word_params) => {
		try{
			const resolve = await this.#rest.post(routes.user_dict_word(null, options), headers.json);
			return await resolve.json();
		}
		catch(e) {
			throw e;
		}
	}

	/**
	 * dictに単語を変更します。
	 * @param {String} uuid
	 * @param {user_dict_word_params} options
	 */
	updateDict = async (uuid, options = user_dict_word_params) => {
		try{
			await this.#rest.put(routes.user_dict_word(uuid, options), headers.noContent);
			return 0;
		}
		catch(e) {
			throw e;
		}
	}

	/**
	 * dictに単語を消します。
	 * @param {String} uuid
	 * @param {user_dict_word_params} options
	 */
	deleteDict = async (uuid, options = user_dict_word_params) => {
		try{
			await this.#rest.delete(routes.user_dict_word(uuid, options), headers.noContent);
			return 0;
		}
		catch(e) {
			throw e;
		}
	}

}