---
layout: post
category: ES2015
title: "ES6: JavaScript, grown up"
date: 2015-06-29
summary: "看 ES6: JavsScript, grown up - Jack Franklin 的笔记"
---

[ES6: JavsScript, grown up - Jack Franklin](https://www.youtube.com/watch?v=mPq5S27qWW8)

# Arrow Functions

```javascript
var nums = [1, 2, 3];

nums.map(function (x) {
  return x * 2;
});

nums.map((x) => x *2);
```

```javascript
// In ES5
var jason = {
  username: 'jason',
  friends: ['drake', 'jack'],
  printFriends: function () {
    this.friends.forEach(function (f) {
      console.log(this.username + ' knows ' + f);
    });
  }
};

// In ES6
let jason = {
  username: 'jason',
  friends: ['drake', 'jack'],
  printFriends () {
    this.friends.forEach((f) => {
      console.log(this.username + ' knows ' + f);
    });
  }
};
```

# Classes

```javascript
class Person {
  constructor (name, age) {
    this.name = name;
    this.age = age;
  }
  about () {
    console.log(this.name + this.age);
  }
};

let jason = new Person('jason', 20);
jason.about();
```

```javascript
// you can also extend your object
class Son extends Person {
  constructor (name, age) {
    super(name, age);
    this.son = true;
  }
};

let jason = new Son('jason', 20);
console.log(jason.son); //true
```

# Object Literals

```javascript
var jason = {
  ['hello' + (() => 'world')()]: 20;
};

console.log(jason.helloworld);  // 20
```

# Destructuring

```javascript
let [a, ,b] = [1, 2, 3];
// a == 1, b == 3

let jason = {
  name: 'jason',
};

let {name, age} = jason;
// name == jason, age == undefined
```

# Function Arguments

- Default Params
- Spread & Rest

# Scope

> JavaScript has Global Scope(window) and Function Scope before ES6

```javascript
foo = 2;
var fad = 2;

function () {
  bar = 3;
  var baz = 5;
}
// Global Scope: foo fad bar
// Function Scope: baz
```

```javascript
function foo () {
  if (something) {
    var bar = 1;
  }
  var fad = 2;
}
// Function Scope: bar fad

// because in JavaScript, we got variable hosting
```

> But now, we got Global Scope(window), Function Scope and Block Scope

```javascript
var foo = 1;

function fun () {
  var baz = 2;
  if (x) {
    var z = 4;
    let y = 3;
  }
}
// Global Scope: foo
// Function Scope: baz z
// Block Scope: y
```

# Modules

```javascript
// app.js
var foo = 2;
var bar = 3;

export {foo, bar};

// foo.js
import {foo} from 'app';
console.log(foo); // 2
```

```javascript
// app.js
export default function () {
  return 2;
}

// foo.js
import foo from 'app';
console.log(foo()); // 2
```

```javascript
// app.js
export var foo = 2;
export var bar = 3;

// foo.js
module stuff from 'app';

stuff.foo // 2
stuff.bar // 3
```
