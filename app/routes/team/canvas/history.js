import Ember from 'ember';

/**
 * The canvas history route
 *
 * @class CanvasWeb.CanvasHistoryRoute
 * @extends Ember.Route
 */
export default Ember.Route.extend({
  model() {
    return this.modelFor('team.canvas')
               .reload()
               .then(canvas => {
                 return canvas.hasMany('ops').reload().then(_ => canvas);
               });
  },

  queryParams: {
    version: {
      replace: true
    }
  }
});
