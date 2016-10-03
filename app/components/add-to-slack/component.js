import ENV from 'canvas-web/config/environment';
import Ember from 'ember';
import OAuth from 'canvas-web/mixins/oauth';

export default Ember.Component.extend(OAuth, {
  clientID: ENV.slackClientID,
  endpoint: 'https://slack.com/oauth/authorize',
  redirectURL: ENV.slackRedirectURI,
  scope: 'incoming-webhook commands bot'.w()
});
