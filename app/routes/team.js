import Ember from 'ember';
import preload from 'canvas-web/lib/preload';

export default Ember.Route.extend({
  currentAccount: Ember.inject.service(),
  teamQuery: Ember.inject.service(),

  model({ domain }) {
    return this.get('teamQuery').findByDomain(domain);
  },

  afterModel(model) {
    this.set('currentAccount.currentUser', model.get('user'));
    return preload(model, 'canvases');
  },

  actions: {
    didCreateCanvas(canvas) {
      this.transitionTo('team.canvases.show',
        canvas.get('team.domain'), canvas.get('id'));
    },

    onDeleteCanvas(canvas, opts) {
      const message = `Are you sure you want to delete this canvas? \
                 There's no going back.`;

      const options = opts || {};

      if (confirm(message)) {
        return canvas.destroyRecord({
          adapterOptions: { team: canvas.get('team') }
        }).then(_ => {
          if (options.transitionTo) {
            this.transitionTo(...options.transitionTo);
          }
        });
      }

      return false;
    }
  }
});
