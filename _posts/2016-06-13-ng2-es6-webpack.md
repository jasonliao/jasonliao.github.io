---
layout: post
category: javascript, angular2
title: Building App with Angular2 & ES6
date: 2016-06-13
summary: 怎么用 ES6 和 Webpack 构建你的 Angular2 应用
---

关于 Angular2 的 TypeScript 教程有很多，但我喜欢 ES6，喜欢 Webpack。但这种开发模式的教程似乎比较少。但这篇就是！如果你也和我一样，那么这篇教程肯定适合你。这篇教程会从一个 Hello, Angular2 开始，配置好所需要的东西，再到一个简单的 Todo。Angular2 简单的语法不会过多的深入，官网的 [5 MIN QUICKSTART](https://angular.io/docs/js/latest/quickstart.html) 和 [DOCS](https://angular.io/docs/ts/latest/guide/) 是一个好地方

## Hello, Angular2

首先使用 `npm init -y` 快速生成一个 `package.json`，然后输入下面这条命令，安装好 `webpack` 和 `webpack-dev-server`，还有把 ES6 转成 ES5 的 `babel-loader`

```bash
$ npm i --save-dev webpack webpack-dev-server babel-core babel-loader babel-preset-es2015
```

然后简单的配置一个 `webpack.config.js`，主要是设置一下入口文件，loader，还有生成文件的位置等等，详细可以看 [Webpack Docs](https://webpack.github.io/docs/)

```javascript
// webpack.config.js
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './app.js' // 入口文件，记住记住
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel', 
      query: {
        presets: ['es2015']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules']
  },
  output: {
    path: '/',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
```

现在基本配置都已经好了，那么就来写 Hello, Angular2 吧

首先 `index.html` 非常简单，只需要输入一个自定义的标签，并引入我们待会生成的 `bundle.js` 即可

```html
<!-- index.html -->
<app></app>
<script src="bundle.js"></script>
```

还记得刚刚在 `webpack.config.js` 的入口文件吗？没错，就是 `app.js`。但在写之前，我们还要安装几个非开发的依赖包

```bash
$ npm i --save angular2 reflect-metadata rxjs zone.js
```

后面三个是 angular2 需要的依赖包，也要安装上

```javascript
// app.js
import 'zone.js';
import 'reflect-metadata';
import { Component } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';

class App {
  constructor () {}
};

App.annotations = [
  new Component({
    selector: 'app', // 刚刚的自定义标签
    template: '<h1>Hello, Angular2<h1>'
  })
];

document.addEventListener('DOMContentLoaded', function () {
  bootstrap(App);
});
```

这时只要开启 `webpack-dev-server` 就可以看到我们的 Hello, Angular2 了 :)

```bash
$ webpack-dev-server --port 3000
```

## Todo App

Todo App 的功能应该很熟悉，现在就用 ng2 & ES6 来实现一个。首先构建的方法和配置和刚刚的一样，有一点点改动的地方是会把 bootstrap 的文件和组件 app 的文件分开，并把它们放在一个 src 的目录下面，所以在 `webpack.config.js` 里要修改一下入口文件和在 resolve 里添加 src 文件夹

```javascript
// webpack.config.js
entry: [
  // blablabla
  './src/bootstrap.js'
],
// ...
resolve: {
  extensions: ['', '.js'],
  modulesDirectories: ['node_modules', 'src']
}
```

`bootstrap.js` 和刚刚的 `app.js` 一样，只是把 App 组件提取出去

```javascript
// bootstrap.js
import 'zone.js';
import 'reflect-metadata';
import { bootstrap } from 'angular2/platform/browser';

import App from './components/app'

document.addEventListener('DOMContentLoaded', function () {
  bootstrap(App);
});
```

然后在 src 下新建 components 文件夹，里面有组件 `app.js`

```javascript
// app.js
import { Component } from 'angular2/core';

Class App {

};

App.annotations = [
  new Component({
    selector: 'app',
    templateUrl: 'src/templates/app.html'
  })
];

export default App;
```

这就是一个组件最基本的要素，这个组件的 DOM 就在 `app.html` 里，而 DOM 里使用到的所有属性和方法，都会在 App 这个类里面写

但在真正在写 `app.html` 和 `app.js` 之前，还有一些准备工作。我们会用到 [todomvc-common](https://github.com/tastejs/todomvc-common) 和 [todomvc-app-css](https://github.com/tastejs/todomvc-app-css) 里的 CSS，所以先在 `inex.html` 里引入

```html
<!-- index.html -->
<head>
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
</head>
<body>
  <app></app>
  <script src="bundle.js"></script>
</body>
```

还要创建 `todo.js` 和 `todostore.js`，这些不涉及到 ng2 的内容，这里就省略了，但可以在 [这里](https://github.com/jasonliao/Everything-I-Learn/tree/master/angular2/angular2-es6/src/services) 看到这两个文件的实现，主要是操作 [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 的一些接口

好了，现在就来填充 `app.html` 和 `app.js` 吧。根据 Todo App 可以知道，首先有一个输入框，给我们新增 todo

```html
<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <input class="new-todo" placeholder="What needs to be done?" autofocus />
  </header>
</section>
```

在用户输入完之后，敲击回车，就会新增一条 todo，可以直接调用 todoStore 的 `add()`，但是在新增之前，需要对有效性进行一进处理，所以我们定义一个 `addTodo()` 的方法绑定在这个 `input` 的 `keyup` 事件上，并且只有在敲击回车时才触发。[DOCS](https://angular.io/docs/ts/latest/guide/user-input.html) 里有更详细的介绍

```html
<input
  class="new-todo"
  placeholder="What needs to be done?"
  autofocus
  (keyup.enter)="addTodo()"
/>
```

`addTodo()` 则要在 App 这个类里面定义

```javascript
// app.js
import { Component } from 'angular2/core';

import TodoStore from '../services/todostore';

class App {
  constructor () {
    this.todoStore = new TodoStore();
    this.newTodoText = '';
  }
  addTodo () {
    if (this.newTodoText.trim().length) {
      this.todoStore.add(this.newTodoText);
      this.newTodoText = '';
    }
  }
};
```

可以看到 `addTodo()` 方法里直接使用和对 `this.newTodoText` 赋值，因为我们会双向绑定 `newTodoText`，使用 `[(ngModel)]`

```html
<input
  class="new-todo"
  placeholder="What needs to be done?"
  autofocus
  (keyup.enter)="addTodo()"
  [(noModel)]="newTodoText"
/>
```

新增 todo 之后，就要展示了，这里主要介绍的是一些内置的指令，`*ngIf`，`*ngFor` 和 `[class]`(`[ngClass]`)，详情看 [DOCS](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#directives)，只有当存在 todo 的时候才会显示

```html
<section class="main" *ngIf="todoStore.todos.length > 0">
  <input class="toggle-all" type="checkbox" [checked]="todoStore.allCompleted()" >
  <ul class="todo-list">
    <li *ngFor="let todo of todoStore.todos" [class.completed]="todo.completed" [class.editing]="todo.editing">
      <div class="view">
        <input class="toggle" type="checkbox" [checked]="todo.completed" />
        <label>{ {todo.title}}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" *ngIf="todo.editing" [value]="todo.title" />
    </li>
  </ul>
</section>
```

第一个 `input` 是一个 checkbox，用于一键完成全部 todo 或者一键取消完成全部，而 `[checked]` 不是内置指令，是属性绑定，值为双引号里的属性值或者方法的返回结果，详情可以看 [DOCS](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#property-binding)

而当点击这个 `input` 的时候，就可以触发 `todoStore.setAllTo()` 方法，而这时传的是点击后 checked 的值，怎么可以获取到自身组件呢，从刚刚的文档可以看到，ng2 可以在 `input` 里面使用 `#`　定义一个变量来使用，现在定义一个 `toggleall`，并为这个 `input` 绑定点击事件

```html
<input
  class="toggle-all"
  type="checkbox"
  #toggleall
  [checked]="todoStore.allCompleted()"
  (click)="todoStore.setAllto(toggleall.checked)"
/>
```

然后是 `todo-list` 这个 `ul`，每一个 `li` 使用 `*ngFor="let todo of todoStore.todos"` 来遍历。`[class.completed]="todo.completed"` 是指 `completed` 这个 CSS 类只有当 `todo.completed` 为 true 的时候才存在。`[class.editing]` 同理

`li` 里面的 `input` 则是对单条 todo 进行完成确认或者取消，我们也要为它绑定点击事件

```html
<input
  class="toggle"
  type="checkbox"
  [checked]="todo.completed"
  (click)="todoStore.toggleCompletion(todo)"
/>
```

而 `label` 也有事件，就是当双击 todo 的时候，就可以对这条 todo 进行修改

```html
<label (dbclick)="editTodo(todo)">{ {todo.title}}</label>
```

`editTodo()` 则在 App 类中定义，像 `addTodo()` 一样

```javascript
editTodo (todo) {
  todo.editing = true;
}
```

当 `todo.editing` 为 true 的时候，类为 `edit` 的 `input` 就会出现，这里有属性的绑定，事件的绑定，但都是之前说过的东西

```html
<input
  class="edit"
  *ngIf="todo.editing"
  [value]="todo.title"
  #editedtodo
  (blur)="stopEditing(todo, editedtodo.value)"
  (keyup.enter)="updateEditingTodo(todo, editedtodo.value)"
  (keyup.escape)="cancelEditingTodo(todo)"
/>
```

同样的，在 App 类也要定义这些事件

```javascript
stopEditing (todo, editedTitle) {
  todo.title = editedTitle;
  todo.editing = false;
}

cancelEditingTodo (todo) {
  todo.editing = false;
}

updateEditingTodo (todo, editedTitle) {
  editedTitle = editedTitle.trim();
  todo.editing = false;

  if (editedTitle.length === 0) {
    return this.todoStore.remove(todo);
  }

  todo.title = editedTitle;
}
```

最后还有一个删除的 `button`，也要绑定一个点击事件

```html
<button class="destroy" (click)="todoStore.remove(todo)"></button>
```

最后，一些提示和附加功能的 footer，里面还是涉及到一些内置指令如 `*ngIf`，和一些事件的绑定，都是你刚刚已经学会的东西啦

```html
<footer class="footer" *ngIf="todoStore.todos.length > 0">
  <span class="todo-count">
    <strong>{ {todoStore.getWithCompleted(false).length}}</strong>
    { {todoStore.getWithCompleted(false).length == 1 ? 'item' : 'items'}} lefe
  </span>
  <button
    class="clear-completed"
    *ngIf="todoStore.getWithCompleted(true).length > 0"
    (click)="todoStore.removeCompleted()"
  >Clear completed</button>
</footer>
```

## Wrap-up

如果你紧跟着上面的教程，和把里面的 DOCS 都看一下。我想你对 ng2 的一些语法和用法都有所了解了，这时你就可以去发挥你的想像力，去构建你的 Angular2 应用，记住，使用 ES6 喔！
