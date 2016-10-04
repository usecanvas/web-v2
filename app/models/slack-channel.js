import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  name: attr(),
  topic: attr(),

  team: belongsTo('team', { async: true, inverse: 'channels' })
}).reopenClass({
  modelName: 'slack-channel'
});
