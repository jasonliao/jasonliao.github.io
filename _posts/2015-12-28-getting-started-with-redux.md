---
layout: post
category: react, redux
title: Getting Started with Redux
date: 2015-12-28
summary: 在 egghead.io 上跟 Dan Abramov 学 Redux 的笔记
---

# The Single Immutable State Tree

Redux 的第一个概念就是在应用中所有改变的数据或界面的路径都包含在一个单一的 JavaScript 对象里，我们把这个对象叫作 State 或者 State Tree

# Describing State Changes with Actions

Redux 的第二个概念就是 State Tree 唯一改变的原因就是 dispatch 一个 action，而我们的 actions 是一个普通的 JavaScript 对象，里面的 type 描述了 actions 的动作，如果这个动作还需要其他参数，就可能还会在这个对象里添加其他的属性

# Pure and Impure Functions

纯函数是返回值只会因传入参数的不同而不同，而不会受其他行为的影响的函数，纯函数里也不应该有请求或者数据库操作而造成其他的副作用。对于相同的参数，纯函数一定会返回一个相同的值，同时，纯函数也不会修改传入的参数。

在 Redux 里面写的函数，有一部分是一定要写纯函数

```javascript
// Pure functions
function square (x) {
  return x * x;
}
function squareAll (items) {
  return items.map(square);
}

// Impure funcitons 
function square (x) {
  updateXInDatabase(x);
  return x * x;
}
function squareAll (items) {
  for (let i = 0; i < items.length; i++) {
    items[i] = square(items[i]);
  }
  return items;
}
```

# The Reducer Function

Reducer 函数接收两个参数，一个是以前的 State，另一个则是我们 dispatch 的 action，然后返回一个经过 actions 处理之后的 State。这里重要的一点是我们不会修改传入的以前的那个 State，所以我们的 Reducer 函数一定是纯函数，它要返回一个全新的 Object

尽管我们每次都返回一个全新的 Object，但是却不会慢，那是因为我们可以引用之前传入的那个 State，这就是为什么 Redux 快的原因

Redux 的最后一个概念就是我们需要一个函数去修改我们的 State Tree，这个函数接收一个以前的 State，一个被 dispatch 的 action，然后返回一个新的 State，这个函数一定要是纯函数，而这个函数，就叫 Reducer

# Writing a Counter Reducer with Tests

```javascript
function counter (state, action) {
  if (typeof state === 'undefined') {
    return 0;
  }

	if (action.type === 'INCREMENT') {
    return state + 1;
	} else if (action.type === 'DECREMENT') {
    return state - 1;
	} else {
    return state;
	}
}

// and then turn the function into ES6 style
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}
```

# Store Methods: getState(), dispatch(), and subscribe()

当我们用 Redux 里的 `createStore()` 方法创建出来的 Store 会有三个方法，分别是 `getState()`，`dispatch()` 和 `subscribe()`

`createStore()` 方法可以有两个参数，第一个是 reducer，第二个则是初始化的 State，这个参数可有可无

`getState()` 方法就是返回当前的 State，如果 `createStore()` 有传入初始化的 State，那么第一次 `getState()` 的值就会是这个

`subscribe()` 方法传入一个回调函数，当 `dispatch()` 执行完之后，就会自动执行这个回调函数

`dispatch()` 方法传入一个 action，也就是一个普通的 JavaScript 对象。这时它会根据 `action.type` 找到刚刚传入 `createStore` 的 reducer，执行完 reducer 之后，把 State 改变，就触发传入 `subscribe()` 的回调函数

# Implementing Store from Scratch

`crateStore()` 的内部实现

```javascript
const createStore = (reducer) => {
  let state,
    	listeners = [];
      
  const getState = () => state;
  
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };
  
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };
  
  dispatch({});
  
  return { getState, dispatch, subscribe };
};
```

