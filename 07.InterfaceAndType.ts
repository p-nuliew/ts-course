// Interface 接口
// 对对象的类型进行约束，只要两个对象的结构一致，属性和方法一致，则他们的类型就是一致的。

// 内联接口类型
function Student(person: { name: string, age: () => number }) {
  console.log(person.name, person.age());
}
Student({ name: 'Tom', age: () => 20 })
Student({ name: 2)  // ts(2322) 不能将类型“number”分配给类型“string”
Student({ name: 'Tom')  // ts(2345) 类型 "{ name: string; }" 中缺少属性 "age"
Student({ name: 'Tom', age: () => 20, id: 2 })  // ts(2345) “id”不在类型“{ name: string; age: () => number; }”中
let ts = { name: 'Tom', age: () => 20, id: 2 }
Student(ts) // 有意思的是，这种“将对象字面量赋值给一个变量，然后把变量传递给函数进行调用”不会报错，会包容地忽略任何多余的属性。我们将这种情况称之为对象字面量的 freshness
// 内联类型与解构语法混用
{
  /** 纯 JavaScript 解构语法 */
  const a = ({ name, age }) {
    console.log('name, age: ', name, age);
  }
  /** TypeScript 里解构与内联类型混用 */
  const b = ({ name, age }: { name: string, age: number }) {
    console.log('name, age: ', name, age);
  }
  /** 纯 JavaScript 解构语法，定义别名 */
  const c = ({ name: aliasName }) {
    console.log('aliasName: ', aliasName);
  }
  /** TypeScript */
  const d = (student: { name: string, age: number }) {
    console.log(name);  // 不能直接打印name
    console.log(student.name);
  }
}

// 内联接口类型是不可复用的，我们应该使用interface关键字来抽离可复用的接口

/ ** 学生类型 */
interface StudentType {
  /** 语言名称 */
  name: string;
  /** 使用年限 */
  age: () => number;
}
const getStudentInfo = (student: StudentType) => {
  return student.name + student.age
}
getStudentInfo({ name: 'tom', age: () => 20 })


// 可缺省属性
// 当属性标注为可缺省之后，它的类型就变成了显示类型与undefined类型组成的联合类型
{
  interface StudentType {
    /** 性别 */
    sex?: string; // string | undefined
  }

  interface StudentType2 {
    /** 性别 */
    sex: string | undefined; // string | undefined
  }

  // 思考StudentType 和 StudentType2是否等价？
  // 答案是不等价。缺省意味着可以不设置属性名，undefined意味着属性键名不可缺省
}


// 只读属性：在属性名前面添加 readonly 修饰符
{
  interface Student {
    readonly age: number;
  }
  let tom: Student = { age: 20 }
  tom.age = 30  // ts(2540) 无法分配到 "age" ，因为它是只读属性
}

// 接口定义函数类型
{
  // 接口定义函数类型：需要给接口定义一个调用签名
  // 签名格式：「参数列表: 返回值类型」，参数列表的参数都需要名字和类型
  interface MyFn {
    (num: number): number
  }
  let f: MyFn = (arg: number) => arg
}
// 接口中的函数类型
interface IncludeFn {
  // 两种写法效果一样
  add: (num: number) => number;
  // add(num: number): number
}
const o: IncludeFn = {
  add: (arg: number) => arg,
}
const r = o.add(1)

// 索引签名
// 格式：  “[索引名: 类型]”
{
  interface StringMap {
    [rank: number]: string; // 设置对象索引为number类型
  }

  const LanguageMap: StringMap = {
    1: 'ts',
    'WrongIndex': '22',  // ts(2322) 'WrongIndex'”不在类型“StringMap”中
  }
}
// 属性与索引签名混用
// 属性的类型必须是对应的数字索引或字符串索引的类型的子集
{
  interface StringMap {
    [props: string]: number;
    age: number;
    name: string; // ts(2411) 类型“string”的属性“name”不能赋给“string”索引类型“number”
  }
  // 因为StringMap接口属性name的类型string不是对应的字符串索引类型number的子集

  interface NumberMap {
    [props: number]: string;
    1: string;
    0: number;  // ts(2411) 类型“number”的属性“0”不能赋给“number”索引类型“string”。
  }
}
// 数字作为对象索引时，它的类型可以与数字兼容，也可以与字符串兼容
{
  interface AType {
    [name: string]: string
  }
  let a: AType = {
    name: 'a',
    1: '1'  // 不会报错
  }
}
// 定义一个属性是number类型，其他属性是string的对象数据结构
// TODO 不能使用单一的接口描述，在08讲中解密
{
  interface a {
    [age: number]: number,
    [props: string]: string
  }
}


// 继承与实现
// 继承：extends
{
  interface A {
    a: string
  }

  interface B extends A {
    b: string  // 定义新的属性
  }

  // 继承多个
  interface C extends A, B{
    c: string;
  }

  // 仅能使用兼容的类型覆盖继承的类型
  // ts(2430) 不能将类型“number”分配给类型“string”。
  interface WrongType extends A {
    a: number
  }
}


// 接口类型的一个作用是将内联类型抽离出来，从而实现复用。其实也可以使用类型别名接收抽离出来的内联类型实现复用
// Type 类型别名
{
  type LanguageType = {
    name: string;
  }
}

// 对于接口类型无法覆盖的场景，比如组合类型、交叉类型，我们可以使用类型别名来接收，如
{
  // 联合
  type MixedType = string | number;
  // 交叉
  type IntersectionType = { id: number, name: string } & { age: number, name: string }
  // 提取接口属性类型
  type AgeType = StudentType['age']
}

// 大多数清空下使用接口类型和类型别名的效果等价，但在某写特定场景下还是存在很大的区别
// interface 与 type 的区别
// 1.前面提到的，对于接口类型无法覆盖的场景，比如组合类型、交叉类型，我们可以使用类型别名来接收
// 2. 重复定义的接口类型，它的属性会叠加。这个特性是得我们可以及其方便地对全局变量、第三方库的类型进行扩展。而重复定义类型别名，则会提示一个ts错误
{
  interface Stu {
    age: number
  }
  interface Stu {
    name: string
  }

  let s: Stu = {
    age: 20,
    name: 'tom'
  }
}
// 先后定义的两个Stu接口属性被叠加在了一起。

// 不过，如果重复定义类型别名，则会提示ts（2300）
{
  // ts(2300) 标识符“Stu”重复。
  type Stu {
    age: number
  }
  // ts(2300) 标识符“Stu”重复。
  type Stu {
    name: string
  }

  let s: Stu = {
    age: 20,
    name: 'tom'
  }
}


enum EnumA { A = 'A' }
enum EnumB { A = 'A' }
type AliasNotCopy = EnumA;
const funA: (a: EnumA) => void = (a: AliasNotCopy) => void 0; // ok
const funB: (a: EnumA) => void = (a: EnumB) => void 0; // ts(2322) 错误
