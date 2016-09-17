---
layout: post
category: node
title: Some notes about 《Node.js in Action》
date: 2015-05-27
summary: 看《Node.js in Action》的一些笔记
---

《Node.js in Action》这本书在2013年出版，所以里面很多的代码在现在的环境跑起来都是跑不通的，下面我就会说说在我学习第八章Express的时候，遇到的那些坑

第八章一开始就以一个简单的应用 Photo 来教我们如何运用Express去渲染页面，去处理表单的上传，还有文件的下载

还有书中用的EJS，我都换成了jade

# Install the Express executable

```
npm install -g express
```

如果现在按这个装了之后，虽然是全局，但还是会 `command not found`，因为在4.x后，要这样

```
npm install -g express-generator
```

当你安装了Express之后，就可以执行

```
express --help
```

在4.x之后，Options会少了很多，但这里要说的是 --css <engine> 竟然没有sass，

[Here is the resources](http://stackoverflow.com/questions/23711897/get-sass-to-autocompile-with-nodejs-express-and-node-sass)

# Exploring the application

首先一个改变是开启一个应用已经不是

```
node app.js
```

而是

```
node ./bin/www
```

书中的`app.configure`已经被去掉了，可以直接使用`app.set()`

`express.bodyParser` 已经换成了`body-parser`

`express.cookieSession` 已经换成了`cookie-session`

`express.cookieParser` 已经换成了`cookie-parser`

...

换了好多好多，具体看这里 [Moving to Express 4](http://expressjs.com/guide/migrating-4.html)

网上说，学习 Node.js 要整天看文档，因为更新得很快 [strongloop/expresss](https://github.com/strongloop/express#quick-start)

[这里](https://github.com/jasonliao/Everything-I-Learn/tree/master/nodejs/node-js-in-action/express/photo)就是我用 Express 4.x 写的一个相当于书中的 Photo 的实例，如果你也被书坑了，你也想把 ejs 换成 jade，都可以看看 :)
