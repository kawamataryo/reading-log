# timeline

2020/07/08 add関数まで作った
# 簡約
関数呼び出しの結果を順次書いたもの

# add関数

```js
const succ = (n) => {
  return n + 1
}
const prev = (n) => {
  return n - 1
}

const add = (x, y) => {
  if(y === 0) {
    return x
  }
  return add(succ(x), prev(y))
}
```

簡約
```
add(3, 2)
=> add(succ(3), prev(2))
=> add(4, 1)
=> add(succ(4), prev(1))
=> add(5, 0)
=> 5
```

# times関数

```js
const times = (count, fun, arg, memo) => {
  if(count > 1) {
    return times(count - 1, fun, arg, fun(memo, arg))
  } else {
    return fun(memo, arg)
  }
}

const multiply = (n, m) => {
  return times(m, add, n, 0)
}
```

簡約

```
multiply(2, 3)
=> times(3, add, 2, 0)
=> times(2, add, 2, add(0, 2))
=> times(2, add, 2, 2)
=> times(1, add, 2, add(2, 2))
=> times(1, add, 2, 4)
=> add(4, 2)
=>> 6
```