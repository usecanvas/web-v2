import Ember from 'ember';

export default Ember.Component.extend({
  isOpen: false,
  localClassNames: ['ui-dropdown'],

  actions: {
    toggleOpen() {
      this.toggleProperty('isOpen');
    }
  }
});
