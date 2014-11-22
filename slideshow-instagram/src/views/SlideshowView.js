/*** SlideshowView ***/

define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Lightbox = require('famous/views/Lightbox');

  var SlideView = require('views/SlideView');

  function SlideshowView() {
    View.apply(this, arguments);

    // Previously we just add one slide view here
    // var slideView = new SlideView();
    // this.add(slideView);

    // Now we give it a base size and alignment so we can use it
    // with the Lightbox view module
    //
    var rootModifier = new StateModifier({
      size: this.options.size,
      origin: [0.5, 0],
      align: [0.5, 0]
    });

    this.mainNode = this.add(this.rootModifier);
    _createLightbox.call(this);
    _createSlides.call(this);
  }

  function _createLightbox() {
    this.lightbox = new Lightbox(this.options.lightboxOpts);
    this.mainNode.add(this.lightbox);
  }

  function _createSlides() {
    this.slides = [];
    this.currentIndex = 0;

    // Add the slide views to the slides array but do not yet
    // add them to the render tree
    //
    for (var i = 0; i < this.options.data.length; i++) {
      var slide = new SlideView({
        size: this.options.size,
        photoUrl: this.options.data[i]
      })

      this.slides.push(slide);
      slide.on('click', this.showNextSlide.bind(this));
    }

    this.showCurrentSlide();
  }

  SlideshowView.prototype = Object.create(View.prototype);
  SlideshowView.prototype.constructor = SlideshowView;
  SlideshowView.prototype.showCurrentSlide = function() {
    var slide = this.slides[this.currentIndex];
    this.lightbox.show(slide);
  }

  SlideshowView.prototype.showNextSlide = function() {
    this.currentIndex++;
    if (this.currentIndex == this.slides.length) this.currentIndex = 0;
    this.showCurrentSlide();
  }

  SlideshowView.DEFAULT_OPTIONS = {
    size: [450, 500],
    data: undefined, // This just serves as documentation
    lightboxOpts: {}
  };

  module.exports = SlideshowView;
});
