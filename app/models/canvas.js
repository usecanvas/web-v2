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
  markdown: attr(),

  team: belongsTo('team', { async: true }),
  comments: hasMany('comment', { async: true }),
  template: belongsTo('canvas', { async: true }),
  ops: hasMany('op', { async: true }),
  pulseEvents: hasMany('pulseEvent', { async: true }),

  editedAt: attr('date'),
  insertedAt: attr('date'),
  updatedAt: attr('date'),

  creator: belongsTo('user', { async: true }),

  apiURL: computed('id', 'team', function() {
    const path = CanvasAdapter.create().urlForFindRecord(
      this.get('id'),
      this.get('constructor.modelName'),
      { adapterOptions: { team: this.get('team') } });

    return `${ENV.apiURL.replace(/\/v1\/$/, '')}${path}`;
  }),

  webURL: computed('team.domain', 'id', function() {
    const domain = this.get('team.domain');
    const id = this.get('id');
    return `https://pro.usecanvas.com/${domain}/${id}`;
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
  }),

  /**
   * Update the template ID of the canvas.
   *
   * @method
   * @param {string} templateID The ID of the new template
   * @returns {Promise<CanvasWeb.Canvas} The updated canvas
   */
  updateTemplate(templateID) {
    return this.store.adapterFor(this.constructor.modelName)
      .updateTemplate(this, templateID)
      .then(_ => this);
  }
});
