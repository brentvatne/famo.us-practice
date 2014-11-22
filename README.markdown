Getting started with famo.us/angular

## First, without Angular

### Basics

The Surface is the most basic renderable - it is equivalent to a
div.

```javascript
var Engine = require('famous/core/Engine');
var Surface = require('famous/core/Surface');

var mainContext = Engine.createContext();

var firstSurface = new Surface({
  content: "hello world"
});

mainContext.add(firstSurface);
```

You can modify the content later

```javascript
firstSurface.setContent('<h1>HELLO WORLD</h1>');
```

You can style it in the same way as css

```javascript
var firstSurface = new Surface({
  content: 'hello world',
  properties: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#FA5C4F'
  }
});
```

If size isn't specified, it inherits the size of the parent.

You can be explicit about size by setting the `size` of a surface:

```javascript
// Specify size in pixels with [x, y]
// Specify size in only one dimension with [undefined, y] or [x, undefined]
// Have the surface auto-size according to the content with [true, true]

var firstSurface = new Surface({
  size: [true, true],
  content: 'hello world',
  properties: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#FA5C4F'
  }
});
```

A surface that displays your name, is 200px wide and 100% in height, has
#FA5C4F background color, has white, center aligned text, has 40px font size,
has 15px border radius

```javascript
var Engine = require('famous/core/Engine');
var Surface = require('famous/core/Surface');
var mainContext = Engine.createContext();

var surface = new Surface({
  content: '<h4>Brent Vatne</h1>',
  size: [200, undefined],
  properties: {
    textAlign: 'center',
    background: '#FA5C4F',
    color: '#fff',
    fontSize: '40px',
    borderRadius: '15px'
  }
})

mainContext.add(surface);
```

You can position a surface using a modifier

```javascript
var stateModifier = new StateModifier({
  transform: Transform.translate(150, 100, 0)
});

mainContext.add(stateModifier).add(surface);
```

You can chain modifiers, but the order of the chaining matters! eg: if
you rotate and then translate, it is different than translate and then
rotate.

```javascript
mainContext
  .add(translateModifierOne)
  .add(rotateModifierOne)
  .add(redSurface);
```

You can branch modifiers by saving a reference to the context with the
modifier applied:

```javascript
var node = mainContext.add(downMod);
node.add(leftSurface);
node.add(rightMod).add(rightSurface);
```

You can change the origin, align, opacity, scale, etc.

```javascript
var originModifier = new StateModifier({
  opacity: 0.8,
  transform: Transform.scale(4, 3, 0.5),
  align: [0.5, 0.5],
  origin: [0.5, 0.5]
});
```

Not clear still on difference between origin and align.. origin for
child, align for parent..

### Animations

Animations can be done by using setTransform on a stateModifier:

```javascript
var stateModifier = new StateModifier();

mainContext.add(stateModifier).add(surface);

stateModifier.setTransform(
  Transform.translate(100, 300, 0),
  { duration : 1000, curve: 'easeInOut' }
);

// This one runs after the previous animation is complete
stateModifier.setTransform(
  Transform.translate(150, 10, 0),
  { duration : 1000, curve: 'easeInOut' },
  function() {
    alert('Done animations!')
  }
);
```

Lots of easings to use - access these ones with Easing.easeName in the
curve option - rather than the string value above 'easeInOut'

inQuad outQuad inOutQuad inCubic outCubic inOutCubic inQuart outQuart inOutQuart inQuint outQuint inOutQuint inSine outSine inOutSine inExpo outExpo inOutExpo inCirc outCirc inOutCirc inElastic outElastic inOutElastic inBack outBack inOutBack inBounce outBounce inOutBounce

You can interrupt animations before they end by calling `halt()` on the
state modifier. If you don't do another `setTransform` after halting
then it will just jump right to the finished state of the transform that
was halted - this will look ugly so it's best to finish it off quickly,
like below.

```javascript
stateModifier.setTransform(
  Transform.translate(0, 400, 0),
  { duration : 8000, curve: 'linear' }
);

surface.on('click', function() {
  stateModifier.halt();
  surface.setContent('halted');
  stateModifier.setTransform(
    Transform.translate(0, 400, 0),
    { duration : 400, curve: Easing.outBounce }
  );
```

You can use physics transitions instead of easing curves

```javascript
var SpringTransition = require('famous/transitions/SpringTransition');
Transitionable.registerMethod('spring', SpringTransition);

stateModifier.setTransform(
  Transform.translate(0, 300, 0),
  { method: 'spring', period: 1000, dampingRatio: 0.3 }
);
```

