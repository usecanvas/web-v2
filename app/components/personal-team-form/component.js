import Ember from 'ember';
import { task } from 'ember-concurrency';

const { computed } = Ember;

/**
 * Component for updating an account holder's personal team
 *
 * @class CanvasWeb.PersonalTeamFormComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  /**
   * The editable team domain with the API-added tilde removed
   *
   * @member {?string}
   */
  teamDomain: computed('team.domain', function() {
    const domain = this.get('team.domain');
    if (domain === null) return null;
    if (domain.startsWith('~')) return domain.slice(1);
    return domain;
  }),

  /**
   * Update the team's domain with `domain` and attempt to save it.
   *
   * Will set an error if there is a domain error and revert the value on the
   * team.
   *
   * @method
   * @param {string} domain The new domain to attempt to save
   * @task
   */
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

  /**
   * Change the "domain" string to "name", since users won't think of the
   * property here as a domain per-se.
   *
   * @method
   * @param {string} error An error string
   * @returns {string} The new error with s/domain/name
   */
  humanizeError(error) {
    if (!error) return error;
    return error.replace(/domain/g, 'name')
                .replace(/Domain/g, 'Name');
  },

  /**
   * A callback called when the team is updated, which will receive the team
   * as an argument.
   *
   * @method
   * @param {CanvasWeb.Team} team The team that was updated
   */
  teamUpdated: Ember.K,

  actions: {
    /**
     * An action called when the team update form is submitted
     *
     * @method
     * @action
     */
    onSubmit() {
      this.get('updateDomain').perform(this.get('teamDomain'));
    }
  }
});
