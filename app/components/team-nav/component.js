import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  localClassNames: ['team-nav'],
  currentAccount: Ember.inject.service(),
  user: computed.readOnly('currentAccount.currentUser')
});
