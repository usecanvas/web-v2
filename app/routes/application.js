import Ember from 'ember';
import RSVP from 'rsvp';

/**
 * Top-level application route.
 *
 * @class CanvasWeb.ApplicationRoute
 * @extends Ember.Route
 */
export default Ember.Route.extend({
  /**
   * Service for the signed-in account
   * @member {Ember.Service}
   */
  currentAccount: Ember.inject.service(),

  /**
   * List of unauthenticated routes
   * @member {Array<string>}
   */
  unauthenticatedRoutes: 'login'.w(),

  /**
   * Callback before model is loaded that fetches the logged-in account and
   * redirects accordingly.
   *
   * @method
   * @override
   * @param {object} transition An Ember route transition object
   * @returns {Ember.RSVP.Promise} A promise resolving once account state is
   *   determined
   */
  beforeModel({ targetName }) {
    return this.get('currentAccount')
      .fetch()
      .then(_ => this.onAccountFetch(targetName, true))
      .catch(_ => this.onAccountFetch(targetName, false));
  },

  model() {
    if (!this.get('currentAccount.currentAccount')) return null;

    return RSVP.hash({
      account: this.get('currentAccount.currentAccount'),
      teams: this.get('store').findAll('team')
    });
  },

  /**
   * Redirect the user to the login screen if they are not authenticated and not
   * visiting an unauthenticated route.
   *
   * @method
   * @param {string} targetName The name of the transition target
   * @param {boolean} signedIn Whether a user is signed in
   */
  onAccountFetch(targetName, signedIn) {
    if (!signedIn && !this.get('unauthenticatedRoutes').includes(targetName)) {
      this.replaceWith('login');
    }
  }
});
