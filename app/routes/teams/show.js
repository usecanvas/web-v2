import Ember from 'ember';

export default Ember.Route.extend({
  teamQuery: Ember.inject.service(),

  model({ domain }) {
    return this.get('teamQuery').findByDomain(domain);
  },

  actions: {
    didCreateCanvas(canvas) {
      this.transitionTo('teams.show.canvases.show',
        canvas.get('team.domain'), canvas.get('id'));
    }
  }
});
