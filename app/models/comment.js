import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  blocks: DS.attr(),
  insertedAt: DS.attr('date', { defaultValue() { return new Date(); } }),
  updatedAt: DS.attr('date'),
  canvas: DS.belongsTo('canvas'),
  block: DS.belongsTo('block'),
  creator: DS.belongsTo('user'),
  blockID: Ember.computed.readOnly('block.id')
});
