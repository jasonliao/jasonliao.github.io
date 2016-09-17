---
layout: post
category: es6, generators
title: Exploring ES6 - Generators 1st
date: 2016-09-17
summary: 《Exploring ES6》这本书关于 Generators 的译文系列
---

最近项目中写 Node CGI 的时候用到了 [koa](http://koajs.com/)，而使用 koa 的核心就是 generators 函数。通过 [Exploring ES6](http://exploringjs.com/) 这本书学习了一下 generators 的相关知识，顺便做一下翻译

下面的例子都在这个 GitHub 仓库里：[generator-examples](https://github.com/rauschma/generator-examples)

## Overview

Generators 是 ES6 新增的一种新特性函数，它可以随时暂停和恢复运行的机制在很多应用中都很有帮助，其中有两个很重要的点：

1. 实现迭代器
2. 阻止异步函数的调用

下面就来看看它们是怎么应用的

### Implementing iterables via generators

下面这个函数返回了一个由对象的 `[key, value]` 组成的迭代器

```javascript
// 函数名先有 `*` 代表这是一个 generator 函数
function *objectEntries(obj) {
  const propKey = Reflect.ownKeys(obj);
  
  for (const propKey of propKeys) {
    // `yield` 会返回一个值并暂停继续运行
    // 当再次运行的时候，会从上次停止的地方继续
    yield [propKey, obj[propKey];
  }
```
`objectEntries()` 这样使用

```javascript
const jane = { first: 'Jane', last: 'Doe' };
for (const [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`)
}
// Output:
// first: Jane
// last: Doe
```

究竟为什么 `objectEntries()` 是怎么工作的，它为什么可以被 `for...of` 遍历，后面的章节会说

### Blocking on asynchronous function calls

下面的代码中我使用了 [co](https://github.com/tj/co) 这个库来异步的获取两个 JSON 文件。值得注意的是，(A) 行通过 `yield` 会把整个赋值过程停住，直到 `Promise.all()` 里的东西都返回了。这就让异步操作看起来像同步的一样

```javascript
co(function* () {
  try {
    const [croftStr, bondStr] = yield Promise.all([  // (A)
      getFile('http://localhost:8000/croft.json'),
      getFile('http://localhost:8000/bond.json'),
    ]);
    const croftJson = JSON.parse(croftStr);
    const bondJson = JSON.parse(bondStr);

    console.log(croftJson);
    console.log(bondJson);
  } catch (e) {
    console.log('Failure to read: ' + e);
  }
});
```

`getFile(url)` 获取 `url` 指定的文件内容，内部实现后面会涉及到。我也会解释 `co` 是怎么工作的

## What are generators?

Generators 是一种可以暂停和恢复运行的函数。先看看第一个例子 `genFunc()`

```javascript
function *genFunc() {
  // (A)
  console.log('First');
  yield; // (B)
  console.log('Second'); // (C)
}
```

两样东西区分一个 generators 函数和普通的函数声明

- 声明使用的“关键字”为 `function *`
- 可以通过 (B) 行的 `yield` 来暂时运行

调用 `genFunc` 并不会执行函数体。但你会得到一个所谓的 generator 对象，你可以通过这个对象来控制函数体的执行

```javascript
const genObj = genFunc();
```

执行 `genFunc()` 后会停在 (A) 行的地方。而执行 `genObj.next()` 方法可以往下执行函数体直到下一个 `yield`

```javascript
> genObj.next()
First
{ value: undefined, done: false }
```

你可以看到最后一行，这是 `genObj.next()` 执行之后返回的一个对象。我们先不管它，后面会说到

`genFunc` 现在在 (B) 行停住了，如果我们再执行 `next()`，就会继续执行 (C) 行

```javascript
> genObj.next()
Second
{ value: undefined, done: true }
```

到这里函数已经执行完了，再调用 `genObj.next()` 也不起任何作用了

### Kinds of generators

这里有四种 generators：

 1. Generator 函数声明

    ```javascript
    function *genFunc() { ... }
	const genObj = genFunc();
    ```

 2. Generator 函数表达式

	```javascript
    const genFunc = function *() { ... }
    const genObj = genFunc();
    ```
    
 3. 在对象字面量里的 generator 方法定义

	```javascript
    const obj = {
      *generatorMethod() { ... }
    }
    const genObj = obj.generatorMethod();
    ```
    
 4. 在 `class` 对象里的 generator 方法定义

	```javascript
    class MyClass {
      *generatorMethod() { ... }
    }
    const myInst = new MyClass();
    const genObj = myInst.generatorMethod();
    ```
    
### Roles played by generators

Generators 可以扮演三个角色：

1. 迭代器(数据的提供者)：每次 `next()` 都可以获取一个 `yield` 出来的值，这意味着 generators 可以通过循环或者递归提供一系列的值。因为 generator 对象实现了 `Iterable` 这个接口，所以这一系列的值都可以当成迭代器来使用，例如可以使用 ES6 的 `for...of` 和 展开运算符 `...`
2. 观察者(数据的使用者)：如果你在执行 `next()` 的时候传入一个值，那么 `yield` 就可以获取到。这意味着 generator 可以获取到外部的数据，成为数据的使用者
3. 共用程序(数据的提供和消耗者)：从上面两点不难发现，generator 很容易就可以同时成为数据的提供者和使用者

下面会对每一个角色提供更深入的解释

## Generators as iterators (data production)

像刚刚说的，generator 对象可以同时成为数据的提供者、使用者或两者同时兼具，这一节先看看当 generator 为数据提供者的时候

一个 generator 函数通过 `yield` 提供一系列的值，其他数据使用者可以通过 `next()` 函数获取这些值，例如，下面这个 generator 函数提供了 `a` 和 `b` 这两个值

```javascript
function *genFunc() {
  yield 'a';
  yield 'b';
}
```

而我们就可以通过 generator 对象来拿到这些值

```javascript
> const genObj = genFunc();
> genObj.next()
{ value: 'a', done: false }
> genObj.next()
{ value: 'b', done: false }
> genObj.next()
{ value: undefined, done: true }
```

### Ways of iterating over a generator

generator 对象是可迭代的，ES6 提供了很多对可迭代对象的支持，接下来这三个尤其重要

首先，`for...of` 循环

```javascript
for (const x of genFunc()) {
  console.log(x);
}
// Output:
// a
// b
```

其次，用展开运算符，可以把元素展开放在一个数组里

```javascript
const arr = [...genFunc()]; // ['a', 'b']
```

第三，解构

```javascript
> const [x, y] = genFunc();
> x
'a'
> y
'b'
```

### Returning from a generator

刚刚那个 generator 函数并没有一个明确的 `return`。这时默认的返回就是 `undefined`。那有明确返回的时候什么怎么样呢：

```javascript
function *genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'result';
}
```

返回值会在最后一次执行 `next()` 的返回对象里出现，此时 `done` 的值为 `true`

```javascript
> const genObjWithReturn = genFuncWithReturn();
> genObjWithReturn.next()
{ value: 'a', done: false }
> genObjWithReturn.next()
{ value: 'b', done: false }
> genObjWithReturn.next()
{ value: 'result', done: true }
```

但是大部份对于可迭代的操作都会忽略最后这个 `done` 为 `true` 的值

```javascript
for (const x of genFuncWithReturn()) {
  console.log(x);
}
// Output:
// a
// b

