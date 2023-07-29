# node-voxclient
This is a module to connect to voicevox with nodejs.

nodejsでvoicevoxに接続するためのモジュールです。（二番煎じ）
自分の学習用に作りました。

## 内容物
### client
基本的な関数群です。
```javascript
const {client} = require('./lib/index');
const fs = require('fs');

(async () => {
    // クライアント情報を登録
	const vox = new client('http://localhost:50021/');
    // クエリクラス作成
	const query = await vox.createQuery('テストなのだ！', 1);
	try {
        // 音声ファイル作成
		const wav = await query.getSynthesis();
		fs.writeFileSync('./test.wav', Buffer.from(wav));
	}
	catch (e){
		console.error(e);
	}
})();
```

### rest
restAPIもどきです。  
```javascript
const {REST} = require('./lib/index.js');
const address = new URL('http://localhost:50021/');
// URLとstringのどっちか
const rest = REST(address);

// get 
rest.get(route, headers)
// post, put, delete
// bodyはオプション
rest.post(route, headers, body)
```

routesは引数にパラメーター、関数自体がパスを返す関数群です。  
```javascript
const {routes, REST} = require('./lib/index.js');
const rest = //省略

rest.post(routes.query({
    text: 'テストなのだ',
    speaker: 1
}), headers);
```

headersに基本的なheaders情報が含まれます。
```javascript
const {routes, REST, headers} = require('./lib/index.js');
const rest = //省略

rest.post(routes.query({
    //省略
}), headers.json);
```