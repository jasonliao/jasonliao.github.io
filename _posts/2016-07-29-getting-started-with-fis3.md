---
layout: post
category: fis
title: Getting Started with FIS3
date: 2016-07-29
summary: FIS3 入门，了解 FIS3 的基础配置与 Webpack 的差异
---

[FIS3](http://fis.baidu.com/fis3/index.html) 是百度 FEX 开源的一个前端工程构建工具，用于解决前端开发中自动化工具、性能优化、模块化框架、开发规范、代码部署、开发流程等问题

在进一步了解 FIS3 之前，我们先来谈谈现在最火的“构建”工具 - Webpack，Webpack 最开始只是想做一个打包工具，把所有的依赖资源都加载到一起。可随着社区越来越大，各种 plugins 和 middleware 的不断出现，慢慢地，它已经不仅仅是一个 module bundler

但项目越来越大，需求越来越多的时候，我在使用 Webpack 的过程中发现了一些痛点

- loaders 依赖过多
- 配置过于复杂
- 对开发者不友好
- 对 MPA 不友好

## Loaders 依赖过多

```shell
npm i --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-0
```

我想这条语句很多开发 React 的同学并不陌生，我只是想用 Babel 编译我用 ES6 写的 React 代码而已呀！

Webpack 的 loader 往往依赖过多，当你完成开发之后，`package.json` 里的开发依赖已经很多了，你还敢叫别人 `npm install` 吗？还是乖乖的打包成 `node_modules.zip`，直接给别人解压吧

## 配置过于复杂

开发的时候免不了文件监听和 livereload，这时一般会采用 webpack-dev-server 做热部署，或者写一个简单的 server，use 一下 webpack-hot-middle。然后你就要区分不同的环境下要使用不同的配置，你可能会有 `webpack.config.js`、`webpack.dev.config.js`、`webpack.prod.config.js`，或者把配置分开，根据 `NODE_ENV` 再组装起来。

## 对开发者不友好

Webpack 配置复杂，所以常常新项目会用之前项目的 `webpack.config.js`，然后再根据新的需要添添改改，但你永远不敢删，你不知道为什么删了这里就突然不行了，你不知道为什么贴了 google 一个答案过来就跑通了，但是跑通就好了

> 哇，可以了 :D
>
> 为什么，加了啥 0.0
>
> 不知道 :)

## 对 MPA 不友好

