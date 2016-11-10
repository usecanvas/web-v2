import CanvasAdapter from 'canvas-web/adapters/canvas';
import DS from 'ember-data';
import ENV from 'canvas-web/config/environment';
import Ember from 'ember';

const { attr, belongsTo, hasMany } = DS;
const { computed, get } = Ember;

export default DS.Model.extend({
  blocks: attr(),
  isTemplate: attr(),
  linkAccess: attr(),
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

  downloadURL: computed('id', 'team', function() {
    const path = CanvasAdapter.create().urlForFindRecord(
      this.get('id'),
      this.get('constructor.modelName'),
      { adapterOptions: { team: this.get('team') } });

    return `${ENV.apiURL.replace(/\/v1\/$/, '')}${path}.canvas`;
  }),

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
  })
});
