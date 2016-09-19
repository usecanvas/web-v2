import DS from 'ember-data';
import Ember from 'ember';

const { attr, belongsTo, hasMany } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  domain: attr(),
  name: attr(),
  images: attr(),

  canvases: hasMany('canvas', { async: true }),
  user: belongsTo('user', { async: true }),

  insertedAt: attr('date'),
  updatedAt: attr('date'),

  image88: computed('images.[]', function() {
    return this.get('images.image_88');
  })
});