# GraphQL 公式ドキュメント

https://graphql.org/learn/

<img width="1415" alt="スクリーンショット 2020-04-18 6 00 32" src="https://user-images.githubusercontent.com/11070996/79613676-f0207780-8139-11ea-8df4-a6533cbc9459.png">

# 2020/04/18

### Introduction to GraphQL

- チュートリアル　https://www.howtographql.com/ 
- 無料で学べるオンラインコース https://www.howtographql.com/ 
- GraphQLはリクエストを受け取ると、まず型とfieldを検証する。通過すればそれぞれのフィールドの関数を実行する

### Queries and Mutations

- GraphQLのリクエストでは、Rootの要素以外に、ネストされたオブジェクトや、Fieldにも引数を指定することができる。

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
  
  - fragmentsを使ってqueryの情報を共通化できる。fragmentsの中に引数を設定することも可能
  
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

- Queryの変数にはデフォルト引数を設定することもできる。引数の型名サフィックスで`!`キーワードをつけると必須の引数になる。

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

`@include(if: Boolean)` ifがtrueの場合は含める
`@skip(if: Boolean)` ifがtrueの場合はスキップする

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

- Mutationsはクエリのように複数の変更を一つのリクエストに含めることができる。その場合は上から順次実行されるのでコンフリクトを心配する必要はない。


### Schemas and Types

- Scalar型とObject型がある。Scalar型
