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
      this.get('teamUpdated')(this.get('team'));
    } catch (_err) {
      this.set('domainError',
        this.humanizeError(this.get('team').getDomainError()));
      this.set('team.domain', oldDomain);
    }
  }).restartable(),

  humanizeError(error) {
    if (!error) return error;
    return error.replace(/domain/g, 'name')
                .replace(/Domain/g, 'Name');
  },

  teamUpdated: Ember.K,

  actions: {
    onSubmit() {
      this.get('updateDomain').perform(this.get('teamDomain'));
    }
  }
});
