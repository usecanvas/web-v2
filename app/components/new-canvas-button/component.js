import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['new-canvas-button'],
  store: Ember.inject.service(),

  click() {
    const team = this.get('team');

    this.get('store').createRecord('canvas', { team }).save();
  }
});
