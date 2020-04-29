# GraphQL 公式ドキュメント

https://graphql.org/learn/

<img width="1415" alt="スクリーンショット 2020-04-18 6 00 32" src="https://user-images.githubusercontent.com/11070996/79613676-f0207780-8139-11ea-8df4-a6533cbc9459.png">

# 2020/04/30

### Introspection



# 2020/04/26

### Validation

- Union タイプでいずれかが持つフィールドをクエリの戻り値として含める場合は、フラグメントで型の絞り込みをする必要がある。inline でなくても良いが、冗長になるので inline fragment が良い。

```graphql
{
  hero {
    name
    ... on Droid {
      primaryFunction
    }
  }
}
```

- https://github.com/graphql/graphql-js/tree/master/src/validation に詳しい validation rule がある

# Execution

- 各 type の field はリゾルバ関数と紐づいている。フィールドが呼び出されるとリゾルバが実行され、値が返却される。フィールドの戻り値が scalar 型の場合は、その値が返却されて、オブジェクト型の場合は、スカラー型に到達するまで、再起的に実行される。<=木構造だ

- リゾルバ関数は obj, args, context, info の 4 つの引数を受け取る。GraphQL Ruby の場合は、args 以外の情報は、root の controller で処理されているのかな？
  - obj・・前のオブジェクト？
  - args・・ クエリのフィールドの引数
  - context・・コンテキスト情報、ログイン情報などなど
  - info・・フィールド名とか、schema など固有の情報。詳細はhttps://graphql.org/graphql-js/type/#graphqlobjecttype

* Promise を返す非同期なリゾルバもある。その場合でも、GraphQL は実行が完了してからクエリ結果を返すので、呼び出し側が意識する必要はない。

* 多くの GraphQL ライブラリでは、フィールドにリゾルバが提供されていない場合は、戻り値のオブジェクトの同名のプロパティが読み取られる。
  - GraphQL Ruby の場合は ActiveRecord を返すと、モデルの各フィールドが返される。

- scalar Coercion と List resolvers はあまり理解していない。何を示唆しているのか分からなかった

# 2020/04/25

### Schemas and Types

- shcema は検証に使われる
- 全ての引数は名前を持つ。そして初期値を与えることができる。
- `type shema` が全てのルートそこから Query, Mutation の型を定義する

  ```graphql
  type schema {
    query: Query
    mutation: Mutation
  }
  ```

- デフォルトの Scalar 型（プリミティブみたいなもの）は`Int`, `Float`, `String`、`Boolean`, `ID` の 5 つ。
  - Graphql-Ruby は `ISO8610DateTime` とかあるので、あれは拡張していたのか
- Enumg 型もある。これは便利なので使っていきたい

  ```graphql
  Enum Episode {
    NEWHOPE
    EMPIRE
    JEDI
  }
  ```

- `!` が non-null の意味。引数でも、戻り値でも同じ
- リストの non-null は値が null 許可するか、リスト自体の null を許可するかでパターンがある

  ```graphql
  [String] // 配列自体も要素もnull可能
  [String!] // 配列自体はnull可能だけど、要素がある場合はそこはnull不可
  [String]! // 配列自体はnull不可、要素はnull可
  [String!]! // 配列自体も要素もnull不可
  ```

- interface もある。interface を定義すると、implements で型に制約を与えることもできる。

  ```graphql
  interface Character {
    id: ID!
  }

  type Human implements Character {
    id: ID!
    name: String!
  }

  type Cat implements Character {
    id: ID!
    roar: String!
  }
  ```

- Union types も定義できる。implements インターフェイスにある項目のみ inline fragments の外に書くとか簡潔な書き方ができる。
- Input type もある。引数でオブジェクトを使って整理したい時に使える。

```graphql
input ReviewInput {
  stars: Int!
  commentary: String
}
```

# 2020/04/18

### Introduction to GraphQL

- チュートリアル　https://www.howtographql.com/
- 無料で学べるオンラインコース https://www.howtographql.com/
- GraphQL はリクエストを受け取ると、まず型と field を検証する。通過すればそれぞれのフィールドの関数を実行する

### Queries and Mutations

- GraphQL のリクエストでは、Root の要素以外に、ネストされたオブジェクトや、Field にも引数を指定することができる。

```graphql
{
  human(id: "1000") {
    name
    height(unit: FOOT)
  }
}
```

- エイリアスを使って同じクエリを一度に異なる引数で呼び出すこともできる

```graphql
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}
```

- fragments を使って query の情報を共通化できる。fragments の中に引数を設定することも可能

```graphql
query HeroComparison($first: Int = 3) {
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  friendsConnection(first: $first) {
    totalCount
    edges {
      node {
        name
      }
    }
  }
}
```

- Query の変数にはデフォルト引数を設定することもできる。引数の型名サフィックスで`!`キーワードをつけると必須の引数になる。

```
query HeroNameAndFriends($episode: Episode = JEDI) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

- クエリ内に条件分岐を加えることもできる

`@include(if: Boolean)` if が true の場合は含める
`@skip(if: Boolean)` if が true の場合はスキップする

```graphql
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}
```

- Mutations はクエリのように複数の変更を一つのリクエストに含めることができる。その場合は上から順次実行されるのでコンフリクトを心配する必要はない。

### Schemas and Types

- Scalar 型と Object 型, Array 型がある。Scalar 型は String や Int、Boolean などのプリミティブな値が入る。

```graphql
type Character {
  name: string  # Scalar型 nullable
  appearsIn: [Episode!]! # Array 型 non-nullable
  parents: { # Object型
    name: string! # scalar型 non-nullable
  }
}
```

- 全て引数には名前が必要。 `=` で初期値を代入することができる。
- schema には 2 つの特別な型、`Query`, `Mutation`がある

```graphql
schema {
  query: Query
  mutation: Mutation
}
```

- ID 型は一意な識別しを持つ。人間が識別できることを想定していない UUID などが入る。
- カスタムな Scalar 型を定義することができる。たとえば`Date`など。
