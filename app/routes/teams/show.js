import Ember from 'ember';

export default Ember.Route.extend({
  teamQuery: Ember.inject.service(),

  model({ domain }) {
    return this.get('teamQuery').findByDomain(domain);
  },

  actions: {
    didCreateCanvas(canvas) {
      this.transitionTo('canvases.show', canvas);
    }
  }
});
