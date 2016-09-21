import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['canvas-title-actions'],
  menuIsShowing: false,

  actions: {
    toggleMenu() {
      this.toggleProperty('menuIsShowing');
    }
  }
});
