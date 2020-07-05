# プログラマの数学

<img width="300" src="https://user-images.githubusercontent.com/11070996/86541880-9024ba80-bf4b-11ea-84bf-42a2d219e441.png">

# 第 2 章論理

## 論理和 A または B

| A     | B     | A ∨ B |
| ----- | ----- | ----- |
| true  | true  | true  |
| true  | false | true  |
| false | true  | true  |
| false | false | false |

## 論理積 A かつ B

| A     | B     | A ∧ B |
| ----- | ----- | ----- |
| true  | true  | true  |
| true  | false | false  |
| false | true  | false  |
| false | false | false |

## 排他的論理和 A または B （両方は満たさない）

| A     | B     | A + B |
| ----- | ----- | ----- |
| true  | true  | false |
| true  | false | true  |
| false | true  | true  |
| false | false | false |

## 等値 A と B は等しい

| A     | B     | A = B |
| ----- | ----- | ----- |
| true  | true  | true  |
| true  | false | false |
| false | true  | false |
| false | false | true  |

## 含意 A ならば B

あまり一般的ではなかった。特に A が false の場合。  
A が false の場合は B はなんでも良いという意味の「ならば」が該当する

| A     | B     | A ⇒ B |
| ----- | ----- | ----- |
| true  | true  | true  |
| true  | false | false |
| false | true  | true  |
| false | false | true  |
