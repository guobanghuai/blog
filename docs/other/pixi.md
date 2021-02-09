# PixiJS

### 一. PixiJS 介绍
<a href="http://pixijs.download/release/docs/index.html">PixiJS</a>是一个轻量级的2D渲染引擎，它能自动侦测使用WebGL还是Canvas来创建图形。开发者无需专门学习 WebGL 就能感受到强大的硬件加速的力量。虽然 PixiJS 非常适合制作小游戏，但它并不是一个游戏引擎。
<a href="https://www.bookstack.cn/read/LearningPixi/introduction">官方教程</a>

### 二. 核心概念

#### 1. Application应用

```javascript
const app = new Application({ // 创建一个Pixi 应用
  width: 300,
  height: 300,
  antialias: true,
  transparent: false,
  resolution: 1 // 设置成window.devicePixelRatio，避免手机端设备显示模糊
});
// 把 Pixi 应用中创建出来的 canvas 添加到页面上
document.body.appendChild(app.view);

// 在离开页面时需要手动清理内存，否则无法释放WebGL内存
app.destroy(true)
```

#### 2. Container 容器

应用的根容器是app.stage。可以用PIXI.Container()方法创建子容器

```javascript
const bgContainer = new PIXI.Container(); // 创建一个背景容器
const bgSprite = new Sprite.from('bg.jpg');
bgContainer.addChild(bgSprite); // 创建一个图片并添加到容器里
app.stage.addChild(bgContainer); // 将创建的容器添加到app根容器里
```
:::tip
可以分别创建多个容器，将不同的单元进行分组。分组之后，可以单独进行管理。
:::


这里的容器类似html里的dom结构。可以相互嵌套，有“父子子属关系”，有“兄弟并列关系”，有“层级上下关系”。

##### 容器操作

```javascript
// 添加子代到容器
// 添加一个子代
container.addChild(sprite);
// 也可以添加多个,它们的深度是：先添加的在最下面
container.addChild(sprite1,sprite2);
 
// 添加子代到容器的指定位置：
// 添加一个子代到指定位置,如果索引超出范围会报错
container.addChildAt(sprite,4);
 
// 返回指定位置的子代：
container.getChildAt(4);
 
// 从容器中取出一个或多个孩子
container.removeChild(sprite);
 
// 从指定的索引位置删除子级
container.removeChildAt(1);
 
// 从此容器中删除在开始索引和结束索引内的所有子项
// 移除所有，默认值为开始到结束
container.removeChildren();
// 移除第二个和三个
container.removeChildren(1,2);
```

#### 3. Renderer 渲染器

```javascript
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.left = '0';
app.renderer.view.style.top = '0';
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);// 重新设置应用的大小
app.stage.scale.set(window.innerWidth / baseWidth); // 设置缩放比，配合resolution可以在不同设备像素比手机上高清显示
```

#### 4. Sprite 精灵

Sprite精灵是可以放在容器里的交互式图像。精灵是你能用代码控制图像的基础。你能够控制他们的位置，大小，和许多其他有用的属性来产生交互和动画。 创建一个精灵需要用 PIXI.Sprite() 方法。

```javascript
const avatar = new Sprite.from('avatar.jpg');

// 和普通的图形一样可以设置各种属性
avatar.width = 100;
avatar.height = 200;
avatar.position.set(20, 30);
avatar.scale.set(2, 2);
```

#### 5. Loader 加载器

加载图片通常需要耗费一定的时间，因此我们常常使用Loader来预加载图片，当图片全部加载成功后，才开始渲染。

```javascript
const loader = new PIXI.Loader();
const resources = [
  { name: 'img1', url: 'img1.png'},
  { name: 'img2', url: 'img2.png'},
  { name: 'img3', url: 'img3.png'},
];
loader.add(resources).load();
loader.onProgress.add(loadProgressHandler);
loader.onError.add(() => {});
loader.onLoad.add(() => {});
loader.onComplete.add(setup);

function loadProgressHandler(loader, resource) {
  console.log('loading: ' + resource.url);
  console.log('progress: ' + loader.progress + '%');
}
function setup() {
  console.log('All files loaded');
}
```
通过add方法添加需要加载的图片，所有图片加载完成后，load方法会调用传入的setup回调函数，这时就可以渲染各种元素。onProgress事件可以监听加载的进度，通过这个方法，可以很方便的制作进度条动画。

#### 6. Texture 纹理
因为 Pixi 用 WebGL 和 GPU 去渲染图像，所以图像需要转化成 GPU 可以处理的格式。可以被 GPU 处理的图像被称作纹理 。在你让精灵显示图片之前，需要将普通的图片转化成 WebGL 纹理。为了让所有工作执行的快速有效率，Pixi使用 纹理缓存 来存储和引用所有你的精灵需要的纹理。纹理的名称字符串就是图像的地址。
```javascript
const loader = new PIXI.Loader();
const resources = [
  { name: 'img1', url: 'img1.png'},
  { name: 'img2', url: 'img2.png'},
  { name: 'img3', url: 'img3.png'},
];
loader.add(resources).load();
const sprite1 = new Sprite(loader.resources['img1'].texture);
```

如果图片在缓存里没有，也可以加载一张新的图片
```javascript
PIXI.Texture.from('new.png');
```

#### 7. Ticker 帧率更新函数
Ticker有点类似前端的requestAnimationFrame，当浏览器的显示频率刷新的时候，此函数会被执行，因此常常用来制作帧动画。app.ticker就是一个Ticker实例。（经测试4.0版本使用app.ticker在ios端会有问题，可以用requestAnimationFrame替换，5.0尚未测试）
```javascript
const move = () => {
  sprite.x += 1;
  if (sprite.x > 100) {
    app.ticker.remove(move); // 移除执行函数
  }
}
app.ticker.add(move);
```
用requestAnimationFrame实现
```javascript
let raqId;
const move = () => {
  sprite.x += 1;
  raqId = window.requestAnimationFrame(move);
  if (sprite.x > 100) {
    window.cancelAnimationFrame(raqId);
  }
}
move();
```

