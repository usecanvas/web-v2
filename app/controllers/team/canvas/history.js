import Ember from 'ember';
import { toShareDBBlock } from 'canvas-web/components/routes/canvas-show/component';

/**
 * A controller for the canvas history route
 *
 * @class CanvasWeb.CanvasHistoryController
 * @extends Ember.Controller
 */
export default Ember.Controller.extend({
  queryParams: 'version'.w(),
  version: null,

  actions: {
    /**
     * Called when the user wishes to clone the canvas at the current history
     * point.
     *
     * @method
     */
    clone() {
      const canvas = this.get('model');
      const blocks = this.get('model.blocks').map(toShareDBBlock);

      this.get('store').createRecord('canvas', {
        blocks,
        isTemplate: canvas.get('isTemplate'),
        linkAccess: canvas.get('linkAccess'),
        slackChannelIds: canvas.get('slackChannelIds'),
        team: canvas.get('team')
      }).save().then(clonedCanvas => {
        this.transitionToRoute('team.canvas.show', clonedCanvas);
      });
    }
  }
});
