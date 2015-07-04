---
layout: post
category: JavaScript
title: JavaScript Node - Array.prototype.?
date: 2015-06-12
summary: 几个数组原型方法的使用和内部大概实现
---

在看 JavaScript 框架设计的时候，知道了 jQuery 可以批量处理是因为一个叫数组化的概念，然后再对数组对象进行扩展，让数组可以完成更多的事情，但在扩展之前，先来看看几个原型方法

# Array.prototype.slice

就像刚刚说的，数组化，像`arguments`和`HTMLCollection`这些类数组的对象，不能直接使用数组的方法

在大部分的浏览器下，通过`[].slice.call()`就可以转换了，MDN 里也有把类数组对象转成数组的例子

但字符串调用这个方法的时候，生成的就是每个字符组成的数组，像这样

```javascript
[].slice.call('Hello') // ['H', 'e', 'l', 'l', 'o']
```

当然啦，还可以用其他方法达到这个效果

```javascript
[].map.call('Hello', function (s) {
  return s;
}); // ['H', 'e', 'l', 'l', 'o']
'Hello'.split(''); // ['H', 'e', 'l', 'l', 'o']
```

`Array.prototype.map`等下我们会说，我们先来推推`slice`内部的大致实现

```javascript
var spliceLikeMethod = function (start, end) {
  var start = start || 0,
      end = end || this.length,
      result = [];
  for (var i = start; i < end; i++) {
    result.push(this[i]);
  }
  return result;
};

// Test
function list () {
  return spliceLikeMethod.call(arguments);
}
console.log(spliceLikeMethod.call('Hello')); //['H', 'e', 'l', 'l', 'o']
console.log(list(1, 2, 3)); //[1, 2, 3]
```

# Array.prototype.map

在 [codewars](http://www.codewars.com/) 里看到一个这样的题目，'123'->[1, 2, 3]，我们可以用刚刚上面的三个方法把'123'转成['1', '2', '3']，那怎么转成我们想要的效果呢，有什么方法是可以数组转数组呢? Yep, we got `Array.prototype.map`

`map`方法接一个回调函数，回调函数传入三个函数，当前值、索引、原数组。所以我们不可以用`['1', '2', '3'].map(parseInt(i))`来完成我们的效果，原因在 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 里也说得很清楚，我们可以`['1', '2', '3'].map(Number(i))`来实现

MDN里还有几个 Example，我们还是一样，根据由这些 Example 去推出`Array.prototype.map`的大致实现

```javascript
var mapLikeMethod = function (callback) {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    arr.push(callback(this[i], i, this));
    // this[i] 是当前值
    // i 是索引
    // this 是原数组
  }
  return arr;
};

// Test
var array = mapLikeMethod.call([1, 2, 3], function (num) {
  return num * 2;
});
var strArr = mapLikeMethod.call('Hello', function (s) {
  return s;
});
console.log(array); // [2, 4, 6]
console.log(strArr); // ['H', 'e', 'l', 'l', 'o']
```

# Array.prototyp.join

`join`方法就是可以让你用你想用的分隔符把数组里的每个元素连接起来组成一个字符串，就像这样

```javascript
['Hello', 'World'].join('-'); // 'Hello-World'
```

我们还可以用`join`方法来实现 repeat 这个功能

```javascript
var repeat = function (str, times) {
  return Array.prototype.join.call({
    length: times + 1
  }, str);
};
console.log(repeat('str', 2)); //strstr
```

这个实现的原理是把我们要复制的字符串当成了分隔符，由一个伪数组调用，因为伪数组里的值都为 undefined，自动转成了 `''`，所以就相当于把分隔符直接连在一起了，我们也可以由此推出`join`方法的大致实现

```javascript
var joinLikeMethod = function (separator) {
  var result = this[0] || '',
      length = this.length,
      i = 1;
  // 默认separator为','
  separator = separator !== '' ?
    separator || ',' :
    separator;
  for (; i < length; i++) {
    result += separator;
    result += this[i] || '';
  }
  return result;
}
```

# Array.prototyp.reduce

[codewar](http://www.codewars.com/) 上有 Flatten
这道题，才去真正了解`reduce`这个方法，这个方法接受一个回调函数和一个初始值。`reduce`方法会把四个参数放到回调函数里，分别是`perviousValue`、`currentValue`、`index`、`array`，后面三个不用说了，但第一个参数要说说，如果`reduce`的第二个参数，即初始值有传入，那`perviousValue`一开始就是该初始值，后面则是前一次回调函数的返回值，循环从数组第一个索引开始。如果初始值没有传入，那一开始就是这个数组的第一个索引值，循环也会从第二个索引开始

好吧，我说得好乱，[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 上看例子

例如这个实现`squareSum([1, 2, 2]); //should return 9`

```javascript
var squareSum = function (numbers) {
  return numbers.reduce(function (sum, n) {
    return n*n + sum;
  }, 0);
}
console.log(squareSum([1, 2, 2])); // 9
```

再来看一个问题

```javascript
var arr = [{x:1}, {x:2}, {x:4}];
var newArr = arr.reduce(function (a, b) {
  return a.x + b.x;
});
console.log(newArr); // NaN
```

为什么会 NaN，刚刚一开头那段话已经提到了，初始值没有传入，所以 a 就是数组的第一个索引值`{x:1}`，第一次循环之后，a 就是上一次循环的返回值，所以第二次循环的时候，a 就变成了3，所以`a.x`就已经不存在了。所以就会出现错误，如果想达到效果，可以这样

```javascript
var arr = [{x:1}, {x:2}, {x:4}];
var newArr = arr.reduce(function (a, b) {
  return {x: a.x + b.x};
});
console.log(newArr.x); // 7
```

如有错误，欢迎指正 :)
