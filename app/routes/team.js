import Ember from 'ember';
import preload from 'canvas-web/lib/preload';

export default Ember.Route.extend({
  teamQuery: Ember.inject.service(),

  model({ domain }) {
    return preload(this.get('teamQuery').findByDomain(domain), 'canvases');
  },

  actions: {
    didCreateCanvas(canvas) {
      this.transitionTo('team.canvases.show',
        canvas.get('team.domain'), canvas.get('id'));
    }
  }
});
