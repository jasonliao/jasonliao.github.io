---
layout: post
category: react, node, react-router
title: Universal React
date: 2015-12-30
summary: 学习怎样构建一个简单的应用通过 React, React-Routet, Express 和 ejs
---

[Universal React](https://24ways.org/2015/universal-react/) in [24 WAYS](https://24ways.org/) by [Jack Franklin](https://github.com/jackfranklin) 这篇文章教我们如何搭建一个简单的应用通过 React, React-Router, Express 和 ejs

下面是我在学的过程中遇到的一些问题和总结，还有一点点的改写，完整的代码在原文也有，我改写过后的就在 [这里](https://github.com/jasonliao/react-and-node-are-perfect-gifts/tree/master/universal-react)

# .babelrc

如果你使用的是 Babel6，那么就要用一个固定的文件 `.babelrc` 来配置用哪个 Babel 插件来预编译我们的 ES6 代码。所以在这个例子里面，我们的要用到的两个插件就是 `es2015` 和 `react`

```javascript
// .babelrc
{
  "presets": ["es2015", "react"]
}
```

```bash
npm install --save-dev babel-cli babel-preset-es2015 babel-preset-react
```

# routes

我们要定义一个 routes，这个 routes 是用在服务器端，我们在服务器端结合 React-Router 处理第一次在地址栏的请求。

```javascript
const routes = {
  path: '',
  component: AppComponent,
  childRoutes: [{
    path: '/',
    component: IndexComponent
  }, {
    path: '/about',
    component: AboutComponent
  }]  
};
```

整个 App 的 Component 应该使用 `path: ''`，意思就是不管什么请求都会渲染这个总的 Component，他是一个 Container。而下面是的 `childRoutes` 就是用来定义不同的请求，渲染不同的子 Component

# *renderToString*,  *match* and *RoutingContext*

`renderToString` 这个方法可以把我们的组件转成 HTML String，这样就可以从服务器端渲染我们的 React 组件到 HTML 上

`match` 这个方法就像它的名字一样，用来配对我们的 routes 和 URL

`RoutingContext` 是 React-Router 提供的一个组件，可以把我们所有的组件包裹在一起，还提供一些功能让我们的 App 和 React-Router 绑在一起

```javascript
app.get('*', (req, res) => {
  match({ routes, location: req.url }, (err, redirectLocation, props) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (props) {
      const markup = renderToString(<RoutingContext {...props} />);
      res.render('index', { markup });
    } else {
      res.sendStatus(404);
    }
  });
});
```

# Components

原文的例子用的是类组件，但当组件是 Presentational Component 的时候，我们在 react-0.14 里可以直接使用函数式组件

```javascript
// index.js
import React from 'react';

const IndexComponent = () => (
  <p>This is the index page</p>
);

export default IndexComponent;
```

```javascript
// about.js
import React from 'react';

const AboutComponent = () => (
  <p>A little bit about me</p>
);

export default AboutComponent;
```

`app.js` 会有一点点的特殊，因为我们刚刚在 routes 里定义了子组件，所以不同的请求，`AppComponent` 里会传入不同的子组件，这会存在 `AppComponent` 的 `props.children` 里，而因为函数式组件没有 `this`，那就不可以通过 `this.props.children` 得到，好在 `prop` 可以通过函数式组件的第一个参数传入

同时，我们使用 React-Router 提供的 `Link` 组件，来处理我们的地址跳转

```javascript
import React from 'react';
import { Link } from 'react-router';

const AppComponent = (props) => (
  <div>
    <h2>Welcome to my App</h2>
    <ul>
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/about'>About</Link></li>
    </ul>
    { props.children }
  </div>
);

export default AppComponent;
```

# Client-Side Randering

像刚刚上面说到的，我们第一次地址请求的时候，才会去请求服务器端，但当我们的再次在页面中跳转的时候，我们可以使用 Ract-Router 和 React 的长处，把页面更改却不用再请求服务器，这不仅减少服务器的负担，而且页面也会渲染得更快

我们第一步是写一个 `client-side.js` 文件，用来处理在页面中的跳转

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';

import { routes } from './routes';

import createBrowserHistory from 'history/lib/createBrowserHistory';

ReactDOM.render(
  <Router routes={routes} history={createBrowserHistory()} />,
  document.getElementById('root')
);
```

`createBrowserHistory` 他可以令我们的 URLs 更简洁，没有其他类似 `localhost:3000/#!/about` 这样的 `#!` 符号出现，让 URLs 在客户器端和服务器端都保持一致

因为我们的用的是 ES6，所以要用 webpack 来转，为此我们要装两个包，还要写个 `webpack.config.js` 来配置一下

```bash
npm install -save-dev webpack babel-loader
```

```javascript
// webpack.config.js

module.exports = {
  entry: './client-render.js',
  output: {
    path: './public/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel'
    }]
  }
};
```

因为我们刚刚已经在 `server.js` 里 serve 了 public 这个文件夹，所以可以直接在 `index.ejs` 里引用 `bundle.js`

```html
<div id="root"><%- markup %></div>
<script src="bundle.js"></script>
```
