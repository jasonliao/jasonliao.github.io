---
layout: post
category: Ext
title: Ext.js Tips - Filter Data in Gridpanel with Paging
date: 2015-04-16
summary: Ext.js中分页的Gripanel按条件过滤遇到的问题与解决方法
---

我想这个功能是非常常见的，就是 Ext 的 Gridpanel 上会有若干个的输入框，一个按钮，点击用于过滤 Gridpanel 里面的信息

但在实践的时候会发现几个问题：

1. 怎么把用户输入的信息传给后台
2. 如果传的值为中文，怎么修改默认的请求方式
3. 重新加载的时候，页脚的信息如何同时更新

Ext4 采用的是 MVC 的开发模式( Ext5 采用的是 MVVM )，所以我们是要创建一个 dataStore 来装载我们的数据，下面我们一般创建 store 的代码

```javascript
var store = Ext.create('Ext.data.Store', {
  fields: [],
  proxy: {
    type: 'ajax',
    url: '', // your action here
    reader: {
      type: 'json',
      root: 'list',
      //后台返回的json对象里要包含totalProperty这个属性
      //页脚用来计算一共有多少页(totalCount/pageSize)
      totalProperty : "totalCount"    
    }
  },
  autoLoad: true,
  pageSize: 20    //每页加载多少条数据
});
```

那怎么动态再把用户输入的信息作为参数通过这个 store 传给后台呢? 我们可以在 查询 这个按钮上加一个handler，在这里加入下面代码

```javascript
store.load({
  params: {
    'params1': xxx,
    'params2': xxx
  }
});
```

这样 store 不仅仅会把分页查询的参数(start, limit, page)自动传过去，还会把你的 params 对象里的参数传过去

但如果我们的参数是中文，或者我们的请求需要是 POST，则要在我们的 store 里加入`actionMethods`这个对象

```javascript
actionMethods: {
  create: 'POST',
  read: 'POST',
  update: 'POST',
  destroy: 'POST'
}
```

因为我们平时请求默认是 read，而他的默认方法是 GET，所以需要用上面代码更改

到现在为止，我们可以为 store 增加参数发送请求，也可以使用 POST 防止中文的乱码情况，但是还有最后一个问题，我们在重新加载 store 之后，gridpanel 和页脚的信息都是对的，但是当你点击下一页的时候，问题就会出现，因为点击页脚下一页的时候，同样会调用 store 的`load`方法，但是此时的参数就仅有分页查询的参数(start, limit, page)，用户输入的参数就不会传过去，那要怎么办呢?

所以就可以在 store 里增加监听，在`load`方法调用之前，先把用户输入的东西拿到，每次 load 的时候，都作为附加参数传过去，那，怎么做?

```javascript
listeners: {
  beforeload: function() {
    // 拿到用户需要过滤的内容 放到下面这个对象里
    this.proxy.extraParams = {
      'params1' : xxx,
      'params2' : xxx
    };
  }
}
```

这样，我们就可以在每次 load 的时候把用户输入的内容一起传到后台，这样我们在 查询 按钮的 handler 里只用写简简单单的一句代码

```javascript
store.load();
```

这个时候后台和前端要配合一下，如果用户什么都不输入，就返回全部就可以啦

如果有什么错误，或者有什么其他方法，都可以联系我喔 :)
