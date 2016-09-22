/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  app.import('vendor/normalize.css');
  app.import('vendor/diff-match-patch.js');
  app.import('vendor/shims/diff-match-patch.js');
  app.import('vendor/sharedb.js');
  app.import('vendor/shims/sharedb.js');
  app.import(`${app.bowerDirectory}/reconnectingWebsocket/reconnecting-websocket.js`);
  app.import('vendor/shims/reconnecting-websocket.js');

  return app.toTree();
};
