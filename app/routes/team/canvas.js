import Ember from 'ember';
import preload from 'canvas-web/lib/preload';

export default Ember.Route.extend({

  model({ id }) {
    return this.get('store').findRecord('canvas', id, {
      adapterOptions: { team: this.modelFor('team') }
    });
  },

  afterModel() {
    return preload(this.modelFor('team'), ['channels']);
  },

  titleToken(model) {
    return model.get('title');
  }
});
