---
layout: post
category: translation
title: (译)Why We Still Need Web-safe Fonts
date: 2015-01-14
summary: 为什么我们还需要网页安全字体
---

[http://sixrevisions.com/web-standards/why-we-still-need-web-safe-fonts/](http://sixrevisions.com/web-standards/why-we-still-need-web-safe-fonts/)

在网页发展的初期，是没有一种标准的字体可以完全的实现跨平台。但是会有一些常用的字体像 Arial，Helvetica 和 New Roman 会被安装在大多数的个人电脑中，这些流行的系统字体就被称为网页安全字体。我们要在网页设计的实例中坚持使用它们。

但是现在发生了一些改变，使用网络字体才是安全的。网络字体是一种通过@font-face去加载显示远程字体的一种技术，这给我们带来创造性的自由和更加广泛的字体选择。

@font-face 规则已经存在了近13年之久，最早在 IE5.5 中出现并提供支持。

@font-face 也正式地被包含在W3C的CSS最新版本(CSS3)，很多现代的浏览器 (Chrome Safari IE FireFox) 都提供支持。

通过一些像 Google Fonts API 这样的服务，实现网络字体是非常简单的，例如使用 Google Font 只要两行CSS代码就可以在大多数的浏览器里显示一种相对陌生的字体(像Bigelow Rules)。

```css
@import url(http://fonts.googleapis.com/css?family=Bigelow+Rules);
body { font-family: 'Bigelow Rules'; }
```

![why-we-still-need-web-safe-fonts-1]({{ site.url }}assets/images/why-we-still-need-web-safe-fonts/why-we-still-need-web-safe-fonts-1.jpg)

尽管 @font-face 可以有接近完美的支持和表现，但是作为一个好的网页，我们仍然需要使用CSS字体集，不仅如此，我们的CSS字体集还需要包括网页安全字体和通用字型像 sans-serif 和 serif

例如，即使我们在使用 Google's web font 服务里最流行的字体 (Open Sans)，我们仍然需要使用包含网页安全字体的 CSS 字体集，在字体集的最后一个是一个通用字型 (sans-serif)

```css
body {font-family: "Open Sans", "Arial", "Helvetica", sans-serif; }
```

在Chroem里 向后渲染字体的顺序如下

![why-we-still-need-web-safe-fonts-2]({{ site.url }}assets/images/why-we-still-need-web-safe-fonts/why-we-still-need-web-safe-fonts-2.jpg)

像上面所说的，用一个好的字体集可以避免当我们的所选的字体不可以加载的时候，让我们的 HTML 文本有一个优雅的向后过渡

# 为什么我们仍然需要网页安全字体集(Why We Still Need a Web-safe Font Stack)

网页安全字体和 CSS 字体集在网页实际运用中好像很过时，尤其是在 @font-face 有很好的支持的之后，现在接近 90% 的用户在使用支持 @font-face 的浏览器，但如果你曾经想过丢弃你的 CSS 字体集，下面的几个原因可能会改变你的想法。

## 不完善的字体(Incomplete Fonts)

如果某种字体中的某个字符不可用，浏览器会尝试去以你字体集里的下一种字体去显示那些字符，但如果你没有字体集，那么浏览器则会用它默认的字体。

例如 Libre Baskerville 字体没有 ™ 这个字符

下面的第一个例子是没有写 CSS 字体集的，而第二个则有 Time New Roman 和 serif 在CSS字体集中。

![why-we-still-need-web-safe-fonts-3]({{ site.url }}assets/images/why-we-still-need-web-safe-fonts/why-we-still-need-web-safe-fonts-3.jpg)

至少如果有了这个字体集， ™ 字符显示得更像 Libre Baskerville 字体

## 网络问题(Netword Issues)

通过 @font-face 加载远程字体需要网络连接，如果负责字体服务的网络不可用或者暂时的维护，浏览器会使用他的默认字体，除非你在你的CSS字体集里添加了网页安全字体。

在 Chrome 里，浏览器的默认字体是 Times New Roman

例如，这个网页设计用的是 PT Sans 字体

![why-we-still-need-web-safe-fonts-4]({{ site.url }}assets/images/why-we-still-need-web-safe-fonts/why-we-still-need-web-safe-fonts-4.jpg)

如果你没有字体集的同时网络中断，然后网页就会变成这个(Chrome)

![why-we-still-need-web-safe-fonts-5]({{ site.url }}assets/images/why-we-still-need-web-safe-fonts/why-we-still-need-web-safe-fonts-5.jpg)

网页看起来完全不一样是因为 Time New Roman 大大影响了这个设计的观感效果

但如果我们用了包括网页安全字体的字体集，我们可以减缓这个网络带来的问题

```css
font-family: "PT Sans", "Helvetica", "Arial", sans-serif;
```

![why-we-still-need-web-safe-fonts-6]({{ site.url }}assets/images/why-we-still-need-web-safe-fonts/why-we-still-need-web-safe-fonts-6.jpg)

## @font-face 可以在客户端关闭(@font-face Can Be Turned Off Client-Side)

一些浏览器可以提供选项禁止下载字体文件。

大多数情况下，禁止浏览器使用远程字体会导致混乱，但是却是有可能的。

为什么有人想要去禁止使用远程字体，没错，就是为了加快网页的加载速度，特别是对那些网速慢的用户尤其有效。

为了证明网页字体对对网页性能的影响 我们用一种叫 Lobster Two 的字体加载以下网页(测试过程没有翻译)，平均加载时间为1.3秒， 这意味着我们打开这个网页，要1.3秒后才可以看到文字，因为 Chrome 的默认行为是当字体在加载时不显示任何文本。

使用宽带从 Google 服务器上下载字体文件要平均1.3秒，想一想如果在更不理想的环境下会加载多长时间，例如用手机网络或者和共享网络。

不使用网络字体，完成加载同样的网页平均需要0.012秒，这意味着字体的影响加载时间达到 10733%，为了在不是非常重要的网页内容中显示一种新奇的字体，这无疑是一个巨大的代价，这就是为什么有一些用户禁止使用远程加载字体文件。

在用户选择禁止加载远程字体文件的情况下，如果我们想要尽量减少对我们网页设计的影响，我们就应该在字体集中使用网页安全字体。

## 网页安全字体 = 便宜的，简单地实现优雅的性能下降(Web-safe Fonts = Cheap and Easy Graceful Degradation)

虽然很少，但还是有一些浏览器不支持 @font-face 。特别是一些旧的浏览器，前面我也有提过 90% 的用户在用支持 @font-face 的浏览器，没有包括网页安全字体和通用字型的字体集意味着我们将丢失了那至少 10% 的用户。

写一个简单的包括网页安全字体的字体集需要的时间和精力都是非常少的，所以我们没有理由不继续这样做。
