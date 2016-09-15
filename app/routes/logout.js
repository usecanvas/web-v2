import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * Service for the signed-in account
   * @member {Ember.Service}
   */
  currentAccount: Ember.inject.service(),

  /**
   * Callback called before the model is loaded in order to log the user out.
   *
   * @method
   * @memberof Web.ApplicationRoute
   * @instance
   * @private
   * @returns {Ember.RSVP.Promise} A promise resolving when the user has been
   *   successfully logged out
   */
  beforeModel() {
    return this.get('currentAccount')
               .logout()
               .then(_ => this.transitionTo('login'))
               .catch(err => {
                 throw err;
               });
  }
});
