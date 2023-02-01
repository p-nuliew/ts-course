{
  class Dog {
    name: string;
    constructor(name: string) {
      this.name = name
    }

    bark() {
      console.log('woof! woof!');
    }
  }
  const dog = new Dog('qwe')
  console.log(dog.bark());
}


// 类继承： extends
{
  class Animal {
    type = 'Animal';
    say(name: string) {
      console.log(`I am ${name}`);
    }
  }
  class Dog extends Animal {
    bark() {
      console.log('woof woof');
    }
  }

  // 派生类Dog 继承 基类Animal，所以支持type、say等属性和方法。通常派生类被称为子类，基类被称为父类
  const dog = new Dog()
  dog.bark()  // woof woof
  dog.say('qwe') // I an qwe
  dog.type  // Animal
}
{
  // 如果在派生类中包含一个构造函数，则必须在构造函数中调用super()方法
  // super() 的作用就是调用基类的构造函数
  class Animal {
    name: string;
    type = 'Animal';
    constructor(name: string) {
      this.name = name;
    }
    say(name: string) {
      console.log(`I am ${name}`);
    }
  }

  class Cat extends Animal {
    constructor() {
      // super() // ts(2554) 未提供 "name" 的自变量
      super('persian')
    }
    age() {
      console.log('i am 18');
    }
  }
  const cat = new Cat()
  cat.age()
  cat.say('hi')
}


// 修饰符
// public private protected
//  public 表示在任何地方可见、是公有的
//  private 只有在类的内部可见
//  protected 仅在类内部及子类内部中可见
class Father {
  public firstName: string;
  private lastName: string = 'Stark';

  constructor(firstName: string) {
    this.firstName = firstName
    this.lastName;
  }
}
const father = new Father('Tony')
father.firstName  // 公有属性可以在任意地方调用
father.lastName // ts(2341)属性“lastName”为私有属性，只能在类“Father”中访问

class Son {
  public firstName: string;
  protected lastName: string = 'Stark';
  constructor(firstName: string) {
    this.firstName = firstName;
    this.lastName; // ok
  }
}

 class GrandSon extends Son {
    constructor(firstName: string) {
      super(firstName);
    }

    public getMyLastName() {
      return this.lastName;
    }
 }

 const grandSon = new GrandSon('Tony');
 console.log(grandSon.getMyLastName()); // => "Stark"
 grandSon.lastName; // 属性“lastName”受保护，只能在类“Son”及其子类中访问