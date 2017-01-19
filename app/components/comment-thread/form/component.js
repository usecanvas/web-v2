import Ember from 'ember';
import Key from 'canvas-web/lib/key';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  content: '',

  submit: task(function *(content) {
    yield this.get('submitComment')(content);
    this.set('content', '');
  }).drop(),

  actions: {
    commentKeyDown(_, evt) {
      evt.stopPropagation();
      const key = new Key(evt.originalEvent);
      if (key.is('meta', 'return')) {
        this.get('submit').perform(this.get('content'));
      }
    }
  }
});
