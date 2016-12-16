import Ember from 'ember';
import * as OpApplication from 'canvas-web/lib/op-application';
import RealtimeCanvas from 'canvas-editor/lib/realtime-canvas';
import ShareDB from 'sharedb';

const { inject, on } = Ember;
const json0 = ShareDB.types.map.json0;

export default Ember.Component.extend({
  /**
  /**
   * @member {Array<string>} An array of localized class names
   */
  localClassNames: 'route-canvas-history'.w(),

  /**
   * @member {CanvasWeb.UnfurlerService} The card-unfurling service
   */
  unfurler: inject.service(),

  /**
   * Initialize RealtimeCanvas blocks and roll the canvas back to `version`.
   *
   * @method
   */
  initCanvas: on('init', function() {
    this.initRealtimeBlocks();
    this.initCanvasVersion();
  }),

  /**
   * Initialize the canvas's realtime blocks.
   *
   * @method
   */
  initRealtimeBlocks() {
    this.get('canvas').set('blocks', this.get('canvas.blocks').map(block => {
      return RealtimeCanvas.createBlockFromJSON(block);
    }));
  },

  /**
   * Initialize the canvas to its state as given by `version`.
   *
   * @method
   */
  initCanvasVersion() {
    const version = parseInt(this.get('version'), 10);
    const maxVersion = this.get('canvas.version');

    if (version > maxVersion) throw new Error('Canvas version out of range');
    if (version === maxVersion) return;

    const rewindOps =
      this.get('canvas.ops')
          .slice(version + 1, maxVersion + 1)
          .mapBy('components')
          .map(json0.invert)
          .reverse();

    rewindOps.forEach(op => {
      OpApplication.applyOperation(this.get('canvas'), op);
    });
  },

  actions: {
    /**
     * Called when the version slider changes.
     *
     * @method
     * @param {string} oldVersion The old version value
     * @param {string} newVersion The new version value
     */
    onVersionChange(oldVersion, newVersion) {
      oldVersion = parseInt(oldVersion, 10);
      newVersion = parseInt(newVersion, 10);

      if (oldVersion < newVersion) {
        const ops =
          this.get('canvas.ops')
              .slice(oldVersion + 1, newVersion + 1)
              .mapBy('components');

        ops.forEach(op => OpApplication.applyOperation(this.get('canvas'), op));
      } else if (oldVersion > newVersion) {
        const ops =
          this.get('canvas.ops')
              .slice(newVersion + 1, oldVersion + 1)
              .reverse()
              .mapBy('components')
              .map(json0.invert);

        ops.forEach(op => OpApplication.applyOperation(this.get('canvas'), op));
      }
    },

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
