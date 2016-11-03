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
    const oldDomain = this.get('team.domain');
    this.set('team.domain', domain);

    try {
      yield this.get('team').save();
    } catch (_err) {
      this.set('team.domain', oldDomain);
    }
  }).restartable(),

  actions: {
    onSubmit() {
      this.get('updateDomain').perform(this.get('teamDomain'));
    }
  }
});
