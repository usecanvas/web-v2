import Ember from 'ember';

export default Ember.Route.extend({
  model({ domain }) {
    return this.get('store')
      .query('team', { filter: { domain } })
      .then(query => query.get('firstObject'));
  }
});
