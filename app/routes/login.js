import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * Service for the signed-in account
   * @member {Ember.Service}
   */
  currentAccount: Ember.inject.service(),

  /**
   * Callback called before the model is loaded in order to ensure no user is
   * logged in.
   *
   * @method
   */
  beforeModel() {
    if (this.get('currentAccount.currentAccount')) this.replaceWith('index');
  }
});
