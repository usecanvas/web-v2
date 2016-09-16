import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['canvas-list'],

  store: Ember.inject.service(),

  actions: {
    onNewCanvas() {
      const team = this.get('team');

      this.get('store').createRecord('canvas', { team }).save();
    }
  }
});
