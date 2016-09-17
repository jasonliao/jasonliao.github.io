---
layout: post
category: node
title: "Hi, I'm totally new to Node.js"
date: 2015-05-03
summary: 开始接触Node.js!!
---

看完了《node.js入门》这本书，然后远成介绍看《node.js in action》，现在看到了第六章。

书在第二章的时候介绍了怎么写一个 chatroom ，里面也有完整的代码，这里就不再说了，你也可以来 [这里](https://github.com/jasonliao/Everything-I-Learn/tree/master/nodejs/node-js-in-action/chatrooms) 跑一下，看一下

下面介绍一下我是怎么学习 node.js 的

# For getting started, book is good, but API is the best

在看《node.js in action》的时候，他在第二章的时候就给我们展示了一个较为复杂的实例，所以会有很多的代码我们都不知道是什么意思，虽然在书的后面会一个一个的给我们解释。但是在代码的第一行就不懂的时候，你还怎么可以淡定下去~  **所以最好的方法就是不懂就查API**

在`js`的第一行我们会经常看到`var http = require('http');`、`var fs = require('fs');`，为什么我们可以加载这些模块，加载了这些模块之后又有什么用，我们要怎么用，这些问题都可以通过 API 解决。

我们来看看 [node.js 的 API 文档](https://nodejs.org/api/)

- 我们可以知道我们经常使用的`http.createServer(function(req, res) {}).listen(8000);`其实是创建一个服务器，当别人请求这个端口的时候，就会触发`request`事件
- 我们也可以知道`fs`就是我们的`File System`，他可以对我们的文件进行一系列的操作
- 我们也可以知道`events`可以用来监听和执行我们的事件
- 我们也可以知道`net`也像`http`那样有一个`createServer`的方法，但是不同的是，`net`是监听别人的`connection`事件
- ...

所以说 **API在手，问题都赶走**

# A simple dos chatroom demo

**自己动手做，印象才够深**

如果一开始觉得上面那个 chatroom 太高端，我们可以自己写一个简单的，只要完成最简单的对话功能就可以了

我们可以描述一下整个过程，多个dos连接到服务器，然后在任意一个dos里输入东西，其他dos都会显示输入的内容，想想我们用到了哪些模块

- dos连接到服务器，所以我们可以用`net.createServer`来监听dos的`connection`事件
- 当dos输入内容的时候，其他的dos会响应，去执行一些事件，我们可以用`events`来做

所以我们建好了一个`a-simple-dos-chatroom.js`文件，在里面加上下面两行代码

```javascript
var net = require('net');
var events = require('events');
```

先用`net`创建一个服务器，然后监听一个端口号，这里我用3000

```javascript
net.createServer(function(client) {
  //client 是连接到这个端口的 socket 的一个实例
  //为每个实例一个id 后面会用到
  var id  = client.remoteAddress + ':' + client.remotePort;
}).listen(3000);
```

当多个dos连接到同一个服务器的时候一起聊天时，我们可以认为他们处于同一个频道下，而这个频道就要来监听每个dos的操作，还要对每个dos进行显示

通过API，我们可以知道要用`events`来监听和执行事件，要创建`events.EventEmitter`这个类的实例，所以我们来创建这个实例`channel`

```javascript
var channel = new events.EventEmitter
```

然后我们为这个`channel`实例定义一个 `clients` 的对象，是用来装载登录后的用户

```javascript
channel.clients = {};
```

`net.createServer`会监听用户的`connection`事件，当他们连接后，我们就会执行`join`这个事件，所以在此之前，我们可以先定义，或者叫先监听这个`join`这个方法

```javascript
channel.on('join', function(id, client){
  this.clients[id] = client;
  this.clients[id].write('welcome to dos chatroom');
});
```

然后我们再在`net.createServer`里执行这个`join`方法

```javascript
channel.emit('join', id, client);
```

现在已经就差最后一步了，就是当我们在自己dos里输入东西的时候，其他的dos也会输出相同的东西，那有什么办法可以监听我们每个client有没有输入东西呢， **查API**

我们找到了`data`这个事件，那好，我们有`client`去监听他，监听到`data`改变后，我们执行`broadcast`方法

```JavaScript
client.on('data', function(data) {
    channel.emit('broadcast', id, data);
});
```

然后我们再定义`broadcast`这个方法

```javascript
channel.on('broadcast', function(id, data) {
  for(var index in this.clients) {
    this.clients[index].write(data);
  }
});
```

这时我们会发现一个问题，就是在输入的那个dos里面，会重复我们输入的东西，因为`broadcast`里对每个`client`都写出了数据，所以我们可以做一个判断

```javascript
channel.on('broadcast', function(id, data) {
  for(var index in this.clients) {
    if(index != id) {
      this.clients[index].write(data);
    }
  }
});
```

到这里，就完成了我们的功能了 :-m

# 一些周边

- [Cygwin](https://cygwin.com/) 这是一个可以在window上使用Linux命令行的东西，而且他安装插件也非常的方便，你只要有他的安装包，就可以双击他，里面会有很多很多的插件，包括你包装了还有没安装的，你可以安装新的，也可以删除不用的

- [cURL](http://zh.wikipedia.org/wiki/CURL) 他是一个利用url语法在命令行下工作的文件传输工具，因为他支持的通讯协议很多，当然包括了http，所以我用他来模拟网页请求，这样就可以省去写页面的时间了。当然啦，远成上次介绍的 [postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm) 我觉得更加强大

- [telnet](http://zh.wikipedia.org/wiki/Telnet) 他可以连接到目的地的服务器，然后在本机输入命令，就可以让远程机子运行，我接触到他是用来模拟net请求，就像刚刚那个 dos-chatroom 一样

- [foru17/front-end-collect](https://github.com/foru17/front-end-collect) 这里有很多关于前端的资讯来源，包括中英文的周刊，博客，活跃的微博，一些社区，一些书等等等等

# Summary

感觉 node 真的好神奇，可以用 JavaScript 去做到以前做不到的东西，原来我也可以用 SQL 语句去对 Mysql 进行 RUAD ~ 原谅我的大惊小怪，还有谢谢远成介绍的书
