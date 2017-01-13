import Ember from 'ember';
export default Ember.Service.extend({
  store: Ember.inject.service(),

  dismissals: Ember.computed(function() {
    return this.get('store').findAll('ui-dismissal');
  })
});
