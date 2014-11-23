/*** SlideView ***/
define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var SlideData = require('data/SlideDataInstagram');

  function SlideView() {
    View.apply(this, arguments);

    // Views do not have a default size
    this.rootModifier = new StateModifier({
      size: this.options.size,
      origin: [0.5,0],
      align: [0.5,0]
    })

    this.mainNode = this.add(this.rootModifier);

    _createBackground.call(this);
    _createFilm.call(this);
    _createPhoto.call(this);
  }

  SlideView.prototype = Object.create(View.prototype);
  SlideView.prototype.constructor = SlideView;
  SlideView.DEFAULT_OPTIONS = {
    size: [400, 350],
    filmBorder: 15,
    photoBorder: 3,
    photoUrl: SlideData.defaultImage
  };

  function _createBackground() {
    var background = new Surface({
      properties: {
        backgroundColor: '#FFFFF5',
        boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)'
      }
    });

    this.mainNode.add(background);
    background.on('click', (function() {
      this._eventOutput.emit('click');
    }).bind(this));
  }

  function _createFilm() {
    this.options.filmSize = this.options.size[0] - 2 * this.options.filmBorder;

    var film = new Surface({
      size: [this.options.filmSize, this.options.filmSize],
      properties: {
        backgroundColor: '#000',
        pointerEvents: 'none',
        zIndex: 1
      }
    });

    var filmModifier = new StateModifier({
      origin: [0.5, 0],
      align: [0.5, 0],
      transform: Transform.translate(0, this.options.filmBorder, 1)
    });

    this.mainNode.add(filmModifier).add(film);
  }

  function _createPhoto() {
    var photoSize = this.options.filmSize - 2 * this.options.photoBorder;

    var photo = new ImageSurface({
      size: [photoSize, photoSize],
      content: this.options.photoUrl,
      properties: {
        pointerEvents: 'none',
        zIndex: 2
      }
    });

    // The horizontal positioning is done through origin/align and the vertical
    // positioning is done through transform: translate - because the view is
    // larger than it is wide and we don't quite want it vertically centered.
    //
    var photoModifier = new StateModifier({
      origin: [0.5, 0],
      align: [0.5, 0],
      transform: Transform.translate(0, this.options.filmBorder + this.options.photoBorder, 2)
    })

    this.mainNode.add(photoModifier).add(photo);
  }

  module.exports = SlideView;
});
