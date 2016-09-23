import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  findByDomain(domain) {
    return this.get('store')
      .query('team', { filter: { domain } })
      .then(queryResult => {
        const team = queryResult.get('firstObject');
        if (!team) {
          const err = new Error('Not found');
          err.status = 404;
          throw err;
        }
        return team;
      });
  }
});
