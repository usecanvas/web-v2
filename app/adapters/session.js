import ApplicationAdapter from './application';
export default ApplicationAdapter.extend({
  logout() {
    return this.ajax(`${this.urlPrefix()}/session`, 'DELETE');
  }
});
