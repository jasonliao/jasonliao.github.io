---
layout: post
category: ES2015
title: ES6 - The future is now
date: 2015-06-23
summary: 看 ES6 - The future is now - Jim Cowart 的笔记
---

[ES6 - The future is now - Jim Cowart](https://www.youtube.com/watch?v=RPBnvQBkPPY)

# Block Scope

## let

```javascript
for (let i = 0; i < 10;; i++) {
  console.log("#" + i);
}

console.log(i); // ReferenceError
```

## const

```javascript
const GOOD_COP = 'Bad Cop';
GOOD_COP = 'Good Cop';
console.log(GOOD_COP); // 'Bad Cop'
```

## Destructuring

```javascript
// matching first two elements
let [a, b] = ['Emmet', 'Baman', 'Wyldstyle', 'Benny'];
console.log(a + '&' + b); // Emmet & Baman

// value swaps made easy!
[a, b] = [b, a];
console.log(a + '&' + b); // Baman & Emmet

// matching first element, and the ...rest parameter
let [x, ...rest] = ['Emmet', 'Baman', 'Wyldstyle', 'Benny']
console.log(rest); // ['Baman', Wyldstyle', 'Benny']

var obj = {
  character: "Wyldstyle",
  voice: "Elizabeth Banks"
};

let { character:c, voice:v } = obj;
console.log(v + " was the voice for " + c);
//Elizabeth Banks waw the voice for Wyldstyle
```

# Fcuntions

## Arrow Functions

```javascript
// The ES5 way
var builder = {
  name: 'Emmet',
  getGreeting: function () {
    return function () {
      return 'Hi, I'm ' + this.name;
    }.bind(this)
  }
}

let greeting = builder.getGreeting();
console.log(greeting());

// The ES6 way
var builder = {
  name: 'Emmet',
  getGreeting = function () {
    return () => "Hi, I'm " + this.name;
  }
}

let greeting = builder.getGreeting();
console.log(greeting());
```

## Default Params

```javascript
// The ES5 way
var benny = {
  say: function (msg) {
    msg = msg || "Spaceship";
    console.log(msg);
  }
};

benny.say(); // Spaceship
benny.say("Underwater Spaceship");
// Underwater Spaceship

// The ES6 way
var benny = {
  say: function (msg = "Spaceship") {
    console.log(msg);
  }
};

benny.say(); // Spaceship
benny.say("Underwater Spaceship");
// Underwater Spaceship
```

## Spread & Rest

```javascript
// The ES5 way
var args = ['Emmet', 'Baman', 'Wyldstyle', 'Benny'];

function processCharacters () {
  var x = [].slice.call(arguments, 0);
  var first = x.shift();
  console.log(first);
  if (x.length > 0) {
    processCharacters.apply(this, x);
  }
}

processCharacters.apply(this, args);
```

```javascript
// The ES6 way
let args = ['Emmet', 'Baman', 'Wyldstyle', 'Benny'];

function processCharacters (first, ...rest) {
  console.log(first);
  if (rest.length > 0) {
    processCharacters(...rest);
  }
}

processCharacters(...args);
```

## Named Parameters

### more destructuring

```javascript
let character = "Bad Cop";
let actor = {
  fName: "Liam",
  lName: "Neeson"
};

function foo (c, {fName, lName}) {
  console.log(fName, lName, " voiced ", c);
}

foo(character, actor);
// Liam Neeson voiced Bad Cop
```

### with default values

```javascript
function foo ({fName = 'Unknow', lName}) {
  console.log(fName, lName);
}

foo({lName: 'Liao'});
// Unknow Liao
```

# String & Object API Additions

## String Templates

```javascript
let x = {
  name: 'Will Arnett',
  part: 'Batman'
};
let res = `${x.name} voiced ${x.part}.`;

console.log(res);
// Will Arnett voiced Batman
```

## Multi-line Strings

```javascript
let x = {
  name: 'Will Arnett',
  part1: 'Man Upstairs',
  part2: 'Lord Business'
};
let res = `${x.name} voiced: 
a.) ${x.part1}
b.) ${x.part2}`;

console.log(res);
/* Will Arnett voiced:
   a.) Man Upstairs
   b.) Lord Business  */
```

## String API Suger

```javascript
let badCopQuote = 'Rest in pieces!';

console.log(badCopQuote.startsWith('Res'));
console.log(badCopQuote.contains('t in p'));
console.log(badCopQuote.endsWith('!'));
// all are true
```

## Object.is

```javascript
Object.is('emmet', 'batman'); // false
Object.is(NaN, NaN); // true
Object.is(0, -0); // false
Object.is(-0, -0); // true
```

## Object Literal Shorthand

```javascript
let name = 'Emmet';
let loveInterest = 'Lucy';

function createCharacter (options) {
  console.log(JSON.stringity(options));
}

createCharacter({
  name,
  loveInterest,
  masterBuilder: true
});

/* { "name": "Emmet",
     "loveInterest": "Lucy",
     "masterBuilder": true } */
```

