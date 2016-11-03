import Ember from 'ember';

const { computed, inject } = Ember;

/**
 * The personal team setup route
 *
 * @class CanvasWeb.SetupRoute
 * @extends Ember.Route
 */
export default Ember.Route.extend({
  currentAccount: inject.service(),
  teamsList: inject.service(),

  /**
   * The current account's personal team
   *
   * @member {CanvasWeb.Team}
   */
  personalTeam: computed('teamsList.teams.[]', function() {
    return this.get('teamsList.teams').findBy('isPersonal');
  }),

  model() {
    return {
      personalTeam: this.get('personalTeam'),
      teams: this.get('teamsList.teams')
    };
  },

  actions: {
    /**
     * Redirect to the personal team when it is updated.
     *
     * @method
     * @param {CanvasWeb.Team} team The team to redirect to
     */
    teamUpdated(team) {
      return this.transitionTo('team.index', team);
    }
  }
});