`subscribe()` 函数返回了一个函数来代替了 `unsubscribe()` 这个方法，如果我们想取消订阅 `render` 回调，则可以 `subscribe(render)()` 这样执行

在返回这个 Store 对象之前，还执行了一次 `dispatch({})`，目的是为了把 reducer 里的初始值赋给 `state`

`createStore()` 就像是观察者模式里的发布者，或者叫主体

# React Counter Example

```javascript
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const Counter = ({
  value, onIncrement, onDecrement
}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

const { createStore } = Redux;
const store = createStore(counter);

const render = () => {
  ReactDOM.render(
    <Counter 
      value={store.getState()}
      onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
      onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
    />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
```

# Avoiding Array Mutations with concat(), slice(), and ...spread

在我们的 reducer 中，我们的函数都是纯函数，这意味着我们不可以修改我们的传入的 State，那如果当我们的 State 是一个数组的时候，我们要怎么去处理这些数组元素中的变动呢？

 1. 元素增加

    ```javascript
    // We can't use Array.push() method
    // We can use ...spread
    let list = [];
    
    return [...list, 0];
    ```
    
 2. 元素去除

    ```javascript
    // We can't use Array.splice() method
    
    let list = [0, 10, 20];
    
    return [...list.slice(0, index), ...list.slice(index + 1)];
    ```
    
 3. 元素改变

    ```javascript
    // We can't use list[index]++
    
    let list = [0, 10, 20];
    
    return [
      ...list.slice(0, index),
      list[index] + 1,
      ...list.slice(index + 1)
    ];

    return list.map((item, index) => {
      if (index != 1) {
          return item;
      }
      return item + 1;
    });
    ```
    
# Avoiding Object Mutations with Object.assign() and ...spread

在 State 中，对对象的操作最多的应该就是属性的修改，而我们则可以用 `Object.assign()` 来返回一个新的对象

```javascript
let todo = {
  id: 0,
  text: 'Learn Redux',
  completed: false
};

return Object.assign({}, todo, {
  completed: !todo.completed
});

// ES7
return { ...todo, completed: !todo.completed };
```

目标对象会把参数对象中的属性一个一个赋值过去，但是遇到相同属性的时候，越靠后的对象属性就会覆盖前面对象的属性

# Writing a Todo List Reducer (Adding a Todo)

```javascript
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, {
        id: action.id,
        text: action.text,
        completed: false
      }];
    default:
      return state;
  }
};
```

# Writing a Todo List Reducer (Toggling a Todo)

```javascript
const todos = (state = [], action) => {
  switch (action.type) {
    case 'TOGGLE_TODO':
      return state.map(todo => {
        if (todo.id !== action.id) {
          return todo;
        }
        return { ...todo, completed: !todo.completed };
      });
    default:
      return state;
  }
};
```

# Reducer Composition with Arrays

当一个 reducer 不仅仅要处理逻辑，还要处理其他事情的时候，这个 reducer 就会变得越来越重，耦合度就会越来越高，所以我们可以把其中一部提取出来，然后再在 reducers 之间相互调用

# Reducer Composition with Objects

我们不仅仅可以在 reducers 之间相互调用，我们还可以合并多个 reducers，把多个 reducers 返回的 State 拼成一个大的 State 对象。这有利于我们的开发，可能有多个人来写不同的 reducers，但最后我们只要把所有的 reducers 拼成一个大的 State 对象即可

# Reducer Composition with combineReducers()

正如前面说的，把多个 reducers 合在一起的操作很常用，所以 Redux 提供了一个 `combineReducers()` 的方法，这个方法的参数是一个对象，对象的属性就是传入 reducers 的 state 对象的属性，而值就是 reducers 的名字。在通常情况下，reducers 的名字和它处理的 state 对象中属性名字相同，所以，这个参数对象的键和值是一样的，此时我们可以用 ES6 的对象字面量的特性

```javascript
const todoApp = combinReducers({
  todos,
  visibilityFilter
});
```

# Implementing combineReducers() from Scratch

