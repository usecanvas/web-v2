import Ember from 'ember';
import * as OpApplication from 'canvas-web/lib/op-application';
import RealtimeCanvas from 'canvas-editor/lib/realtime-canvas';
import ShareDB from 'sharedb';
import { task, timeout } from 'ember-concurrency';

const { computed, inject, on } = Ember;
const json0 = ShareDB.types.map.json0;

export default Ember.Component.extend({
  /**
   * @member {number} The initial version value
   */
  initialVersion: computed('version', function() {
    return parseInt(this.get('version'), 10);
  }),

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
    if (Ember.typeOf(this.get('canvas.blocks.firstObject')) === 'instance') {
      // Already initialized
      return;
    }

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
    const version = this.get('initialVersion');
    const maxVersion = this.get('canvas.version');

    if (version > maxVersion) throw new Error('Canvas version out of range');
    if (version === maxVersion) return;

    const ops =
      this.get('canvas.ops')
          .slice(version, maxVersion)
          .mapBy('components')
          .map(json0.invert)
          .reverse();

    ops.forEach(op => OpApplication.applyOperation(this.get('canvas'), op));
  },

  /**
   * Travel through time between two versions of a canvas.
   *
   * @method
   * @param {number} toVersion The version to travel to
   */
  timeTravel: task(function *(toVersion) {
    const fromVersion = parseInt(this.get('version'), 10);

    if (fromVersion < toVersion) {
      const ops =
        this.get('canvas.ops')
            .slice(fromVersion, toVersion)
            .mapBy('components');

      ops.forEach(op => OpApplication.applyOperation(this.get('canvas'), op));
    } else if (fromVersion > toVersion) {
      const ops =
        this.get('canvas.ops')
            .slice(toVersion, fromVersion)
            .reverse()
            .mapBy('components')
            .map(json0.invert);

      ops.forEach(op => OpApplication.applyOperation(this.get('canvas'), op));
    }

    this.set('version', toVersion);

    yield timeout(100);
  }).keepLatest(),

  actions: {
    /**
     * Clone the current document.
     *
     * @method
     */
    clone: Ember.K,

    /**
     * Called when the version slider changes.
     *
     * @method
     * @param {string} oldVersion The old version value
     * @param {string} newVersion The new version value
     */
    onVersionChange(_oldVersion, newVersion) {
      newVersion = parseInt(newVersion, 10);
      this.get('timeTravel').perform(newVersion);
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
