---
layout: post
category: ES2015
title: Trangle JS - ES6
date: 2015-06-18
summary: 看 Trangle JS - ES6 的笔记
---

[Trangle JS - ES6](https://www.youtube.com/watch?v=W5lSNokaGQ8)

# Enhanced Object Literals

```javascript
let sayHello = () => { console.log('hello') };

let obj = {
  // Shorthand for 'sayHello: sayHello'
  sayHello,

  // method declarations
  toString () {
    return super.toString() + '... literally';
  },

  keys () {
    let key = Object.keys(this);
    keys.push('extraneous');
    return keys;
  },

  // Computed (dynamic) property names
  ['prop_' + (6 * 7)]: 42,

  // get and set
  get name () {
    return 'Object Literal';
  }
}
```

# Block Scoping

```javascript
// let is block-scoped and never hoisted
{
  var age = 35;
  let name = 'Jason';
}
console.log(age === 35); // true
console.log(name); // ReferenceError: name is not defined

// var is function-scoped and hoisted
(() => {
  console.log(name === undefined); // true
  var name = 'Jason';
  console.log(name === 'Jason'); // true
})()

// es5
var ingredients = ['rum', 'banana', 'nutella'];

for (var i = 0; i < ingredients.length; i++) {
  var ingredient = ingredients;
  setTimeout(function () {
    console.log('Time to add the ' + ingredient);
  }, 200);
}
// Time to add the nutella
// Time to add the nutella
// Time to add the nutella

// es6
var ingredients = ['rum', 'banana', 'nutella'];

for (var i = 0; i < ingredients.length; i++) {
  let ingredient = ingredients;
  setTimeout(function () {
    console.log('Time to add the ' + ingredient);
  }, 200);
}
// Time to add the rum
// Time to add the banana
// Time to add the nutella
```

# Arrow Functions

```javascript
// es5
let length = function (str) {
  return str.length;
};

// es6
let length = str => str.length
```

```javascript
// es5
let tokenWrapper = function (token) {
  return { access_token: token }
};

// es6
let tokenWrapper = token => ({ access_token: token });
```

```javascript
// es5
let bind = function (func, ctx) {
  return function () {
    return func.apply(ctx, arguments);
  };
}

// es6
let bind = (func, ctx) => () => func.apply(ctx, arguments);
```

# Classes

```javascript
class Animal {
  constructor (type='dog') {
    this.type = type;
  }

  static mate (top, bottom) {
    return new Animal('cat');
  }
  
  get appearance () {
    console.log("I'm here");
  }

  appear () {
    console.log(this.appearance);
  }
};
```

# The Iterable Protocol

```javascript
let myIterable = {};

myIterable[Symbol.iterator] = function () {
  let dead = false;

  return {
    next () {
      if (dead) {
        return { done: true };
      }
      dead = true;
      return {
        done: false,
        vlaue: "I'm just run once"
      };
    }
  };
}

for (let quote of myIterable) {
  console.log(quote);
}
//  "I'm just run once"

// you can alse use generator
function* myIterator () {
  for (let i = 0; i < 1; i++) {
    yield "I'm just run once";
  }
}

for (let value of myIterable()) {
  console.log(value);
}
//  "I'm just run once"
```

```javascript
function* lyricGenerator () {
  yield 'stop';
  yield * 'Hello';
}


let mc = lyricGenerator();

console.log(mc.next().vlaue); // stop
console.log(mc.next().vlaue); // H
```

# Proxies

```javascript
function makeModel (obj) {
  let dirtyArrtibutes = new Set();
    
  return new Proxy(obj, {
    set (target, prop, value, receiver) {
      if (!Object.equal(value, target[prop])) {
        dirtyArrtibutes.add(prop);
      }
      return Reflect.set(target, prop, value, receiver);
    },
    deleteProperty (target, prop) {
      if (Object.hasOwnProperty(target[prop])) {
        dirtyArrtibutes.add(prop);
      }
      return Reflect.deleteProperty(target, prop);
    }
  });

  setTimeout(() => console.log(dirtyAttribute), 1200);
}

let user = makeModel({ name: "Jason" });
```
