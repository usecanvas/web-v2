import DS from 'ember-data';

const { attr, belongsTo } = DS;

/**
 * A model representing a single OT operation on a canvas.
 *
 * @class CanvasWeb.Op
 * @extends DS.Model
 */
export default DS.Model.extend({
  components: attr(),
  version: attr(),

  canvas: belongsTo('canvas', { async: true }),

  insertedAt: attr('date'),
  updatedAt: attr('date')
});
