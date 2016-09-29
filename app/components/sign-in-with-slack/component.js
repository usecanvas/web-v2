import ENV from 'canvas-web/config/environment';
import Ember from 'ember';
import OAuth from 'canvas-web/mixins/oauth';

/**
 * Provides a button which a user can click to sign in with Slack.
 *
 * @class CanvasWeb.SignInWithSlackComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend(OAuth, {
  clientID: ENV.slackClientID,
  endpoint: 'https://slack.com/oauth/authorize',
  redirectURL: ENV.slackRedirectURI,
  scope: 'identity.avatar identity.basic identity.team identity.email'.w(),
  state: 'identity'
});
