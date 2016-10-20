import Ember from 'ember';

const { inject } = Ember;

export default Ember.Service.extend({
  store: inject.service(),

  unfurl(url) {
    return this.get('store').findRecord('unfurl', url);
  }
});
