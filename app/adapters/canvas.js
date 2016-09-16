import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForCreateRecord(modelName, snapshot) {
    const teamID = snapshot.record.get('team.id');

    return `/teams/${teamID}/canvases`;
  }
});
