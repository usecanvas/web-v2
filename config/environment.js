/* eslint-env node */

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'canvas-web',
    debugWebSockets: false,
    environment,
    isElectron: process.env.EMBER_CLI_ELECTRON,
    gitHubClientID: process.env.GITHUB_CLIENT_ID,
    gitHubRedirectURL: process.env.GITHUB_REDIRECT_URL,
    intercomAppID: process.env.INTERCOM_APP_ID,
    rootURL: process.env.EMBER_CLI_ELECTRON ? '' : '/',
    locationType: process.env.EMBER_CLI_ELECTRON ? 'hash' : 'auto',
    realtimeHost: process.env.REALTIME_HOST,
    apiURL: process.env.API_URL,
    slackClientID: process.env.SLACK_CLIENT_ID,
    slackRedirectURI: slackRedirectURI(process.env.NODE_ENV),
    slackAddRedirectURI: addToSlackRedirectURI(process.env.NODE_ENV),
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    segment: {
      LOG_EVENT_TRACKING: environment === 'development',
      WRITE_KEY: process.env.SEGMENT_WRITE_KEY
    },

    'ember-cli-mirage': {
      enabled: environment === 'test'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') { // eslint-disable-line no-empty
  }

  return ENV;
};

function addToSlackRedirectURI(env) {
  if (env === 'production') {
    const segments = process.env.API_URL.split('/');
    const apiURL = segments.slice(0, segments.length - 2).join('/');
    return `${apiURL}/oauth/slack/add-to-slack/callback`;
  }

  return 'http://localhost:4000/oauth/slack/add-to-slack/callback';
}

function slackRedirectURI(env) {
  if (env === 'production') {
    const segments = process.env.API_URL.split('/');
    const apiURL = segments.slice(0, segments.length - 2).join('/');
    return `${apiURL}/oauth/slack/callback`;
  }

  return 'http://localhost:4000/oauth/slack/callback';
}
