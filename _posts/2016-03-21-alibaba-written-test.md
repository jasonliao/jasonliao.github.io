---
layout: post
category: interview
title: Alibaba Written Test
date: 2016-03-21
summary: 阿里巴巴 UC 移动事业群笔试总结
---

3 月 16 日下午，我跟实验室另一个前端同学到广电科技大厦进行 UC 的笔试，虽然去的过程比较曲折，但我们最后还是准时到达了指定地点，准备笔试。


因为太多人原因，我们被安排到了 14 楼的 UC 员工餐厅中进行笔试，然后 3 点 10 分左右，我们就开始正式笔试了，笔试是分不同的方向的，下面我们就来看看 UC 的笔试题(题目只能凭记忆复原，不保证准确)

 1. `a` 变量是一个数组，如果数组长度为 0，则增加一个值为 1，否则则按先进先出的原则去掉一个值(代码越简短越高分)

    个人感觉考察了三目运算符，和数组的方法

    ```javascript
    a.length === 0 ? a.push(1) : a.unshift();
    ```

 2. 写出下列代码的结果

    ```javascript
    var func = (function (a) {
      this.a = a;
      return function (a) {
        return a + this.a
      }
    }(function (a, b) {
      return a;
    }(1, 4)));

    console.log(func(4));
    ```

    这道题考察了 `this` 和 IIFE 

    我们先来看看最低下的这个匿名函数，`(function (a, b) { return a; }(1, 4))` 这个返回 1 没有问题，那么就相当于最顶的那个匿名函数传入了 1，然后把 1 赋给了 `this.a`，`this` 指向的是 `window`，所以这时 `window` 已经多了一个属性 `a` 且值为 1，这时 `func` 就是一个函数为 `function (a) { return a + this.a; }`。当我们再执行 `func(4)` 的时候，就相当于 4 + 1，答案就等于 5 啦

 3. 一个 `<ul></ul>` 里插入 10 行 `<li>第 1 行</li>` ~ `<li>第 10 行</li>`，考虑性能

    这道题考的应该是 `Fragment`，我当时也知道，使用 `Fragment` 可以避免逐个添加列表项，导致浏览器反复渲染，可以使用一个文档片段来保存它们，最后再一次性添加到文档中

    但是我却忘记了创建 `Fragment` 的方法，`document.createElement('fragment')` 看着不像，所以后来放弃了它，选择了 `innerHTML`，先来看看我的原来的答案

    ```javascript
    var ul = document.createElement('ul'),
        innerHTML = '',
        i;

    for (i = 1; i++; i<=10) {
      innerHTML += '<li>第' + i + '行</li>';
    }

    ul.innerHTML = innerHTML;
    document.body.appendChild(ul);
    ```

    > 一般来说，在插入大量新 HTML 标记的时，使用 `innerHTML` 属性与通过多次 DOM 操作先创建节点再指定它们之间的关系相比，效率要高得多。这是因为在设置 `innerHTML` 或 `outerHTML` 时，就会创建一个 HTML 解析器。这个解析器是在浏览器级别的代码(通过是 C++ 编写的)基础上运行的，因此比执行 JavaScript 快得多。不可避免地，创建和销毁 HTML 解析器也会带来性能的损失，所以最好能够设置 `innerHTML` 或 `outerHTML`
    > 的次数控制在合理的范围内

    这句话是 JavaScript 高级程序设计的引用，但其实通过 [jsperf](https://jsperf.com/) 的 [测试](http://jsperf.com/document-fragment-vs-innerhtml-vs-looped-appendchild)，循环 `appndChild` 都比 `innerHTML` 快

    所以正确答案还是应该使用 `Fragment`，因为不断地使用 `appendChild` 会使 [页面不断地重新计算，重新布局和重绘](http://stackoverflow.com/questions/11623299/what-does-recalculate-layout-paint-mean-in-chrome-developer-tool-timeline-record)。所以下面的可能才是正确答案

    ```javascript
    var ul = document.createElement('ul'),
        fragment = document.createDocumentFragment(),
        i;

    for (i = 1; i++; i<=10) {
      var li = document.createElement('li');
      li.innerText = '第' + i + '行';
      fragment.appendChild(li);
    }

    ul.appendChild(fragment);
    document.body.appendChild(ul);
    ```

 4. 生成一个长度为 100 的数组 `array`，值为其下标

    考察数组方法，但不仅仅是 `map`

    先来看看我写在试卷上的答案

    ```javascript
    var arrObj = new Array(100);
    var array = arrObj.map(function (arr, i) {
      return i;
    });
    ```

    我一开始认为，`new Array(100)` 会产生一个长度为 100，值都为 `undefined` 的数组，但其实不然，它只是一个 `length` 为 100 的 **空数组**，**数组**，**组**...

    没错，它还考察了 `join` 和 `split`，可能还有一点 ES6

    ```javascript
    var array = new Array(101).join(0).split('').map(function (arr, i) {
      return i;
    });

    // or ES6 `Array.fill()`
    var array = new Array(100).fill(0).map((arr, i) => i);
    ```

    这里要注意的是，我们使用 `join` 方法的时候，要新建一个长度为 101 的数组，因为 `join` 是填在数组元素中间的，101 的元素中间才有 100 的空隙，然后再用空字符串来 `split` 它们

 5. 把 `array` 乱序排列

    这道题考察的就是 `sort` 方法，如果返回负数，则第一个参数在第二个参数前，返回正数，则第一个参数在第二个参数后，相等返回 0。我在试卷上的答案是，只要让返回值随机等于 -1 0 1 就可以了

    ```javascript
    array.sort(function () {
      return Math.floor(Math.random() * 3 - 1);
    });
    ```

    当然还有其他的方法，我们展宇大大想到的方法是，`Math.random()` 返回 [0, 1)，所以 0.5 的两边概率相等

    ```javascript
    array.sort(function () {
      return Math.random() > 0.5 ? 1 : -1;
    });
    ```

 6. 用优雅的方式求出 `array` 的前十个数的和

    `reduce`!

    ```javascript
    var sum = array.slice(0, 10).reduce(function (pre, cur) {
      return pre + cur;
    });
    ```

    累了吗？来点主观题？

 7. 你了解 JavaScript 中的继承吗？请列举一些，并说出你推荐哪种

    我列举了一些 [类式继承](https://github.com/jasonliao/prepare-for-interview/blob/master/JavaScript/classical-inheritance.md) 和 [原型继承](https://github.com/jasonliao/prepare-for-interview/blob/master/JavaScript/prototypal-inheritance.md)，然后我更推荐原型继承

    > Q: When is classical inheritance an appropriate choice?

    > A: NEVER

    *In JavaScript, prototypal inheritance is simpler & more flexible than classical inheritance. - [10 Interview Questions
    Every JavaScript Developer Should Know](https://medium.com/javascript-scene/10-interview-questions-every-javascript-developer-should-know-6fa6bdf5ad95#.5fffcdr5u)*

 8. 网页上线之前，根据雅虎军规，要做哪些优化

    [Best Practices for Speeding Up Your Web Site](https://developer.yahoo.com/performance/rules.html)

 9. 怎么进一步地对上面的优化进行自动化

    我母鸡呀，然后我就写了 Webpack，Gulp bala balala 小魔仙

10. 写正则，匹配 http://\*.9game.cn/\*

    [Online Regexp Tester](https://regex101.com/#javascript) have fun :)

11. 如果上面的正则很重要，要考虑性能，要考虑安全，要考虑对全局的影响，那要怎么做

    我环系母鸡呀，我就说要不断地优化，把它独立存放，修改方便之类的

12. 你平时怎么定位错误，使用什么开发工具

    [Chrome Developer Tools](https://l-movingon.github.io/posts/2016-03-18-chrome-developer-tools.html) 一直扯

13. 如果你本地测试完全没有问题，但是一上线就出现问题，怎么处理

    线上 debug 呀，本地不要只做单元测试呀，我在讲什么呀

14. 回调会导致 callback hell，要怎么处理，用一句话概括

    [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，简单清晰且 ES6 支持

## Summary

嗯嗯，大概就是这么多，大概就是这么个意思，大概就是这么个顺序

总结下来之后，深刻地认识到，把小红书读透很重要(不是买东西那个！)，大家也可以把题的答案写在评论里，我们一起讨论一下呀

如有错误，欢迎指正 :)
