import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  components: attr(),
  version: attr(),

  canvas: belongsTo('canvas', { async: true }),

  insertedAt: attr('date'),
  updatedAt: attr('date')
});
