import DS from 'ember-data';
import Ember from 'ember';

const { attr, belongsTo } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  blocks: attr(),
  nativeVersion: attr(),
  type: attr(),
  version: attr(),

  team: belongsTo('team', { async: true }),

  insertedAt: attr(),
  updatedAt: attr(),

  firstContentBlock: computed('blocks.[]',
                              'blocks.@each.blocks',
                              'blocks.@each.content', function() {
    const firstContentBlock = this.get('blocks.1');

    if (!firstContentBlock) return null;
    return firstContentBlock.get('blocks.firstObject') || firstContentBlock;
  }),

  summary: computed('firstContentBlock.content', function() {
    return (this.get('firstContentBlock.content') || '').slice(0, 140) ||
      'No content';
  }),

  title: computed('blocks.firstObject.content', function() {
    return this.get('blocks.firstObject.content') || 'Untitled';
  })
});
