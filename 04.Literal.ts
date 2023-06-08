{
  let str: string = 'this is string'
}
// 在很多情况下，TypeScript 会根据上下文环境自动推断出变量的类型，无须我们再写明类型注解
{
  let str = 'this is string'
}
// 我们把 ts 这种基于赋值表达式推断类型的能力称之为“类型推断”



// 类型推断
// 在 ts 中，类型标注声明是在变量之后（即类型后置），它不想java语言一样，先声明变量的类型，再声明变量的名称。
// 使用类型标注后置的好处是编译器可以通过代码所在的上下文推导其对应的类型，无需再声明变量类型
{
  let x1 = 20;  // 推断出 x1 的类型为 number
  let x2: number = x1;  // ok
}

// 在 ts 中，具有初始化值的变量、有默认值的函数参数、函数返回的类型都可以根据上下文推断出来。

// 有默认值的函数参数
// 推断出参数 b 的类型是 number 或者 undefined，返回值的类型也是 number
{
  function add1(a: number, b = 1) {
    return a + b
  }
  const x1 = add1(1)
  const x2 = add1(1, '1') // ts(2345) 类型“string”的参数不能赋给类型“number”的参数
}

// 函数返回的类型
// 根据参数的类型，推断出返回值的类型也是 number
{
  function add2(a: number, b: number) {
    return a + b
  }
  const x3 = add2(1, 2)
}



// 上下文推断
{
  let str = 'this is string'; // str: string
  let num = 1; // num: number
  let bool = true; // bool: boolean
}
{
  const str = 'this is string'; // str: 'this is string'
  const num = 1; // num: 1
  const bool = true; // bool: true
}
// 通过 let 和 const 定于的赋予了相同值的变量，其推断出来的类型不一样。



// 字面量类型
// 在 ts 中，字面量不仅可以表示值，还可以表示类型，即所谓的字面量类型
// 目前，ts 支持 3种字面量类型：字符串字面量类型、数字字面量类型、布尔字面量类型。
// 这3种字面量类型分别拥有与其值一样的字面量类型。
{
  let literalStr: 'this is string' = 'this is string'
  let literalNum: 1 = 1
  let literalBoolean: true = true
}

// 字符串字面量类型
{
  let literalStr2: 'this is string' = 'this is string'
  literalStr2 = 'str2'  // ts(2322) 不能将类型“"str2"”分配给类型“"this is string"”。
}
// 实际上，定义单个字面量类型并没有太大的用处，他真正的应用场景是可以多个字面量类型合成一个联合类型，用来描述拥有明确成员的实用的集合
type Color = 'green' | 'red'
function bg(color: Color) {}
bg('green') // ok
bg('blue')  // ts(2345) 类型“"blue"”的参数不能赋给类型“Color”的参数
// 相较于使用string，使用字面量类型（组合的联合类型）可以将函数的参数限定为更具体的类型。这不仅提升了程序的可读性，还保证了函数参数类型。

// 数字字面量类型和布尔字面量类型
// 数字字面量类型和布尔字面量类型的使用与字符串字面量类型类似
{
  interface P {
    size: 'small' | 'middle',
    boolean: true | false,
    num: 1 | 2 | 5
  }
}

// 字面量类型的拓宽: literal widening
{
  let x = undefined;  // any
  var yy = undefined; // any
  const yyy = undefined // undefined
}

// 为什么通过 let 和 const 定于的赋予了相同值的变量，其推断出来的类型不一样
{
  const str = 'this is string'; // str: 'this is string'
  let str2 = 'this is string'; // str: string
}
// 这是因为
// 在缺省类型注解的情况下，const 定义为不可变更的常量，这是一种比较合理的设计，
// 而 let 缺省显式注解的可变更的变量的类型转换为了赋值字面量类型的父类型，这种设计成为“literal widening”，即字面量类型的拓宽

// 类型缩小 Type Narrowing
// 通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小的集合
{
  type Goods = 'pen' | 'pencil' | 'ruler'
  const getPenCost = (item: 'pen') => 2
  const getCost = (item: Goods) => {
    if (item ==='pen') {
      getPenCost(item)
    } else {
      console.log(item);  // 'pencil' | 'ruler' 编译器可以推断出收敛后的类型
    }
  }
}