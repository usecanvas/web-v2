import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  localClassNames: ['team-list'],
  slackTeams: computed.filterBy('teams', 'isSlack'),

  personalTeam: computed('teams.@each.isPersonal', function() {
    return this.get('teams').findBy('isPersonal');
  })
});
