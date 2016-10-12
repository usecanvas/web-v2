import DS from 'ember-data';
import Ember from 'ember';

const { attr, belongsTo, hasMany } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  avatarUrl: attr(),
  email: attr(),
  images: attr(),
  name: attr(),
  slackId: attr(),

  canvases: hasMany('canvas', { async: true }),
  team: belongsTo('team', { async: true }),

  insertedAt: attr('date'),
  updatedAt: attr('date'),

  image72: computed('images.[]', function() {
    return this.get('images.image_72');
  })
});
