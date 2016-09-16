import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  blocks: attr(),
  nativeVersion: attr(),
  type: attr(),
  version: attr(),

  team: belongsTo('team', { async: true }),

  insertedAt: attr(),
  updatedAt: attr()
});
