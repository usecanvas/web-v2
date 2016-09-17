import Ember from 'ember';

const { computed } = Ember;

export default Ember.Service.extend({
  currentAccount: Ember.inject.service(),
  store: Ember.inject.service(),

  teams: computed('currentAccount.currentAccount', function() {
    return this.get('store').findAll('team');
  })
});
