import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition() {
      const team = this.controller.get('model');

      try {
        localStorage.lastTeamID = team.get('id');
      } catch (_err) {
        // Ignore
      }
    }
  }
});
