import Ember from 'ember';

const { get } = Ember;

export default Ember.Component.extend({
  localClassNames: ['channel-topic-canvas'],
  store: Ember.inject.service(),

  actions: {
    unfurlBlock(block) {
      return this.get('store').findRecord('unfurl', get(block, 'meta.url'));
    }
  }
});
