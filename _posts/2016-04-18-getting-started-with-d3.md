---
layout: post
category: d3
title: Getting Started with D3
date: 2016-04-18
summary: D3.js 入门学习
---

[D3.js](https://d3js.org/) 是一个用来做数据展示的库，可以用它来封装一些成一些基础的数据展示组件，也可以从中学习到 SVG 的知识。现在我们就来学习 D3 吧！

## Baisc Methods

- `select()` 选择一个区域，进行我们的工作
- `append()` 为这个区域添加一个标签
- `text` 为这个标签添加文本内容
- `attr()` 为添加的标签添加属性

```javascript
d3.select('body')
  .append('p')
  .text('Hello, D3')
  .attr('style', 'color: #abcdef');
```

## Working with SVG

但 D3 并不是用来做这些东西的， D3 主要用于数据的展示，而且是基于 SVG 的。那现在我们来看看它真正的魅力。首先，我们创建一个 `<svg>` 

```javascript
var canvas = d3.select('body')
               .append('svg')
               .attr('width', 500)
               .attr('height', 500);
```

在 [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Element) 上我们可以找到很多在 SVG 上使用的元素，例如常见的 `<circle>`，`<rect>`，`<line>` 等等。那我们现在就先做个简单的例子，在 `<svg>` 里画一个矩形

```javascript
canvas.append('rect')
      .attr('width', 400)
      .attr('height', 200);
      .attr('fill', '#abcdef')
```

这时你应该就可以看到一个天空蓝的矩形出现在我们的页面中啦

## Binding with Dataset

好的，我们继续往前走，刚刚说到 D3 是用来做数据展示的，那肯定要有数据呀。而数据一般都是动态获取的。那么 D3 是怎么绑定我们从后台获取回来的数据呢

我们先从一个简单的柱状图开始

```javascript
// bars

var dataset = [10, 20, 30]; // our data

var bars = canvas.selectAll('rect')
                 .data(dataset)
                 .enter()
                 .append('rect')
                 .attr('width', function (d) { return d; })
                 .attr('height', 50)
                 .attr('y', function (d, i) { return i * 55; });
```

这里出现了三个新的方法。

- `selectAll()` 选择所有的指定标签
- `data()` 传入要处理的数据
- `enter()` 返回与数据相对应的点位符

可能有些人很困惑，一开始 `canvas` 里都没有 `rect`，为什么就可以 `selectAll('rect')` 呢？的确，这里是有点奇怪。但其实这里关键的是 `enter()` 函数，它会根据数据的个数返回占位符，每个占位符都会执行 `append()` 和 `attr` 等下面的操作，`d` 就是每个数据的值，`i` 就是数据的下标，类似 `map()` 一样

而当我们想更新数据的时候，这些 `rect` 就已经存在了，所以 `selectAll('rect')` 并不一定是空的。下面讲到 `enter()`，`update()` 和 `exit()` 的区别的时候，你就会明白了

但不管怎么说，我们的确做出了一个很丑的柱状图 :)

## Scale Our Data

你看这个柱状图又粗又短不能忍，那就加长一点吧，每个乘 10！

```javascript
.attr('width', function (d) { return d * 10; })
```

棒棒不够多？加多两条！

```javascript
var dataset = [10, 20, 30, 50, 60]; // our data
```

咦？为什么最后两条棒棒一样长。对啦，我们的 `canvas` 才设置了 `500`，怎么可以装下 600 的棒棒呢？所以我们就要求我们的棒棒都会等比例伸缩

