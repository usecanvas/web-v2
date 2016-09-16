import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  insertedAt: attr(),
  updatedAt: attr()
});
