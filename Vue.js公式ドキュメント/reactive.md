# Reactivity in Depth

> Reactivity is a programming paradigm that allows us to adjust to changes in a declarative manner.

reactiveとは、宣言的な方法で変更に適応できるシステム

Vueインスタンスのdataオプションにオブジェクトを渡すと、全てのプロパティにgetterと、setterのインターセプトをしたプロキシに変換する

ProxyはES6の機能でIE11には対応していない。(旧バージョンではObject.definePropertyを利用している)

Proxyを使った方が簡潔で、パフォーマンスが向上している。

trackでは、WeakMapにオブジェクトを入れて、さらにMapで各プロパティを管理、プロパティごとにSetで依存関数を記録している。

依存関係は、effect内で呼ばれたオブジェクト。

Reflectが重要。（reflectの第三引数が重要）

コンポーネントインスタンスのウォッチャーでレンダリング中にプロパティがタッチされる。

コンポーネントの最初のレンダリング時（setup()かな？)にtemplateでアクセスしたプロパティが記録される。

プロパティの値に変更がはいると、triggerが実行されて全ての再描画が走る。

dataは、内部的にはreactive()を実行している。

ref()はプリミティブ値を、リアクティブにする時に使う。
refはvalueというgetterと、setterを持つオブジェクト。このgetterとsetterでtrackとtriggerを読んでいる。


reactiveの中にrefオブジェクトを入れると、unwrapされて、通常のreactiveオブジェクトと同等に使える

watchEffectのonTriggerと、onTrackを使うと、trackとtrigger時のいろいろな情報が取れる。これは動きを理解するのに最高

watchEffectのEffectは

```ts
watchEffect(
  () => {
    /* side effect */
  },
  {
    onTrigger(e) {
      debugger
    }
  }
)
```