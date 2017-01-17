import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  content: '',

  submit: task(function *(content) {
    yield this.get('createComment')(content);
    this.set('content', '');
  }).drop()
});
