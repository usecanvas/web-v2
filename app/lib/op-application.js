import RealtimeCanvas from 'canvas-editor/lib/realtime-canvas';
import { parseListPath, parseObjectPath, parseStringPath } from 'canvas-web/lib/sharedb-path';

/**
 * Handles the application of operations to a local model.
 *
 * @module
 */

/**
 * @function
 * @param {CanvasEditor.RealtimeCanvas} model The model to apply the op to
 * @param {Array<object>} op An array of OT components
 */
export function applyOperation(model, op) {
  for (const comp of op) {
    if (comp.hasOwnProperty('ld') &&
        comp.hasOwnProperty('li')) {
      applyListReplace(model, comp);
      continue;
    }

    if (comp.hasOwnProperty('od') &&
        comp.hasOwnProperty('oi')) {
      applyObjectReplace(model, comp);
      continue;
    }

    for (const compKey in comp) {
      if (!comp.hasOwnProperty(compKey)) continue;

      switch (compKey) {
        case 'si':
          applyStringInsert(model, comp);
          break;
        case 'sd':
          applyStringDelete(model, comp);
          break;
        case 'li':
          applyListInsert(model, comp);
          break;
        case 'ld':
          applyListDelete(model, comp);
          break;
        case 'oi':
          applyObjectInsert(model, comp);
          break;
        case 'od':
          applyObjectDelete(model, comp);
          break;
        case 'p':
          break; // Ignore "path" component
        default:
          throw new Error(`Cannot apply unrecognized component: ${comp}`);
      }
    }
  }
}

/**
 * Apply a list delete component.
 *
 * @method
 * @private
 * @param {CanvasEditor.RealtimeCanvas} model The model to apply the comp to
 * @param {object} comp The component to apply
 * @param {string} [comp.p] The path to the target delete point
 * @param {string} [comp.ld] The object to delete
 */
function applyListDelete(model, { p, _ld }) {
  const { parent, property, index } =
    parseListPath(p, model);
  parent.get(property).removeAt(index);
}

/**
 * Apply a list insert component.
 *
 * @method
 * @private
 * @param {CanvasEditor.RealtimeCanvas} model The model to apply the comp to
 * @param {object} comp The component to apply
 * @param {string} [comp.p] The path to the target insert point
 * @param {string} [comp.li] The object to insert
 */
function applyListInsert(model, { p, li }) {
  const { parent, property, index } =
    parseListPath(p, model);
  const realtimeBlock = RealtimeCanvas.createBlockFromJSON(li);
  if (parent.get('isGroup')) realtimeBlock.set('parent', parent);
  parent.get(property).replace(index, 0, [realtimeBlock]);
}

/**
 * Apply a list replace component.
 *
 * @method
 * @private
 * @param {CanvasEditor.RealtimeCanvas} model The model to apply the comp to
 * @param {object} comp The component to apply
 * @param {string} [comp.p] The path to the target insert point
 * @param {string} [comp.ld] The object to delete
 * @param {string} [comp.li] The object to insert
 */
function applyListReplace(model, { p, ld, li }) {
  applyListDelete(model, { p, ld });
  applyListInsert(model, { p, li });
}

/**
 * Apply an object delete component.
 *
 * @method
 * @private
 * @param {CanvasEditor.RealtimeCanvas} model The model to apply the comp to
 * @param {object} comp The component to apply
 * @param {string} [comp.p] The path to the target delete point
 * @param {string} [comp.od] The object to delete
 */
function applyObjectDelete(model, { p, _od }) {
  const { block, metaPath } = parseObjectPath(p, model);
  block.set(metaPath.join('.'), null);
}

/**
 * Apply an object insert component.
 *
 * @method
 * @private
 * @param {CanvasEditor.RealtimeCanvas} model The model to apply the comp to
 * @param {object} comp The component to apply
 * @param {string} [comp.p] The path to the target insert point
 * @param {string} [comp.oi] The object to insert
 */
function applyObjectInsert(model, { p, oi }) {
  const { block, metaPath } = parseObjectPath(p, model);
  block.set(metaPath.join('.'), oi);
}

/**
 * Apply an object replace component.
 *
 * @method
 * @private
 * @param {CanvasEditor.RealtimeCanvas} model The model to apply the comp to
 * @param {object} comp The component to apply
 * @param {string} [comp.p] The path to the target insert point
 * @param {string} [comp.od] The object to delete
 * @param {string} [comp.oi] The object to insert
 */
function applyObjectReplace(model, { p, od, oi }) {
  applyObjectDelete(model, { p, od });
  applyObjectInsert(model, { p, oi });
}

/**
 * Apply a string delete component.
 *
 * @method
 * @private
 * @param {CanvasEditor.RealtimeCanvas} model The model to apply the comp to
 * @param {object} comp The component to apply
 * @param {string} [comp.p] The path to the target delete point
 * @param {string} [comp.sd] The string to delete
 */
function applyStringDelete(model, { p, sd }) {
  const { block, property, offset } =
    parseStringPath(p, model);
  const content = block.get(property);
  const newContent =
    content.slice(0, offset) + content.slice(offset + sd.length);
  block.set('content', newContent);
}

/**
 * Apply a string insert component.
 *
 * @method
 * @private
 * @param {CanvasEditor.RealtimeCanvas} model The model to apply the comp to
 * @param {object} comp The component to apply
 * @param {string} [comp.p] The path to the target insert point
 * @param {string} [comp.si] The string to insert
 */
function applyStringInsert(model, { p, si }) {
  const { block, property, offset } =
    parseStringPath(p, model);
  const content = block.get(property);
  const newContent =
    content.slice(0, offset) + si + content.slice(offset);
  block.set('content', newContent);
}
