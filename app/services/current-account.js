import Ember from 'ember';
import Raven from 'raven';
import RSVP from 'rsvp';

const { inject } = Ember;

export default Ember.Service.extend({
  /**
   * The logged-in account.
   * @member {CanvasWeb.Account}
   */
  currentAccount: null,

  /**
   * The active team user.
   * @member {CanvasWeb.User}
   */
  currentUser: null,

  /**
   * The CSRF token service
   * @member {Ember.Service}
   */
  csrfToken: inject.service(),

  loggedIn: false,

  /**
   * The data store
   * @member {DS.Store}
   */
  store: inject.service(),

  /**
   * Fetch and set the logged-in account.
   *
   * @method
   * @returns {Ember.RSVP.Promise} A promise resolving once the user is fetched
   *   and set
   */
  fetch() {
    return this.get('store').findRecord('account', 'me').then(account => {
      this.set('loggedIn', true);
      this.set('currentAccount', account);
      Raven.setUserContext(account.getProperties('id'));
      return account;
    });
  },

  /**
   * Log out the logged-in account.
   *
   * @method
   * @returns {Ember.RSVP.Promise} A promise resolving once the account is
   *   logged out
   */
  logout() {
    return new RSVP.Promise(resolve => {
      return Ember.$.ajax('/v1/session', {
        headers: { 'x-csrf-token': this.get('csrfToken.token') },
        type: 'DELETE'
      }).then(_ => {
        this.set('currentAccount', null);
        resolve(null);
      });
    });
  }
});
