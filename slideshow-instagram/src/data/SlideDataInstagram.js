define(function(require, exports, module) {
  var InstagramApiAuth = require('data/InstagramApiAuth');

  var apiConfig = {
    userId: InstagramApiAuth.userId,
    accessToken: InstagramApiAuth.accessToken,
    clientId: InstagramApiAuth.clientId,
    instagramUrl: 'https://api.instagram.com/v1/users/{{userId}}/media/recent?client_id={{clientId}}',
  };

  var SlideDataInstagram = {
      defaultImage: 'http://photos-h.ak.instagram.com/hphotos-ak-xap1/10731861_704162169665879_1351785239_n.jpg'
  };

  SlideDataInstagram.getUrl = function() {
    return apiConfig.instagramUrl.
      replace('{{userId}}', apiConfig.userId).
      replace('{{clientId}}', apiConfig.clientId);

  };

  SlideDataInstagram.parse = function(response) {
    var urls = [];
    var entries = response.data;
    for (var i = 0; i < entries.length; i++) {
      var url = entries[i].images.standard_resolution.url;
      urls.push(url);
    }
    return urls;
  };

  module.exports = SlideDataInstagram;
});
