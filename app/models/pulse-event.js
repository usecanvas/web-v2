import DS from 'ember-data';
import Ember from 'ember';

const { attr, belongsTo } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  providerName: attr(),
  providerUrl: attr(),
  referencer: attr(),
  type: attr(),
  url: attr(),

  canvas: belongsTo('canvas', { async: true }),

  insertedAt: attr('date'),
  updatedAt: attr('date'),

  unfurled: computed('url', function() {
    return this.store.findRecord('unfurl', this.get('url'));
  })
});
