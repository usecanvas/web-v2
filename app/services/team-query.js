import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  findByDomain(domain) {
    return this.get('store')
      .query('team', { filter: { domain } })
      .then(query => query.get('firstObject'));
  }
});
