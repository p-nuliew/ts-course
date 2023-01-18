// 数组
let arrayOfNumber: number[] = [1, 2, 3];  // []定义
let arrayOfNumber2: Array<number> = [4, 5, 6];  // 泛型定义
// 更推荐[]这种方式，可以避免与JSX语法冲突

// 元祖：可以限制数组的个数和类型
// 好比 react hooks 里的 useState。const [count, setCount] = useState;
// 在js数组里，我们无法区分 [count, setCount]的类型。对于不同类型的值更倾向通过键值对的形式塞到一个对象中，再返回这个对象。
// 而元祖正好满足了这点：保证元素类型，长度不可变更。

// useState的返回值类型是个元祖类型
// (state: State) => [State, SetState];


// 特殊类型
// any: 任意类型，会绕过静态类型检测

// unknown: 描述类型并不确定的变量，比如在多个 if else 的场景
let result: unknown

const x = 12
const y = false
if (x === 12) {
  result = x
} else if (y) {
  result = y
}

// unknown 比 any 更安全，unknown 只能赋值给 unknown 或 any
// let num: number = result;  // 提示 ts(2322)
// let abc: any = result;

// 想要做操 unknown 类型，必须缩小类型，否则对 unknown 的任何操作都会报错
// result.toFixed()  提示 ts(2574)
// 缩小类型(所有的类型缩小手段对 unknown 都有效)
if (typeof result === 'number') {
  result.toFixed()
}

// void、undefined、null 三个废柴类型
// void: 仅适用于表示没有返回值的函数
// function voidFn(): void {}
// undefined:
// null: 价值主要体现在接口定制上，可表明对象或属性是空值，尤其是前后端交互的接口

// never: 表示永远不会发生值的类型
// 适用以下场景
// 1. 没有返回值的函数
function ThrowError(msg: string): never {
  throw new Error(msg)
}
// 2. never 是所有类型的子类型
// 3. 在恒为 false 的类型守卫条件判断下，变量的类型将缩小为 never
// const str: string = 'string'
// if (typeof str === 'number') {
//   str.toLowerCase() // 类型“never”上不存在属性“toLowerCase”。ts(2339)
// }
// 4. never 可以用来实现禁止写接口下特定的属性
const props: {
  id: number,
  name?: never
} = {
  id: 1
}
// props.name = 1  // ts(2322)  无论给 name 赋什么类型的值，都是提示类型错误，实际效果等同于只读

// object: 表示非原始类型的类型。也是个没什么用的类型
declare function create(o: object | null): any
create({})
create(() => null)
// create(2) // ts(2345)
// create('1') // ts(2345)


// 类型断言
const arrayNumber: number[] = [1, 2, 3, 4];
// const greaterThan2: number = arrayNumber.find(num => num > 2); // 提示 ts(2322)
// 其中 greaterThan2 一定是个数字，但静态类型对运行时的逻辑无能为力，提示我们不能把类型 undefined 分配给类型 number。
// 但是我们可以使用一种笃定的方式————类型断言，告诉ts按照我们的方式做类型检测

// 比如使用 as 语法做类型断言
const greaterThan2: number = arrayNumber.find(num => num > 2) as number;
// 又或者使用尖括号 + 类型的格式做类型断言
const greaterThan3: number = <number>arrayNumber.find(num => num > 3)


// 非空断言 !: 应当视为和 any 一样危险
let mayNullOrUndefinedOrString: null | undefined | string;

mayNullOrUndefinedOrString!.toString(); // ok
// mayNullOrUndefinedOrString.toString(); // ts(2531)

// 建议使用类型守卫代替非空断言
if (mayNullOrUndefinedOrString === 'string') {
  mayNullOrUndefinedOrString.toString()
}




