---
layout: post
category: ES2015
title: ES6 - The new JavaScript
date: 2015-06-27
summary: 看 ES6 - The new JavaScript - Aaron Frost 的笔记
---

[ES6 - The new JavaScript - Aaron Frost](https://www.youtube.com/watch?v=y46nckrcCok&spfreload=10)

# let const

```javascript
let d = 0;
if (true) {
  let d = 2;
  console.log("here d = ", d); // 2
}
console.log("at the end d = ", d); // 0
```

```javascript
// let scopes
let a = 0; // Basic

if (true) { // if
  let b = 1;
}

let term = "js";
switch (term) { // switch
  case "js"
    let c = 2;
    break;
}

while (true) { // loop body
  let d = 0;
}
```

# Rest Paramrters

```javascript
function foo (...bar) {
  console.log(bar.join(' ');
}
foo('I', 'am', 'Jason');
// I am Jason
```

> Is that syntatic sugar for Array.prototype.slice on Arguments or does it do something more for you?

```javascript
// WHO CARES!!! We already had 'arguments'
function foo () {
  console.log(Array.prototype.join.call(arguments, ' ');
}
foo('I', 'am', 'Jason');
// I am Jason
```

```javascript
// DIFFERENCES
function argumenty (name) {
  console.log(name, arguments);
}
function resty (name, ...other) {
  console.log(name, other);
}
argumenty('I', 'am', 'Jason');
// I, ['I', 'am', 'Jason', callee (...), caller: (...)]
resty('I', 'am', 'Jason');
// I, ['am', 'Jason']
```

**some rules**

- one per functoin
- must be the last parameter
- can't use 'arguments'
- no default values

```javascript
// can't use 'arguments'
function doSomething (...bar) {
  console.log(arguments.length); // SyntaxError
}
doSomething(1, 2, 3); // 3 but works in babel

// no default values
function doSomething (...params=[1, 2, 3]) { // SyntaxError
  console.log(params.join(' '));
}
doSomething();
```

> What happens to function(...bar) if there are no remaining arguments?

```javascript
function foo (...bar) {
  console.log(bar);
}
foo();  // []
```

# Spread Operator

```javascript
let nums = [1, 2, 3];
console.log(nums);  // [1, 2, 3]
console.log(...nums); // 1, 2, 3
```

```javascript
// Old vs New
function exchange (a, b) {
  return [b, a];
}
let nums = [1, 2, 3];
let old = exchange(nums[0], nums[1]);
let new = exchange(...nums);
console.log(old); // [2, 1]
console.log(new); // [2, 1]
```

就是说，在函数调用的时候，如果用`...`来传递参数的时候，就会把参数分开，一个一个地传进去。

如果在函数参数里写`...`的时候，就会把传进来的参数打包成一个数组。

> What can I do with spread

## Combine Arrays

```javascript
let nums = [1, 2, 3];
let abcs = ['a', 'b', 'c'];

let alphanum = [...nums, ...abcs];
console.log(alphanum);
// [1, 2, 3, a, b, c]

function gerNums () {
  return [1, 2, 3];
}

let b = [0, ...getNums()];
console.log(b);
// [0, 1, 2, 3]
```

# Destructuring

## Destructuring Object

```javascript
function getMsg () {
  return {
    name: 'Jason',
    age: 20
  }
}

let {name, age} = getMsg();
console.log(name); // Jason
console.log(age); // 20

let {name: n, age: a} = getMsg();
console.log(n);  // Jason
console.log(a); // 20

// console.log(name, age); name is undefined

// The old way
var person = {
  name: 'Jason',
  age: 20
};

function displayPerson (p) {
  var name = p.name;
  var age = p.age;
  console.log(name, age);
}
displayPerson(person);

// The new way
function displayPerson (p) {
  let {name, age} = p;
  // let {age, name} is also work
  // It doesn't matter the order of variable names is different
  console.log(name, age);
}

// Or anther new way
function displayPerson ({name, age}) {
  console.log(name, age);
}
```

```javascript
// What's more
// In the past
function displayPerson (p) {
  var name = p.name || 'jason';
  var age = p.age || 20;
  console.log(name, age);
}

// but now
function displayPerson ({name='Jason', age=20}) {
  console.log(name, age);
}
```

```javascript
// nested destructuring

let person = {
  name: 'Jason',
  age: 20,
  address: {
    country: 'China',
    city: 'ZhuHai'
  }
}

let {name, age, address: {country, city}} = person;
cpnsole.log(name, age, country, city);
```

## Destructuring Array

```javascript
let nums = [1, 2, 3, 4, 5];

let [first, second, , , fifth] = nums;
console.log(first, second, fifth);
// 1, 2, 5
```

```javascript
let a = 1,
    b = 2;

[b, a] = [a, b];
console.log(a, b); // 2, 1
```

```javascript
// nested array destructuring
let nums = [1, 2, [3, 4, [5,6]]];

let [one,,[three,,[,six]]] = nums;
console.log(one, three, six);
// 1, 3, 6
```

```javascript
let [x, y, ...z] = ['J', 'a', 's', 'o', 'n'];

console.log(x, y, z);
// 'J' 'a' ['s', 'o', 'n']
```

# Arrow Functions

```javascript
// Parameters

let x;
x = () => {}; // No parameters, must have parens
x = (val) => {} // One parameter, optional
x = val => {} // One parameter, optional
x = (y, z) => {} // Two or more parameters, must have parens
```

> Arrow Functions is function, but it does't have the prototype, so it can't be used as a constructor

> Can't alter `this`, so no `.call` or `.apply`