`combineReducers()` 的内部实现

```javascript
const combinReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
			nextState[key] = reducers[key](state[key], action);
			return nextState;
    }, {});
  };
};
```

# React Todo List Example (Adding a Todo)

```javascript
<input ref={ node => this.input = node } />
<button onClick={() => {
  store.dispatch({ 
    type: 'ADD_TODO', 
    text: this.input.value, 
    id: nextTodoId++ 
  });
  this.input.value = '';
}}>Add Todo</button>
```
# React Todo List Example (Toggling a Todo)

```javascript
<ul>
  { visibleTodos.map(todo => 
    <li key={todo.id} onClick={() => {
      store.dispatch({ type: 'TOGGLE_TODO', id: todo.id });
    }} style={
      { textDecoration: todo.completed ? 'line-through': 'none',
        color: todo.completed ? 'red': 'black'}
    }>{todo.text}</li>
  )}
</ul>
```

# React Todo List Example (Filtering Todos)

```javascript
const FilterLink = ({filter, currentFilter, children}) => {
  if (currentFilter === filter) {
    return <span>{children}</span>
  }
  
  return (
    <a href='#' onClick={e => {
      e.preventDefault();
      store.dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter
      });
    }}>{children}</a>
  )
};
```

```javascript
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter( t => !t.completed );
    case 'SHOW_COMPLETED':
      return todos.filter( t => t.completed );
  }
};
```

```javascript
<p>
  Show:
  <FilterLink 
    filter='SHOW_ALL' 
    currentFilter={visibilityFilter}
  >All</FilterLink> {' '}
  <FilterLink 
    filter='SHOW_ACTIVE' 
    currentFilter={visibilityFilter}
  >Active</FilterLink> {' '}
  <FilterLink 
    filter='SHOW_COMPLETED' 
    currentFilter={visibilityFilter}
  >Completed</FilterLink>
</p>
```

# Extracting Presentational Components (Todo, TodoList)

```javascript
const Todo = ({ completed, text, onClick }) => (
  <li onClick={onClick} style={
    { textDecoration: completed ? 'line-through': 'none',
    color: completed ? 'red': 'black' }
  }>{text}</li>
);
```

```javascript
const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    { todos.map(todo => 
      <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
    )}
  </ul>
);
```

# Extracting Presentational Components (AddTodo, Footer, FilterLink)

```javascript
const AddTodo = ({ onAddClick }) => {
  let input;
  
  return (
    <div>
      <input ref={ node => input = node } />
      <button onClick={() => {
        onAddClick(input.value);
        input.value = '';
      }}>Add Todo
      </button>
    </div>
  );
};
```

```javascript
const Footer ({ visibilityFilter, onFilterClick }) => (
  <p>
    Show:
    <FilterLink 
      filter='SHOW_ALL' 
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >All</FilterLink> {' '}
    <FilterLink 
      filter='SHOW_ACTIVE' 
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >Active</FilterLink> {' '}
    <FilterLink 
      filter='SHOW_COMPLETED' 
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >Completed</FilterLink>
  </p>
);
```

```javascript
const FilterLink = ({ filter, currentFilter, children, onClick }) => (
  if (filter === currentFilter) {
    return <span>{children}</span>
  }
  
  return (
    <a href='#' onClick={e => {
      e.preventDefault();
      onClick(filter);
    }}>{children}</a>
  )
);
```

# Extracting Container Components (FilterLink)

为什么要把 `FilterLink` 变成 Container Component，因为一开始，`TodoApp` 给 `Footer` 传的很多东西，`Footer` 本身并没有用，而是交给了底下的 `FilterLink`，这样就造成了 `FilterLink` 本身接受了太多东西，所以把原先 `FilterLink` 的实现变成 `Link`，再在 `Footer` 和 `Link` 之间插入一层 `FilterLink`，这一层 `FilterLink` 就可以处理交互并传给 `Link`

