import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  blocks: DS.attr(),
  updatedAt: DS.attr('date'),
  canvas: DS.belongsTo('canvas'),
  block: DS.belongsTo('block'),
  creator: DS.belongsTo('user'),

  // This is necessary because comment.get('block.id') will trigger
  // a fetch even though it has the id property already
  blockId: Ember.computed('block', function() {
    return this.belongsTo('block').id();
  })
});
