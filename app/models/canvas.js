import DS from 'ember-data';
import Ember from 'ember';

const { attr, belongsTo, hasMany } = DS;
const { computed, get } = Ember;

export default DS.Model.extend({
  blocks: attr(),
  isTemplate: attr(),
  nativeVersion: attr(),
  slackChannelIds: attr({ defaultValue: _ => [] }),
  type: attr(),
  version: attr(),

  team: belongsTo('team', { async: true }),
  template: belongsTo('canvas', { async: true }),
  pulseEvents: hasMany('pulseEvent', { async: true }),

  editedAt: attr('date'),
  insertedAt: attr('date'),
  updatedAt: attr('date'),

  creator: belongsTo('user', { async: true }),

  firstContentBlock: computed('blocks.[]',
                              'blocks.@each.blocks',
                              'blocks.@each.content', function() {
    const firstContentBlock = this.get('blocks.1');

    if (!firstContentBlock) return null;
    return get(firstContentBlock, 'blocks.firstObject') || firstContentBlock;
  }),

  summary: computed('firstContentBlock.content', function() {
    return (this.get('firstContentBlock.content') || '').slice(0, 140) ||
      'No content';
  }),

  title: computed('blocks.firstObject.content', function() {
    return this.get('blocks.firstObject.content') || 'Untitled';
  }),

  getWebUrl(blockId) {
    const { protocol, host, search } = window.location;
    const teamDomain = this.get('team.domain');
    const canvasId = this.get('id');

    return `${protocol}//${host}/${teamDomain}/${canvasId}${search}#${blockId}`;
  }
});
