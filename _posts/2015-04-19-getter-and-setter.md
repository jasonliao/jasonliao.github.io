---
layout: post
category: Javascript
title: Getter and Setter
date: 2015-04-19
summary: JavaScript中的get, set方法
---

从一个视频里接触到 JavaScript 的`get`和`set`

一般来说，我们是怎么给我们类的属性定义`get`和`set`方法的呢

```javascript
var Person = function (age) {
  this.age = age;
};
 
Person.prototype = {
  getAge: function () {
    return this.age;
  },
  setAge: function (age) {
    this.age = age;
  }
};
  
var p1 = new Person(19);
var p2 = new Person(23);
```

我们定义了一定 Person 的类，他的每个实例都有`age`这个属性，它们都会指向相同的`Person.prototype`，所以有同样的`getAge`和`setAge`的方法

```javascript
console.log(p1.age); // 19
console.log(p2.age); // 23
p1.age = 20;
console.log(p1.age); // 20
console.log(p2.age); // 23
```

## 为什么我们可以用`p1.age`这样来获得属性的值呢?为什么`p1.age = 20`又可以改变属性的值呢?

**因为每个属性都有有一对自带的`get`和`set`方法，当你想取得某属性的值的时候，就会调用这个属性的`get`方法；当你想修改这个属性的值的时候，就会调用这个属性的`set`方法**

看下面这个例子

```javascript
var Person = function(age) {
  this.age = age;
};
 
Person.prototype = {
  get age() {
    console.log('here is get');
  },
  set age(val) {
    console.log('here is set');
  }
};
  
var p1 = new Person(19);    // here is set 
var p2 = new Person(23);    // here is set
 
console.log(p1.age);
// here is get
// undefined
```

你们看到这时控制台打印了两次`here is set`， 这是因为在实例化的时候，需要为每个实例的`age`赋值，就是要修改属性的值，所以就会调用该属性的`set`方法

也正是因为我们只是在`set`里打印了一句话，并没有真正地给`age`赋值，所以当我们用`p1.age`去拿值的时候，就会返回 undefined，但是在取得值之前，我们是调用了`get`方法，所以会先打印出 here is get

## 那`get`和`set`的内部实现是怎样的呢?

```javascript
Person.prototype = {
  age : {
    get age() {
      return this.age;
    },
    set : age(val) {
      this.age = val;
    }
  }
};
```

不知道～

## 自定义`get`，`set`方法有什么用?

我们可以用`get`， `set`方法来定义一些变量，一些要基于我们其他变量才可以确定的变量，看例子

```javascript
var Person = function(age) {
  this.age = age;
};
 
Person.prototype = {
  get birthYear() {
    return (new Date()).getFullYear() - this.age;
  },
  set birthYear(val) {
    this.age = (new Date()).getFullYear() - val;
  }
};
  
var p1 = new Person(19);    
var p2 = new Person(23);
   
console.log(p1.birthYear);    //1996
console.log(p2.birthYear);    //1992

p1.age = 20;
p2.birthYear = 1994;
console.log(p1.birthYear);    //1995
console.log(p2.age);          //21
```

因为我们 birthYear 的`get`方法是根据`this.age`返回，而每个`this.age`都在实例里存在一份，所以 birthYear 虽然不是实例的属性，但是却互不干扰; 而在`set`方法里，当我们设置 birthYear 的值的时候，会修改我们的`this.age`，所以可以做到修改任意一个，另一个也会发生改变

## 这样做有什么好处吗?

1. 我们不用在构造函数里定义那么多属性，换句话说，我们在实例化的时候，不需要传入那么多参数
2. 只在原型里定义了`get`，`set`方法的属性不会在多份实例里占内存，只存在一份在`prototype`里，节省内存，但却可以互不干扰


如有错误，欢迎指正 :)
