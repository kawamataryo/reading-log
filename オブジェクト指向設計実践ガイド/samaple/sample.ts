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
