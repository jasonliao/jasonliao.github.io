---
layout: post
category: css
title: A Look at Length Units in CSS
date: 2015-12-06
summary: 关于 CSS 长度单位的一些总结和使用场景
---

总结了几篇文章，先给外链

- [A Look at Length Units in CSS](http://www.sitepoint.com/look-at-length-units-in-css/)
- [CSS Font-Sizing: a Definitive Guide](http://www.sitepoint.com/css-font-sizing-tutorial/)
- [从网易与淘宝的font-size思考前端设计稿与工作流](http://www.cnblogs.com/lyzg/p/4877277.html)

CSS 内有至少 10 种的长度单位，每一个单位都有特定的目标使得我们的页面在越来越多的终端设备中可以有灵活的表现

现在我们来看看不同的单位在不同的情况下要怎么使用

# Absolute length units

绝对长度不会相对屏幕的大小或分辨率而改变，所以，绝对长度不适用于数字设备或者当分辨率未知的时候使用

- cm (1cm = 96px / 2.54)
- mm (1mm = 1 / 10th of 1cm)
- in (1in = 2.54cm = 96px)
- pc (1pc = 1 / 6th of 1in = 16px)
- pt (1pt = 1 / 72th of 1in)
- px (1px = 1 / 96th of 1in)

当我们使用相同的绝对长度的时候，在不同的设备上会有不同的大小，那是因为不同的设备有不同的 DPI(dots per inch)，高的分辨率有更高的 DPI，所以看起来图片和文字就会小一点

# Relative length units

相对长度不会有固定的长度，它们的大小会相对于之前或以后定义的值的大小，当你做响应式布局的时候，就要应该使用这种长度单位

- ex (x-height)
- ch (character)
- em (named after print ems, but not the same)
- rem (root em)

想到了解相对长度单位，一定要先了解我们的 `font-size` 属性

我们常常开发的时候，对待 `font-size` 都是暴力解决，不断调整数值以达到想要的效果，最后却发现，在不同设备上，还是会有不同的表现，因为我们常常对 `font-size` 使用的，都是 `px` 这样绝对的长度

`font-size` 除了有 **绝对长度单位** 和 **相对长度单位** 之外，还有 **绝对长度关键字** 和 **相对长度关键字**，虽然这都很少在开发中使用，详情可以看第二个外链

## ex and ch units

`ex` 在真正的开发中很少用到，`1ex` 的大小等于小写字母 `x` 的高度(当前的 `font-size`)，在大多数的情况下，`1ex` 差不多等于 `0.5em`

`ch` 也是类似，也是很少用，`1ch` 就等于 `0` 字符的长度

## em unit

`em` 的大小是相对于基础元素或都父亲元素的 `font-size`，举个例子，如果父元素的 `font-size` 为 `20px`，那么如果子元素使用 `1em`，那么子元素的大小就会计算成 `20px`

要注意的是，如果有很多个 `div` 嵌套，如果我们设置了 `div` 的 `font-size: 1.5em`，那么我们的字体就会越来越大，因为当前元素计算 `em` 是以第一个父元素计算大小的

## rem unit

这时 `rem` 就显得很方便了，因为它总是根据根元素的 `font-size` 来计算，在 HTML 里就是 `html` 节点，所以只要我们在 `html` 里设置了固定的 `font-size`，那就不怕出现上述 `em` 带来的问题

事实上很多公司都使用了`rem` 来做移动端的页面，这样页面在不同设备下就能保持一致的网页布局

但是问题来了，`rem` 是相对于 `html` 的 `font-size` 来计算，所以在不同的设备分辨率下，`font-size` 应该值不同，如果我们使用的是 `media` 设置媒体属性，也只能对某一个范围的分辨率使用同一个 `font-size` 的值，这样写不仅仅麻烦，而且 `rem` 有值也很难算

### 网易

网易的做法是通过 JavaScript 把 `font-size` 计算出来

1. 首先，根据设计稿的横向分辨率 / 100 得到 `body` 的 `rem` 值
2. `font-size` 的 `px` 值则由设置的宽度 `clientWidth` / `body` 的 `rem` 值得到
3. 根据设计图把所有 `px` 都 / 100 得到 `rem` 值

如果采用网易的做法，视口要如下设置

```html
<meta name="viewport" content="initial-scale=1,maximum-scale=1, minimum-scale=1">
```

### 淘宝

淘宝触屏版布局的前提就是 `viewport` 的 `scale` 根据 `devicePixelRatio` 动态设置

```javascript
var scale = 1 / devicePixelRatio;
document.querySelector('meta[name="viewport"]').setAttribute('content','initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
```

1. 首先，先设置 `font-size` 的 `px` 大小为 `deviceWidth` / 10
2. 元素的尺寸就为 设计稿标尺寸 / `font-size`

# Viewport-relative length units

- vh (viewport height)
- vw (viewport width)
- vmin (viewport minimum)
- vmax (viewport maximum)

## vh and vw

`vh` 是相对于视窗的的高度，`1vh` 等于 1 / 100th 视窗的高度，例如如果视窗的高度为 `400px`，那么 `1vh` 就等于 `4px`，`vw` 也是同样

## vmin and vmax

`vmin` 是相对于视窗宽度和高度更小的一边，`1vmin` 等于那一边的 1 / 100th，例子，如果视窗 500 x 700，那么 `1vmin` 就等于 `5px`，如果视窗 1000 x 700，那么 `1vmin` 就等于 `7px`，`vmax` 同理

# Conclusion

在浏览器方面，兼容性都比较好，具体可以看第一个外链，所以我们应该多多使用 `rem`, `vh` 的 `vw` 这些相对的长度单位，更灵活，更简单，更具有扩展性地实现我们的布局

# Read more

- [The New CSS3 Relative Font Sizing Units](http://www.sitepoint.com/new-css3-relative-font-size/)
- [The Power of em Units in CSS](http://www.sitepoint.com/power-em-units-css/)
- [Understanding and Using rem Units in CSS](http://www.sitepoint.com/understanding-and-using-rem-units-in-css/)