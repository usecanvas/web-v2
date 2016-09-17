import Ember from 'ember';

const { computed } = Ember;

export default Ember.Service.extend({
  currentAccount: Ember.inject.service(),
  store: Ember.inject.service(),

  /**
   * The logged-in account's teams.
   * @member {Array<CanvasWeb.Team>}
   */
  teams: computed('currentAccount', function() {
    return this.get('store').findAll('team');
  })
});
