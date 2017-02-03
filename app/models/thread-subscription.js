import DS from 'ember-data';

export default DS.Model.extend({
  subscribed: DS.attr(),
  canvas: DS.belongsTo('canvas')
});
