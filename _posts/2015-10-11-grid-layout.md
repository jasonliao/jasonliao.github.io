---
layout: post
category: css, grid, layout
title: Grid Layout
date: 2015-10-11
summary: 虽然在真正的开发中还不可以使用，但是 Grid Layout 真的很 Cool
---

# Evolution

- Tables
- Floats
- Inlines
- CSS Frameworks
- [Flex](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- **Grid**

# Attention Here

Grid Layout 在最新的 Chrome, FF, Safari 上都不支持， IE 10＋ 有部分的支持，所以如果你想在 Chrome 上玩，可以去到 *chrome://flags* 找到 *Enable experimental Web Platform features* 并打开就可以啦

ok, here we go...

# display: grid

对父容器应用 `display: grid` 就可以对他下面的子元素进行 Grid Layout

我们可以先看我们的 HTML

```html
<div class="grid">
  <div class="a">A</div>
  <div class="b">B</div>
  <div class="c">C</div>
  <div class="d">D</div>
</div>
```

# grid-template-columns ＆ grid-template-rows

`grid-template-columns` 这个属性是在父容器中定义的，可以在这个属性中定义有多少列，每一列的宽度是多少

`grid-template-rows` 也是一样，只是定义的是有多少行，每一行高度是多少

```css 
.grid {
  display: grid;
  grid-template-column: 100px 100px 100px;
  grid-template-rows: 100px 200px;
}
```

这样的意思就是，有三列，每一列的宽度为 100px，有两行，第一行为 100px，第二行则为 200px

若当我们设置第二列为 `auto` 的时候，那么第二列的宽度就是我们内容的宽度，只时如果我们设置第二列的任意一个元素的宽度，那么也会相应的作用在任意一行的第二列元素中，如

```css
.grid {
  display: grid;
  grid-template-columns: 100px auto;
  grid-template-rows: 100px 200px;
}
.b {
  width: 300px;
}
```

那么第二行的 D 也会有 300px 的宽度

我们还可以在 `grid-template-columns` 中设置 `flex`，如 `1fr` `2fr`，意思就是按比较来分布列的宽度

当然如果我们要有多列的布局，一个一个的写肯定很麻烦，所以我们还可以用 `repeat(num, xpx)` 来设置， 如 `repeat(4, 100px)`

所以现在让我们写一个左定宽右响应的布局就会变得很简单

```css
.grid {
  display: grid;
  grid-temlpate-columns: 200px 1fr;
}
```

## shortcut

我们可以直接用 `grid` 加 `/` 来分别定义 `grid-template-columns` 和 `grid-template-rows` like this

```css
.grid {
  display: grid;
  grid: 100px 100px / 100px 200px;
}
```

# grid-column & grid-row

`grid-column` 和 `grid-row` 是用在子元素中的，可以用来定义我们的子元素在哪一行，哪一列，例如我们可以把我们的 `A` 放到第二行的第一列中

这时我们把我们的 HTML 中的 D 子元素去掉

```html
<div class="grid">
  ...
  <!-- <div class="d">D</div> -->
</div>
```

```css
.a {
  grid-row: 2;
  grid-column: 1;
}
```

这时我们的 A 就会在第二行的第一列

我们还可以使我们的 `A` 在下面占据两列，只要 `grid-column: 1 / span 2`，同样达到这个效果的可以了 `grid-column: 1 / 3` 这样的意思就是由第一条线到第三条线

# grid-template-areas & grid-area

`grid-template-areas` 是在父容器中使用，可以形象的对子元素进行布局

而 `grid-area` 则是用于给子元素进行定义

```css
.grid {
  grid-template-areas: "head head"
                       "nav main"
                       "foot foot";
}
```

```css
.a {
  grid-area: head;
}
.b {
  grid-area: nav;
}
.c {
  grid-area: main;
}
.d {
  grid-area: foot;
}
```

`.` 也是可以的，表示没有元素占据着那一列

# Responsive Grids with Media Queries

我们可以不用设置我们的 HTML 只要控制我们的 CSS 就可以了

```css
.grid {
  grid: 
  grid-template-areas:
}

@media (max-width: xxxpx) {
  grid:
  grid-template-areas:
}
```

# Other

有一些属性我们知道一下就可以了，但是在实际用的时候，可以用更简单的方法代替他们

- `grid-column-start` `grid-column-end` 就是用来设定子元素在行的哪一条线到哪一条线，而我们用 `grid-column: x / y` 这种方法就可以方便得多，同时也很好理解

- `grid-row-start` `grid-row-end` 则同理，可以用 `grid-row: x / y` 来代替

- `grid-area` 其实可以像我们刚刚那样定义一种区域名称之外，我们还可以用 `grid-area: a / b / c / d` (a, b, c, d均为数值) 来表示，他们分别代表的是 `grid-row-start` `grid-column-start` `grid-row-end` `grid-column-end` 四条线就可以确定一个区域，但是我觉得的确很难记


# Reference

- [The future of layout with CSS: Grid Layouts](https://hacks.mozilla.org/2015/09/the-future-of-layout-with-css-grid-layouts/?utm_source=html5weekly&utm_medium=email)
- [CSS Grid Layout Module Level 1](http://www.w3.org/TR/css-grid-1/)
- [Manuel Rego - CSS Grid Layout is Just Around the Corner](https://www.youtube.com/watch?v=9js_5MjiGFo)
- [Grid by Example](http://gridbyexample.com/)