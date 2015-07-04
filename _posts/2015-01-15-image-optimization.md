---
layout: post
category: performance
title: 图片优化(Pixel-fitting，压缩)
date: 2015-01-15
summary: Pixel-fitting的简单教学及图片压缩方法
---

昨晚看了一篇关于图片优化的文章 里面提到了一个熟悉的东西 Pixel-fitting

[http://sixrevisions.com/web-development/advanced-image-optimization/](http://sixrevisions.com/web-development/advanced-image-optimization/)

还有关于 Pixel-fitting 的一篇 [http://dcurt.is/pixel-fitting](http://dcurt.is/pixel-fitting)

然后上网查了一下，关于这方面的教程好像不多，所以就自己弄了一个文字版的，有点粗糙，如果哪个步骤不清楚或者不对都可以提出。

首先 Pixel-fitting 是针对图标的，一些简单的曲直线勾勒出来的东西，这个教程的例子就用我之前自己为自己弄的一个图标。

在Ai里打开图标并选中，如果你想对非矢量图标进行操作，就要在Ai里先用钢笔工具勾选，这个方法网上Ai教程也有，我就不多说了。

![image-optimization-1]({{ site.url }}assets/images/image-optimization/image-optimization-1.jpg)

Ctrl + C 复制到 Ps 中粘贴到一个文件上，为了对比，我粘贴了两个同样大小的。注：粘贴进来的时候一定要选择形状图层

![image-optimization-2]({{ site.url }}assets/images/image-optimization/image-optimization-2.jpg)

![image-optimization-3]({{ site.url }}assets/images/image-optimization/image-optimization-3.jpg)

然后就正式开始啦，选中你想要修改的图层，我选中的是右边那个，然后使用 `直接选择工具`

![image-optimization-4]({{ site.url }}assets/images/image-optimization/image-optimization-4.jpg)

放大右边的图层，你会看到图标模糊的原因，选中最上面的两个锚点 (注: 被选中的锚点为实心黑)

![image-optimization-5]({{ site.url }}assets/images/image-optimization/image-optimization-5.jpg)

选中之后，简单的使用方向键，上上下下按几下之后，你就全部都懂了，调整后

![image-optimization-6]({{ site.url }}assets/images/image-optimization/image-optimization-6.jpg)

把所有的直边调整好之后，再对比一下

![image-optimization-7]({{ site.url }}assets/images/image-optimization/image-optimization-7.png)

你会发现右边看起来锐利很多，而且更加的清晰

图片优化当然不仅仅提高质量 在大小上也有提高

我最常用的两个图片压缩

- [Smush](http://smushit.eperf.vip.ac4.yahoo.com/ysmush.it/)
- [TinyPNG](https://tinypng.com/)

Smush很强大，尽管很小很小的图片(png) 都总能挤出可以压缩的部分，而且压缩出来之后，即使放到最大看，也和原图几乎一样(其实我是看不出有什么不同 只是不敢用"完全一样"的字眼而已)

TinyPNG 的压缩力更强大，只是有时候压缩出来的放得很大之后，就会与原图有区别(边缘问题)

所以建议都通过他们处理之后，再对比衡量一下，选择你心仪的那一个

当然如果你有更好的工具，也可以分享出来~

PS: Smush 处理之后下载下来是一个解压包，解压就可以得到你的文件，如果你上传的时候文件名为中文，解压得到的文件可能是乱码。改一个后缀名就可以啦

Hope can help :)
