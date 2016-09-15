import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Service.extend({
  /**
   * The logged-in account.
   * @member {CanvasWeb.Account}
   */
  currentAccount: null,

  /**
   * The data store
   * @member {DS.Store}
   */
  store: Ember.inject.service(),

  /**
   * Fetch and set the logged-in account.
   *
   * @method
   * @returns {Ember.RSVP.Promise} A promise resolving once the user is fetched
   *   and set
   */
  fetch() {
    return this.get('store').find('account', 'me').then(account => {
      this.set('currentAccount', account);
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
      return Ember.$.ajax('/session', { type: 'DELETE' }).then(_ => {
        this.set('currentAccount', null);
        resolve(null);
      });
    });
  }
});
