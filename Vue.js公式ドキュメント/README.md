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