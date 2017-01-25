import DS from 'ember-data';

export default DS.Model.extend({
  canvas: DS.belongsTo('canvas')
});
