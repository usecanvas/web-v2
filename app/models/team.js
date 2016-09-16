import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  name: attr(),
  imageUrl: attr(),
  insertedAt: attr(),
  updatedAt: attr()
});
