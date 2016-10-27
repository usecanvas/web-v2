import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord({ filter: { domain } }) {
    return `${this.get('namespace')}/teams/${domain}`;
  }
});
