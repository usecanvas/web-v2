import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  email: attr(),
  slackId: attr(),
  insertedAt: attr(),
  updatedAt: attr()
});