const arr = [...genFuncWithReturn()]; // ['a', 'b']
```

`yield *` 会递归调用 generator，直到 `done` 为 `true`。这个后面会再讨论

### Throwing an exception from a generator

如果在 generators 里有一个异常，就可以使用 `next()` 将其抛出

```javascript
function* genFunc() {
  throw new Error('Problem!');
}
const genObj = genFunc();
genObj.next(); // Error: Problem!
```

这说明 `next()` 可以有三种不同的结果：

- 当一个值 `x` 的迭代列表里，就是 `yield` 出来时，会返回 `{ value: x, done: false }`
- 当一个值 `z` 在迭代列表的最后，就是 `return` 出来时，会返回 `{ value: z, done: true }`
- 当有一个异常在 generator 函数体里时，就会抛出一个异常

### Example: iterating over properties

现面就来看看用 generators 来实现一个可迭代的对象是有多么的方便。下面这个 `objectEntries()` 函数返回一个由对象属性组成的可迭代对象


```javascript
function *objectEntries(obj) {
  const propKeys = Reflect.ownKeys(obj);

  for (const propKey of propKeys) {
  	yield [propKey, obj[propKey]];
  }
}
```

这个函数可以让我们通过 `for...of` 循环来遍历这个 `jane` 对象的属性

```javascript
const jane = { first: 'Jane', last: 'Doe' };
for (const [key,value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// Output:
// first: Jane
// last: Doe
```

如果不使用 generators 来实现一个迭代器，会麻烦得多

```javascript
function objectEntries(obj) {
  let index = 0;
  let propKeys = Reflect.ownKeys(obj);

  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (index < propKeys.length) {
        let key = propKeys[index];
        index++;
        return { value: [key, obj[key]] };
      } else {
      	return { done: true };
      }
    }
  };
}
```

### You can only `yield` in generators


很重要的一点是，你只能在 generator 函数里使用 `yield`。就是说，你在回调里使用 `yield` 是不可行的

```javascript
function* genFunc() {
  ['a', 'b'].forEach(x => yield x); // SyntaxError
}
```

`yield` 不允许在非 generator 的函数体内，就是为什么刚刚的代码会报语法错误。在上面那个例子里，很容易重写实现相同的效果。但并不是每种情况都可以

```javascript
function *genFunc() {
  for (const x of ['a', 'b']) {
  	yield x; // OK
  }
}
```

### Recursion via `yield *`

你只能在 generator 函数里使用 `yield`。如果你要实现递归算法在 generator 里，你需要在一个 generator 里调用另一个 generator 的方法。这一节会告诉你这会比听起来复杂很多，所以 ES6 为此提供了一个特殊的操作符 `yield *`。现在我只会解释为当所有的 generators 都是数据提供者的时候 `yield *` 的表现，后面再会解释当涉及到外部数据的时候会怎样

一个 generator 怎么递归调用另一个 generator？假设你的一个 generator 函数 `foo`：

```javascript
function *foo() {
  yield 'a';
  yield 'b';
}
```

 那怎么在另一个 generator 函数 `bar` 里调用 `foo` 呢？下面的方法是不起作用的！
 
```javascript
function* bar() {
  yield 'x';
  foo(); // does nothing!
  yield 'y';
}
```

之前我们也说了，调用 `foo()` 并不会执行函数体，而是返回一个 generator 对象。这就是为会需要 `yield *` 来递归执行

```javascript
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

