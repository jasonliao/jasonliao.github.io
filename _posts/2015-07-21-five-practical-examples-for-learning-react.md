---
layout: post
category: react
title: 5 Practical Examples For Learning The React Framework
date: 2015-07-21
summary: some note when I rewrite that 5 simple react examples with ES6
---

[click here!](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/)

I rewrite all the demos with ES6, some note here, [source code here](https://github.com/jasonliao/5-practical-examples-for-learning-react)

If you wanna run the app, you need [npm](http://npmjs.org/) and also [webpack](http://webpack.github.io/). Enter which one you like and

```bash
npm install && webpack
```

then hit the `index.html`

Help yourself and have fun! :)

# Timer

React apps are components. Each component has state(an object with data) and each is in charge of their own rendering - the `render` method is called whenever the state change. Here is an example for building a simple timer.

## getInitialState

This is called before our `render` function. The object that is returned is assigned to `this.state`, we can use it via `this.state.xxx`.

```javascript
getInitialState () {
  return {
    xxx: xxx,
    yyy: yyy
  };
}
```

but if you use ES6 `class`, there is no `getInitialState` method anymore, we can add it as a property in `constructor`.

```javascript
export defalut class Timer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      elapsed: 0
    }
  }
}
```

## No Autobinding

[no-autobinding](https://facebook.github.io/react/docs/reusable-components.html#no-autobinding)

every time you call your method, you should use `.bind(this)`.

```javascript
componentDidMount () {
  this.timer = setInterval(this.tick.bind(this), 50);
}
tick () {
  this.setState({
    elapsed: new Date() - this.props.start
  });
}
```

## Autobinding

[autobinding](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding)

you can prebind methods in your `constructor`.

```javascript
constructor (props) {
  super(props);
  this.tick = this.tick.bind(this);
}
```

also you can use the arrow function

```javascript
tick = () => {
  // ...
}
```

## componentDidMount

`componentDidMount` is called by react when the component has been rendered on the page. 

> Actuall, if you are using ES6, the code block of `componentDidMount` method can be put inside the `constructor` and you don't need `componentDidMount` any more.

One difference between the `constructor` and `componentDidMount` is that the `constructor` get called during server rendering too. If the `interval` gets set on the server, possible many times, then the server will become very busy.

## componentWillUnmount

This method is called immediately before the component is removed form the page and destroyed.

# Navigation menu

Let's see how we can handle click event in React by building a navigation menu.

# Real-time search

[check this out](https://facebook.github.io/react/docs/forms.html)

```html
<input type="text" value={this.state.value} onChange={this.handleChange.bind(this)} placeholder="Type here">
```

Why set value as `this.state.value`

- you can udate your value when you key presses
- you can set your default value

```javascript
constructor (props) {
  super(props);
  this.state = {
    value: "your default value"
  };
}
```

- you can control your component respond

```javascript
handleChange (e) {
  this.setState({
    value: e.target.value.substr(0, 140)
  });
}
```

# Order form

The real power of React comes when you combine multiple components.

[How to communicate betweeen components](http://facebook.github.io/react/tips/communicate-between-components.html)

# Image App with Ajax

This example will demonstrate how you can combine react with jQuery. and how to load results via Ajax

use this `this.favoriteClick.bind(this)(id)` if you no autobinding your method
