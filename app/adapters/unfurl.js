import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindRecord(id, modelName, snapshot) {
    const canvas = snapshot.adapterOptions.canvas;
    const team = canvas.get('team');
    return `${this.get('namespace')}/teams/${team.get('id')}/canvases/${canvas.get('id')}/unfurls/${id}`;
  }
});
