---
layout: post
category: HTML
title: "(译)What's the DOM"
date: 2015-04-10
summary: DOM是什么
---

[https://css-tricks.com/dom/](https://css-tricks.com/dom/)

![what-is-the-dom-1]({{ site.url }}assets/images/what-is-the-dom/what-is-the-dom-1.jpg)

但 HTML 里的东西被浏览器解析后，就变成了 DOM

![what-is-the-dom-2]({{ site.url }}assets/images/what-is-the-dom/what-is-the-dom-2.jpg)

查看源代码只是给你看那些构成那个页面的 HTML，大概就是你写的那个 HTML

它的代码看起来可能不一样，举个例子，你用后台语言写一个模板但不经常看已经编译出来后的 HTML , 或者会在你写完 HTML 之后真正上线变成网页的时候，会有一个构建的过程，可能会导致 HTML 的压缩或者改变

查看源代码事实上会有点怪异，真正会去看这些代码的人其实只有开发者和一些主流的浏览器中的开发者工具，这时它可能具有一定的实用性

![what-is-the-dom-3]({{ site.url }}assets/images/what-is-the-dom/what-is-the-dom-3.jpg)

当你看着那些开发者工具面板的时候，他们给你显示的那些像 HTML 的东西，其实就是 DOM 的可视化表示。我们终于找到了!!!

![what-is-the-dom-4]({{ site.url }}assets/images/what-is-the-dom/what-is-the-dom-4.jpg)

嗯，是的。它的确是直接从你的 HTML 那里来。在大多数简单的情况下，DOM 的可视化表示会和你简单的 HTML 长得很像

但这往往是不一样的

# 什么时候 DOM 和 HTML 不同

这里有一种可能性，你的 HTML 存在着一点错误，然后浏览器帮你修复了他们。例如你有一个`<table>`标签在你的 HTML 里，但却漏了`<tbody>`这个标签，浏览器就会帮你插入`<tbody>`，在 DOM 里就会有它，这样你就可以用 JavaScript 找到他和用 CSS 来给他赋予样式，即使`<tbody>`不在你的 HTML 里

但是最有可能的一种情况是...

# JavaScript 会修改 DOM

想像你有一个空的元素在 HTML 里，像下面那样

```html
<div id="container"></div>
```

在 HTML 下面，有这样的一段 JavaScript

```html
<script>
  var container = document.getElementById('container');
  container.innerHTML = 'New Content';
</script>
```

即使你不会 JavaScript，你也可以根据语意猜出是什么意思，在屏幕上你会看到 New Content，因为你空的 div 被填充了一点东西

如果你用开发者开具可看 DOM 的可视化表示，你会看到

```html
<div id="container">New Content</div>
```

这就与你原始的html或查看源代码时的内容不一样了

# Ajax and 模版

我们不要在这里走到极端，但我肯定你可以想象如果你用 Ajax 去把页面的内容去除然后再重新放一点东西进去，那 DOM 一定会与你原始的 HTML 非常的不一样。从其他源加载回来的数据和使用客户端模板也是同样的道理

去 Gmail 查看一下源代码，你会发现它只是一些 script 标签和一些原始页面加载的数据。 几乎不可以辨认出这就是你屏幕里的这个页面

# JavaScript vs. the DOM

JavaScript 是被浏览器读取和靠他来操作一些东西的一种语言，但 DOM 就是这些东西，事实上很多你所认为的一些 JavaScript 的东西都是一些 DOM API

举个例子，我们可以写 JavaScript 来监听一个元素的`mouseenter`事件，但是这个元素事实上就是一个 DOM 节点，我们通过 DOM 属性来添加监听在 DOM 节点上，当这个事件触发，这个 DOM 节点就会去执行这个事件

![what-is-the-dom-5]({{ site.url }}assets/images/what-is-the-dom/what-is-the-dom-5.jpg)

可能我会说错一些什么，但我希望你可以得到我所说的重点，DOM 是最重要的东西，在浏览器里所有东西都是 DOM ，JavaScript只是一种语法，一种语言，他完全可以在没有 DOM API，浏览器之外使用(Node.js)

# 这个文章对我来说不够深入耶

好吧，像" DOM 是什么呢？就是 Document Object Model "等等等等这种类型的文章， 我不想写(也没有资格写),但下面这些应该可以满足你

- W3C: [What is the Document Object Model](http://www.w3.org/TR/DOM-Level-2-Core/introduction.html)
- MDN: [What is the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- Wikipedia: [Document Object Model](https://en.wikipedia.org/wiki/Document_Object_Model)
