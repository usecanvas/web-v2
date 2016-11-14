import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindAll(modelName, snapshot) {
    const teamID = snapshot.adapterOptions.team.get('id');
    return `${this.urlPrefix()}/teams/${teamID}/slack/channels`;
  }
});
