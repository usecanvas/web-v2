import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForCreateRecord(modelName, snapshot) {
    const teamID = snapshot.record.get('team.id');
    return `${this.urlPrefix()}/teams/${teamID}/canvases`;
  },

  urlForDeleteRecord() {
    return this.urlForFindRecord(...arguments);
  },

  urlForFindRecord(id, modelName, snapshot) {
    const teamID = snapshot.adapterOptions.team.get('id');
    return `${this.urlPrefix()}/teams/${teamID}/canvases/${id}`;
  },

  urlForUpdateRecord(id, modelName, snapshot) {
    snapshot.adapterOptions = { team: snapshot.record.get('team') };
    return this.urlForFindRecord(...arguments);
  },

  /**
   * Update the template of a canvas.
   *
   * @method
   * @param {CanvasWeb.Canvas} canvas The canvas to update the template of
   * @param {string} templateID The ID of the template
   * @returns {Promise} A promise resolved when the update finishes or fails
   */
  updateTemplate(canvas, templateID) {
    const url = this.urlForFindRecord(
      canvas.get('id'),
      canvas.constructor.modelName,
      { adapterOptions: { team: canvas.get('team') } });

    const data = {
      data: {
        attributes: {},
        relationships: {
          template: { data: { id: templateID, type: 'canvas' } }
        }
      }
    };

    return this.ajax(url, 'PATCH', { data });
  }
});
