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
 *
 * @class UndoManager
 */
export default class UndoManager {
}
