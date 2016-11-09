import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord({ filter: { domain } }) {
    return `${this.get('namespace')}/teams/${domain}`;
  },

  fetchTemplates(team) {
    const url = `${this.get('namespace')}/teams/${team.get('id')}/templates`;
    return this.ajax(url, 'GET', {});
  }
});
