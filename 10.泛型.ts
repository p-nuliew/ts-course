// 泛型：更广泛的类型约束，将类型参数化
{
  function reflect(param: unknown) {
    return param
  }

  reflect(1)
  reflect('str')
}
// 对于reflect函数，我们希望传入什么类型的参数，就返回对应类型的值。这时候泛型就派上了用场

{
  function reflect2<P>(param: P) {
    return param
  }

  let num = reflect2<number>(1) // num 类型为number
  let str = reflect2<string>('str') // str 类型为string

  // 调用泛型函数时如果受泛型约束的参数有值时，可以无需指定入参类型，参数会自动推断出来，即如下
  let num2 = reflect2(1) // num2 类型为number
  let str2 = reflect2('str') // str2 类型为string
}


// 泛型约束：将泛型入参限定在一个相对更明确的集合内
// 如：限定泛型入参只能为string|number|boolean
{
  function reflectSpecified<P extends string | number | boolean>(param: P): P {
    return param
  }

  reflectSpecified(1) // ok
  reflectSpecified('str') // ok
  reflectSpecified(true)  // ok
  reflectSpecified([])  // ts(2345) 类型“never[]”的参数不能赋给类型“string | number | boolean”的参数。
}


// 如何描述数组的map方法类型
[1, 2, 3].map(x => x);
['a', 'b', 'c'].map(x => {});

// 不同的数组调用map,map方法都能够自动推导出item的类型，那map必然是使用了泛型进行了更宽松的约束
interface Array<T> {
  map<U>(callbackfn: (item: T, index: number, array: T[]) => U): U[]
}
// map回调函数callback的第一个参数是数组的每一项，正好就是定义数组时传入的泛型变量T，然后callback会返回一个新数组，因为我们需要重新定义一个变量U

{
  const arr1: Array<number> = [1, 2, 3].map(x => x)
  const arr2: Array<string> = ['a', 'b', 'c'].map(x => x)

  interface Person {
    name: string;
    age: number
  }
  const arr3: Array<Person> = [{ name: 'tom', age: 20 }, { name: 'alex', age: 10 }]
}


// 基础用法
// 函数中使用泛型
// 声明一个泛型变量
function fn1<T>() {}

// 在参数中使用泛型变量
function fn2<T>(arg: T) {}

// 在返回值中使用泛型变量
function fn3<T>(arg: T):T { return arg }

// 变量函数声明的写法
let myFn: (<T>(arg: T) => T) = fn3  // 括号可省略，这里是为了更直观

// 接口中使用泛型
// 使用接口约束一部分数据类型，使用泛型变量让剩余部分更灵活
interface Parser<T> {
  success: boolean,
  code: number,
  data: T,
  msg: string,
}
// 接口泛型与函数泛型相结合
interface Array<T> {
  // map<U>(): U[],
  map<U>(callback: (item: T, index: number, array: T[]) => U): U[],
}
const arr5: Array<number> = [1,2,3].map(x => x)

// 描述数据返回结果
interface Result<T> {
  success: boolean,
  code: number,
  data: T,
  msg: string,
}

// 结合Promise使用，Promise本身接收一个泛型变量
// 返回数据为number时
function fetchData(): Promise<Result<number>> {
  return http.get('api/number')
}

// 返回数据为数组时
interface Item {
  age: number,
  name: string
}
function fetchData2(): Promise<Result<Item[]>> {
  return http.get('api/array')
}

// 返回数据为分页对象时
interface Page<T> {
  current: number,
  pageSize: number,
  total: number,
  data: T[]
}
function fetchData3(): Promise<Result<Page<Item[]>>> {
  return http.get('api/page/array')
}