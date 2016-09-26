/* eslint-env node */

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    sourcemaps: {
      enabled: true
    },

    inlineContent: {
      sentry: {
        enabled: Boolean(process.env.SENTRY_DSN),
        content: `<script>
                    Raven.config('${process.env.SENTRY_DSN}').install();
                    Raven.setRelease('${process.env.HEROKU_RELEASE_VERSION}');
                  </script>`
      }
    }
  });

  app.import('vendor/normalize.css');
  app.import('vendor/diff-match-patch.js');
  app.import('vendor/shims/diff-match-patch.js');
  app.import('vendor/sharedb.js');
  app.import('vendor/shims/sharedb.js');
  app.import(`${app.bowerDirectory}/reconnectingWebsocket/reconnecting-websocket.js`);
  app.import('vendor/shims/reconnecting-websocket.js');
  app.import(`${app.bowerDirectory}/raven-js/dist/raven.js`);
  app.import(`${app.bowerDirectory}/raven-js/dist/plugins/ember.js`);
  app.import('vendor/shims/raven.js');

  return app.toTree();
};
