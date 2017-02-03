import Ember from 'ember';
import Paragraph from 'canvas-editor/lib/realtime-canvas/paragraph';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  blockId: 0, //default block id

  subscribeProps: Ember.computed(_ => ({ subscriptions: [] })),

  subscription: Ember.computed('subscribeProps.subscriptions.[]', function() {
    const subscriptions = this.get('subscribeProps.subscriptions');
    return subscriptions.findBy('id', this.get('blockId'));
  }),

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

  setSubscription: task(function *(subscribed) {
    const canvas = this.get('canvas');
    const subscription = this.get('store').createRecord('thread-subscription', {
      id: this.get('blockId'), canvas, subscribed
    });
    yield subscription.save();
  }).drop(),

  toggleSubscription: task(function *(subscription) {
    subscription.toggleProperty('subscribed');
    yield subscription.save();
  }).drop(),
});
