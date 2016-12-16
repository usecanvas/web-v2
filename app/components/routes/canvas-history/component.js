import Ember from 'ember';
import RealtimeCanvas from 'canvas-editor/lib/realtime-canvas';

const { inject, on } = Ember;

export default Ember.Component.extend({
  /**
   * @member {Array<string>} An array of localized class names
   */
  localClassNames: 'route-canvas-history'.w(),

  /**
   * @member {CanvasWeb.UnfurlerService} The card-unfurling service
   */
  unfurler: inject.service(),

  /**
   * Initialize RealtimeCanvas blocks.
   *
   * @method
   */
  initRealtimeBlocks: on('init', function() {
    this.get('canvas').set('blocks', this.get('canvas.blocks').map(block => {
      return RealtimeCanvas.createBlockFromJSON(block);
    }));
  }),

  actions: {
    /**
     * Unfurl a block into human-readable information.
     *
     * @method
     * @param {CanvasEditor.RealtimeCanvas.Block} block The block to unfurl
     * @returns {Promise<CanvasWeb.Unfurl>} The unfurl for the block
     */
    unfurlBlock(block) {
      return this.get('unfurler').unfurl(block.get('meta.url'));
    }
  }
});
