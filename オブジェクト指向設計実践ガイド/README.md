# オブジェクト指向設計実践ガイド

<img width="516" src="https://user-images.githubusercontent.com/11070996/80845860-7f06b700-8c45-11ea-839c-6e93756be36a.png" />


# 2020/05/02

### 依存関係の管理

・クラス同士の依存はなるべく作らないほうが良い。依存があると修正の影響範囲が広がる。

依存があるクラスの例。

```ts
class Car {
  engine: Engine
  constructor(private type: string) {
    this.engine = new Engine(type)
  }

  move() {
    this.engine.start()
    // なんらかの処理
  }
}


class Engine {
  constructor(public type: string){}

  start() {
    // 処理
  }
}

const car = new Car("Honda")
car.move()
```

依存を注入した場合（DI）
Engineクラスに依存するのではなく、startメソッドを持つEngineのinterfaceに依存する

```ts
class Car {
  constructor(private engine: Engine) {}

  move() {
    this.engine.start()
    // なんらかの処理
  }
}


class Engine {
  constructor(public type: string){}

  start() {
    // 処理
  }
}

// CarクラスにEngineを注入している
const engine = new Engine("Honda")
const car = new Car(engine)
car.move()
```

依存を逆転した場合。
間違った例。使う側の処理が変わっている。
使う側がEngineをnewすることでCarを動かしている。

```ts
class Car {
  constructor() {}

  move(engine: Engine) {
    engine.start()
    // なんらかの処理
  }
}


// EngineはCarクラスに依存している
class Engine {
  car: Car
  constructor(public type: string){
    this.car = new Car
  }

  start() {
    // 処理
  }

  carMove() {
    // 処理
    this.car.move(this)
  }
}

const engine = new Engine("Honda")
engine.carMove()
```

正しい依存関係逆転の例
CarクラスはEngineに直接依存せず、IStartableに依存している。
EngineクラスはIStartableに依存している。

```ts
class Car {
  constructor(private engine: IStartable) {}

  move() {
    this.engine.start();
    // なんらかの処理
  }
}

interface IStartable {
  start: () => void;
}

class Engine implements IStartable {
  constructor(public type: string) {}

  start() {
    // 処理
  }
}

const engine = new Engine("Honda")
const car = new Car(engine)
car.move()
```
