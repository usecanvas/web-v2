import Ember from 'ember';

const { computed, inject } = Ember;

export default Ember.Component.extend({
  localClassNames: ['team-nav'],
  currentAccount: inject.service(),
  user: computed.readOnly('currentAccount.currentUser')
});
