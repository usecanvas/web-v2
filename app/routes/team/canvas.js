import Ember from 'ember';
import preload from 'canvas-web/lib/preload';

export default Ember.Route.extend({
  teamQuery: Ember.inject.service(),

  model({ id }) {
    const domain = this.paramsFor('team').domain;

    return this.get('teamQuery').findByDomain(domain).then(team => {
      return this.get('store').findRecord('canvas', id, {
        adapterOptions: { team }
      });
    });
  },

  afterModel(canvas) {
    return preload(canvas.get('team'), ['channels']);
  },

  titleToken(model) {
    return model.get('title');
  }
});
