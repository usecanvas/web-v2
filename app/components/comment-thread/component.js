import Ember from 'ember';
import Paragraph from 'canvas-editor/lib/realtime-canvas/paragraph';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  blockId: 0, //default block id

  subscribeProps: Ember.computed(_ => ({})),
  subscription: Ember.computed('subscribeProps.subscriptions.[]', function() {
    if (this.get('subscribeProps.subscriptions.isFulfilled')) {
      return this.findRecord('subscription', this.get('blockId'));
    }
    return this.materializeSubscription(this.get('blockId'));
  }),

  materializeSubscription(id) {
    const [type, subscribed] = ['subscription',
      this.get('subscribeProps.defaultSubscribeState')];
    const attributes = { subscribed };
    const relationships = { canvas:
      { type: 'canvas', id: this.get('canvas.id') } };
    const payload = { data: { id, type, attributes, relationships } };

    return this.get('store').push(payload);
  },

  createComment: task(function *(content) {
    const store = this.get('store');
    const canvas = this.get('canvas');
    const block = yield store.findRecord('block', this.get('blockId'));
    const contentBlock = Paragraph.create({ content });
    const blocks = [contentBlock.toJSON({ serializeId: true })];

    yield store.createRecord('comment',
                             { blocks, canvas, block }).save();
  }).drop(),

  editComment: task(function *(comment, content) {
    comment.set('blocks', [{ type: 'paragraph', content }]);
    yield comment.save();
  }).drop(),

  removeComment: task(function *(comment) {
    yield comment.destroyRecord();
  }).drop(),

  toggleSubscription: task(function *(subscription) {
    subscription.toggleProperty('subscribed');
    yield subscription.save();
  }).drop(),
});
