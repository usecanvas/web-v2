import Ember from 'ember';

const { computed, inject } = Ember;

export default Ember.Controller.extend({
  currentAccount: inject.service(),
  loggedIn: computed.alias('currentAccount.loggedIn')
});
