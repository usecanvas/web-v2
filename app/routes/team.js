import Ember from 'ember';
import Raven from 'raven';
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

  afterModel(team, { targetName }) {
    if (targetName === 'team.canvas.show' && !team.get('isInTeam')) {
      return null;
    }

    if (team.get('needsSlackToken')) {
      this.transitionTo('team.slack');
      return null;
    }

    /*
     * Force Ember to fetch the user keyed by team ID for the current account
     * and team.
     */
    return this.store
      .findRecord('user', team.get('id'), { adapterOptions: { team } })
      .then(user => {
        team.set('accountUser', user);
        this.set('currentAccount.currentUser', team.get('accountUser'));
        const userContext = Raven.getContext().user;
        userContext.email = user.get('email');
        userContext.user =
          { id: user.get('id'),
            email: user.get('email'),
            team: { id: team.get('id'), domain: team.get('domain') } };
        Raven.setUserContext(userContext);
        return preload(team, ['canvases']);
      });
  },

  actions: {
    didCreateCanvas(canvas) {
      this.transitionTo('team.canvas.show',
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
