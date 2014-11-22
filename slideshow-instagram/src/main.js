define(function(require, exports, module) {
  var Engine  = require('famous/core/Engine');
  var Utility = require('famous/utilities/Utility');

  var SlideData = require('data/SlideDataInstagram');
  var AppView = require('views/AppView');

  var mainContext = Engine.createContext();

  $.ajax({
    type: "GET",
    dataType: "jsonp",
    cache: false,
    url: SlideData.getUrl(),
    success: initApp
  });

  function initApp(response) {
    var appView = new AppView({data: SlideData.parse(response)});
    mainContext.add(appView);
  }
});

