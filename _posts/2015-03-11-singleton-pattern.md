---
layout: post
category: Javascript
title: Singleton Pattern in JavaScript
date: 2015-03-11
summary: 单体模式在JavaScript中的应用
---

# What's Singleton, What Singleton for

单体就是一个只实例化一次的对象，他可以用来

- 划分命名空间，减少全局变量的数目
- 可以用分支来封装浏览器之间的差异
- 可以把代码组织得更为一致，从而更容易维护

现在我们来看看单体的最基本的模式

```javascript
var Jason = {
  attribute: true,
  method: function () {
    // ...
  }
}
```

这种最基本的单体模式可以用`delete`方法把属性和方法删掉，如`delete(Jason.xxx)`

所以我们就应该把我们的私有变量都保护起来，这时就要用到闭包了

# Namespace

使用单体模式来创建命名空间

```javascript
var Jason = (function () {
  // 这里存放私有成员
  var privateAttribute = true;
  function privateMethod () {
    // ...
  }
  return {
    // 这里存放公有成员
    publicAttribute: false,
    publicMethod: function () {
      // ...
    }
  };
})();
```

这样我们就创建了一个含有私有成员的命名空间，私有成员不可以再`delete`去删除了。当我们调用`publicMethod`的时候，就可以用`Jason.publicMethod()`这样来调用，而且在公有方法访问外部成员的时候，直接使用名称就可以了，不需要加`this`

# Lazy Instance

有些很大的模块如果一开始就加载，就会使页面加载得很慢，我们可以等到他使用的时候，再加载

惰性加载单体要借助一个静态方法，之前我们如果想访问一个模块的公有方法的时候，要`Jason.publicMethod()`访问，但现在就要`Jason.getInstance().publicMethod()`这个调用

`getInstance`这个方法检查这个单体是不是已经实例化，如果没有，他将创建这个实例并将他返回，如果已经存在，则直接将他返回

下面我们就拿刚刚那个命名空间的代码做修改(但实际上，像命名空间这样的单体，不需要惰性加载，因为他会立即被用到)

1. 把单体里的所有代码都移到一个叫`constructor`的方法中

2. 再声明一个变量`uniqueInstance`来标识该单体是否已经实例化

3. 因为`uniqueInstance`和`constructor`都是外部变量，不可以直接访问，所以要返回一个公有方法`getInstance`给对象调用，在这个方法里再判断此单体是否已实例化

```javascript
var Jason = (function () {
  var uniqueInstance;
  function constructor () {
    // 这里存放私有成员
    var privateAttribute = true;
    function privateMethod () {
      // ...
    }
    return {
      // 这里存放公有成员
      publicAttribute = false,
      publicMethod: function () {
        // ...
      }
    }
  }
  return {
    getInstance: function () {
      if (!uniqueInstance) {
        uniqueInstance = constructor();
      }
      return uniqueInstance;
    }
  }
})();
```

这样就可以用`Jason.getInstance().publicMethod()`来调用我们的共有方法了
