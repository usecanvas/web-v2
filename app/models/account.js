import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  insertedAt: attr('date'),
  updatedAt: attr('date')
});
