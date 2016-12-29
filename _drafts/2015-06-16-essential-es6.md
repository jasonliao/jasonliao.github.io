---
layout: post
category: ES2015
title: Essential ES6
date: 2015-06-16
summary: 看 Essential ES6 - Kyle Robinson Young 的笔记
---

[Essential ES6 - Kyle Robinson Young](https://www.youtube.com/watch?v=CozSF5abcTA)

# let

```javascript
let type = 'grizzly';

while (true) {
  let type = 'polar';
  console.log(type);
  break;
}

console.log(type);
// polar
// grizzly
```

# const

```javascript
const PI = Math.PI;
PI = 123;
// can't write, read only
```

# class

```javascript
class Bear {
  constructor () {
    this.age = 12;
    this.type = 'Bear';
  }
  says () {
    console.log(this.type + ' says ' + this.age);
  }
}

class SouthBear {
  constructor () {
    super();
    this.type = 'SouthBear';
  }
}

let bear = new SouthBear();
bear.says(); //SouthBear says 12
```

# Arrow function

```javascript
let bears = ['polar', 'koala'].filter((bear) => bear !== 'koala');
console.log(bears); // ['polar']

let bears = ['polar', 'koala'].filter((bear) => {
  return bear !== 'koala';
});
console.log(bears); // ['polar']

class Bear {
  constructor () {
    this.age = 12;
    this.type = 'Bear';
  }
  says () {
    setTimeouot(function () {
      console.log(this.type + ' says ' + this.age);
    }, 1000);
  }
}
let bear = new Bear();
bear.says(); //undefined says 12
// this means window 

// we usually fix this by 
class Bear {
  constructor () {
    this.age = 12;
    this.type = 'Bear';
  }
  says () {
    var self = this;
    setTimeouot(function () {
      console.log(self.type + ' says ' + this.age);
    }, 1000);
  }
}

// or
class Bear {
  constructor () {
    this.age = 12;
    this.type = 'Bear';
  }
  says () {
    setTimeouot(function () {
      console.log(this.type + ' says ' + this.age);
    }.bind(this), 1000);
  }
}

// but now we can use allow function
class Bear {
  constructor () {
    this.age = 12;
    this.type = 'Bear';
  }
  says () {
    setTimeouot(() => {
      console.log(this.type + ' says ' + this.age);
    }.bind(this), 1000);
  }
}
// Bear says 12
```

# Template Strings

```javascript
var bears = [
  'grizzly',
  'polar'
].join('/n');
console.log(bears);
/*  grizzly
    polar   */

let bears = `
grizzly
polar
`

console.log(bears);
/*  grizzly
    polar   */

let bear = 'grizzly';
let says = 'growl';
console.log(`The ${bear} says ${says}`);
// The bear says growl
```

# Destructuring

```javascript
let bear = 'grizzly';
let says = 'growl';
let zoo = { bear, says };
console.log(zoo);
// { bear: 'grizzly', says: 'growl' }

let grizzly = { type: 'grizzly', many: 2 };
let { type, many } = grizzly;
console.log(many, type);
// 2 'grizzly'
```

# Default Params

```javascript
function bear (type) {
  type = type || 'grizzly';
  console.log(type);
}
bear(); // 'grizzly'

function bear (type = 'grizzly') {
  console.log(type);
}
bear(); // 'grizzly'

function bears (...types) {
  // we can get types array
  // we don't need turn arguments to array
  console.log(types);
}
bears('polar', 'grizzly');
//['polar', 'grizzly']
```
