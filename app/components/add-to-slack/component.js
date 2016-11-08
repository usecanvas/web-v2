import ENV from 'canvas-web/config/environment';
import Ember from 'ember';
import OAuth from 'canvas-web/mixins/oauth';

export default Ember.Component.extend(OAuth, {
  clientID: ENV.slackClientID,
  endpoint: 'https://slack.com/oauth/authorize',
  localClassNames: ['add-to-slack'],
  redirectURL: ENV.slackAddRedirectURI,
  scope: `
    bot
    channels:history
    channels:read
    chat:write:bot
    commands
    team:read
    users:read
    `.w(),
  state: 'add'
});