### Events

#### Surface events

click mousedown mousemove mouseup mouseover mouseout touchstart touchmove touchend touchcancel keydown keyup keypress

```javascript
surface.on('mouseover', function() {
  surface.setProperties({
    backgroundColor: '#878785'
  });
});

surface.on('mouseout', function() {
  surface.setProperties({
    backgroundColor: '#FA5C4F'
  });
});
```

`touch` events don't work with a desktop click.

#### Engine events

```javascript
Engine.on('keydown', function(e) {
  surface.setContent(e.which);
});
```

This is like doing `$(document).on('click')` - events are first given a
chance to be handled by the surface that they are triggered on, then
propagate up to the Engine.

It also has some other useful events that aren't triggered on surfaces,
like `prerender` and `postrender` and `resize`. The render events are
triggered approximately every 16.7ms at 60fps.

```javascript
Engine.on('resize', function() {
  surface.setContent('resized');
});
```

#### Program events

"Events are a way of moving information between program modules in a
decoupled way. In Famo.us we emit, transmit, and listen to program
events using Event Handler objects." - in other words, you can use this
as an event bus between multiple components for inter-component communication.

```javascript
var surface;
createSurface();
var eventHandler = new EventHandler();

surface.on('click', function() {
  eventHandler.emit('hello');
});

eventHandler.on('hello', function() {
  surface.setContent('heard hello');
});
```

Not quite sure why yet, but apparently it's more common to have multiple
event handlers which subscribe to each other.

```javascript
var surfaceA, surfaceB;
createSurfaces();

var eventHandlerA = new EventHandler();
var eventHandlerB = new EventHandler();

surfaceA.on('click', function() {
  eventHandlerA.emit('hello');
  surfaceA.setContent('said hello');
});

eventHandlerB.subscribe(eventHandlerA);
// eventHandlerA.pipe(eventHandlerB); has the same effect
// but eventHandlerA will emit to B, which is unaware of A,
// whereas in subscribe, eventHandlerA is unaware of B.

eventHandlerB.on('hello', function() {
  surfaceB.setContent('heard hello');
});
```

Use views to organize code and aggregate events.
```javascript
var myView = new View();
mainContext.add(myView);

var surface = new Surface // etc ..

myView.add(surface);
surface.pipe(myView);

// normally inside view module's code
myView._eventInput.on('click', function() {
  myView._eventOutput.emit('hello');
});

// listening to view's events from the outside
myView.on('hello', function() {
  surface.setContent('hello');
});
```

Unlike surfaces, views don't actually map to DOM elements - "they're
empty render nodes with some extra features." In addition, they do not
have a size by default. So we need to use a StateModifier to set their
size. The following example defines a `SlideView` class, which inherits
from the base `View` class and sets a size on it.


```javascript
define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  function SlideView() {
    View.apply(this, arguments);

    this.rootModifier = new StateModifier({
        size: [400, 450]
    });

    // saving a reference to the new node
    this.mainNode = this.add(this.rootModifier);
  }

  SlideView.prototype = Object.create(View.prototype);
  SlideView.prototype.constructor = SlideView;

  SlideView.DEFAULT_OPTIONS = {};

  module.exports = SlideView;
});
```

Events get captured at the surface level and do not automatically bubble up to the view

```javascript
// Where slide is a view, and we want this to be called whenever any of
// the surfaces within that view are clicked.
slide.on('click', this.showNextSlide.bind(this));
```

If there are several surfaces inside of the `slide` view here, we can
just set some of them to have `pointerEvents: 'none'` in the properties
and attach the click handler to whichever surface spans the whole view.

```javascript
// Where this is the instance of the slide view
// * Be sure to bind the callback to this also, otherwise there
//   will be a stack overflow as it will just repeatedly emit
//   click on the surface.
//
background.on('click', function() {
  // the event output handler is used to broadcast outwards
  this._eventOutput.emit('click');
}.bind(this));

// And for the other surfaces, make them not register click events
// For example on the photo ImageSurface:
var photo = new ImageSurface({
  size: [size, size],
  content: this.options.photoUrl,
  properties: {
    zIndex: 2,
    pointerEvents: 'none'
  }
});
```

### Speaking of ImageSurface..
Use this instead of setting content of `<img>` inside of a normal
surface - `ImageSurface` will only be rendered as an `img` tag, whereas
if it was within a surface it would be nested within a `div`.


### Pitfalls

* It's good to set both z-index and z-translate - some browsers don't
  work properly so both will be required
