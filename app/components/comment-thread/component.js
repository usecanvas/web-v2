import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  comments: [1, 2, 3, 4],
  store: Ember.inject.service(),

  block: Ember.computed(function() {
    const id = this.get('blockId');
    const store = this.get('store');
    return store.peekRecord('block', id) ||
      store.createRecord('block', { id });
  }),

  createComment: task(function *(content) {
    const canvas = this.get('canvas');
    const block = this.get('block');

    const comment = yield this.get('store').createRecord('comment', {
      blocks: [{ type: 'paragraph', content }],
      canvas,
      block
    }).save();

    this.get('comments').pushObject(comment);
  }).drop(),
});
