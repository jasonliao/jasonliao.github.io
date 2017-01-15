---
layout: post
category: react
title: I Wish I Know When I Learning React
date: 2016-01-04
summary: React 的发展和学习 React 要了解的东西
---

> Glad you back @Drake

# React.Component or React.createClass

刚刚学习 React 的时候，有很多教程创建一个 React 组件的时候，都是使用 `React.createClass`，那是 ES6 还没有广泛使用的时候的语法，后来在 React v0.13 的时候，就可以使用 ES6 的 `class` 来创建 React 组件，也就是继承 `React.Component`。

```javascript
var Hello = React.createClass();
```

```javascript
class Hello extends React.Component {}
```

虽然如此，但现在还是有很多人喜欢用 `React.createClass`，因为这种方式创建的组件，可以使用 Mixins，而且里面的方法是自动绑定的( `this` 指向这个组件)

**但务必使用 ES6 语法**，不要问为什么，看完下面你就知道了。但首先我们还是要解决上面的两个问题

首先是 Autobinding 的问题，在 ES6 里同样有方法可以绑定我们的 `this`

- 我们在创建类之后，可以在构造器里对我们所有的函数做一个绑定

  ```javascript
  class Counter extends React.Component {
    constructor () {
      super();
      this.tick = this.tick.bind(this);
    }
    tick () {
      // ...
    }
    // ...
  }
  ```

- 也可以在我们调用函数的时候，进行绑定

  ```javascript
  class Counter extends React.Component {
    tick () {
      // ...
    }
    render () {
      return <button onClick={this.tick.bind(this)}>Click</button>
    }
  }
  ```
    
- 我们也可以使用 Arrow Functions 去实现

  ```javascript
  class Counter extends React.Component {
    tick = () => {
      // ...
    }
  }
  ```

其次是 Mixins，Mixins 只是让你把一些额外的功能集成到你的组件里，相反的，我们可以把功能写在另一个组件里，然后再把之前的组件传进来，组合之后 export 出去，我们把这种组件称之为 "Higher-Order Component"，具体的 demo 在下面的链接里有

而 Minixs 里大多都是 React 的生命周期函数，想要了解 [React LifeCycle](http://zhuanlan.zhihu.com/purerender/20312691) 可以通过 [pure render](http://zhuanlan.zhihu.com/purerender) 这个关于 React 的知乎专栏

## Further Reading

- [React.Component vs React.createClass](http://reactjsnews.com/composing-components/) - Naman Goel & Zach Silveira
- [Mixins Are Dead. Long Live Composition](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.ow2zaagk7) - Dan Abramov
- [React Mixins when using ES6 and React](http://egorsmirnov.me/2015/09/30/react-and-es6-part4.html) - Egor Smirnov

# Smart and Dumb Components

也就是 Container Components 和 Presentational Components。自从 v0.13 出来之后提出了 "Higher-Order Component"，慢慢的发现，我们的组件会分为两类

- Dumb Components
  - 不会依赖应用的 `action` 或者 `store`
  - 接收数据和回调通过 `props`
  - 几乎没有自己的 `state`
  - 可能会用到其他 Dumb Components
- Smart Components
  - 把一个或者多个 Smart or Dumb Components 包含起来
  - 用引用 `action` 或者 `store`，传到 Dumb Components 下面去
  - 几乎没有 DOM 节点，都是通过其他 Smart or Dumb Components 组合起来

所以后来在 React v0.14 更新的时候，不仅仅把 React 分成了 React 和 ReactDOM，而且还提出了 Stateless Functional Components，也就是类似上面的 Dumb Components，这种组件因为没有多余的部分，只负责渲染，所以我们直接可以使用新版本的语法

```javascript
const Aquarium = (props) => {
  const fish = getFish(props.species);
  return <Tank>{fist}</Tank>;
};

// 或者我们可以直接加上 ES6 的解构语法
const Aquarium ＝ ({ species }) => (
  <Tank>{ getFish(species) }</Tank>
);
```

使用 ES6 的语法，就可以让构建我们的组件变成合理，简单。当然啦，要结合 Webpack 把我们的小应用跑起来

## Further Reading

- [Smart and Dumb Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.28858ndoq) - Dan Abramov
- [React v0.14](http://facebook.github.io/react/blog/2015/10/07/react-v0.14.html) - Facebook React Blog

# Flux, Reflux and Redux

Flux 是配合 React 推出来的单向数据流架构，如果你想了解 Flux 具体是个什么东西，下面两篇 post 可能可以帮到你(卖了个广告)

- [Getting To Know Flux, the React.js Architecture](https://scotch.io/tutorials/getting-to-know-flux-the-react-js-architecture) - Ken Wheeler
- [Simple TODO with React and Flux](https://github.com/jasonliao/simple-todo-with-react-and/tree/master/flux) - Jason Liao

但我认为更应该使用 Redux 去管理你的数据流。

学习 Redux 当然可以去看作者的教学视频 [Getting Started with Redux](https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree?series=getting-started-with-redux)。你会从中了解到很多 Redux 的概念，像 **Single source of truth**，**State is read-only**，**Changes are made with pure functions**。还可以学到一些函数式编程的思想

当然你也可以去 [Egghead.io Redux Course Notes](https://github.com/tayiorbeii/egghead.io_redux_course_notes) 这个 repo 看里面的总结，如果你对英语有恐惧也可以看 [我的总结和笔记](https://jasonliao.me/posts/2015-12-28-getting-started-with-redux.html) (再卖个广告)

# Universal React

现在社区基本用的是 React + Redux + React-Router + Express，我们可以在服务器端渲染我们的 React 组件，也可以在客户器端靠 React-Router 来处理我们的跳转，Jack Franklin 的 [Universal React](https://24ways.org/2015/universal-react/) 是一个小 demo 教我们如何搭建我们的应用

但是我却在处理数据的时候，遇到了一些问题，用户处理一些与数据有关的操作的时候，我们不能把请求写在 reducers 里面，会导致 reducers 不纯，那是要写在 Middleware 里面吗？还有如果用异步到客户端，怎么在客户器端控制跳转等等，相信应用越大，遇到的问题就越多

最近也一直在找 Best Practice，如果了解掌握了再回来更新

Hope it helps :)
