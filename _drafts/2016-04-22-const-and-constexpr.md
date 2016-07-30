---
layout: post
category: cpp
title: const and constexpr
date: 2016-04-22
summary: const 和 constexpr 的区别和使用场景
---

C++11 之后新增了 `constexpr`，它和我们常常看到的 `const` 有什么区别呢？它们分别运用在哪些场景呢？

## Basic Meaning and Syntax

这两个关键字都可以用来声明对象和函数。当它们用在对象上的时候的基本区别有

- `const` 用来声明一个对象为常量。这样说明了一旦这个对象被初始化后，这个对象的值就不会改变，那编译器就可以对此进行优化。同样的，也可以避免程序员在这个对象初始化之后通过代码来修改这个对象
- `constexpr` 在用来声明一些使用常量表达式来初始化的变量

*(`const` 和 `constexpr` 在修饰变量对象的时候，区别就在于 `constexpr` 在编译期就已经确定了是常量，而 `const` 并未区分编译期常量和运行期常量)*

```c++
const int i = 42; // ok, 编译时初始化
const int j = get_size(); // ok, 运行时初始化
```

```c++
constexpr int i = 42; // ok
constexpr int j = get_size(); 
// 只有当 get_size 是一个 constexpr 函数并且这个函数值在编译时期就能确定时，才 ok
```

所以如果在声明时直接初始化，建议都使用 `constexpr`

刚刚也说了，`constexpr` 也可以用在声明函数中，而用在函数中时，`const` 和 `constexpr` 有以下区别

- `const` 不能用于一般的函数，只能用于非静态成员函数。它保证了成员函数不会修改非静态的数据成员
- `constexpr` 不仅仅可以用在成员和非成员函数中，还可以用在构造器中。用它声明的函数可以用在常量表达式中
  - 函数体应该要越简单越好，除了类型定义和静态声明之外，只能有一个 `return` 语句。而在构造器中，只允许有列表初始化、类型定义和静态声明
  - 参数和返回值的类型都必须为字面量

## Constant Expressions

`constexpr` 即可以声明变量对象，也可以声明函数。都适用在常量表达式中。一个常量表达式可不仅仅是一个常量

- 它可以用在编译时需要计算的地方，如模板的参数和数组的大小

  ```c++
  constexpr int num = 10;
  int arr[num];
  ```

- 但需要注意的是
  - 用 `constexpr` 声明的东西，不一定都会在编译时计算，它也可能在运行时计算
  - 一个对象如果不使用 `constexpr` 声明也可能属于常量表达式

  ```c++
  int main ()
  {
    const int N = 3;
    int number[N]{1, 2, 3}; // N 是常量表达式
    return 0;
  }
  ```

  这可能是因为 `N` 是一个常量并且用一个字面量声明初始化，所以满足了常量表达式的要求，即使它没有使用 `constexpr` 去声明

### So when do I actually have to use `constexpr`

- 一个变量对象可以不使用 `constexpr` 声明也能被用作常量表达式，就像上面的 `N` 一样，但需要满足下面几点

  - 用 `const` 声明
  - 是整形或者枚举类型
  - 在声明时用常量表达式初始化

  ```c++
  const int N = 3; // 3 是常量表达式

  // same as 
  constexpr int N = 3;
  ```

- 而对于函数来说，如果要用于常量表达式，就一定要用 `constexpr` 来声明，但用 `constexpr` 声明的函数不一定都可以用作常量表达式

  ```c++
  constexpr int size (int cnt)
  {
    return cnt * cnt;
  }

  const int i = 3;
  constexpr int j = size(i); // ok

  int i = 3;
  constexpr int j = size(i) // error
  ```

  `constexpr` 修饰的函数，如果传入的依赖的参数可以在编译时期计算出来，那么这个函数就会产生编译时期的值，可以用作常量表达式。但是，如果传入的参数不能在编译时期计算出来，那么 `constexpr` 修饰的函数就和普通函数一样。不能用作常量表达式。不过，我们不必因此而写两个版本，所以如果函数体适用于 `constexpr` 函数的条件，可以尽量加上 `constexpr`

**如果你知道这个变量对象或者函数可以在编译期就可以计算出结果，就应该使用 `constexpr`，因为它会对性能有很大的提升，C++11 提出 `constexpr` 也就是为了解决性能的问题**

## Read more

- [difference between const and constexpr](http://stackoverflow.com/questions/14116003/difference-between-constexpr-and-const)
- [const 和 const 的区别](https://www.zhihu.com/question/29662350)
