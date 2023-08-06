const nodevox = require('./lib/index');
const fs = require('fs');
const path = require('path');
const stream = require('stream');

// サーバーアドレス。
const address = new URL('http://localhost:50021');

// clientインスタンス作成
const client = new nodevox.Client(address, 0);

// クエリ作成~合成
// コメントアウトして計測したほうが正確です。
const text = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわおん';

console.time('stream');
client.createVoice(text, 1, true).then(data => {
	const file = fs.createWriteStream(path.join(__dirname, 'file1.wav'), {
		autoClose: true
	});
	stream.Readable.fromWeb(data).pipe(file);
	console.timeEnd('stream');
});

console.time('query');
client.createQuery(text, 1)
	.then(query => query.synthesis())
	.then(data => {
		fs.writeFileSync(path.join(__dirname, 'file2.wav'),
			Buffer.from(data));
		console.timeEnd('query');
	});

// // クエリ作成
// (async () => {
// 	const exQuery = await client.createQuery('テストなのだ', 1);
// 	console.debug(await exQuery.get());
// 	// 合成
// 	const data = await exQuery.synthesis();
// 	fs.writeFileSync(path.join(__dirname, 'file2.wav'), Buffer.from(data));
// })();

// // speakerlistを作成
// (async() => {
// 	const list = await client.createSpeaker();
// 	console.debug(await list.get());
// 	// 合成
// 	// [ 'ノーマル', 'あまあま', 'ツンツン', 'セクシー', 'ささやき', 'ヒソヒソ' ]
// 	console.debug(list.listSpeakerStyle('ずんだもん'));
// 	// 3
// 	console.debug(list.searchId('ずんだもん', 'ノーマル'));
// 	//
// 	console.debug(await list.searchSpeaker(3));
// })();