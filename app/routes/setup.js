import Ember from 'ember';

const { computed, inject } = Ember;

export default Ember.Route.extend({
  currentAccount: inject.service(),
  teamsList: inject.service(),

  personalTeam: computed('teamsList.teams.[]', function() {
    return this.get('teamsList.teams').findBy('isPersonal');
  }),

  model() {
    return {
      personalTeam: this.get('personalTeam'),
      teams: this.get('teamsList.teams')
    };
  }
});
