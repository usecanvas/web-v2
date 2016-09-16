import DS from 'ember-data';
import Ember from 'ember';

const { attr } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  name: attr(),
  imageUrl: attr(),
  insertedAt: attr(),
  updatedAt: attr(),

  image88: computed('imageUrl', function() {
    return this.get('imageUrl').replace(/_original\.png$/, '_88.png');
  })
});
