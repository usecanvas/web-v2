import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  createComment: task(function *(content) {
    const store = this.get('store');
    const canvas = this.get('canvas');
    const block = yield store.findRecord('block', this.get('blockId'));

    yield store.createRecord('comment', {
      blocks: [{ type: 'paragraph', content }],
      canvas,
      block
    }).save();
  }).drop(),

  editComment: task(function *(comment, content) {
    comment.set('blocks', [{ type: 'paragraph', content }]);
    yield comment.save();
  }).drop(),

  removeComment: task(function *(comment) {
    yield comment.destroyRecord();
  }).drop(),
});
