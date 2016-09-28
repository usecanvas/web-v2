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
  scope: 'repo'.w(),

  actions: {
    openAuthorizeURL() {
      const authWindow = window.open(
        this.get('authorizeURL'),
        'github-oauth',
        'height=800,width=1000');

      const isClosedInterval = setInterval(_ => {
        if (!authWindow.closed) return;
        window.location.reload();
        clearInterval(isClosedInterval);
      }, 1000);
    }
  }
});
