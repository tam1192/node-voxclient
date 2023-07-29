'use strict';
const URLParams = require('./urlParams');

const query_options = {
	/**
	 * @type {String} 読み上げる文章
	 */
	text: undefined,
	/**
	 * @type {Number} 話者
	 */
	speaker: 1,
}
exports.query_options = query_options;

/**
 * @param {query_options} options
 * @returns {URL}
 */
exports.query = (options = query_options) => {
	return URLParams('audio_query', options);
}

const synthesis_options = {
	/**
	 * @type {Number} 話者
	 */
	speaker: 1,
	/**
	 * @type {boolean} 疑問系のテキストが与えられたら語尾を自動調整する
	 */
	enable_interrogative_upspeak: false,
}
exports.synthesis_options = synthesis_options;

/**
 * @param {synthesis_options} options
 * @returns {URL}
 */
exports.synthesis = (options = synthesis_options) => {
	return URLParams('synthesis', options);
}

const user_dict_word_params = {
	/**
	 * @type {String} surface 言葉の表層形
	 */
	surface: undefined,
	/**
	 * @type {String} pronunciation 言葉の発音（カタカナ）
	 */
	pronunciation: undefined,
	/**
	 * @type {Number} accent_type アクセント型（音が下がる場所を指す）
	 */
	accent_type: undefined,
	/**
	 * @type {('PROPER_NOUN'|'COMMON_NOUN'|'VERB'|'ADJECTIVE'|'SUFFIX')} word_type PROPER_NOUN（固有名詞）、COMMON_NOUN（普通名詞）、VERB（動詞）、ADJECTIVE（形容詞）、SUFFIX（語尾）
	 */
	word_type: undefined,
	/**
	 * @type {Number} priority 単語の優先度（0から10までの整数） 数字が大きいほど優先度が高くなる 1から9までの値を指定することを推奨
	 */
	priority: undefined,
}
exports.user_dict_word_params = user_dict_word_params;

/**
 * @param {String} _uuid
 * @param {user_dict_word_params} options
 * @returns {URL}
 */
exports.user_dict_word = (_uuid, options = user_dict_word_params) => {
	const uuid = (()=>{
		if(typeof _uuid=='string') {
			return `user_dict_word/${_uuid}`;
		}
		else if(_uuid==undefined) {
			return 'user_dict_word';
		}
		else {
			throw new TypeError('options is undefined.');
		}
	})();
	return URLParams(uuid, options);
}