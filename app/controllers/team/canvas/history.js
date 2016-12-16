import Ember from 'ember';

/**
 * A controller for the canvas history route
 *
 * @class CanvasWeb.CanvasHistoryController
 * @extends Ember.Controller
 */
export default Ember.Controller.extend({
  queryParams: 'version'.w(),
  version: null
});
