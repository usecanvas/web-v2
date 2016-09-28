import ENV from 'canvas-web/config/environment';
import Ember from 'ember';
import OAuth from 'canvas-web/mixins/oauth';

/**
 * Provides a link which a user can click to sign in with GitHub.
 *
 * @class CanvasWeb.GitHubOAuthComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend(OAuth, {
  clientID: ENV.gitHubClientID,
  endpoint: 'https://github.com/login/oauth/authorize',
  redirectURL: ENV.gitHubRedirectURL,
  scope: 'repo'.w()
});