```javascript
let obj = {
  name: 'Emmet',
  sayHi () {
    return "Hi there, I'm " + this.name;
  }
};

// The above is the same as:
let obj = {
  name: 'Emmet',
  sayHi: function () {
    return 'Hi there, I'm ' + this.name;
  }
}
```

## Object.assign

```javascript
let loveInterest = "Lucy";
let b = { masterBuilder: true };
let a = { name: "emmet" };

let emmet = Object.assign(a, b, { loveInterest });

console.log(emmet);
/* { "name": "emmet",
     "loveInterest": "Lucy",
     "masterBuilder": true } */

// target object itself is changed
console.log(a);
/* { "name": "emmet",
     "loveInterest": "Lucy",
     "masterBuilder": true } */
```

# Number API Additions

## Number.isInteger

```javascript
Number.isInteger(0.7); // false
Number.isInteger(5); // true
Number.isInteger(Number.EPSILON); //false
Number.isInteger(NaN); //false
```

## Number.isSafeInteger

```javascript
Number.isSafeInteger(17); // true
Number.isSafeInteger(Math.pow(2, 60)); // false
Number.isSafeInteger(Math.pow(2, 53) - 1); // true
Number.isSafeInteger(NaN); // false
Number.isSafeInteger(Infinity); // false
```

## Number.isNaN

```javascript
// NaN value equivalence cannot be tested
// for with normal equality comparisons
console.log(NaN === NaN); // false!

//isNaN to the rescue...
Number.isNaN(NaN); // true
Number.isNaN(Number.NaN); // true
Number.isNaN(0 / 0); // true
Number.isNaN(43); // false
```

# Array API Additions

## Array.findIndex

```javascript
// In ES5
var arr = [
  { part: "Vitruvius", actor: "Morgan Freeman"  },
  { part: "Superman", actor: "Channing Tatum"  },
  { part: "Metalbeard", actor: "Nick Offerman"  }
];

var len = arr.length;
var idx = 0;
while (idx < len) {
  if (arr[idx].part === "Superman") {
    break;
  }
  idx++;
}

console.log(idx); //1
```

```javascript
// In ES6
var arr = [
  { part: "Vitruvius", actor: "Morgan Freeman" },
  { part: "Superman", actor: "Channing Tatum" },
  { part: "Metalbeard", actor: "Nick Offerman" }
];

console.log(
  arr.findIndex((x) => x.part === "Superman")
);
```

## Array.find

```javascript
// In ES5
var arr = [
  { part: "Vitruvius", actor: "Morgan Freeman" },
  { part: "Superman", actor: "Channing Tatum" },
  { part: "Metalbeard", actor: "Nick Offerman" }
];

var len = arr.length;
var idx = 0;
var result;
while (idx < len) {
  if (arr[idx].part === "Superman") {
    result = arr[idx];
    break;
  }
  idx++;
}

console.log(result.actor);
// Channing Tatum
```

```javascript
// In ES6
var arr = [
  { part: "Vitruvius", actor: "Morgan Freeman" },
  { part: "Superman", actor: "Channing Tatum" },
  { part: "Metalbeard", actor: "Nick Offerman" }
];

console.log(
  arr.find((x) => x.part === "Superman").actor
);
// Channing Tatum
```

## Array.fill

```javascript
let arr = ["Double", "Decker", "Couch"];

arr.fill("Spaceship", 0, arr.length);
console.log(arr.join(" "));
// Spaceship Spaceship Spaceship

arr.fill("Spaceship", -1, arr.length);
console.log(arr.join(" "));
// Double, Decker, Spaceship
```

## Array.from

```javascript
// In ES5
function batman () {
  return Array.prototype.slice.call(arguments, 0);
}

var res = batman("Waw!", "Pow!");
console.log(res.join(" "));
// WaW! Pow!
```

```javascript
function batman () {
  return Array.from(arguments);
}

var res = batman("Waw!", "Pow!");
console.log(res.join(" "));
// WaW! Pow!
```

```javascript
var res1 = Array.from("Spaceship");
console.log(res1);
// S,p,a,c,e,s,h,i,p

var arr = [
  { part: "Vitruvius", actor: "Morgan Freeman" },
  { part: "Superman", actor: "Channing Tatum" },
  { part: "Metalbeard", actor: "Nick Offerman" }
];
var res2 = Array.from(arr, (x) => x.actor);
console.log(res2);
// [Morgan Freeman, Channing Tatum, Nick Offerman]
```

# Loops Generators Collection & more

## Loops Made Better

```javascript
// In ES5 Array iteration via forEach
["Tegan", "Sarah"].forEach(function (item) {
  console.log(item);
});
```

