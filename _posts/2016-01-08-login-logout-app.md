---
layout: post
category: react, node
title: Login-Logout App
date: 2016-01-08
summary: 用 React, Redux, React-Router, Express 构建的小应用
---

[Universal React](https://24ways.org/2015/universal-react/) 这篇 Post 让我们知道了怎么在服务器端渲染我们的组件，还让我们知道了怎么在除了第一次请求之外，用 react-router 来在客户端处理路由的跳转，减少请求，不仅可以减少等待时间，还可以减轻服务器端的负担，带来更好的用户体验

我上两篇的 [Post](https://l-movingon.github.io/posts/2015-12-30-universal-react.html) 对整个过程和实现做了一些总结和笔记，但是却想把 redux 也结合起来，然后就想到了这个 [Login-Logout App](https://github.com/jasonliao/react-and-node-are-perfect-gifts/tree/master/login-logout-app)，现在就让我们来看看在实现这个 App 的时候，遇到的问题和对 universal react 更深刻的一点理解

# How to Use 

如果你想玩玩这个 [Login-Logout App](https://github.com/jasonliao/react-and-node-are-perfect-gifts/tree/master/login-logout-app)，可以这样

```bash
$ git clone git@github.com:jasonliao/react-and-node-are-perfect-gifts.git
$ cd login-logout-app & npm install

$ webpack & npm start
```

**Hit [localhost:3000](http://localhost:3000)**

# Project Structure

加入了 redux 之后，项目的结构会发生一些变化，首先我一般会把客户端的代码放在 app 文件夹里面，里面再细分为 actions，components，contants，containers，reducers，store 文件夹用来装对应的东西

client.js 是用于客户端的渲染，配合同文件夹下的 routes.js 一起工作

```javascript
// routes.js
import App from './containers/App';
import Index from './containers/Index';
import Login from './containers/Login';

const routes = {
  path: '',
  component: App,
  childRoutes: [{
    path: '/',
    component: Index
  }, {
    path: '/login',
    component: Login
  }]
};
```

想重点说的是，我们会有 containers 和 components 两个不同的文件夹来装组件，我觉得最好的区分就是如果路由里用到的组件就放在 containers 里，这些组件负责 mapState 和 mapDispatch，然后传给下面的 components 用

App 这个 containers 里的组件是负责包含其他路由的组件，不管哪个路径它都会出现

```javascript
// App.js
import React from 'react';

const App = ({ children }) => (
  <div>
    <h1>Welcome to my login-logout app</h1>
    { children }
  </div>
);
```

与 app 文件夹并列的是 server 文件夹，server 文件夹里会有 server.js 用于在服务器端渲染我们的 react 组件，因为这个小应用不涉及到后台的请求和与数据库的连接，所以暂时只有这个文件，但当应用越来越大的时候，里面还会 config，contorller，model 等等文件夹来分别装配置文件，action，和对象模型

如果你看了 Universal React 的 demo 的 server.js 可能会有一点点不一样，因为项目结构的不一样，所以先要作一点点配置的修改

```javascript
// server.js

app.use(express.static(__dirname + '/../public'));
app.set('views', __dirname + '/../views');
```

# *mapStateToProps* and *mapDispatchToProps*

当你某个组件想用 state 和 actions 的时候，你就要用 `connect` 方法，再加上 `mapStateToProps` 和 `mapDispatchToProps` 这两个函数来重新返回一个组件

在这个应用中，我的 state 只是一个字符串，有人登录了，字符串就为登录人的姓名，否则为空，那么一开始我写我的 `mapStateToProps` 的时候是这样写的

```javascript
const mapStateToProps = (state) => {
  return {
    username: state
  };
};
```

但是却在一直报错，但服务器端一开始渲染的时候，就渲染到了这个组件，而服务器端的报错和这个错误完全没关，后来我把这个 `mapStateToProps` 放到 Login 组件上，在客户端跳转的时候，终于在 bundle 上看到了问题的真正原因。

state 已经变成了一个对象，对象有一个属性叫 `user`，这时才想起是 `combineReducers` 惹的祸

```javascript
// reducers/index.js

const rootReducer = combineReducers({
  user
});
```

`combineReducers` 会帮我们不同的 reducers 合成一个对象 `{ user: '' }`，属性值就是你这个子 reducer 的名字，这样的好处在于，一个应用可以由不同的人写不同的 reducer，不同的组件也可以只关注 state 里的一部分，而不需要关注整一个大的 state

所有换成这样就可以了

```javascript
const mapStateToProps = (state) => {
  return {
    username: state.user
  };
};
```

而 `mapDispatchToProps` 在有 redux 之后，就不需要再写了，因为有 `bindActionCreators`，这个方法可以把我们的 actions 与 dispatch 绑定，我们不用再手动触发 `dispatch` 方法，只要执行 actions 就可以，而 `connect` 方法默认会把 store 传入，所以

```javascript
// containers/Login.js

const Login = ({ dispatch }) => {
  const actions = bindActionCreators(userAction, dispatch);
  
  return <LoginForm onLoginSubmit={actions.onLoginSubmit} />;
};

export default connect()(Login);
```

# *connect* 

> First, we need to import Provider from react-redux, which we installed earlier, and **wrap the root component in `<Provider>`** before rendering.

> Then, we **wrap the components we want to connect to Redux with the `connect()` function from react-redux**.

一开始，我想在 Index 组件里 mapState，但是却报错提示我把组件包在 `<Provider>` 里，我已经用 `<Provider>` 包住啦，不信你看我 client.js

```javascript
// client.js

ReactDOM.render(
  <Provider store={store}>
    <Router history={createBrowserHistory()} >
      { routes }
    </Router>
  </Provider>,
  document.getElementById('root');
);
```

然后我在 Login 里面 mapState，却发现可以了！

我没有写错！没有写错！有写错！写错！错！

直到我发现了上面的文档，原来在 Index 不可以，在 Login 可以是因为在服务器端一开始渲染的就是 App 和 Index 组件，还没有通过客户端的渲染，所以 client.js 里写了 `<Provider>` 根本不起作用，而跳转到 Login 是客户端的渲染，所以就行啦

那就是说，我在服务器端加上 `<Provider>` 就可以了，在 Universal React 里 server.js 的 `markup` 是这样的

```javascript
const markup = renderToString(
  <RoutingContext  { ...props } />
);
```

添加 `<Provider>`

```javascript
const markup = renderToString(
  <Provider store={ configureStore() } >
    <RoutingContext  { ...props } />
  </Provider>
);
```

Everything just perfect!

# < Link >

在构建这个 App 前，我就有点问题搞不懂。表单数据的提交要如何处理，如果提交到 Node 后台处理可以用 `res.redirect()` 跳转，但是这样却无法修改到我们的 state。所以一定要在按钮绑定事件，在客户端用请求的方式提交数据到后台，那要在哪里处理这些逻辑和返回的数据呢，不能在 reducers 里因为那些是纯函数，还有就是怎么跳转呢

个人认为 app 文件夹里应该还有一个文件夹是用来处理逻辑和验证的，然后在 actions creator 里面调用，再返回一个 action 对象

react-router 还提供了一个 `<Link>` 组件给我们使用，所以我们可以在 `<Link>` 里用 `to=''` 来控制跳转，和 `onClick={}` 来执行我们的 actions，例如我们的 LoginForm 组件

```javascript
const LoginForm = ({ onLoginSubmit }) => {
  let usernameInput, passwordInput;
  
  return (
    <div>
      <label>username: </label>
      <input type="text" ref={ node => usernameInput = node } /><br />
      <label>password: </label>
      <input type="password" ref={ node => passwordInput = node } /><br />
      <Link to="/" onClick={ () => {
        onLoginSubmit(usernameInput, passwordInput);
      } }>Login</Link>{' '}
      <Link to="/">Return</Link>
    </div>
  );
};
```

# How to Connect with DB

下个 App 告诉你 :)
