import Ember from 'ember';

/**
 * The canvas history route
 *
 * @class CanvasWeb.CanvasHistoryRoute
 * @extends Ember.Route
 */
export default Ember.Route.extend({
  model() {
    const canvas = this.modelFor('team.canvas');

    if (canvas.get('shareDBDoc')) {
      canvas.set('version', canvas.get('shareDBDoc.version'));
    }

    return canvas.get('ops').then(_ => {
      return canvas;
    });
  }
});
