import Ember from 'ember';

const { w } = Ember.String;

export default Ember.Component.extend({
  allowPublicAccess: false,
  permissions: w('view edit'),

  actions: {
    togglePublicAccess() {
      console.log('Toggling public access...');
      this.toggleProperty('allowPublicAccess');
    }
  }
});
