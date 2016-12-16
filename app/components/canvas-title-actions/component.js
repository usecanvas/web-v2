import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['canvas-title-actions'],
  menuIsShowing: false,
  router: Ember.inject.service(),

  actions: {
    deleteCanvas() {
      this.get('onDeleteCanvas')(this.get('canvas'), {
        transitionTo: ['team']
      });
    },

    navigateHistory() {
      this.get('onNavigateHistory')();
    },

    onUseTemplate() {
      this.get('onUseTemplate')();
    },

    toggleMenu() {
      this.toggleProperty('menuIsShowing');
    }
  }
});
