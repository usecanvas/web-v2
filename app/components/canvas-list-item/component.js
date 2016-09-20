import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['canvas-list-item'],

  actions: {
    deleteCanvas(canvas) {
      canvas.destroyRecord({ adapterOptions: { team: canvas.get('team') } });
    }
  }
});
