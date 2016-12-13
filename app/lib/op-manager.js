import Ember from 'ember';
import ShareDB from 'sharedb';

const JSON0 = ShareDB.types.map.json0;
const { run } = Ember;

/**
 * A manager for submitting OT operations.
 *
 * This library is used for coalescing all OT operations submitted by a client
 * within a single Ember run loop into one operation.
 *
 * @class CanvasWeb.OpManager
 */
export default class OpManager {
  /**
   * @constructor
   * @param {ShareDB.Doc} shareDBDoc The ShareDB document that represents the
   *   canvas being edited
   * @param {CanvasWeb.UndoManager} undoManager The undo manager for the canvas
   */
  constructor(shareDBDoc, undoManager) {
    /**
     * @property {Array} The current coalescing op
     */
    this.currentOp = [];

    /**
     * @property {ShareDB.Doc} The ShareDB doc to submit to
     */
    this.shareDBDoc = shareDBDoc;

    /**
     * @property {CanvasWeb.UndoManager} The undo manager to push coalesced
     *   undos to
     */
    this.undoManager = undoManager;
  }

  /**
   * Submit the given operation.
   *
   * @method
   * @param {Array<object>} op The operation to submit
   * @param {boolean} [isUndoRedo=false] Whether the operation is a undo/redo op
   */
  submitOp(op, isUndoRedo = false) {
    if (isUndoRedo) {
      run.scheduleOnce('actions', this, 'flushOp');
      run.scheduleOnce('actions', this, 'sendOp', op);
      return;
    }

    this.currentOp = JSON0.compose(this.currentOp, op);
    run.scheduleOnce('actions', this, 'flushOp');
  }

  /**
   * Submit the coalesced ops to ShareDB and the undo manager.
   *
   * @method
   * @private
   */
  flushOp() {
    if (this.currentOp.length === 0) return;
    this.sendOp(this.currentOp);
    this.undoManager.pushUserOp(this.currentOp);
    this.currentOp = [];
  }

  /**
   * Send an operation to ShareDB.
   *
   * @method
   * @private
   * @param {Array<objectt>} op An operation to submit after flush
   */
  sendOp(op) {
    if (op.length === 0) return;
    this.shareDBDoc.submitOp(op);
  }
}
