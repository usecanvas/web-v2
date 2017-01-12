import ENV from 'canvas-web/config/environment';
import Ember from 'ember';
import OAuth from 'canvas-web/mixins/oauth';

const { computed } = Ember;

/**
 * A component that can be used to initiate a Slack OAuth flow.
 *
 * @class CanvasWeb.SlackOAuthComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend(OAuth, {
  /**
   * @member {Array<string>} A base set of non-invasive scopes that we request.
   */
  baseScopes: `bot
    channels:read
    chat:write:bot
    commands
    groups:read
    team:read
    users:read`.w(),

  /**
   * @member {?string} The Slack OAuth client ID
   */
  clientID: ENV.slackClientID,

  /**
   * @member {string} The Slack OAuth authorization endpoint URL
   */
  endpoint: 'https://slack.com/oauth/authorize',

  /**
   * @member {Array<string>} The scopes that the team currently has.
   */
  currentScopes: [],

  /**
   * @member {Array<string>} A set of extended invasive scopes to be added on
   *   to the base OAuth scope set
   */
  extendedScopes: [],

  /**
   * @member {?string} The redirect URI for the Slack OAuth client
   */
  redirectURL: ENV.slackAddRedirectURI,

  /**
   * @member {Array<string>} A list of scopes that will be requested unless
   * already granted.
   */
  unionScopes: Ember.computed.union('baseScopes', 'extendedScopes'),

  /**
   * @member {Array<string>} A list of scopes that will be requested.
   */
  scope: Ember.computed.setDiff('unionScopes', 'currentScopes'),

  /**
   * @member {string} A Slack OAuth state nonce—we are currently not making
   *   good use of this.
   */
  state: 'add'
});