const arr = [...bar()];
// ['x', 'a', 'b', 'y']
```

`yield *` 在内部大致执行了类似的操作

```javascript
function* bar() {
  yield 'x';
  for (const value of foo()) {
    yield value;
  }
  yield 'y';
}
```

`yield *` 不一定要一个 generator 对象，它可以是任何一个可迭代的变量

```javascript
function* bla() {
  yield 'sequence';
  yield *['of', 'yielded'];
  yield 'values';
}

const arr = [...bla()];
// ['sequence', 'of', 'yielded', 'values']
```

#### `yield *` considers end-of-iteration values

很多对可迭代的操作都会忽略最后一个对象的值(就是 `done` 为 `true` 的那个)。这个值就放在了 `yield *` 操作的返回值里

```javascript
function *genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'The result';
}

function *logReturned(genObj) {
  const result = yield *genObj;
  console.log(result); // (A)
}

> [...logReturned(genFuncWithReturn())]
The result
[ 'a', 'b' ]
```

#### Iterating over trees

遍历一棵树就是一个很好的例子，用传统的方法为一棵写遍历是很复杂的。这时就让 generator 很突出了：它可以让你通过递归实现一个迭代器。看下面这个例子，它是可遍历的因为它有一个键为 `Symbol.iterator` 的方法。这个方法是一个 generator 方法，当它被调用里，返回一个迭代器

```javascript
class BinaryTree {
  constructor(value, left=null, right=null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }

  *[Symbol.iterator]() {
    yield this.value;
    if (this.left) {
      yield* this.left;
    }
    if (this.right) {
      yield* this.right;
    }
  }
}
```

先构造一棵树，然后通过 `for...of` 来中序遍历

```javascript
const tree = new BinaryTree('a',
  new BinaryTree('b',
    new BinaryTree('c'),
    new BinaryTree('d')
  ),
  new BinaryTree('e')
);

for (const x of tree) {
  console.log(x);
}
// Output:
// a
// b
// c
// d
// e
```

现在先翻译了当 generators 为迭代器(数据的提供者)时的一些知识和用法，后面会把其他角色进一步学习和翻译，如有错误，欢迎指出 :)
