import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  localClassNames: ['canvas-list'],
  canvasSorting: ['updatedAt:desc'],
  sortedCanvases: computed.sort('canvases', 'canvasSorting')
});
