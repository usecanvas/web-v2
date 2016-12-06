import ShareDB from 'sharedb';

const JSONType = ShareDB.types.map.json0;

/**
 * An object representing a unit of work on a data structure
 *
 * @typedef {Object} Component
 * @property {Array<number|string>} p The path this component operates on
 * @property {Object} ld An object deleted from a list
 * @property {Object} li An object inserted into a list
 * @property {Object} od An object deleted from an object
 * @property {Object} oi An object inserted into an object
 * @property {string} sd A deleted string
 * @property {string} si An inserted string
 */

/**
 * A list of {@link Component}s applied to a data structure
 * @typedef {Array<Component>} Op
 */

/**
 * A manager for a canvas's undo/redo state.
 *
 * This manager behaves differently then one might expect an undo manager to
 * behave because it is OT-aware. When undoing an operation, rather than
 * rewinding, it inverses the last *user* operation and rebases it against any
 * *remote* operations that have come in since, and returns that. It is up to
 * the programmer to then ensure that the inverse operation makes its way back
 * into the undo manager.
 *
 * Likewise, a "redo" is the inverse/rebase of the last user "undo" operation,
 * and the manager is responsible for the task of tracking whether an undo or
 * redo is available.
 */
export default class UndoManager {
  /**
   * Create an undo manager.
   */
  constructor() {
    /**
     * An array containing all ops, user and remote.
     * @type {Array<Op>}
     */
    this.allOps = [];

    /**
     * An array containing only user ops and their index within all ops
     * @type {Array<Array<Op, number>>}
     */
    this.undoStack = [];

    /**
     * A number representing the position inside the user ops undo stack.
     * @type {number}
     */
    this.undoStackCursor = -1;
  }

  /**
   * Push a new operation into the undo manager.
   *
   * @param {Op} op The operation to push
   * @param {boolean} [isUserOp=false] Whether the op is a user op
   */
  pushOp(op, isUserOp = false) {
    this.allOps.push(op);
    if (isUserOp) this.pushUserOp(op);
  }

  /**
   * Redo the user op at the current corsor.
   *
   * @returns {?Op} The redo op, or null if none exists
   */
  redo() {
    if (this.undoStackCursor + 1 === this.undoStack.length) return null;

    const [op, index] = this.undoStack[this.undoStackCursor + 1];

    let rebased = op;
    for (let idx = index + 1, len = this.allOps.length; idx < len; idx += 1) {
      const rebaseOp = this.allOps[idx];
      if (rebaseOp.undoRedo) continue;
      rebased = JSONType.transform(rebased, rebaseOp, 'left');
    }

    rebased.undoRedo = true;

    this.undoStack[this.undoStackCursor + 1] =
      [rebased, this.allOps.length + 1];

    this.undoStackCursor += 1;

    return rebased;
  }

  /**
   * Undo the user op at the current cursor.
   *
   * @returns {?Op} The inverse op, or null if none exists
   */
  undo() {
    if (this.undoStackCursor === -1) return null;

    const [op, index] = this.undoStack[this.undoStackCursor];

    let inverse = JSONType.invert(op);
    for (let idx = index + 1, len = this.allOps.length; idx < len; idx += 1) {
      const rebaseOp = this.allOps[idx];
      // if (rebaseOp.undoRedo) continue;
      inverse = JSONType.transform(inverse, rebaseOp, 'left');
    }

    inverse.undoRedo = true;
    this.undoStackCursor -= 1;

    return inverse;
  }

  /**
   * Push a user operation into the undo manager.
   *
   * @private
   * @param {Op} op The operation to push
   */
  pushUserOp(op) {
    const index = this.allOps.length - 1;
    this.undoStack = this.undoStack.slice(0, this.undoStackCursor + 1);
    this.undoStack.push([op, index]);
    this.undoStackCursor = this.undoStack.length - 1;
  }
}
