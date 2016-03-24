---
layout: post
category: JavaScript
title: "' '、String(' ') and new String(' ')"
date: 2015-02-10
summary: "' '、String(' ')和new String(' ')这三者的差别"
---

[http://www.queness.com/post/9806/5-missing-javascript-number-format-functions](http://www.queness.com/post/9806/5-missing-javascript-number-format-functions)

这篇文章介绍5种常用的数字转换格式，但是里面有一个小小的不好的编程习惯，就是在把数字转成字符串的时候，使用了 `var s = new String(xxx)`

这在 JSLint 中会报错 Do not use String as a conctruct

[https://jslinterrors.com/do-not-use-a-as-a-constructoar](https://jslinterrors.com/do-not-use-a-as-a-constructoar) 这是 JSLine 对这种错误的解释

> 虽然用这种方式写的代码在运行中不会有任何的错误, 但是却会对其他的开发人员造成困惑并且以后有不可预料的情况发生

那究竟有什么不可预料的情况发生 下面是例子

```javascript
var i = 24;
var s = new String(i);
// 其他代码
var j = 24;
var s1 = new String(j);
if(s == s1) {
  console.log('s == s1');  
} else {
  console.log('s != s1');  
}
```

这时候可以看到 打印出来的是 s != s1 这就是不可预料的情况！

- `var s = new String('hello world');`
- `var s1 = String('hello world');`
- `var s2 = 'hello world';`

这三者到底有什么区别呢？

当我们用`typeof`打印出他们的类型的时候，我们可以发现 s 为`object`，而后两者则为`string`，但是我们用`instanceof` 来判断的时候，发现 s 是`Object`的实例，也是`String`的实例，但后两者却什么都不是。

显然

s1 和 s2 一样是基本类型为`string`，s 则是引用类型

所以他们在比较的时候，也要有所注意

`s1 === s2`为`true`，值相等同时，类型也相等

但字符串对象 s 作比较的时候 就会有讲究 如果与它比较的是字符串(基本类型) 则按值比较 如果与它比较的是字符串对象 则按引用比较

```javascript
var s = new String('hello world');
var s1 = new String('hello world');
var s2 = String('hello world');
 
console.log( s == s2 );    //true
console.log( s == s1 );    //false
```
[https://msdn.microsoft.com/library/ie/d53a7bd4(v=vs.94).aspx/](https://msdn.microsoft.com/library/ie/d53a7bd4(v=vs.94).aspx/) 里面的 By Value vs. By Reference 也会有更详细的说明

最后说一下最开始提到的那篇文章，里面对数字格式的转换运用的逻辑和技巧都非常的棒，而且评论也非常精彩喔~

如有错误 欢迎指正 :)
