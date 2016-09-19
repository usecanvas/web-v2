import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForCreateRecord(modelName, snapshot) {
    const teamID = snapshot.record.get('team.id');
    return `${this.get('namespace')}/teams/${teamID}/canvases`;
  },

  urlForFindRecord(id, modelName, snapshot) {
    const teamID = snapshot.adapterOptions.team.get('id');
    return `${this.get('namespace')}/teams/${teamID}/canvases/${id}`;
  }
});
