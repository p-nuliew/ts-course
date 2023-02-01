// 读懂联合类型和交叉类型的含义

// 联合类型：不是单一原子类型，可能是多种不同类型的组合。
// 组合成员公有的属性和方法可以直接使用，想要访问个别成员特有的属性或方法，需要使用类型守卫。
// 定义一个函数，可以接收string类型，也可以接收number类型。
function formatPX(size: unknown) {
  if (typeof size === 'number') {
    return `${size}px`
  }
  if (typeof size === 'string') {
    return `${parseInt(size) || 0}px`
  }
  throw Error('仅支持 number 或者 string')
}
formatPX(13)
formatPX('13px')
// 如果没有联合类型，我们可能会使用unknown/any来表示。（unknown比any更安全）

// 这种方式带来的问题是，我们可以给formatPX传递任何值，并通过静态类型检测，但是在运行时还是会抛出一个错误，例如：
formatPX(true)
formatPX(null)

// 使用联合类型，更明确表达size的类型。同时解决了运行时会报错的问题
{
  function formatPX2(size: string | number) {
    if (typeof size === 'number') {
      return `${size}px`
    }
    if (typeof size === 'string') {
      return `${parseInt(size) || 0}px`
    }
    throw Error('仅支持 number 或者 string')
  }
  formatPX2(13)
  formatPX2('13px')
  formatPX2(true) // ts(2345) 类型“boolean”的参数不能赋给类型“string | number”的参数。
  formatPX2(null) // ts(2345) 类型“null”的参数不能赋给类型“string | number”的参数
}

// 联合类型进一步联合
type ModernUnit = 'vh' | 'vw'
type Unit = 'px' | 'em'
type MessedUp = ModernUnit | Unit

// string原始类型 和 string字面量类型 组合，只会保留string原始类型
type A = 'e' | string | 'wp'  // 类型为 string

// 接口类型联合起来
interface Bird {
  fly(): void;
  layEggs(): void;
}
interface Fish {
  swim(): void;
  layEggs(): void;
}
const getPet: () => Bird | Fish = () => {
  return {

  } as Bird | Fish
}
const Pet = getPet()
Pet.layEggs() // ok。因为Bird和Fish都有layEggs方法
Pet.fly() // ts(2339) 类型“Bird | Fish”上不存在属性“fly”。类型“Fish”上不存在属性“fly”

// 从代码中可看到，我们可以访问各个成员都拥有的属性、方法。但是如果要使用个别成员的特有属性，则需要引入类型守卫来区分不同的成员类型。

// 访问个别成员的特有属性，需使用in操作符判断的类型守卫。
// 因为Pet的类型可能是Bird也可能是Fish。
if ('fly' in Pet) {
  Pet.fly()
}



// 交叉类型：可以把多个类型合并成一个类型，合并后的类型拥有所有成员类型的特性。
// 把原子类型合并成交叉类型并没有什么意思。因为任何类型不都能满足同时属于多种原子类型。

// 合并接口类型
// 联合类型的真正用武之地是将多个接口类型合并成一个类型
type IntersectionType = { id: number; name: string; } & { age: number };
const mixed: IntersectionType = {
  id: 1,
  name: 'name',
  age: 18
}

// 如果合并的多个接口类型存在同名属性，分为两种情况：
// 1.如果同名属性的类型不兼容，这就意味着这是个无用的联合类型
{
  type IntersectionType = { id: number; name: string } & { name: number }
  // name 属性的类型一个是string，另一个是number,交叉类型即为never。
  // never 表示永远不会发生值的类型。所以我们赋予mixed任意类型的name属性值都会提示类型错误,如果不设置name属性又会提示缺少必选的name属性。
  const mixed: IntersectionType = { id: 1, name: 3,  }
}
// 2.如果同名属性的类型兼容，比如一个是number，另一个是number的子类型（数字字面量类型），合并后name的类型就是两者中的子类型。
{
  type IntersectionType = { id: number; age: number } & { age: 2 }
  const mixed: IntersectionType = { id: 1, age: 2,  }
  const mixed2: IntersectionType = { id: 1, age: 22,  } // ts2332。不能将类型“22”分配给类型“2”。
}


// 合并联合类型(交集)：提取所有联合类型的相同类型成员。
type UnionA = 'px' | 'em' | 'rem' | '%'
type UnionB = 'vh' | 'em' | 'rem' | 'pt'
type IntersectionUnion = UnionA & UnionB;
const intersectionA:IntersectionUnion = 'em'
const intersectionB:IntersectionUnion = 'rem'
const intersectionC:IntersectionUnion = 'px'  // ts(2322) 不能将类型“"px"”分配给类型“"em" | "rem"”。
const intersectionD:IntersectionUnion = 'pt'  // ts(2322)




// 类型缩减
// 对于string、number、boolean、枚举这些类型，如果将“原始类型和原始字面量类型”组合成联合类型，那就会类型缩减
type URStr = 'string' | string  // 类型是string
type URNum = 2 | number // 类型是number
type URBoolean = true | boolean // 类型是 boolean
enum EnumUR {
  ONE,
  TWO
}
type URE = EnumUR.ONE | EnumUR  // 类型是 EnumUR
// 缩减规则：ts会把字面量类型、枚举成员类型缩减掉，只保留原始类型、枚举类型等父类型。

// 类型缩减大大削弱了IDE的自动提示能力
{
  type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string; // 类型缩减成 string
  const color: BorderColor = 'green'  // 赋值时，无法提示有哪些字面量
}
// 上述代码中，black、red这些字符串字面量都无法自动提示出来
// 但是，ts提供了黑魔法 ’& {}‘，它可以让类型缩减被控制
{
  type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string & {}; // 类型缩减成 string
  const color: BorderColor = 'black'  // 自动提示
}

// 如何定义如下所示 age 属性是数字类型，而其他不确定的属性是字符串类型的数据结构的对象
{
  age: 1, // 数字类型
  anyProperty: 'str', // 其他不确定的属性都是字符串类型
  ...
}

// 之前提到过，一个接口不能满足这种要求，那在这里提到肯定是要用到两个接口的联合类型和类型缩减
// 这个问题的核心在于找到既是number的子类型，这样age类型缩减之后的类型就是number;又要满足又是string的子类型，这样才能满足属性和string索引类型的约束关系。
// 没错，就是never。never是所有类型的子类型。
type UnionInterface = {
  age: number
} | {
  age: never;
  [prop: string]: string
}
// never 是任何类型的子类型，所以类型UnionInterface的age属性会缩减为number类型。
const abc: UnionInterface = {
  age: 1,
  anyProp: 'str',
}