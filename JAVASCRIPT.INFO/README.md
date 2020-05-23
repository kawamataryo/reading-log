# JAVSCRIPT.INFO 現代のJavaScriptチュートリアル

# 目的
- JS及びプラウザの挙動、プログラミングの基礎固め


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