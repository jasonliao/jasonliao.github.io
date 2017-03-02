---
layout: post
category: web, vr
title: Two Ways to Build VR on the Web
date: 2017-03-02
summary: 创建 WebVR 的两种方式
---

Virtual Reality 在过去的一年里越来越火，越来越多的 VR 设备不断浮出，像三星的 Gear VR，HTC 的 VIVE，还有 Oculus Rift 等等，在商场里我们也可以看到有很多很成熟的体验项目。作为前端开发者的我们，是不是也想自己创建场景，戴上最低成本的 VR 设备，来感受一下 VR 的魅力呢 ;)

本文会介绍两种方式来实现 Web VR，两种方式都会涉及到 three.js，如果你还不了解这个 JavaScript 3D的库，可以先到官网看看 [如何创建一个简单的场景](https://threejs.org/docs/index.html#Manual/Getting_Started/Creating_a_scene)。本文也只会使用简单的场景，重点在于如何让这个场景在你的 VR 设备上看到，并且要知道每一行代码的作用。

# Where Do I Get One?

在 VR 设备里，最低成本的，估计就要算 Google Cardboard 了，你不仅可以买一个，你甚至可以自己制作一个。Google 把 Cardboard 的 [图纸](https://mdmundo.s3-us-west-2.amazonaws.com/wp-content/uploads/Scissor-cut_template.pdf) 开放了出来，网上也有很多根据这个图纸自己动手做的视频教程，如果你有做手工艺品的爱好，那么自己动手做一个也是很有乐趣的。

对于从小就看[「艺术创想」](http://search.bilibili.com/all?keyword=%E8%89%BA%E6%9C%AF%E5%88%9B%E6%83%B3)的我来说，这个机会怎么会放过，我也自己做了一个，并把过程记录了下来，而且我这个还是 **零成本** 的！心动了吧，快看 [这里](https://github.com/jasonliao/build-vr-on-the-web/blob/master/how-to-make-a-google-cardboard.md)！可最后为了更好的体验，我还是在某宝上买了一个 ¯\\\_(ツ)_/¯

# What We’re Going to Build

场景我们只打算做一个简单的立方体展示，而 VR 效果就是可以看到这个立方体的各个面。虽然每个面都一样，没什么好看的。但试想一下这个立方体是一件商品，是一个包包，那就相当于在看这个包包的细节啦，那就不用买了，反正她们买回来也是看两下就想要下一个了。

这里分别是 [Device Orientation Demo](https://jasonliao.me/build-vr-on-the-web/deviceorientation/) 和 [WebVR API Demo](https://jasonliao.me/build-vr-on-the-web/webvr/)，点开就可以看了！所有的源码都在 [这个仓库](https://github.com/jasonliao/build-vr-on-the-web) 里喔。

# Device Orientation

这是基于设备定向的一种方式，因为手机浏览器几乎都支持 [deviceorientation](https://developer.mozilla.org/en-US/docs/Web/Events/deviceorientation) 事件，所以当用户持着手机设备转动不同方向的时候，就会产生不同的 alpha、beta、gamma 值组合，这样就可以根据这些值来转化成 three.js 中 camera 的位置，从而可以实现在我们转动的时候，看到物体不同的面。

先来看看这种方式中，我们需要哪些文件：

* `three.min.js` - JavaScript 的 3D 库，用于创建场景
* `DeviceOrientationControls.js` - three.js 的一个插件，可以根据我们对设备的移动来更新 camera 的位置（可以在 [three.js/examples/js/controls/DeviceOrientationControls.js](https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/DeviceOrientationControls.js) 里找到）
* `OrbitControls.js` - 这用于在非移动设备上通过鼠标对 camera 的控制，为了更好的测试或者 debug（可以在 [three.js/examples/js/controls/OrbitControls.js](https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js) 里找到）
* `StereoEffect.js` - 对于 Google Cardboard 来说，需要将场景分成两个镜头（可以在 [three.js/examples/js/effects/StereoEffect.js](https://github.com/mrdoob/three.js/blob/dev/examples/js/effects/StereoEffect.js) 里找到）

好啦，终于要写代码了！`index.html` 我们不需要做太多的东西，引入上面那个四个库，再引入一个我们自己的 `index.js`，设置一下样式就可以了

```html
<!-- index.html -->
<head>
  <style>
    body { margin: 0; overflow: hidden; }
  </style>
</head>
<body>
  <script src="./lib/three.min.js"></script>
  <!-- import other three libraries -->
  <script src="./src/index.js"></script>
</body>
```

来到 `index.js`。首先得创建一个立方体场景，刚好 three.js 的 [Getting Started](https://threejs.org/docs/index.html#Manual/Getting_Started/Creating_a_scene) 也是创建一个立方体，它肯定比我讲得更清楚呀，所以我就不在这里重复了。

但在这里还是有一点点的小不同。我们会把变量都定义好，然后把所有的操作都放到 `init()` 函数里，那么就可以在任意时候调用 `init()` 函数，初始化所有东西。

```javascript
// three.js scene
let scene, renderer, element, camera, light, geometry, material, object
// mouse or device orientation controls
let controls
// stereo effect for google cardboard
let effect

function init() {
  // build up your scene here
  
  effect = new THREE.StereoEffect(renderer)
  
  controls = new THREE.OrbitControls(camera, element)
  controls.enablePen = false
  controls.enableZoom = false
  
  function setOrientationControls(e) {
    if (!e.alpha) {
      return
    }
    
    controls = new THREE.DeviceOrientationControls(object, false)
    controls.connect()
    controls.update()
    window.removeEventListener('deviceorientation', setOrientationControls, true)
  }
  
  window.addEventListener('deviceorientation', setOrientationControls, true)
}
```

这里有几个重要的点需要注意：

1. `effect` 会把参数 `renderer` 转成两个出来，满足 Google Cardboard 的需要，那么稍后就需要使用 `effect.render()`，如果是其他设备，就直接使用 `renderer.render()`。当然你也可以使用按钮来切换这两种模式。

2. `controls` 先默认设置为使用鼠标控制镜头，所以传递的是 `camera` 参数。我们用鼠标拖拽物体的时候，物体的确在翻滚，但事实上不是在控制物体，而是在控制镜头。我们可以从翻滚物体到另一面时，整个物体变暗验证这一点。因为灯光并没有移动，只是把镜头移到了物体的背面，所以才变暗。如果我们是拖拽了物体，那么不管转到哪一面，都应该有灯光照射到。与此同时我们还设置了不可以放大缩小和移动。

    那如果我传入的参数是 `object`，那是不是意味着我控制的是物体呢？没错！但这并不是我们想要的效果，因为当你控制了物体，那么移动鼠标的时候，就有可能把物体移动到镜头之外了。
    
3. 为 `window` 绑定 `deviceorientation` 事件，也就是在使用移动设备的时候，`controls` 就会由设备定向来接管，接管完后解绑事件就可以了。这时传入的是 `object` 参数，恰恰与上面的相反，为什么呢？因为当我们头带设备的时候，转动方向是为了看到物体转动，所以这时的确要转动物体。如果我们传入的是 `camera`，转动的是镜头，就会出现刚刚上述的情况，看不到物体啦。

    当然啦，有时候的确需要这种传入镜头的情况。例如你的场景是一间闺房，那你肯定不想只转动台面上的台灯看细节，而是转动镜头看看房里的其他风景。

OK，`init()` 函数已经完成了，但是单纯地调用它还不可以，我们还需要它动起来！

```javascript
function animate() {
  requestAnimationFrame(animate)
  
  controls.update()
  resize()
  effect.render(scene, camera)
}
```

每当使用鼠标搬动或者设备晃动的时候，我们都要去更新镜头或者物体的位置，[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) 会 60/s 次地去调用传入的函数。它与 `setInterval` 的区别在于它只会在当前 Tab 的时候会工作，一旦跳到了别的 Tab 的时候，就会停下来。接着调用 `controls.update()`，这样不管你是控制镜头还是物体，都可以动起来。

`resize()` 函数是做什么的呢？先来看看里面是什么

```javascript
function resize() {
  var width = window.innerWidth
  var height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  effect.setSize(width, height)
}
```

哦哦，原来是设置舞台的大小，因为刚刚已经把 `renderer` 转成了 StereoEffect，所以这里直接设置 `effect.setSize()` 就可以了。当用户改变屏幕大小的时候，就要重新计算镜头的比例，更新，然后再重新设置舞台大小。当然啦，你可以监听 `resize` 事件，然后再做这些事，也更合理一些。

这就是使用 Device Orientation 方式来完成 VR 页面的过程，很简单不是吗？但等等！还有更好更简单的在下面呢！

# WebVR API

这里虽然说使用的是 WebVR API 的方式，但实际上我们并不会直接使用这些 API，因为有更简单的方法。如果你对 WebVR API 有兴趣或者想要有更多的了解，可以去看在 [W3C 上的草稿](https://w3c.github.io/webvr/)。

而我们简单的方法就是 [webvr-boilerplate](https://github.com/borismus/webvr-boilerplate) 这个基于 [webvr-polyfill](https://github.com/googlevr/webvr-polyfill) 的库，可以很方便的支持多种 VR 设备的体验，那么现在就来看看有多方便吧！

还是一样，先来看看我们都需要一些什么文件：

* `three.min.js` - JavaScript 的 3D 库，用于创建场景
* `VRControls.js` - three.js 的一个插件，用于对物体或者镜头的控制（可以在 [three.js/examples/js/controls/VRControls.js](https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/VRControls.js) 里找到）
* `VREffect.js` - 同样是 three.js 的一个插件，用于展示不同的 VR 效果（可以在 [three.js/examples/js/effects/VREffect.js](https://github.com/mrdoob/three.js/blob/dev/examples/js/effects/VREffect.js) 里找到）
* `webvr-polyfill.js` - WebVR 的兼容 API（可以在 [webvr-polyfill/build/](https://github.com/googlevr/webvr-polyfill/tree/master/build) 里找到)
* `webvr-manager.js` - 刚刚介绍的库的主要文件（可以在 [webvr-boilerplate/build/](https://github.com/borismus/webvr-boilerplate/tree/master/build) 里找到）

使用这种方式和刚刚用 Device Orientation 实现的差不多，只是对一些方法的小调整。`index.html` 还是和刚刚的一样，只是引入的库不一样了。现在来看看 `index.js` 里的区别。

```javascript
function init() {
  // build up your scene here
  
  effect = new THREE.VREffect(renderer)
  
  controls = new THREE.VRControls(object)
  controls.standing = true
  camera.postion.set(0, controls.userHeight, 6)
  
  manager = new WebVRManager(renderer, effect, { hideButton: false });
}
```

`effect` 这里采用了新的构造方式，没有固定是显示一个还是两个，后面也是采用 `effect.render()` 来展示。

而 `controls` 采用的是 `VRControls()` 的方式，传入的是 object，这就意味着不管是当我们拖动鼠标还是晃动脑袋，移动的都是物体，这在移动端和非移动端上保持了一致，也不需要分开处理。但这里需要添加两个设置，一个是把 `standing` 变量设为 `true`，还有把 camera 的 Y 轴设置为 `controls.userHeight` 的高度，这样物体就是在我们的正前方啦。

最后我们使用那个库的的方法来构造一下 `manager` 变量，它会给我们的页面提供一个按钮，用于进入 VR 模式，点击之后就可以 Google Cardboard 的模式，且有不同的版本选择，也有后退键，可以退出。也就是说，通过这一行代码就可以更方便地在多种 VR 模式下切换，不需要我们自己去写样式按钮和绑定事件等等。

`init()` 的调整就结束啦，代码更简洁，功能也更丰富。那 `animate()` 函数和 `resize()` 还有什么要修改的吗？只有一点点！就是把 `animate()` 里的 `effect.render()` 改成 `manager.render()` 就可以啦。

# Pros and Cons

如果你都看到上面两个 Demo，你就不难发现他们的优缺点，现在就来总结一下吧：

*（前者为 Device Orientation，后者为 WebVR API）*

1. 前者在移动端拖动不会退出全屏，而后者拖动会出现地址栏
2. 前者在 StereoEffect 下物体更顺滑，而后者则有锯齿
3. 后者方式代码简洁，且移动端与非移动端保持一致
4. 后者多种模式体验更友好，切换更方便

如果是你，你会选择哪种呢？

# Wrap Up

当初是看到 [How to Build VR on the Web Today](https://www.sitepoint.com/how-to-build-vr-on-the-web-today/) 这篇文章然后才心血来潮玩起了 VR，这篇文章里介绍的例子虽然很炫酷，但对初学者并不友好，并没有把每一行代码的作用说清楚，这样会让初学者搞不清哪些是 three.js 的知识，哪些是 Web VR 的知识。后来不断地试错，终于做出了个最简单的 Demo。

希望这篇文章对想玩这个的同学有帮助，如果有什么错误或者问题，欢迎在下面评论或者 [issues](https://github.com/jasonliao/build-vr-on-the-web/issues) :)






