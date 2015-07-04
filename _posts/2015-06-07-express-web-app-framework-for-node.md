---
layout: post
category: node,expree
title: Express - Web Application Framework for Node.js
date: 2015-06-07
summary: Getting started with Express!!!
---

# Installation

```
npm install express
```

# Usage

```javascript
var express = require('express');

var app = express();

app.listen(3000, function (req, res) {
  console.log('Server started on port 3000');
});
```

# Configuration

我们可以用`app.get()`和`app.set()`来查看或者修改我们的设置。

常见的设置有

- views 这个是用来设置我们放页面的文件路径
- view engine 这个用来设置我们渲染页面的引擎

# Routing

我们根据我们请求的方法，进行相应的处理

- app.get()
- app.post()
- app.del()
- app.put()

他接收一个请求的路径还有一个回调函数

```javascript
app.get('/', function (req, res) {
  res.send('Hello, Express');
});
```

# Requests

`request`有下面有好多好多方法，具体看[API](http://expressjs.com/4x/api.html#req)。

但是我想介绍几个经常用到的

## req.params

这个可以获取在URL里的参数 一般是这种形式 /user/:id 我们就可以用`req.params.id`来拿到我们的id

## req.query

这个则是返回GET请求后所有参数的一个对象 一般是这种形式 `/login?username=xxx&password=yyy`

那我们就可以用`req.query.username`来拿到xxx `req.query.password`来拿到 `yyy`

## req.body

这个则是拿到整个提交的所有键值对，但默认是 undefined，我们需要用到`body-parser`这个 middleware

如果你还要上传文件的话，就要在form里加入 `multipart/form-data` 这时候你就还要有`multer`这个 middleware

```javascript
var bodyParser = require('body-parser');
var multer = require('multer'); //如果你要上传文件

app.use(bodyParser());
app.use(multer());  //同上
```

## req.cookies

`req.cookies`可以访问到我们的请求的 cookies 的对象，但同样的，在4.x要`cookie-parser`这个 middleware

# Responses

`response`也和`request`一样，是一个具有多方法的对象，我们来看这几个重要的

## res.render

这个方法就是可以渲染我们的想要的页面，还可以给我们渲染的页面传入属性

## res.redirect

这个方法就可以让我们回到我们想要的路径下，也是经常使用的

# View Engines

常见的有 jade 和 ejs

```
npm install jade
```

# Using middleware

我们可以直接使用`app.use()`就可以使用 middleware

什么是 middleware, 其实就是一个 function with three arguments (req, res, next)

就是这个 next 可以让我们的程序顺利的进行下去，我们也可以试着去写我们的 middleware

```javascript
module.exports = function (req, res, next) {
  console.log('This is my middleware');
  next();
};
```

# Serve static files

如果我们想用我们的 javascript 或者 css 的时候，就要 serve static files

```javascript
app.use(express.static(path.join(__dirname, '/public');
```

## Handle errors

Error handlers 是一个有4个参数的函数，当next(err)这样调用的时候，所有的middleware都会停止，除了Error handlers

```javascript
app.use(function (err, req, res, next) {
  res.render('error', {
    message: err.message,
    error: err
  });
});
```

## Structure large applicationa

当我们的程序越来越壮大的时候，我们会遇到很多的冲突，例如我们想在请求`'/'`的时候做什么，请求`'/login'`的时候做什么，请求`'/photo'`的时候又做什么

我们可能会这样写

```javascript
app.get('/', fucntion (req, res) {
  // do something
});
app.get('/login', fucntion (req, res) {
  // do something
});
app.get('/photo', fucntion (req, res) {
  // do something
});
```

这时我们就可以用Router把在同一页面下的工作放在一起，例如我们在`'/user'`下可能有`login` 和 `sign up`

我们就可以新建一个文件夹 router 新建一个文件 user.js

```javascript
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  //do something
});
router.get('/login', function (req, res) {
  //do something
});
router.get('/signup', function (req, res) {
  //do something
});

module.expores = router;
```

那么我们在 app.js 中就可以这样

```javascript
var user = require('./router/user');

app.use('/user', user);
```

这样就说明在`'/user'`这个路径下 有`'/user'`,`'/user/login'`,`'/user/signup'`这几个响应，就不用每个路径都写完整了

## Summary

hope can help :)
