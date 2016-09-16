import DS from 'ember-data';
import Ember from 'ember';

const { attr } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  name: attr(),
  images: attr(),
  insertedAt: attr(),
  updatedAt: attr(),

  image88: computed('images.[]', function() {
    return this.get('images.image_88');
  })
});
