// 定义函数
{
  function add() {}
  const add2 = () => {}
}

// 指定函数参数和返回值类型
{
  const add = (a: number, b: number): number => {
    return a + b
  }
}
// 定义一个函数类型，并使用箭头函数实现了这个类型
{
  type Adder = (a: number, b: number) => number
  const add: Adder = (a, b) => a + b
}

// 可选参数和默认参数
{
  function log(x?: string) {
    return x
  }

  log()
  log('hello world')
}
{
  function log2(x: string = 'hello world') {
    return x
  }
  log2(1) // ts(2345)
  log2()
}
// 剩余参数
{
  function sum(...nums: number[]) {
    return nums.reduce((a, b) => a + b, 0)
  }
  sum(1, 2, 3)
  sum(1, '2') // ts(2345)
}
{
  // 联合类型
  function sum2(...nums: (number | string)[]) {
    return nums.reduce<number>((a, b) => a + Number(b), 0)
  }
  sum2(1, '2')
}

// this
// 在ts中，如果想要声明this类型，需要在函数的第一个参数中声明this指代的对象
{
  function say() {
    console.log(this.name); // ts(2836) this没有声明类型注解
  }

  // 声明this指代的对象
  function say2(this: Window, name: string) {
    console.log(this.name);
  }
  window.say = say
  window.say('hi')
}
// 定义对象的函数属性时，实际调用中的this指向与指定的this指向不同，ts就会发现this指向的错误
{
  interface Person {
    name: string;
    say(this: Person): void;
    getAge: (age: number) => number;
  }
  const person: Person = {
    name: 'captain',
    say() {
      console.log(this.name);
    }
  }
  const fn = person.say
  fn()  // ts(2684) 类型为“void”的 "this" 上下文不能分配给类型为“Person”的方法的 "this"。
}

// 函数重载：可以更精准地描述参数与返回值类型约束关系的函数类型
{
  function convert(x: string): number;
  function convert(x: number): string;
  function convert(x: null): -1;
  function convert(x: string | number | null): any {
      if (typeof x === 'string') {
          return Number(x);
      }
      if (typeof x === 'number') {
          return String(x);
      }
      return -1;
  }
  // convert被调用时，ts会从上到下查找函数重载列表中与入参类型匹配的类型
  const x1 = convert('1'); // => number
  const x2 = convert(1); // => string
  const x3 = convert(null); // -1
}