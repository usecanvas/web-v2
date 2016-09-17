import Ember from 'ember';

export default Ember.Route.extend({
  teamQuery: Ember.inject.service(),

  model({ 'team.domain': domain, id }) {
    return this.get('teamQuery').findByDomain(domain).then(team => {
      return this.get('store').findRecord('canvas', id, {
        adapterOptions: { team }
      });
    });
  }
});
