import Ember from 'ember';
import { task } from 'ember-concurrency';

const { computed } = Ember;

export default Ember.Component.extend({
  teamDomain: computed('team.domain', function() {
    const domain = this.get('team.domain');
    if (domain === null) return null;
    if (domain.startsWith('~')) return domain.slice(1);
    return domain;
  }),

  updateDomain: task(function *(domain) {
    this.set('team.domain', domain);
    yield this.get('team').save();
  }).restartable(),

  actions: {
    onSubmit() {
      this.get('updateDomain').perform(this.get('teamDomain'));
    }
  }
});
