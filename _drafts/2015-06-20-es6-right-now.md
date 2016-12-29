---
layout: post
category: ES2015
title: ES6 Right Now
date: 2015-06-20
summary: 看 ES6 Right Now - John Paul 的笔记
---

[ES6 Right Now - John Paul](https://www.youtube.com/watch?v=rwm5JLqCpdk)

# Promise

```javascript
var p = new Promise(function (resolve, reject) {
  setTimeout(resolve, 1000);
});

p.then(funtion () {
  alert('after 1 second');
});
```

# Set

```javascript
let set = new Set();
set.add('a');
set.add('b');
set.add('c');
set.add('b');

alert(set.size);  // 3
set.forEach(alert); // 1 2 3
```

# Block scope

```javascript
var arr = [1, 2, 3];
var 0 = [];

for (var i = 0; i < arr.length; i++) {
  var val = arr[i];
  o.push(function () { alert(val) });
}

o.forEach(function (fun) {
  fun();
});
// 3, 3, 3

var arr = [1, 2, 3];
var 0 = [];

for (var i = 0; i < arr.length; i++) {
  let val = arr[i];
  o.push(function () { alert(val) });
}

o.forEach(function (fun) {
  fun();
});
// 1, 2, 3
```

# Array Comprehensions

```javascript
var arr =  [1, 2, 3];
var doubled = [for (x of arr) x * 2)];
doubled.forEach(alert);
// 2, 4, 6
```

# Arrow Functions

```javascript
var alertLoc;
var obj = {
  loc: 'Chicago',
  init () {
    alertLoc = function () {
      console.log("We're in " + this.loc);
    }
  }
};

obj.init();
alertLoc();
// We' re in undefined

var alertLoc;
var obj = {
  loc: 'Chicago',
  init () {
    alertLoc = () => {
      console.log("We're in " + this.loc);
    }
  }
};

obj.init();
alertLoc();
// We' re in Chicago
```

# Destructuring Assignment

```javascript
var arr = [1, 2, 3];
func(arr);

function func ([fst, snd, thd]) {
  console.log(fst); // 1
  console.log(thd); // 3
}

function destructure (...args) {
  var [options, callback] = args;
  console.log(options.v);
  console.log(typeof callback);
}

var o = { v: true };
destructure(o, (x) => x);
// true function
```

# Template Strings

```javascript
let first = 'Jason';
let last = 'Liao';

let fullName = `I'm ${first} ${last}'`;
console.log(fullName);
// I'm Jason Liao
```

# Generators

```javascript
function* infO () {
  var i = 0;
  while (true) {
    yield ++i;
  }
}

for (var x of info()) {
  console.log(x);
  if (x > 3) {
    break;
  }
}
// 1, 2, 3, 4
```

# Classes

```javascript
class Greeter {
  constructor (message) {
    this.message = message;
  }
  greet () {
    console.log(this.message);
  }
}

var greeter = new Greeter('Hey');
greeter.greet();
// Hey
```

# Exports 

## default exports

```javascript
// a.js
var name = 'Jason';
export default name;

// b.js
import name form 'a';
console.log(name);
```

## named exports

```javascript
// a.js
var name = 'Jason';
var location = 'ZH';

export name;
export location;

// b.js
import { location, name } from 'a';
console.log(name + ' is in ' + location);
```

## named exports import namespace

```javascript
// a.js
var name = 'Jason';
var location = 'ZH';

export name;
export location;

// b.js
import * as a from 'a';
console.log(a.name + ' is in ' + a.location);
```
