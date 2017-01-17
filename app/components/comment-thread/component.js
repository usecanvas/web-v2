import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  createdComments: Ember.computed(_ => []),
  store: Ember.inject.service(),
  comments: Ember.computed.union('blockComments', 'createdComments'),

  blockComments: Ember.computed('blockId', 'canvas.id', function() {
    const canvas = this.get('canvas');
    const block = this.get('block');
    return this.get('store').query('comment', { filter: { canvas, block } });
  }),

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

    this.get('createdComments').pushObject(comment);
  }).drop(),
});
