import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  block: Ember.computed(function() {
    const id = this.get('blockId');
    const store = this.get('store');
    return store.peekRecord('block', id) ||
      store.push({ data: { id, type: 'block' } });
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
