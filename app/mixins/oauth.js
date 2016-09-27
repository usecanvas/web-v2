import Ember from 'ember';

const { computed } = Ember;

export default Ember.Mixin.create({
  /**
   * An OAuth client ID
   * @member {string}
   */
  clientID: '',

  /**
   * An endpoint for authorizing
   * @member {string}
   */
  endpoint: '',

  /**
   * An OAuth redirect URL
   * @member {string}
   */
  redirectURL: '',

  /**
   * A list of OAuth identity scopes
   * @member {Array<string>}
   */
  scope: computed(_ => []),

  /**
   * A string used to identify OAuth flow state
   * @member {string}
   */
  state: '',

  /**
   * OAuth scopes formatted as a query parameter
   * @member {string}
   */
  scopeParam: computed('scope.[]', function() {
    return this.get('scope').join(',');
  }),


  /**
   * A URL used to sign in
   * @member {string}
   */
  authorizeURL: computed('endpoint', 'scopeParam', function() {
    return `${this.get('endpoint')}?scope=${this.get('scopeParam')}\
&client_id=${this.get('clientID')}\
&state=${this.get('state')}\
&redirect_uri=${this.get('redirectURL')}`;
  })
});
