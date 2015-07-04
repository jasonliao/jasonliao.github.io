---
layout: post
category: JavaScript
title: JavaScript Note - Closures
date: 2015-01-12
summary: 关于闭包作用域的一些浅显理解
---

> Closures are functions that refer to independent (free) variables

闭包是静态方式／词法方式进行存储所有父作用域的一个函数

在 JavaScript 高级程序设计里面通过一个`createComparisonFunction()`函数和这个函数的作用域链之间的关系图说得很明白为什么闭包可以访问外部函数的变量，是因为闭包的作用域链不仅包括自己本地的活动对象，还包括外部函数作用域链所指向的活动对象

在JavaScript高级程序设计和 JavaScript 精粹里都有一个类似的例子，在循环里创建闭包(为了测试，做了一点点修改)

```javascript
var fn = function () {
  var result = [];
  for (var i = 0; i < 3; i++) {
    result[i] = function () {
      console.log(i);
    };
  }
  return result;
};

var lists = ();
lists[0](); // 3
lists[1](); // 3
lists[2](); // 3
```

```javascript
var fn = function () {
  var result = [];
  for (var i = 0; i < 3; i++) {
    result[i] = (function () {
      return function (num) {
        console.log(num);
      }
    })(i);
  }
  return result;
};

var lists = ();
lists[0](); // 0
lists[1](); // 1
lists[2](); // 2
```

当时为了让自己可以了解得更彻底，自己也把作用域画了出来，第一个函数作用域关系图

![about-closures]({{ site.url }}assets/images/about-closures/about-closures-1.png)

从第一个函数的作用域关系图可以看到，之所以数组里的每个函数都打印`3`是因为每个函数在各自己本地的活动对象里都找不到`i`，所以继续往上找，在外部函数的活动对象里找到了`i`，但是此时的`i`在循环结束后的值为`3`，所以每个函数打印均为`3`

第二个函数作用域关系图

![about-closures]({{ site.url }}assets/images/about-closures/about-closures-2.png)

第二个函数把一个立即执行的函数赋给了`result`数组，并传入了`i`所以此时`result[x]`的活动对象里就多一个变量`num`，值为`i`(函数参数按值传递)，所以返回的函数打印`num`时，根据作用域链找到了`result[x]`活动对象里的`num`，并打印出`num`的值

通过画这两个函数的作用域链的关系图，就可以清楚地弄懂闭包的工作原理，也就不会对闭包那么害怕了

下面是面试题喔

```javascript
function foo (a) {
  return function (b) {
    return a+++b;
  };
}

var a = foo(10);
var b = foo(20);

var arrs = [a(10), b(20), a(10)];
console.log(arrs);  // what is your answer
```

PS. 在最上面的两个例子在JSLint里都是会报warning: Don't make functions with a loop

所以可以在循环外定义函数后再在循环里使用，防止会出现其他的情况

最后附上 Sumlime-Text 3 怎么安装 SublimeLinter 的[教程](http://www.sublimelinter.com/en/latest/installation.html)

如有错误，欢迎指正 :)
