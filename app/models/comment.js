import DS from 'ember-data';

export default DS.Model.extend({
  blocks: DS.attr(),
  insertedAt: DS.attr('date', { defaultValue() { return new Date(); } }),
  updatedAt: DS.attr('date'),
  canvas: DS.belongsTo('canvas'),
  block: DS.belongsTo('block'),
  creator: DS.belongsTo('user'),
});
