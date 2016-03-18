---
layout: post
category: devtools
title: You Really Know Chrome Developer Tools
date: 2016-03-18
summary: 跟着 Code School 学会如何使用开发者工具
---

[Code School](https://www.codeschool.com/) 的 [Discover Devtools](https://www.codeschool.com/courses/discover-devtools) 这个教程教会我们怎么使用我们的 Developer Tools，下面是教程的一些总结，但只有经常运用到开发中，才会发现个中奥妙

# Elements

## DOM Manipulation

这个面板的左边是 DOM，里面有页面的元素，当我们点击某个元素的时候，我们就可以在右边看到对应的元素样式，同时我们还可以右击这一个元素，选择行为如 `:hover` `:active` `:focus` `:visited`，也可以对元素进行内容的更改，属性的增添，位置的调整等等，并且可以在网页上即时地看到效果

## Updating Styles

可以看到这个面板的右边就有很多很多的样式，他们可能来自不同的文件，来自同一文件的不同地方。当你点击一个元素的时候，所有关于这个元素的样式都会列在上面

同样的，右边的样式部分我们也同样可以在线编辑并立刻看到效果，也同样可以对样式进行增删查改，更有趣的是，chrome developr tools 对顔色的选取和动画效果的支持非常好，你也可以去玩玩喔

# Sources

## Editing in the Source Tab

我们可以在 Source 这个面板里编辑我们的 JavaScript 文件或者 CSS 文件，除此之外，我们可以看到我们修改过的历史，也可以另存为这个文件，以达到覆盖原文件的效果

# Console

## Working with the Console

我们可以直接在 `console` 里选择出页面里存在的元素，同样，我们可以在 JavaScript 代码中使用 `console.log` 来 debug，当然啦，我们不仅仅可以使用 `console.log`，`console` 是一个对象，里面有很多很多的方法，[Console API](https://developers.google.com/chrome-developer-tools/docs/console-api) 里会有详细的介绍

## Examining Exceptions

如果在 Console 里看到一个错误，我们可以点击该错误所在的行数，这时就会自动跳到 Sources 面板里并打开这个文件定位到这个错误的地方

## Element Selector Shortcuts

正如上面说的，我们可以在 Console 选择到我们的元素，如 `document.querySelector()`，但是还有一种更加方便的方法就是使用 `$`

**但这并不是使用了 jQuery，这只是 Chrome Develper Tools 给我们 `document.querySelector` 的一个快捷方式，但是当你的这个页面如果有加载 jQuery，那么这个 `$` 就会是 jQuery 里 `$` 的功能**

如果我们想知道我们找的这个元素在 DOM 中的哪里，我们可以使用 `inspect()`，这时就会把我们找到的元素高亮在 Elements 面板中

除此之外，CDT 还会记住我们在 Elements 中高亮过的元素，而且我们可以在 Console 中使用 `$0` `$1` 这样选择我们点亮过的元素，数字越小，代表越近选中的元素

# Dubugger

## Debugging JavaScript & Pause on Ecceptions

当我们 Console 出现错误的时候，我们可以点击错误的行数跳到错误的地方，但更有效的方法是我们可以暂停这个错误，在这个错误发生之前停止，这样就可以从变量中知道哪里出了错

在 Sources 面板的最右侧，就是我们 debug 的地方，上面有一排按钮，最右边那个就是暂停错误的错误的按钮，我们点击它，重新刷新页面的时候，就会在错误之前暂停

当我们找到错误来源的时候，就可以在那里设置断点，只需要在行号点击一下就可以了，当代码运行到断点的时候，就会停下来，这时那一排按钮的前几个也会被激活，第一个是跳到下一个断点，第二个是进行下一行，第三个是进入该行的函数中，而第四个则是可以往上跳到调用他的函数中去

## Local Storage

在 Resources 这个面板里，有 Local Storage，Session Storage 和 Cookies 等等的资源都可以看到

# Network

## The Network Tab

在 Network 这个面板里可以看到每个资源加载的请求，请求方法，状态，类型，大小，时间等等。在面板的最底下可以看到一共加载的数量和时间

我们还可以按住 `shift` 键去点击刷新按钮，这样所有的请求都会重新发送，重新获取

在 Timeline 中，可以看到请求到响应的时间和真正下载执行的时间，我们还可以看到两条线，一条是 `DOMContentLoaded` 的线，而另一条，就是 `load` 的线

当点击某个请求的时候，就可以看到这请求更加具体的信息，包括请求头和响应头，还有返回的内容等等

## Network Performance

[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) 会给我们的网站提建议，以提高性能

[Closure Compiler Service](https://closure-compiler.appspot.com/home) 则可以合并且压缩我们的 JavaScript 代码。但现在可能很少用这个了

## Removing Unneeded Requests

修复或者去掉返回 404 的请求

## Serving Correctly Sized Images

不要加载比使用大的图片，这样不仅仅浪费加载时间，还需要浏览器去缩放你的图片，这也会对性能有所影响

# Profiles

## Rendering Performance 

Timeline 面板可以让我们知道页面加载或者操作时带来的一些性能问题，例如 JavaScript 的计算和执行时间，页面的排版渲染时间等等，可以从中看到可以优化的项

## CPU Profiling

而 Profiles 面板就可以收集 JavaScript 中一些影响性能的代码，例如不断地循环和动画效果等等，只要点击 `Collect JavaScript CPU Profile` 和 `Start`，然后操作，再点 `Stop` 就可以了

# Memory

## Memory Profiling

在 Timeline 中，还可以看到我们操作的时候，内存的变化

## Pinpointing Leaks

如果想看看哪里有内存泄漏，也可以在 Profiles 面板中点击 `Take Heap Snapshot` 和下面的 `Take Snapshot` 按钮，然后进行操作，然后重复上面的操作，就可以对两个 `Snapshot` 进行对比了

# Summary

很多功能都是一句话带过，因为没有真正的场景可以测试，所以也不知道真正使用的情况。所以还是建议大家亲自到 Code School 里学习一下，每一小节结束都会有一个测试，寓教于乐。Enjoy it!
