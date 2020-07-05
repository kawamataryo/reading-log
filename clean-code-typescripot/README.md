# clean code typescript

https://github.com/MSakamaki/clean-code-typescript

# 2020/06/13

[不正な文脈を追加しない](https://github.com/MSakamaki/clean-code-typescript#%E4%B8%8D%E8%A6%81%E3%81%AA%E6%96%87%E8%84%88%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%97%E3%81%AA%E3%81%84)
- 上位のClass、methodで説明されていることを、変数名や、メソッド名に含めない
- 結構やりがち。UserクラスのgetUserとか

[関数の引数は二つ以下](https://github.com/MSakamaki/clean-code-typescript#%E9%96%A2%E6%95%B0%E3%81%AE%E5%BC%95%E6%95%B0-%E7%90%86%E6%83%B3%E3%81%AF%EF%BC%92%E3%81%A4%E4%BB%A5%E4%B8%8B)
- 関数が2つより多くなる場合は、optionsなどの形で、オブジェクトとして貰うようにする
- さらにType Aliasを使うとより良い

[Object.assign や 分割代入を使ってデフォルトオブジェクトを設定する](https://github.com/MSakamaki/clean-code-typescript#objectassign-%E3%82%84-%E5%88%86%E5%89%B2%E4%BB%A3%E5%85%A5%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B)
- 初期値を設定するならObject.assignがおすすめ
  - https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
```ts
const hoge = (options: { a: string?, b: number?, c: string? }) {
  // 初期値の設定
  // optionsにデフォルト値がはいる。
  // でも、nullが明示的に入っている場合は、初期値設定できないので注意
  return Object.assign({
    a: 'a',
    b: 1,
    c: 'c'
  }, options)
}

```

[関数の引数にフラグは渡さない](https://github.com/MSakamaki/clean-code-typescript#%E9%96%A2%E6%95%B0%E3%81%AE%E5%BC%95%E6%95%B0%E3%81%AB%E3%83%95%E3%83%A9%E3%82%B0%E3%81%AF%E6%B8%A1%E3%81%95%E3%81%AA%E3%81%84)
- 関数がフラグを受け取る場合は、その関数は別の処理を行うということ。そもそも関数を分割した方が良い。

ジェネレーター関数 `function*`で始まるやつ

[getterとsetterを使う](https://github.com/MSakamaki/clean-code-typescript#getter-%E3%81%A8-setter-%E3%82%92%E4%BD%BF%E3%81%86)
- オブジェクトをカプセル化したり、バリデーションする時は良さそう.
- 