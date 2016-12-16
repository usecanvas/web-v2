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

    return canvas.get('ops').then(_ => {
      return canvas;
    });
  }
});
