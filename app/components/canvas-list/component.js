import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  localClassNames: ['canvas-list'],
  canvasSorting: ['updatedAt:desc'],
  sortedCanvases: computed.sort('canvases', 'canvasSorting'),

  actions: {
    deleteCanvas(canvas) {
      canvas.destroyRecord({ adapterOptions: { team: canvas.get('team') } });
    }
  }
});
