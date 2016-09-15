import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Service.extend({
  /**
   * Fetch and set the logged-in account.
   *
   * @method
   * @returns {Ember.RSVP.Promise} A promise resolving once the user is fetched
   *   and set.
   */
  fetch() {
    return RSVP.Promise.reject();
  }
});
