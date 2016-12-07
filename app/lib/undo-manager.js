import ShareDB from 'sharedb';

const json0 = ShareDB.types.map.json0;

/**
 * @typedef {Array<Object>} Op
 */

/**
 * @typedef {Array<Op>} OpStack
 */

/**
 * A manager for undoing/redoing operations.
 *
 * It works by maintaining undo and redo stacks, and transforming operations in
 * those stacks when they need to be applied.
 *
 * For context on how this works, see this post in the ShareJS Google Group:
 * https://groups.google.com/forum/#!msg/sharejs/d-dj4Jp-Ors/jLQ21Kpr138J
 *
 * ## Basic Operation Handling
 *
 * For each user operation, the redo stack is emptied and the inverse of the
 * user operation is pushed onto the undo stack.
 *
 * ```javascript
 * undoManager.pushUserOp(op);
 * ```
 *
 * For each remote operation, each operation in both the undo and redo stacks
 * are cross-transformed with the remote operation.

 * ```javascript
 * undoManager.handleRemoteOp(op);
 * ```
 *
 * When undoing, the inverse of the undo is pushed onto the redo stack, and when
 * redoing, the inverse of the redo is pushed onto the undo stack.

 * ```javascript
 * const undoOp = undoManager.undo();
 * const redoOp = undoManager.redo(); // <- Inverse of `undoOp`.
 * ```
 *
 * @class UndoManager
 */
export default class UndoManager {
  constructor() {
    /**
     * @member {OpStack} The operations to undo, in reverse order
     */
    this.undoStack = [];

    /**
     * @member {OpStack} The operations to redo, in reverse order
     */
    this.redoStack = [];
  }

  /**
   * Handle a remote op by transforming everything in the undo and redo stacks.
   *
   * @method
   * @param {Op} remoteOp The remote op
   */
  handleRemoteOp(remoteOp) {
    this.transformStack(this.undoStack, remoteOp);
    this.transformStack(this.redoStack, remoteOp);
  }

  /**
   * Push a user operation's inverse onto the undo stack.
   *
   * @method
   * @param {Op} op The op to invert and push onto the undo stack
   */
  pushUserOp(op) {
    const inverseOp = json0.invert(op);
    this.redoStack = [];
    this.undoStack.push(inverseOp);
  }

  /**
   * Get the last operation from the redo stack, transformed if needed.
   *
   * @method
   * @returns {?Op} The redo operation, if there is one
   */
  redo() {
    const redoOp = this.redoStack.pop();
    if (!redoOp) return null;
    this.undoStack.push(json0.invert(redoOp));
    return redoOp;
  }

  /**
   * Get the last operation from the undo stack, transformed if needed.
   *
   * @method
   * @returns {?Op} The undo operation, if there is one
   */
  undo() {
    const undoOp = this.undoStack.pop();
    if (!undoOp) return null;
    this.redoStack.push(json0.invert(undoOp));
    return undoOp;
  }

  /**
   * Transform a stack against a remote operation.
   *
   * This algorithm comes from
   * https://groups.google.com/d/msg/sharejs/d-dj4Jp-Ors/jLQ21Kpr138J.
   *
   * @method
   * @private
   * @param {OpStack} stack The stack to transform
   * @param {Op} remoteOp The remote op to transform the stack against
   */
  transformStack(stack, remoteOp) {
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      const stackOp = stack[i];
      const stackOpPrime = json0.transform(stackOp, remoteOp, 'left');
      remoteOp = json0.transform(remoteOp, stackOp, 'right');
      stack[i] = stackOpPrime;
    }
  }
}
