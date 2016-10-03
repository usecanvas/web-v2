import Ember from 'ember';
import preload from 'canvas-web/lib/preload';

const { inject } = Ember;

export default Ember.Route.extend({
  currentAccount: inject.service(),
  teamQuery: inject.service(),

  model({ domain }) {
    return this.get('teamQuery').findByDomain(domain);
  },

  titleToken(team) {
    return team.get('name');
  },

  afterModel(team) {
    /*
     * Force Ember to fetch the user keyed by team ID for the current account
     * and team.
     */
    return this.store
      .findRecord('user', team.get('id'), { adapterOptions: { team } })
      .then(user => {
        team.set('accountUser', user);
        this.set('currentAccount.currentUser', team.get('accountUser'));
        return preload(team, ['canvases']);
      });
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

      if (!confirm(message)) return;

      canvas.destroyRecord(
        { adapterOptions: { team: canvas.get('team') } }
      ).then(_ => {
        if (options.transitionTo) this.transitionTo(...options.transitionTo);
      });
    }
  }
});
