import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(teamID) {
    return `${this.urlPrefix()}/teams/${teamID}/user`;
  }
});
