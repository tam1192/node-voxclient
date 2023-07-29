/**
 * accept: json
 */
exports.json = new Headers({
	Accept: 'application/json'
});

/**
 * accept: wav
 */
exports.wav = new Headers([
	['Accept', 'audio/wav'],
	['Content-Type', 'application/json']
])

/**
 * accept: none
 */
exports.noContent = new Headers({
	accept: '*/*'
});