Webpack 最理想是用在 SPA 上，一个入口，一个 `bundler.js` 打包所有资源。太大，各种 [optimization plgins](https://github.com/webpack/docs/wiki/optimization) 来一下。但是用在 MPA 上，尽管有多入口，尽管有 chunk，但他怎么都不可以把每个页面所仅仅需要的那些依赖加载进来，换句话说，在 MPA 上，Webpack 很难做到按需加载

说了这么多我在使用 Webpack 时的一些痛点，其实是想说明

**我也是 Webpack 党呀！**

那你还讲不讲 FIS3 →_→

## Getting Started with FIS3

下面讲的东西是围绕这个 [小仓库](https://github.com/jasonliao/getting-started-with-fis3) 的

我们先来看看 `fis-conf.js` 里一些关键的配置，FIS3 支持三种模块化开化的方案，官方推荐 CommonJS 的 ModJS，当然你也可以使用 AMD 的 RequireJS 和 CMD 的 SeaJS 等等。然后你要把所有的你定义的模块，都设置为 `isMod` 为 `true`，如果你还要需要 `node_modules` 里的模块，则还需要 fis3-hook-node_modues 插件。

```javascript
fis
  .match('/{node_modules, src}/**.js', {
    isMod: true
  })
  .unhook('components')
  .hook('node_modules')
  .hook('commonjs', {
    extList: ['.js']
  })
  .match('::package', {
    postpackager: fis.plugin('loader')
  })
```

这时，你需要三个依赖

```shell
$ npm i --save-dev fis3-hook-commonjs fis3-hook-node_modules fis3-postpackager-loader
```

然后你需要在页面里引入 `mod.js`，然后 `require` 这个页面需要的 `.js`

```html
<head> 
  <script src="../static/mod.js"></script> 
</head> 
<body> 
  <script>require('./index')</script> 
</body> 
```

FIS3 不管对 MPA 还是 SPA 都友好就是因为它并不以入口文件为先，而是以页面优先，这样他就可以加载到这个页面真正所需要的东西，完成按需加载

接着你就可以按照小仓库里的 README 步骤中跑起了小应用，`fis-conf.js` 里其他的配置也都非常易懂,但还是有几个点要说一下

## Plugins

相对于 Webpack 的 Loaders，FIS3 则是基于自己的 [Plugins](http://fis.baidu.com/fis3/plugins.html)，所以可以看到 `package.json` 里的开发依赖

```javascript
// package.json 
"devDependencies": { 
  "fis-parser-babel-5.x": "^1.4.0", 
  "fis3-hook-commonjs": "^0.1.25", 
  "fis3-hook-node_modules": "^2.2.7", 
  "fis3-parser-node-sass": "^0.1.9", 
  "fis3-postpackager-loader": "^2.0.5", 
  "fis3-preprocessor-js-require-css": "^0.1.0" 
} 
```

## FIS server & release

FIS 有一个内置的常驻 server，不手动关闭和重启是不会关闭的，当然你是可以替换它的。有了这个 server，就可以配置 FIS3 的 `release` 命令轻松的达到文件监听和浏览器刷新的功能，而不再需要其他配置

```shell
$ fis3 server start
$ fis3 release -wL # -w(watch) -L(live)
```

## FIS3 media

FIS3 里提供了 `media` 来管理我们不同的开发状态，就像我小仓库 `fis.media('prod')` 之后的配置，说的就是当发布产品的状态时，把所有的 `.js` 和 `.css` 都压缩且 Hash，这样有助于提升上线时的性能，当然图片也可以完成类似
的操作

```shell
$ fis3 release prod
```

FIS3 里的配置就像 CSS 一样，下面的配置会把上面的覆盖，所以你之前的配置也会
起效，只需要在 `media` 里对你又想重新处理的文件再次匹配配置即可。而且你根本
不用担心这些资源因为名字的改变而在上线之后会加载不到，FIS3 会把所有文件里
的资源链接都帮你改好，你只用关注开发时的路径就可以了，这就 **是资源定位能力**

## FIS3 compile & pack

FIS3 的构建过程包括单文件编译和所有文件的打包过程，而每个过程都有不同的阶段，可以看到下图

![workflow](https://raw.githubusercontent.com/fouber/fis-wiki-img/master/workflow.png)

因为整个构建过程的流程很清晰，所以你可以选择你需要的阶段对你需要的文件进行单独或统一配置，这里也就不存在黑魔法

## FIS3 pros and cons

通过对一个小项目的配置，我觉得 FIS3 有如下优点

- 配置清晰简单，依赖少
- 文件可以单独处理，资源自动同步
- 每个页面独立加载脚步，对 SPA 和 MPA 都友好
- 内置 server，一条命令解决文件监听和浏览器刷新
- 编译构建过程清晰，可对应配置，对开发者友好


当然还有一些 FIS3 的特性我没有了解到，例如 **内容嵌入**、**依赖声明**、**自定义插件**、**`roadmap.path`** 等等，这些对部署和性能优化也有很大的帮助，详情看 [Wiki](https://github.com/fex-team/fis/wiki/)

但是

**我也是 Webpack 党呀！**

FIS3 也不是没有缺点的

- 入门门槛高，[Demo](https://github.com/fex-team/fis3-demo) 基于功能，而非项目本身
- 使用的人不多，坑都没有被沉挖(不同的插件之间会有影响)
- 社区不活跃，解决问题不通畅

如果你也想玩 FIS3，有个小建议，**一切尽在 issues 中**

## Read More

- [FIS Wiki](https://github.com/fis-dev/fis/wiki)
- [FIS3 Docs](http://fis.baidu.com/fis3/docs/beginning/intro.html)
- [如何用 FIS3 来开发 React?](http://fex.baidu.com/blog/2016/04/develop-react-with-fis3/)

个人观点，如有错误，欢迎指正 :)
