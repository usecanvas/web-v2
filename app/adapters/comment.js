import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery({ filter: { canvas, block } }) {
    const canvasId = canvas.get('id');
    let url = `${this.urlPrefix()}/comments?filter[canvas.id]=${canvasId}`;
    if (block) {
      const blockId = block.get('id');
      url += `&filter[block.id]=${blockId}`;
    }
    return url;
  }
});