D3 给我们提供了很多类型的比例尺。具体当然还是看 [文档](https://github.com/mbostock/d3/wiki/API-Reference#d3scale-scales) 啦

我就举个最简单的线性比例，在我们刚刚的代码基础上，添加一个 `widthScale` 的变量

```javascript
var widthScale = d3.scale.linear()
                   .domain([0, 60])
                   .range([0, 500]);
```

这几行代码的意思就是，我要使用线性比例，数据在 0 ～ 60 之间，范围在 0 ~ 500 之间。最后，还让所有的 `rect` 都使用这个规则

```javascript
.attr('width', function (d) { return widthScale(d); })
```

当然啦，我们棒棒的宽度，高度，甚至填充色都可以 Scale，快来试试吧

## Add Group and Axis

SVG 里提供了一个 `<g>` 标签给我们分组，现在要为柱状图添加轴了，所以为了区别轴和棒棒本身，我们分别用不同的 `<g>` 包住它们，首先，在 `canvas` 变量后面加多一行

```javascript
.append('g');
```

然后现在就定义轴，定义轴非常简单，因为 D3 都帮我们封装好了

```javascript
var axis = d3.svg.axis()
             .scale(widthScale);
```

这样就定义好了，然后我们就在 `canvas` 里把它加进去

```javascript
canvas.append('g')
      .call(axis);
```

但是这个轴应该在底部才对呀，没关系，因为已经分组了，所以可以对组进行样式和位置的调整

```javascript
canvas.append('g')
      .attr('transform', 'translate(3, 300)')
      .call(axis);
```

这个柱状图真是越来越像样啦

## Enter & Update & Exit

刚刚前面提到的绑定数据的时候，我们使用了一个 `enter()` 的方法，返回的是数据的占位符。这种情况是指一开始我们的 DOM 元素小于 Dataset 元素的时候，但除此之外，我们还有两种情况，一种就是当我们的 DOM 元素大于 Dataset 元素的时候，另一种就是 DOM 元素等于 Dataset 元素的时候

这样我们就会涉及另外一个函数 `exit()`

怎么理解 `enter()` 和 `exit()` 呢，首先，先把你的代码都清空，我们要开始认真了

重新定义一个 `canvas` 和 `dataset`

```javascript
var dataset = [10];

var canvas = d3.select('body')
               .append('svg')
               .attr('width', 500)
               .attr('height', 500);
```

根据之前的学习，我们知道，如果 `canvas` 里没有我们选择的元素，就要使用 `enter()` 来返回占位符，再去每个占位符进行操作

```javascript
var circle = canvas.selectAll('circle')
                   .data(dataset)
                   .enter()
                   .append('circle')
                   .attr('cx', 25)
                   .attr('cy', 25)
                   .attr('r', 25)
                   .attr('fill', 'green');
```

这时就可以看到我们设置的一个绿色的圆，但是如果本来，就有一个圆的存在呢，我们在 `circle` 变量之前，首先手动插入一个红色的圆 `circle1  `，而且为了区别，我把它的位置调到了最底下

```javascript
var circle1 = canvas.append('circle')
                    .attr('cx', 25)
                    .attr('cy', 475)
                    .attr('r', 25)
                    .attr('fill', 'red');
```

这时候你再看页面，你的绿波波已经不见了，那是因为当你 `selectAll('circle')` 的时候，返回的是 1，`data(dataset)` 的时候与数据匹配发现数据也是 1，那么 `enter()` 的时候，就没有多余的占位符返回了，所以后面的代码都不起作用

现在就是 DOM 元素和数据元素相等的情况，那我是不是就没有办法对已经存在的 DOM 元素进行修改了呢，当然可以！在 `enter()` 之前，我们可以对所有选中的 DOM 元素进行更新(不严谨，下文说)

```javascript
var circle = canvas.selectAll('circle')
                   .data(dataset)
                   .attr('cy', 250) // 对已经存在的元素进行更新
                   .enter()
                   .append('circle')
                   .attr('cx', 25)
                   .attr('cy', 25)
                   .attr('r', 25)
                   .attr('fill', 'green');
```

看，你把红色波波放到垂直居中的地方去了，继续一路小跑，修改 `dataset` 

```javascript
var dataset = [10, 20];
```

又看到我们的绿色波波了是吗？现在我想你已经明白 `enter()` 的作用了

**`enter()` 的作用在于，把 `selectAll()` 选择到的 DOM 元素和 `data()` 里规定的数据个数进行比较，返回 (数据个数 - DOM 元素) 个占位符，并对每个占位符执行 `enter()` 之后的代码，而原来选择到的 DOM 元素要么保持原来的定义样式，要么可以在 `enter()` 前对它们进行更新**

我们讨论了数据个数大于等于 DOM 元素的情况，那小于呢？

```javascript
var dataset = [10];

var circle1 = canvas.append('circle')
                    .attr('cx', 25)
                    .attr('cy', 475)
                    .attr('r', 25)
                    .attr('fill', 'red');

var circle2 = canvas.append('circle')
                    .attr('cx', 25)
                    .attr('cy', 25)
                    .attr('r', 25)
                    .attr('fill', 'red');

var circle = canvas.selectAll('circle')
                   .data(dataset)
```

先把我们的代码变成这样，就可以到两个红波波一个在顶一个在底，我们可以发现，现在的情况是 DOM 元素多于数据个数的，那么现在我加多一行代码在 `circle` 里，猜猜会是什么效果

```javascript
var circle = canvas.selectAll('circle')
                   .data(dataset)
                   .attr('fill', 'green');
```

为什么只有一个绿球！

这也就是刚刚我说不严谨的地方，它并不是选择所有的 DOM 元素进行更新，事实上，它更新的 DOM 元素的个数，等于 DOM 元素和数据个数中的较小值。也就是说，当 DOM 元素小于数据个数(刚刚讨论的情况)，那么更新的就是所有 DOM 元素；当 DOM 元素大于数据个数(现在讨论的情况)，那么更新的就是前数据个数个 DOM 元素

那么剩下的元素怎么处理呢，对啦，多余的数据由 `enter()` 处理，多余的 DOM 元素就由 `exit()` 处理

```javascript
var circle = canvas.selectAll('circle')
                   .data(dataset)
                   .attr('fill', 'green')
                   .exit()
                   .attr('fill', 'blue');
```

最后用一张图来概括一下吧

![enter&exit](http://ww4.sinaimg.cn/large/7988751agw1f2yhis0q7vj21kw16tk4x.jpg)

我的入门学习就到这里啦，但是后面还会有更多更多的内容，我们会了解到 SVG 越来越多的标签，不仅仅局限于现在的柱状图。还有也会对他们设置样式和动画，我相信一定会越来越有趣的 :)
