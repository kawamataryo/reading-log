# JAVSCRIPT.INFO 現代のJavaScriptチュートリアル

# 目的
- JS及びプラウザの挙動、プログラミングの基礎固め

# メモ良いところ
- 実際のコードでどう使われるかが書いてる。逆に使われない場合も、使われないと書いてある。

# プラウザ
📅 2020/05/30
[ブラウザ環境, 仕様](https://ja.javascript.info/browser-environment)
[DOM ツリー](https://ja.javascript.info/dom-nodes)
[DOM を歩く](https://ja.javascript.info/dom-navigation)

プラウザの仕様
- プラウザにはグローバルオブジェクトがある
- DOM, BOM, JSの3つ
- CSSを構造的に把握するためのCSSOMという仕様もある
- BOM（Browser Object Mode) document以外のプラウザに提供される追加オブジェト
  - navigator OSのバックグラウンド情報, UAとか
  - location 現在のURL、新しいURLへのリダイレクト
  - BOMはHTML仕様の一部

DOMの自動補正
- プラウザは書きかけのHTMLを補正する
- HTMLやBODYがなかったら勝手に挿入する

- コメントも自動的にノードになる

DOMコレクション
- Arrayライクなオブジェクト
- for .. ofで反復処理できる
- filterとかは使えない
  - Array.from(document.body.childNodes).filter で使える

Element-only navigation
- テキストノードや、コメントノードを除く場合は、Element付きのメソッドを呼ぶ

# Promise
📅 2020/05/28
[Promise API](https://ja.javascript.info/promise-api)
[Promisification](https://ja.javascript.info/promisify)
[Microtasks](https://ja.javascript.info/microtask-queue)

`Promise.resolve`はPromiseをラップしたい処理で使える。例えばキャッシュがあれば、キャッシュで返し、なければ非同期処理を呼ぶ関数など。キャッシュから返す場合でもPromiseでラップすると使い手側は、そのことを考えなくて良い


```js
function loadCached(url) {
  let cache = loadCached.cache || (loadCached.cache = new Map());

  if (cache.has(url)) {
    return Promise.resolve(cache.get(url)); // (*)
  }

  return fetch(url)
    .then(response => response.text())
    .then(text => {
      cache[url] = text;
      return text;
    });
}
```

- .json()はPromiseを返すのか,,。fetchは全て完了するまえにresponseを返すから？
- Promise.allはどれかが途中で失敗しても、他は実行し続ける。途中でキャンセルとかはない。
- 非Promiseの値をPromise.allに渡した場合、その値はPromise.resolve()でラップされる。

Promise.allでどれかが失敗した場合でも、成功した結果はアウトプットしたい場合の書き方。
勉強になるな。

```js
Promise.all(
  // それぞれにcatchを書く
  fetch('https://api.github.com/users/iliakan').catch(err => err),
  fetch('https://api.github.com/users/remy').catch(err => err),
  fetch('http://no-such-url').catch(err => err)
).then(result => /*...*/)
```

# Promise
📅 2020/05/25
[Promise](https://ja.javascript.info/promise-basics)
[Promises チェーン](https://ja.javascript.info/promise-chaining)

- 非同期アクションは常にPromiseを返すべき
- 非同期で例外のキャチを忘れると、unhandledrejectionイベントが発生する。

```js
new Promise(function(resolve, reject) {
  setTimeout(() => {
    throw new Error("Whoops!");
  }, 1000);
}).catch(alert);
```

でalertは実行されない。executorの外なので暗黙のtry..catchが効かない

# Mutation observer
📅 2020/05/24
[Mutation observer](https://ja.javascript.info/mutation-observer)
[MutationObserver - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

- DOM要素を監視して、変更があった場合にコールバックを起動する組み込みオブジェクト。
- 状態の変化によって動的になにかを実行したい時に使える
- MutationObserverはIEでも使える

```js
// オブザーバーの作成
const observer = new MutationObserver(() => {console.log('hello')})
// オブザーバーのDOMヘのアタッチ
observer.observe(node, config)
```

# SelectionとRange
📅 2020/05/24
[Selection と Range](https://ja.javascript.info/selection-range)

### Range
- DOMを範囲指定で取得することができる
- 取得したDOMに対しては様々な処理ができる

```html
<p id="p">Example: <i>italic</i> and <b>bold</b></p>

<script>
  let range = new Range();

  range.setStart(p, 0);
  range.setEnd(p, 2);

  // range の toString はそのコンテンツをテキストとして(タグなし)返します
  alert(range); // Example: italic

  // この range をドキュメント選択に適用します（後で説明します）
  document.getSelection().addRange(range);
</script>
```

### Selection

- ドキュメントの選択を行う
- selectionでドキュメントのハイライトとかできそう

```html
<input id="input" style="width:200px" value="Select here and click the button">
<button id="button">Wrap selection in stars *...*</button>

<script>
button.onclick = () => {
  if (input.selectionStart == input.selectionEnd) {
    return; // nothing is selected
  }

  // 選択範囲を*で囲っている
  let selected = input.value.slice(input.selectionStart, input.selectionEnd);
  input.setRangeText(`*${selected}*`);
};
</script>
```


# メモ
- 実際にどういうタイミングで使われるのかが書いてあるのが最高

# イベントループ：micortaskとmacrotask
📅 2020/05/24
[イベントループ(event loop): microtask と macrotask](https://ja.javascript.info/event-loop)

- JavaScriptエンジンは無限ループでタスクを待機している
- エンジンのアルゴリズムは、古いタスクから開始し、それを実行する。タスクが現れるまでスリープという簡単なもの
- Eventループはキューで出来ている
- エンジンがタスクを実行している時間は、レンダリングはブロックされている。
- setTimeoutとPromise.resolve()ではPromise.resolve()の方が実行が早い。それはsetTimeoutがmacrotaskで、Promise.resolve()がmicrotaskを生成するものだから？？

```js
//3番目に実行
setTimeout(() => alert("timeout"));

//2番目に実行
Promise.resolve()
  .then(() => alert("promise"));

//1番目に実行
alert("code");
```

# Promise
📅 2020/05/24
[Promise](https://ja.javascript.info/promise-basics)

- promiseに渡されるコールバックはexecutorと呼ばれる