import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  intercomHash: attr(),
  insertedAt: attr('date'),
  updatedAt: attr('date')
});
