# Vue.js公式ドキュメント
https://v3.vuejs.org/

# Introduction
- Vueは段階的に採用できるプログレッシブなフレームワーク。他のライブラリや、既存のプロジェクトと簡単に統合できる
- Vueではtemplateに公開したデータとDOMがリンクされて、データが変更されるとリアクティブにDOMが再描画される。
- ディレクティブとはDOMの属性や子コンポーネとのpropsに値をバインドできる機能。接頭語として`v-`が付く。
  - v-bind
  - v-on
  - v-model
- Vueのコンポーネントはweb componentsと似ているが以下の点で異なる
  - 全ての主要プラウザで動作する
  - クロスコンポーネントデータフロー、カスタムイベント通信、およびビルドツールの統合を提供している

# Vue instance
- Vue インスタンスの作成
  ```js
    Vue.createApp(/*option*/).mount('#app')
  ```
- VueはMVVMパターンに一部触発されて、慣例としてVueインスタンスを参照するための変数は`vm`となっている。
- createAppで作成されたインスタンスがルートのVueインスタンスとなる。
- Vueインスタンスのプロパティに公開されているインスタンスプロパティは`$`が接頭語になっている。ユーザー定義のものと区別するため

# template
- [Template Syntax | Vue.js](https://v3.vuejs.org/guide/template-syntax.html#dynamic-arguments)
- ディレクティブの動的引数。動的にバインドする属性や、イベントを変えることができる。知らなかった。
  ```html
  <!-- attributeName, eventNameは実行時に評価された値が入る -->
  <a v-bind:[attributeName]="url"> ... </a>
  <a v-on:[eventName]="doSomething"> ... </a>
```
- 動的引数は、nullをのぞいて文字列に評価されることを期待している。nullを入れると明示的にバインドを削除できる。
- 動的引数では、構文上の制約もある

# computed property watcher
- [Computed Properties and Watchers | Vue.js](https://v3.vuejs.org/guide/computed.html#basic-example)
- `computed`を使う利点は、依存関係に基づいてキャッシュされること。通常のメソッドだと再レンダリングの度に関数が再実行されるが、`computed`を使うとその際実行を防げる。
- computedにはgetterを生やすこともできる

#  class and style binding
- [Class and Style Bindings | Vue.js](https://v3.vuejs.org/guide/class-and-style.html#binding-html-classes)
- classのバインドは、computedで定義する方がすっきりする
- 子コンポーネントへのclassの指定は、子コンポーネントないのルート要素のクラスへマージされる
  - もし、小コンポーネントに複数のルート要素がある場合は、`$attrs.class`で明示的に定義する必要がある。
  ```html
  <div id="app">
    <my-component class="baz"></my-component>
  </div>
  ```

  ```js
  const app = Vue.createApp()

  app.component('my-component', {
    template: `
      <p :class="$attrs.class">Hi!</p>
      <span>This is a child component</span>
    `
  })
  ```

2020/07/19
次回はここから
https://v3.vuejs.org/guide/class-and-style.html#binding-inline-styles

# 条件付きレンダリング
- [Conditional Rendering | Vue.js](https://v3.vuejs.org/guide/conditional.html#v-else)
- v-ifとv-showの違いは、v-showは常にDOMに要素が残りCSSのdisplayプロパティによって表示が制御されること。v-showはtemplateで使うことはできない。
- v-ifはコストが高い。頻繁に切り替える要素の場合はv-showを使った方が良い

# リストレンダリング
- [List Rendering | Vue.js](https://v3.vuejs.org/guide/list.html#mapping-an-array-to-elements-with-v-for)
- v-forはオブジェクトの各プロパティの反復処理もできる。引数を２つに分けることで、keyとvalueを変数に束縛できる。
  ```vue
  <li v-for="(value, name) in myObject">
    {{ name }}: {{ value }}
  </li>
  ```
- リアクティブな要素としての配列は破壊的メソッドをラップして、DOMの再描画をトリガーしている。filter等の非破壊メソッドを使う場合は、再代入を行う。その場合でも、Vueは全てを書き換えるのではなく、必要な要素のみ書き換える動きをする。
- v-forとv-ifを両方一緒に使った場合は、v-forはv-ifより優先順位が高くなる。

2020/07/20
次回はここから
https://v3.vuejs.org/guide/events.html#listening-to-events

# Event Handling
- [Event Handling | Vue.js](https://v3.vuejs.org/guide/events.html#listening-to-events)
- カンマ区切りで複数のイベントも実行できる
```vue
<!-- both one() and two() will execute on button click -->
<button @click="one($event), two($event)">
  Submit
</button>
```

## イベント修飾子
DOMイベントの処理を修飾する
修飾子は記載順序で処理が行われるので順番に注意する
 .stop
 .prevent
 .capture
 .self
 .once
 .passive

```vue
<!-- the click event's propagation will be stopped -->
<a @click.stop="doThis"></a>

<!-- the submit event will no longer reload the page -->
<form @submit.prevent="onSubmit"></form>

<!-- modifiers can be chained -->
<a @click.stop.prevent="doThat"></a>

<!-- just the modifier -->
<form @submit.prevent></form>

<!-- use capture mode when adding the event listener -->
<!-- i.e. an event targeting an inner element is handled here before being handled by that element -->
<div @click.capture="doThis">...</div>

<!-- only trigger handler if event.target is the element itself -->
<!-- i.e. not from a child element -->
<div @click.self="doThat">...</div>
```