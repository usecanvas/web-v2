import ENV from 'canvas-web/config/environment';
import Ember from 'ember';

const { computed } = Ember;

/**
 * Provides a button which a user can click to sign in with Slack.
 *
 * @class CanvasWeb.SignInWithSlackComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  /**
   * An endpoint for authorizing with Slack
   * @member {string}
   */
  endpoint: 'https://slack.com/oauth/authorize',

  /**
   * A list of OAuth identity scopes for Slack
   * @member {Array<string>}
   */
  scope: 'identity.avatar identity.basic identity.team identity.email'.w(),

  /**
   * OAuth scopes formatted as a query parameter
   * @member {string}
   */
  scopeParam: computed('scope.[]', function() {
    return this.get('scope').join(',');
  }),

  /**
   * A string used to identify OAuth flow state
   * @member {string}
   */
  state: 'identity',

  /**
   * A URL used to sign in with Slack
   * @member {string}
   */
  authorizeURL: computed('endpoint', 'scopeParam', function() {
    return `${this.get('endpoint')}?scope=${this.get('scopeParam')}&client_id=${ENV.slackClientID}&state=${this.get('state')}`;
  })
});
