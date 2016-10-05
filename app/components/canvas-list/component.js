import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  sortedCanvases: computed.sort('canvases', function(canvasA, canvasB) {
    const timeA = canvasA.get('editedAt') || canvasA.get('updatedAt');
    const timeB = canvasB.get('editedAt') || canvasB.get('updatedAt');

    return timeB - timeA;
  })
});
