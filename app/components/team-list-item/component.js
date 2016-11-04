import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  localClassNames: ['team-list-item'],

  imageURL: computed('team.image88', function() {
    return this.getWithDefault('team.image88',
      '/images/personal-notes-avatar.png');
  })
});
