import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  canvasSorting: ['updatedAt:desc'],
  sortedCanvases: computed.sort('canvases', 'canvasSorting')
});