还有一个问题就是，如果每次 State 更新，都从最顶的 Component 开始更新下来，那么就会很低效，所以慢慢的，我们就会把 `store.subscribe()` 放到 React 组件的生命周期函数里

```javascript
componentDidMount () {
  this.unsubscribe = store.subscript(() => 
    this.forceUpdate()
  );
}

componentWillUnmount () {
  this.unsubscribe();
}
```

# Extracting Container Components (VisibleTodoList, AddTodo)

先分解成 Presentational Components，如果发现传入的 `props` 太多的时候，就可以尝试插入一层 Container Container 来处理 state 或者 action

# Passing the Store Down Explicitly via Props

在 Container Components 里的 store 都是全局声明的变量，这样不利于我们开发，我们有时候会对不同的 Container Components 测试不同的 store，所以我们更希望 store 是充当 `props` 那样传进去

```javascript
const TodoApp = ({ store }) => (
  <div>
    <AddTodo store={store} />
    <VisibleTodoList store={store} />
    <Footer store={store} />
  </div>
);

ReactDOM.render(
  <TodoApp store={createStore(todoApp)} />,
  document.getElementById('root')
);
```

那我们就可以在 Container Components 里通过 `const { store } = this.props;` 来拿到我们的 store

# Passing the Store Down Implicitly via Context

通过 `props` 去传入我们的 store 会非常的繁琐，所以我们可以通过 React 给我们提供的 context 来传递我们的 store，我们先定义一个 `Provider` 组件，`getChildContext()` 函数可以返回子组件需要的 context

```javascript
class Provider extends Component {
  getChildContext () {
    return {
      store: this.props.store
    };
  }
  
  render () {
    return this.props.children
  }
}
```

但是一定要注意的是，要记住声明这个 context 是什么类型

```javascript
Provider.childContextTypes = {
  store: React.PropTypes.object
};
```

这样我们就可以在我们的 Container Components 里使用 context 了

```javascript
const { store } = this.context;
```

但同样的，也要声明这个 context 是什么类型，例如在 `VisibleTodoList` 中使用了 context，就要

```javascript
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
};
```

但如果这个 Container Components 不是类式声明的，没有 `this`，那么 context 就会是这个函数组件的第二个参数，就像 `AddTodo` 组件

```javascript
const AddTodo = (props, { store }) => {
  // ...
};
AddTodo.contextTypes = {
  store: React.PropTypes.object
};
```

# Passing the Store Down with < Provider > from React Redux

```javascript
const { Provider } = ReactRudex;
```

react-redux 给我们提供了这个方法，作用是把传进 Provider 的东西作为 context 传到他的孩子下

# Generating Containers with connect() from React Redux (VisibleTodoList)

```javascript
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: id => dispatch({ type: 'TOGGLE_TODO', id})
  };
};

const { connect } = ReactRedux;

const VisibleTodoList = connect( 
  mapStateToProps, 
  mapDispatchToProps
)(TodoList);
```

# Generating Containers with connect() from React Redux (AddTodo)

```javascript
let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <div>
      <input ref={ node => input = node } />
      <button onClick={() => {
        dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        });
        input.value = '';
      }}>Add Todo</button>
    </div>
  )
};
AddTodo = connect()(AddTodo);
```

如果 `connect()`　函数没有传入参数的时候，默认就会把整个 store 传入组件中

# Generating Containers with connect() from React Redux (FooterLink)

```javascript
const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
};

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);
```

如果我们还需要用到 `props` ，那么我们会在 `mapStateToProps()` 和 `mapDispatchToProps()` 函数中添加第二个参数 `ownProps`

# Extracting Action Creators

Action Creators 是一个普通的 JavaScript 函数，返回的也是一个普通的 JavaScript 对象。可以直接调用这个 Action Creators 返回一个对象传给 dispatch，这就不需要在写组件的文件里有其他的不相干的变量，和例如维护 `nextTodoId` 这样的代码
