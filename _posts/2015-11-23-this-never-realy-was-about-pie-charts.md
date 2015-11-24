---
layout: post
category: css
title: This never really was about pie charts
date: 2015-11-23
summary: 看完 Lea Verou 在 CSSConf 上的分享后内容的总结和感想
---

看了 [Lea Verou](https://github.com/LeaVerou/) 在 [CSSConf 2015](https://2015.cssconf.com/) 上面的演讲 [The Miss Slice](https://www.youtube.com/watch?v=s4HdeJctq-A) 后觉得很兴奋，又一次感受到了 CSS 的强大之处

而 Lea 的著作 [CSS Secrets](http://shop.oreilly.com/product/0636920031123.do) 这本书真的值得一看，它会让你觉得自己好像从来都没有学过 CSS 一样

# Can we make pie charts with CSS?

首先我们可以 `border` 属性来做一个占 25% 的 Pie Chart，用的是类似我们做三角形的方法，依靠宽宽的 `border`，再把特定的边的色设置成透明，先来看看我们的 HTML

```html
<div class="pie"></div>
```

```css
.pie {
    width: 0;
    border: 5em solid gold;
    border-radius: 50%;
    border-right-color: transparent;
    background: #f06;
    transform: rotate(-45deg);
}
```

这样就可以非常简单的做出一个占 25% 的 Pie Chart，但是问题来了，如果我们需要不同的百分比呢

我们很容易想到的就是一个 Pie，然后我们再用另一个元素去遮挡，从而达到我们的目的，但为了没有多余的元素，我们可以使用伪元素 `::before` 或 `::after`

```css
.pie {
    width: 10em;
    height: 10em;
    background: #f06;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
}

.pie::before {
    content: "";
    position: absolute;
    bottom: 50%;
    left: 50%;
    padding: 50%;
    background: gold;
    transform: scaleX(-1)
               rotate(-90deg)
               skewX(0deg);
    transform-origin: left bottom;
}
```

`transform` 里的 `scaleX(-1)` 和 `rotate(-90deg)` 仅仅是为了当我们调节 `skewX` 的值的时候，这个 Pie Chart 的增长方向是顺时针的从 12 点的方向开始

而 `transform-origin: left bottom;` 则是让我们的伪元素，其实也就是一个矩形，在变形的时候，可以以左下角为中心变形，也就是 Pie 的圆心


当我们不断的增加 `skewX` 的值的时候，我们的伪元素，其实也就是一个矩形，会被拉伸为一个平行四边形，也正因为这样，我们 Pie Chart 的占比就可以增大缩小，但尽量可以调节占比，但还是有以下几个问题

1. 当占比越来越大，矩形的高小于半径的时候，就会挡不住半圆，解决方法就是增大矩形的大小 `padding: 5000%`
2. 当占比为 50% 的时候，矩形刚好拉伸到一条线，就是没有了遮挡，解决方法就是如果这个 Pie Chart 占比是 50%，就去掉 `bottom: 50%`
3. 大于 50% 的时候，就要互换两个元素的顏色，还要把 `scale(-1)` 去掉
4. `skewX` 的值是多少才是我们想要的占比呢，需要计算

靠矩形拉伸来遮挡有很多的问题，那我们如果用一个半圆来遮挡，是不是就可以解决上面的第一个问题了，而且让我们的 Pie 本来就是 50% 占比的，这样当我们的半圆转到另一边的时候，就刚好是 50%，也就可以解决上述的第二个问题了

```css
.pie {
	width: 10em;
	height: 10em;
	border-radius: 50%;
	background: linear-gradient(to right,#f06 50%, gold 50%);
	position: relative;
}

.pie::before {
	content: "";
	background: #f06;
	width: 50%;
	height: 100%;
	position: absolute;
	border-radius: 0 100% 100% 0 / 50%;
	margin-left: 50%;
	transform: rotate(0.1turn);
	transform-origin: left;
}
```

用这个方法，就可以不仅解决了上面 1 和 2 的问题，还解决了 4 的问题，`0.1ture` 就是 10％，`0.4turn` 就是 40%，直接明了，不需要计算，那么怎么解决大于 50% 的问题呢，也没有上面的方法那么麻烦，我们只要把伪元素的顔色改一下就可以了

但是有没有当大于 50%，不需要改色的方法呢，元素的遮挡可能不能实现了，那关于图形的操作，我们还有什么呢，没错，可以试试 SVG，我们先用 SVG 画一个圆

```html
<svg viewBox="0 0 64 64" class="pie">
    <circle cx="50%" cy="50%" r="25%"></circle>
</svg>
```

然后我们为我们的圆加上描边，`stroke-width` 为 32 是因为我们的 SVG 的一半，而 `stroke-dasharray` 就是你要虚线的样式，空隙设置到 100 其实就是这个圆的周长，我们就是要不断增加第一个参数，使得这个黄色的区域越来越大，以实现不断增大的占比

然后把填充色去掉 `fill: none`，再在 `.pie` 中设置底色

```css
.pie {
	background: #f06;
	border-radius: 50%;
	transform: rotate(-90deg);
}

.pie circle {
	stroke: gold;
	stroke-width: 32;
	stroke-dasharray: 1 100;
	fill: none;
}
```

这样当我们设置 `stroke-dasharray` 的第一个值的时候，就可以直观的得到相应值占比的 Pie Chart

这应该是目前最好的一个解决方案，但是还没完，在 CSS 的第四个阶段和草案中会有 [conic-gradients](http://www.w3.org/TR/css4-images/#conic-gradients)，那这个环形渐变可以怎么做我们的 Pie Chart 呢

但是因为没有一个浏览器可以实现，但 Lea 却自己实现了一个并开源了给我们玩玩，[CSS conic-gradient() polyfill](http://leaverou.github.io/conic-gradient/)

那我们要怎么实现我们的 Pie Chart 呢

```css
background: conic-gradient(gold 0 40%, #f06 0);
border-radius: 50%
```

这就是 40% 占比的 Pie Chart，两行代码，只要改一处地方就可以改变占比，so cool!

# This never really was about pie charts

其实不仅仅是 Pie Charts，我们写 CSS 的时候，不仅仅要实现就可以了，还要想出多几种方法，对比其中的好与不好

> Good solution needs three things

> **1. Flexibility**
> **2. Extensibility**
> **3. Maintainability**

与此同时，我们还要对新技术，新趋势保持热情，主动学习才能学到更多

共勉 :)

# Read more

- [SVG Element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle)
- [stroke-dasharray](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray)
- [LeaVerou/conic-gradient](https://github.com/LeaVerou/conic-gradient)
- [CSS Secrets](http://www.salttiger.com/css-secrets/)