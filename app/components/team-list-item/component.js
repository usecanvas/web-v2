import Ember from 'ember';
import ENV from 'canvas-web/config/environment';

const { computed } = Ember;

export default Ember.Component.extend({
  localClassNames: ['team-list-item'],

  imageURL: computed('team.image88', function() {
    return this.getWithDefault('team.image88',
      `${ENV.rootURL}images/personal-notes-avatar.png`);
  })
});