```javascript
// In ES6 Array iteration via for-of
for (let item of ["Tegan", "Sarah"]) {
  console.log(item);
}

let obj = {
  Emmet: 'Chris Pratt';
  Vitruvius: 'Morgan Freeman'
};

for (let k of Object.keys(obj)) {
  console.log(k, ': ', obj[k]);
}
```

## for-of + generators

```javascript
// Using a generator
function* entries (obj) {
  for (let k of Object.keys(obj)) {
    yield [k, obj[k]];
  }
}

let obj = {
  Emmet: 'Chris Pratt';
  Vitruvius: 'Morgan Freeman'
};
// destructuring - to get key/value
for (let [key, value] of entries(obj)) {
  console.log(key, ': ', value);
}
```

## Generators

- Allow you to "pause & resume" a function
- "Interruptible Computations"
- "Shallow Coroutines"
- Great for simplifying asynchronous code

## Generators - The Basics

```javascript
function* legoCharacters () {
  yield "Emmet";
  yield "Lucy";
  yield "Benny";
}

for (let c of legoCharacters()) {
  console.log(c);
}
/*  Emmet
    Lucy
    Benny */
```

**What's Really Going On?**

- Generators return a generator object that is an iterator
- An iterator has a `next` method
- Call next returns an object
  - with a `value`
  - and a `done` boolean

```javascript
function* legoCharacters () {
  yield "Emmet";
  yield "Lucy";
  yield "Benny";
}
let generator = legoCharacters();

console.log(generator.next());
// { "value": "Emmet", "done": false }
```

## Map

- Data structure mapping Keys & Values
- Can be iterated over via for-of
- Not Limited to String keys!

```javascript
let map = new Map();

// string keys
map.set("theSpecial", "Emmet");

// symbols as keys
let over_priced_cofee = Symbol();
map.set(over_priced_cofee, 37);

// WAT! Objects as keys!
let lucy = { name: "Lucy" };
map.set(lucy, "Wyldstyle");

// iteration
for (let [k, v] of map) {
  console.log(k, ': ', v);
}

console.log(map.has(lucy)); //true
console.log(map.size); //3

// removing keys
console.log(map,delete('theSpecial'));
```

## WeakMap

- Keys are weakly held Objects
- values are anything
- Keys are not enumerable(because of garbage collection)

```javascript
let lucy = {name: 'Lucy' };
let emmet = { name: 'Emmet' };

var map = new WeakMap();
map.set(lucy, 'Wyldstyle');
map.set(emmet, 'The Special');

console.log(map.get(lucy)); // Wyldstyle
console.log(map.has(emmet)); //true
```

## Set

A Collection with no duplicates

```javascript
var set = new Set();

set.add("double decker couch");
set.add("bat mobile");
set.add("Spaceship");
set.add("Spaceship");
set.add("Spaceship");

for (let item of set) {
  console.log(item);
}
/*  "double decker couch"
    "bat mobile"
    "Spaceship"   */
```

## WeakSet

- Hold weakly held Objects only
- Objects will be unique(like Set)
- Not enumerable

# Promises

- Represent the result of async operation(then-able)
- Have existed in libs like when.js, Q, RSVP & jQuery
- Are now native to JavaScript

```javascript
// creating a Promise in ES6
let findTheSpecial = function () {
  return new Promise(
    (resolve, reject) => resolve("Emmet")
  );
};

findTheSpecial().then(
  (x) => console.log("The Special is: ", x),
  (err) => console.log(err)
);
// The Special is Emmet
```

# Modules/Classes

## Modeles

```javascript
// lib/legomovie.js
var localValue = "Emmet Brickowsi";
export default function whatIsEverything () {
  return "Evenything is awesome";
}
export var coffeePrice = 37;

// import the whole module
import * as legomovie from "lib/legomovie";
console.log(legomovie.whatIsEverything());
console.log(legomovie.coffeePrice);

// or named import
import { coffeePrice as wat, whatIsEverything } from "lib/legomovie";
console.log("Overpriced Coffee is only $", wat);

// or using the default export example
import legomovie from "lib/legomovie";
console.log(legomovie());
```

## Classes

```javascript
class LegoPerson {
  constructor (name) {
    this.name = name;
  }
  sayName () {
    return "hi, I'm " + this.name;
  }
}

class Emmet extends LegoPerson {
  constructor (otherName) {
    super("Emmet Brickowski");
    this.otherName = otherName;
  }
  get myOtherName () {
    return `Well, my name is ${this.name}
      but Vitruvius calls me ${this.otherName}`;
  }
}

let emmet = new Emmet("The Special");
```

# Proxies

- Allows you to define the 'semantics of an object in JavaScript
- Gives you hooks to intercept/trap certain operations
- Use-cases include:
  - default value/'method missing'
  - validation
  - value correction/transformation
  - logging, profiling(& other cross-cutting concerns)
  - and More!
