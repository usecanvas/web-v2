import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  canvasID: Ember.computed('canvas', function() {
    return this.belongsTo('canvas').id();
  }),
  canvas: DS.belongsTo('canvas')
});