#### 8. Graphic 几何图形
graphics主要用于绘制原始形状（如线条，圆形和矩形）以及他们的上色和填充。
```javascript
const graphics = new PIXI.Graphics()
// 线框 
graphics.lineStyle(2, 0x0000FF, 1) graphics.drawRect(50, 250, 100, 100)
// 四边形 
graphics.drawRect(50, 50, 100, 100)
// 圆形 
graphics.drawCircle(100, 250, 50)
// 椭圆 
graphics.drawEllipse(600, 250, 80, 50)
// 圆角矩形 
graphics.drawRoundedRect(50, 440, 100, 100, 16)
// 星星 
graphics.drawStar(360, 370, 5, 50)
// 多边形 
graphics.drawPolygon(path)
// 贝塞尔曲线 
graphics.bezierCurveTo(100, 240, 200, 200, 240, 100)
// 圆弧 
graphics.arc(300, 100, 50, Math.PI, 2 * Math.PI)
app.stage.addChild(graphics)
```
清除图形 用graphics.clear()方法


#### 9. Text 文本
```javascript
// 自定义文字样式 
const style = new PIXI.TextStyle({    
  fontFamily: 'Arial',    
  fontSize: 36,    
  fontStyle: 'italic',    
  fontWeight: 'bold',    
  fill: ['#ffffff', '#00ff99'],    
  stroke: '#4a1850',    
  strokeThickness: 5,    
  dropShadow: true,    
  dropShadowColor: '#000000',    
  dropShadowBlur: 4,    
  dropShadowAngle: Math.PI / 6,    
  dropShadowDistance: 6,    
  wordWrap: true,    
  wordWrapWidth: 440
})
const text = new PIXI.Text('hello word！', style)
app.stage.addChild(text)
```

#### 10. 事件交互
pixi中常用的鼠标交互事件：
```javascript
// 兼容鼠标和触摸屏的共同触发
type InteractionPointerEvents = "pointerdown" | "pointercancel" | "pointerup" | "pointertap" | "pointerupoutside" | "pointermove" | "pointerover" | "pointerout";
// 触摸屏触发事件
type InteractionTouchEvents = "touchstart" | "touchcancel" | "touchend" | "touchendoutside" | "touchmove" | "tap";
// 鼠标触发事件
type InteractionMouseEvents = "rightdown" | "mousedown" | "rightup" | "mouseup" | "rightclick" | "click" | "rightupoutside" | "mouseupoutside" | "mousemove" | "mouseover" | "mouseout";
```

点击事件
```javascript
const point = new Graphics();
point.beginFill(0x0bef47)
point.drawCircle(300, 300, 50)
point.endFill()
point.interactive = true;// 响应交互
point.buttonMode = true;// 鼠标变手型
point.on("pointerdown", (event: PIXI.InteractionEvent) => {
    console.log("graphics")
})
app.stage.addChild(point)
```
:::tip
interactive 默认为false，不会响应交互事件。buttonMode属性，默认为false，设置为true时，鼠标悬浮会变成手型。或者可以直接设置cursor来修改光标样式
:::

拖拽
```javascript
const texture = PIXI.Texture.from('examples/assets/bunny.png') 
const bunny = new PIXI.Sprite(texture)
bunny    
  .on('pointerdown', onDragStart)    
  .on('pointerup', onDragEnd)    
  .on('pointerupoutside', onDragEnd)    
  .on('pointermove', onDragMove)     
function onDragStart(event) {    
  this.data = event.data    
  this.alpha = 0.5    
  this.dragging = true 
}
function onDragEnd() {    
  this.alpha = 1    
  this.dragging = false    
  this.data = null 
}
function onDragMove() {    
  if (this.dragging) {        
    const newPosition = this.data.getLocalPosition(this.parent)        
    this.x = newPosition.x        
    this.y = newPosition.y    
  } 
}
```

### 三. 动画精灵
动画在游戏里是必不可少的，Pixi为我们提供了AnimatedSprite方法加载动画。这里的动画通常是指帧动画，将动画的每一关键帧制作成图片并按顺序加载。通常会把一组动画制作成一张雪碧图。

```javascript
let base = TextureCache[imgURL];
//第一个纹理
let texture0 = new Texture(base);
texture0.frame = new Rectangle(0, 0, 80, 143);
//第二个纹理
let texture1 = new Texture(base);
texture1.frame = new Rectangle(80, 0, 80, 143);
//第三个纹理
let texture2 = new Texture(base);
texture2.frame = new Rectangle(160, 0, 80, 143);
//第四个纹理
let texture3 = new Texture(base);
texture3.frame = new Rectangle(240, 0, 80, 143);

//创建纹理数组
let textures = [texture0, texture1, texture2,texture3];
//创建动画精灵
let pixie = new PIXI.extras.AnimatedSprite(textures); 
//设置动画精灵的速度
pixie.animationSpeed=0.1;

//把动画精灵添加到舞台
app.stage.addChild(pixie);

pixie.play(); //播放动画精灵
// pixie.gotoAndPlay(); //转到特定的帧并开始播放动画精灵
// pixie.stop(); //停止播放动画精灵
// pixie.gotoAndStop(); //转到特定的帧并停止播放动画精灵

```
:::tip
 如果觉得这样加载动画很麻烦，推荐使用<a href="https://github.com/kittykatattack/spriteUtilities">SpriteUtilities</a> 的库，该库包含许多有用的函数，用于创建Pixi精灵并使它们更易于使用。
:::
