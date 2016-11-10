import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord({ filter: { domain } }) {
    return `${this.urlPrefix()}/teams/${domain}`;
  },

  fetchTemplates(team) {
    const url = `${this.urlPrefix()}/teams/${team.get('id')}/templates`;
    return this.ajax(url, 'GET', {});
  }
});
