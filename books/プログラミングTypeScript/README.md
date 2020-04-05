# O'Reilly プログラミング TypeScript

![image](https://user-images.githubusercontent.com/11070996/78132483-ca1b8780-7457-11ea-8bd1-21a67af11d9d.png)

# 2020/04/06
P261〜280

### tscのトランスパイルについて
tscのトランスパイルはtargetで指定したesのバージョンに変換するもの。
そのランタイムにない機能については提供しないので注意!! Polyfillが別途必要になる。
（polyfillと、トランスパイルの違いについてあまり理解してない..調べよう。）

### importHelpers
`...`スプレッド構文などを、トランスパイルするときに一つのファイルごとに`__asigin` のヘルパー関数が定義される。100ファイルあると、100回定義されるので、無駄。importHelpersを有効化すると、tslibというライブラリからヘルパー関数をimportする形式に変わりファイルサイズの肥大化を防げる。
tslibは別途importが必要

# 2020/04/05
P242〜260

### アンビエント宣言
`declare module`で型がないモジュールに対しても型を宣言をすることができる。 型がないものについては無理やりdeclareを使う。

```typescript
// foo-libはanyとして推論される
declare module 'foo-lib' {}

// bar-libはbarLib.aはstringとして推論される
declare module 'bar-lib' {
  type defaultType = {
    a: string
  }
  export default defaultType
}

```

# 2020/04/04
P225〜241

### 名前空間とモジュール
- CommonJS方式は、Node.jsで使われているexport, requireの方式。この方式では静的な解析が難しい。（requireに文字列、変数を入れられたりする）標準ではES6のimport、export方式を使う。
- `import * as hoge from hogehoge` も、esModuleInteropをtrueにすれば`import hoge from hogehoge`でかける
- namespace機能もある。ただ、namespaceよりはモジュールを使うべき。namespaceの宣言はマージされるので、moduleの方が依存を管理しやすい。

# 2020/04/02
P196〜224

### workerでの型定義
worker自体あまり理解しておらずむずかった。読み直しが必要
<メモ>
プロセスと、スレッドの違い。プロセスはリソースを共有できない。スレッドは出来る。プロセスで変数を共有したい時はフォークでコピーを作る。
プロセスから処理の単位としてスレッドが作られる

### tsconfig.jsonのlib
libはどの組み込みのtype.d.tsを型情報に含めるかの設定。型だけで実態はない。
たとえば、node.jsの実行環境で、DOMをlibに含めて、コード内で読んでも、コンパイルは通るが実行時にはエラーになる。

# 2020/03/31
P170〜195

非同期処理のところ。

# 非同期処理
この動画で完全に理解した
[VimeoPhilip Roberts: Help, I'm stuck in an event-loop.](https://vimeo.com/96425312)

##  用語
### コールスタック
メインの関数呼び出し。後入れ先出しで実行される。

### イベントループ
コールスタックが空になったらイベントキューから処理を一つ呼び出す機構

### キュー
非同期処理のコールバック関数が格納されているもの。

## 非同期処理の流れ
1. コールスタックでmain()が呼ばれる
2. 非同期処理をスタート（setTimeout()とか）
3. web apiに処理がうつる
4. 次のコールスタックの処理へ
5. web apiで処理が完了
6. web apiからcallbackがキューに移動
7. main処理がおわりコールスタックが空に
8. イベントループがスタックの状況を確認し、キューから一つコールスタックに移動する
9. コールスタックの処理がスタート

疑問。エラー時の対応は？イベントキューの流れは合ってる？

# 2020/03/29
P155〜170

特にメモはなし。


# 2020/03/28
P144〜155

### コンパニオンオブジェクトパターン
型とオブジェクトをペアにしてエクスポートするパターン。型と関数名は名前空間が異なるので、別々に扱うことができる。importするときは一つの名前で良い。

### ユーザー型定義ガード
tyopeofの型の絞り込みはスコープ内でのみ有効。別のスコープからは聞かない。それに対応するため、`a is string` のようなユーザー定義型ガードを行う。booleanを返すメソッドの時に有効かも。

```typescript
// trueだった場合は、aはstringとして扱われる。
function isString(a: unknown): a is string {
  return typeof a === 'string'
}

const f = () => {
  input: string | number = getStringOrNumber()
  if( isString(input) ){
     // ここではinputはstringとして見られる
  }
}
```

### 条件型（conditional type）

以下のように3項演算子の形式でジェネリクス型を絞り込める機能。
分配法則が利く（ここら辺よくわかってない）

```typescript
type IsString<T> = T extends string ? true : false
```


### infer キーワード
正直あまりわかってない。conditional typeで型をキャプチャする機能

[公式ドキュメントを読んでもinferが理解できない人のためのinferの説明 - Qiita](https://qiita.com/ringtail003/items/733aff32ddad7d4fda90)
[TypeScript 2.8 · TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)

2020/03/29 追記 なんとなくわかってきた!!!

```typescript
type ReturnType<T> = T extends (...arg: any[]) => infer R ? R : never
type ArgType<T> = T extends (...arg: infer R) => any ? R : never

type Sum = {
  (n1: number, n2: number): number
}

type SumReturn = ReturnType<Sum> // numberになっているはず

let a: SumReturn
a = 1; // numberなので通る
a = "1" // stringなのでエラー

type SumArg = ArgType<Sum> // [number, number] になっている

let b: SumArg
b = 1; // numberなのでerror
b = [1, 2] // [number, number] なので通る
b = [1, 2, 3] // [number, number, number]なので失敗
```

# 2020/03/27
P130〜144

### タグ付き合併型
オブジェクト型の合併型の絞り込みの際に、リテラル型を持つフィールドを作っておくことで絞り込みが可能になる。Reduxとかで使われてるらしい。。（わかってない）

### readonly、optionalの解除

マップ型を使うとreadonly、optionalの付与だけでなく解除もできる

```typescript
type readonlyAb= {
  readonly a: string
  readonly b: string
}

type aB = {
  -readonly [k in keyof readonlyAb]: readonly[k]
}

type nullable = {
  c?: string
  d?: string
}

type nonNulable = {
  [k in typeof nullable]-?: nullable[k]
}

```

# 2020/03/26
P117〜130

### サブタイプとスーパータイプ
サブタイプはスーパータイプを要求されるところに割り当てることができる。

`number`のところに`6`のリテラル型を割り当てるとか、`number[]`のところにタプルの`[number, number]`を割り当てるとか
`never`は全ての型のサブタイプ、`any`は全ての型のスーパータイプ。
だから、never型で定義するとどの引数にも入れられる。逆にanyを引数の型としておけば、全ての型を受け入れられる。

### 型の拡大
TypeScriptは型を拡大解釈する。constをつけるとリテラル型になる。

```ts
let a = 6 // aはnumber型
const b = 6 // bは6のリテラル型
```

`as const`を使うと、オブジェクト、配列も再起的に、リテラル型、ReadOnlyに直す。


# 2020/03/25
P105〜116

### ポリモーフィズム

Classもジェネリクスを受け取ることができる。コンストラクターやインスタンスメソッドで利用できる。スタティックメソッドで使う場合は少し注意が必要。ジェネリクスの型を読めないらしい？ほんまか？

### finalの実現
継承不可なクラスや、オーバーロード不可の関数を定義するfinal修飾司はない。大体として、コンストラクターにprivateをつけることで実現できる。ただそうすると、new()でインスタンス化ができなくるんで注意。
代案は以下

```ts
class Finalizeable {
  private construnctor() {}
  static create() {
    return new Finlizeable()
  }
}

const f = Finalizeable.create()
```

### デコレータ
デコレーターは実質ミックスインと同様。ただ、デコレーターで追加された関数、プロパティは、型検査で認識できないので注意。（型エラーが出る）まだ使えないだろう。

### ミックスイン
クラスに特定の関数やプロパティを注入するミックスインは、役割志向プログラミングで用いられる（has-a関係で構築する）。
組み込みのミックスインはTypeScriptにないが、独自に自作することができる。クラスを受け取り、プロパティとメソッドを追加したクラスを返す関数で。型安全に構築できる。

# 2020/03/23
P87〜105

### 抽象クラスと抽象メソッド
`abstract class home`で宣言することで、抽象クラスを宣言できる。抽象クラスはそれ自体をnew()できないという制約を持つ。`abstract hoge()`で抽象メソッドを作ることもできる。抽象メソッドは、そのクラスをextendしたサブクラスが必ずオーバーロードしなくてはならない関数である。

### 戻り値の型としてのthis
戻り値として自分自身のコピーを返すメソッドの場合は、戻り値として、自分の型ではなくて、`this`を使った方が良い。なぜならextendなどでそのラスのサブクラスをつくったときに、互換性が崩れるためである。明示的に自分の型を指定してしまうと、サブクラスでオーバーロードが必要になる

### インターフェイスとタイプの違い
* interfaceは宣言が自動的にマージされる（typeは同じネームスペースで二つ書くとerrorになる）
* interfaceは型の式が使えない`|`, `&`など
* interfaceはimplementsができる。なのでクラスのインターフェイスを作る場合は良いかも。

### インターフェイスと抽象クラスの継承の使い分け
複数のクラスで実装を共有する場合は、抽象クラスの継承が良い。クラスの共通宣言をする場合は、インターフェイスが良い。軽量なので。

### クラスは構造的に型付けされる
同じメンバと関数を持つ場合、たとえ別クラスとして宣言しても、型チェックの際には同様のクラスとして評価される。それはTypeScriptが構造的に型をチェックするため。



# 2020/03/21
P82〜85

### ジェネリクス型のTips
ジェネリクス型も初期値を持つことができる

```typescript
type Fun<T = number> = (arg: T): boolean
```

ジェネリクスもextendで型制約を加えることができる

```typescript
type Fun<T extends number> = (arg: T): boolean
```

### 型駆動開発
関数を書くときに、最初に型レベルで定義してから実装を書くようにする。
最初に引数と、戻り値の型を決めてしまう。

### オーバーロード
関数のオーバーロドを理解することで、引数の制限をより強固にすることができる。（一つ目の引数にこれを受けたら、二つ目の引数の型はこれとか）

```typescript
type Func = {
  (arg1: number, arg2: number): boolean
  (arg1: string, arg2: string): boolean
  (arg1: boolean, arg2: boolean): boolean
}

const fun: Func = (arg1, arg2) => {
  return arg1 === arg2
}

fun(1,2)
fun('s', 'b')
fun(true, false)
fun('s', 1) // Error
```

# 2020/03/19
P47〜66

### レストパラメーター
可変長の引数を受け取る関数の定義。
`...引数名` でできる。

```typescript
const hoge = (...arg) => {
  arg.forEach((i) => {
    console.log(i)
  })
}
```

### ジェネレーター関数
よく分かってない。無限な配列を生み出す何か？フィボナッチ数列とか作れる。next()で呼び出す

### 関数のオーバーロード
関数で複数の型定義を作れる。便利そうだけど今いちわかってない

```typescript
type Sample = {
  (s: 'a'): number
  (s: 'b'): string
  (s: 'c', n: number): { hoge: string }
}

const sample: Sample = (s: 'a' | 'b' | 'c', n?: number): number | string | { hoge: string} => {
  if(s === 'a') {
    return 1
  }
  if(s === 'b') {
    return 'b'
  }
  if(s === 'c') {
    return { hoge: 'c'}
  }
} // Error分からん
```

# 2020/03/18
P26〜46

### union型は両方のメンバーを含むものでもありえる（本当か？）
union型は`|`で型をつなぎ一見どちらかなのかなと思うが、実際には両方である場合もある？手元で試したら違う結果になるな、、あとで調べよう

```typescript
type Cat = {
  name: string
}

type Dog = {
  run: string
}

type DogOrCat = Cat | Dog

const dog: DogOrCat = {
  run: "fast"
}

const cat: DogOrCat = {
  name: "cat"
}

// ちゃんとErrorになる
const dogOrCat: DogOrCat = {
  name: "cat"
  run: "fast"
} 
```

### Enumは使わない
Enumは極力使わない方が良い。使うならconst Enumにする
Enumを使わない理由は以下アクセスが可能なため
Enumを引数の型にするとnumberを通してしまう。使うなら文字列Enumが良い。

```
enum Sample {
  aaa,
  bbb
}

const hoge =(arg: Sample): number => {
  return 1
}

hoge(Sample.aaa)
hoge(Sample.bbb)
hoge(43) // Errorが出ない.!!!!
```

# 2020/03/17 
P1〜26

### TypeScriptのコンパイラーの動き
1. TypeScriptのソースをAST（抽象構文木）に変換
2. ASTを型チェッカーによりチェック
3. TypeScript ASTをJavaScriptに変換
その後、それぞれの環境のJavaScriptのコンパイラー・ランタイムで処理される。

用語メモ
```
* コンパイラー 
	* コードをASTに変換し、さらにバイトコードに変換するもの
* ランタイム
	* バイトコードを評価するもの
* V8
	* JavaScriptエンジン（コンパイラーとランタイムを担うプログラム）
```

### Unknown型
anyと同様に全ての値を入れられるが、その値を使うためには必ずtypechckが必要になる型。明示的にtypeofやinstance ofを使った絞り込みが必要

```typescript
let a: unknown = 30
const b = a + 30 // Error

if (typeof a === 'number') {
const c =  a + 30 // number 60
}
```
