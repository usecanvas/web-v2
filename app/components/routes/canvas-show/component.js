import DMP from 'diff-match-patch';
import Ember from 'ember';
import Key from 'canvas-web/lib/key';
import OpManager from 'canvas-web/lib/op-manager';
import RSVP from 'rsvp';
import Rangy from 'rangy';
import SelectionState from 'canvas-editor/lib/selection-state';
import UndoManager from 'canvas-web/lib/undo-manager';
import nsEvents from 'canvas-web/lib/ns-events';
import { getTargetBlock, parseStringPath } from 'canvas-web/lib/sharedb-path';
import { task, timeout } from 'ember-concurrency';
import * as OpApplication from 'canvas-web/lib/op-application';

const differ = new DMP();
const { $, computed, inject, observer, on, run } = Ember;

/**
 * A component for displaying a canvas and handling its realtime operations.
 *
 * @class CanvasWeb.CanvasShowRouteComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  /*
   * SIMPLE PROPERTIES
   * =================
   */

  /**
   * @member {CanvasWeb.CurrentAccountService} A service exposing the current
   *   user account
   */
  currentAccount: inject.service(),

  /**
   * @member {Ember.Service} A service for displaying flash messages
   */
  flashMessage: inject.service(),

  /*
   * @member {EmberCLISegment.SegmentService} A service for the segment api
   */
  segment: inject.service(),

  /**
   * @member {Array<string>} An array of localized class names
   */
  localClassNames: 'route-canvas-show'.w(),

  /**
   * @member {?CanvasWeb.OpManager} A lib for coalescing and submitting OT
   *   operations
   */
  opManager: null,

  /**
   * @member {boolean} Whether to show the filter bar
   */
  showFilter: false,

  /**
   * @member {DS.Store} The Ember Data store
   */
  store: inject.service(),

  /**
   * @member {CanvasWeb.UnfurlerService} The card-unfurling service
   */
  unfurler: inject.service(),

  /*
   * COMPUTED PROPERTIES
   * ===================
   */

  /**
   * @member {boolean} Whether there is a filter term present (blank === false)
   */
  isFiltered: computed.bool('filterTerm'),

  /**
   * @member {boolean} Whether the canvas is in readonly mode
   */
  readOnly: computed('canvas.team.isInTeam', 'canvas.linkAccess', function() {
    return !this.get('canvas.team.isInTeam') &&
      this.get('canvas.linkAccess') === 'read';
  }),

  /**
   * @member {boolean} Whether the channel selector should be visible
   */
  showChannelSelector:
    computed.and('canvas.team.isInTeam', 'canvas.team.slackId'),

  /**
   * @member {CanvasWeb.UndoManager} A manager for the canvas's undo/redo state
   */
  undoManager: computed(function() {
    return new UndoManager();
  }),

  /*
   * METHODS
   * =======
   */

  /*
   * Observers
   * ---------
   */

  /**
   * Reset the filter state to its initial value, either from a query
   * param or an empty filter.
   *
   * @method
   */
  resetFilterState: observer('filterQueryParam', function() {
    if (this.get('filterQueryParam')) {
      this.set('filterTerm', this.get('filterQueryParam'));
      this.set('showFilter', true);
    } else {
      this.set('filterTerm', '');
    }
  }),

  /**
   * Scroll to the top when the `canvas` changes.
   *
   * @method
   */
  scrollToTop: observer('canvas', function() {
    run.next(_ => {
      if (this.get('blockID')) {
        const element = this.$(`#${this.get('blockID')}`).get(0);

        if (element) {
          element.scrollIntoView();
          return;
        }
      }

      const mainClass = 'js-canvas-show-main';
      Ember.$(`.${mainClass}`).scrollTop(0);
    });
  }),

  /**
   * Update the filter query parameter when the term is updated.
   *
   * @method
   */
  updateFilterQP: task(function *() {
    yield timeout(500);
    this.set('filterQueryParam', this.get('filterTerm'));
  }).drop().observes('filterTerm'),

  /*
   * DOM Event Hooks
   * ---------------
   */

  /**
   * Handle a `dragenter` event.
   *
   * @method
   * @param {jQuery.Event} evt The `dragenter` event
   */
  dragEnter(_evt) {
    if (this.get('canvas.blocks.length') > 1) return;
    if (this.get('canvas.blocks.firstObject.content')) return;
    this._super(...arguments);
  },

  /**
   * Handle a regular 'keydown' event on this component.
   * @method
   * @param {jQuery.Event} evt The `keydown` event
   */
  keyDown(evt) {
    const key = new Key(evt.originalEvent);

    if (key.is('meta', 's')) {
      evt.preventDefault();
    }
  },

  /**
   * Handle a `keydown` event on the document.
   *
   * @method
   * @param {jQuery.Event} evt The `keydown` event
   */
  keydownDocument(evt) {
    const key = new Key(evt);

    if (evt.target.nodeName === 'INPUT' || this.isEventInEditor(evt)) return;

    if (key.is('slash')) {
      this.set('showFilter', true);
      evt.preventDefault();
    } else if (key.is('esc')) {
      this.set('showFilter', false);
      this.set('filterTerm', '');
    } else if (key.is('meta', 's')) {
      evt.preventDefault();
    }
  },

  /**
   * Handle a fatal error on `window`.
   *
   * @method
   * @param {string} message The error message
   * @param {string} source The error source URL
   * @param {number} line The line number of the error
   * @param {number} col The column number of the error
   * @param {Error} err The error
   */
  windowOnerror(_message, _source, _line, _col, _err) {
    this.set('readOnly', true);

    this.flashMessages.add({
      destroyOnClick: false,
      emoji: '😭',
      message: `We seem to have encountered a really bad error :( Please \
                reload the page to prevent data loss.`,
      sticky: true,
      type: 'danger'
    });
  },

  /*
   * Lifecycle Hooks
   * ---------------
   */

  /**
   * Reset the filter state on initialization.
   *
   * @method
   */
  initFilterState: on('init', function() {
    this.resetFilterState();
  }),

  /**
   * Initialize an op manager.
   *
   * @method
   */
  initOpManager: on('init', function() {
    const opManager = new OpManager(
      this.get('canvas.shareDBDoc'),
      this.get('undoManager'));
    this.set('opManager', opManager);
  }),

  /**
   * Bind keydown event handlers on the canvas.
   *
   * @method
   */
  bindKeyboardShortcuts: on('didInsertElement', function() {
    $(document).on(
      nsEvents(this, 'keydown'), run.bind(this, 'keydownDocument'));
  }),

  /**
   * Bind operation event handlers.
   *
   * @method
   */
  bindOpEvents: on('didInsertElement', function() {
    this.get('canvas.shareDBDoc').on('op', (op, isLocalOp) => {
      if (isLocalOp) return;

      run.join(_ => {
        this.syncLocalSelection(op);
        OpApplication.applyOperation(this.get('canvas'), op);
        this.get('undoManager').handleRemoteOp(op);
      });
    });
  }),

  /**
   * Bind a window.onerror to prevent editing when an error occurs.
   *
   * @method
   */
  bindWindowOnerror: on('didInsertElement', function() {
    this._oldWindowOnerror = window.onerror;
    window.onerror = this.windowOnerror.bind(this);
  }),

  /**
   * Scroll to the top on render.
   *
   * @method
   */
  initialScrollToTop: on('didInsertElement', function() {
    this.scrollToTop();
  }),

  /**
   * Unbind keydown event handlers on the canvas.
   *
   * @method
   */
  unbindKeyboardShortcuts: on('willDestroyElement', function() {
    $(document).off(nsEvents(this, 'keydown'));
  }),

  /**
   * Unbind window.onerror back to its original value.
   *
   * @method
   */
  unbindWindowOnerror: on('willDestroyElement', function() {
    window.onerror = this._oldWindowOnerror;
  }),

  /*
   * Regular Methods
   * ---------------
   */

  /**
   * Given a block and its index in its parent, return an operation path
   * pointing to it.
   *
   * @method
   * @param {CanvasEditor.RealtimeCanvas.Block} block The block to get a path to
   * @param {?number} index The index of the block in its parent's children
   * @returns {Array<string, number>} The OT path to the block
   */
  getPathToBlock(block, index) {
    const parent = block.get('parent') || this.get('canvas');

    if (typeof index !== 'number') {
      index = parent.get('blocks').indexOf(block);
    }

    if (!block.get('parent')) return [index];
    const groupIndex = this.get('canvas.blocks').indexOf(block.get('parent'));
    return [groupIndex, 'blocks', index];
  },

  /**
   * Given a block, get the block before it (visually to the user).
   *
   * @method
   * @param {CanvasEditor.RealtimeCanvas.Block} block The block to get the block
   *   before
   * @returns {?CanvasEditor.RealtimeCanvas.Block} The block before `block`
   */
  getPreviousBlock(block) {
    if (block.get('type') === 'title') return null;

    const parent = block.get('parent') || this.get('canvas');
    const blockIndex = parent.get('blocks').indexOf(block);

    const previousBlock = parent.get('blocks').objectAt(blockIndex - 1);

    if (previousBlock && previousBlock.get('isGroup')) {
      return previousBlock.get('blocks.lastObject');
    } else if (previousBlock) {
      return previousBlock;
    }

    return this.getPreviousBlock(parent);
  },

  /**
   * Given x and y coordinates, return the range closest to them.
   *
   * @method
   * @param {number} x The X coordinate
   * @param {number} y The Y coordinate
   * @returns {?Range} The range at the point
   */
  getRangeFromPoint(x, y) {
    let range;
    if (document.caretPositionFromPoint) {
      const position = document.caretPositionFromPoint(x, y);

      if (position) {
        range = document.createRange();
        range.setStart(position.offsetNode, position.offset);
      }
    } else if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
    }
    return range;
  },

  /**
   * Determine whether an event took place in the editor.
   *
   * @method
   * @param {jQuery.Event} evt The event in question
   * @returns {boolean} Whether `evt` occurred in the editor
   */
  isEventInEditor(evt) {
    return this.$('.canvas-editor')[0].contains(evt.target) ||
      this.$('[data-card-block-selected=true]').length;
  },

  /**
   * Submit the given operation and update the edited time on the canvas for
   * local display.
   *
   * @method
   * @param {Array<object>} op The operation to submit
   * @param {boolean} [isUndoRedo=false] Whether the operation is a undo/redo op
   */
  submitOp(op, isUndoRedo = false) {
    this.set('canvas.editedAt', new Date());
    this.get('opManager').submitOp(op, isUndoRedo);
  },

  /* eslint-disable max-statements */
  /**
   * Synchronize the local selection against a remote incoming operation.
   *
   * @method
   * @param {Array<object>} op An array of operation components
   */
  syncLocalSelection(op) {
    let activeElement =
      this.$(window.getSelection().anchorNode)
          .closest('.canvas-block-editable')
          .get(0);

    if (!activeElement) return;

    const selection = new SelectionState(activeElement);
    let activeBlockID = activeElement.getAttribute('data-block-id');

    selection.capture();

    for (const comp of op) {
      const block = getTargetBlock(comp, this.get('canvas'));
      if (!block || block.get('id') !== activeBlockID) continue;

      if (comp.si) {
        const { offset } = parseStringPath(comp.p, this.get('canvas'));
        if (offset < selection.start) selection.start += comp.si.length;
        if (offset < selection.end) selection.end += comp.si.length;
      } else if (comp.sd) {
        const { offset } = parseStringPath(comp.p, this.get('canvas'));

        if (offset < selection.start) {
          selection.start -= Math.min(comp.sd.length, selection.start - offset);
        }

        if (offset < selection.end) {
          selection.end -= Math.min(comp.sd.length, selection.end - offset);
        }
      } else if (comp.ld) {
        const prevBlock = this.getPreviousBlock(block);
        activeElement = this.$(
          `#${prevBlock.get('id')} .canvas-block-editable`
        ).get(0);
        activeBlockID = prevBlock.get('id');
        const range = Rangy.createRange();
        range.selectNodeContents(activeElement);
        range.collapse(false);
        Rangy.getSelection().setSingleRange(range);
        this.$(activeElement).focus();
        selection.element = activeElement;
        selection.capture();
      }
    }

    run.scheduleOnce('afterRender', selection, 'restore');
  },
  /* eslint-enable max-statements */

  /*
   * ACTIONS
   * =======
   */

  actions: {
    /**
     * Generate and submit an operation from a diff on the block's content
     * string.
     *
     * Called when a block's content string was updated locally.
     *
     * @method
     * @param {CanvasEditor.RealtimeCanvas.Block} block The block whose content
     *   was updated
     */
    blockContentUpdatedLocally(block) {
      const lastContent = block.get('lastContent');
      const content = block.get('content');
      const diff = differ.diff_main(lastContent, content);
      const blockPath = this.getPathToBlock(block).concat('content');
      const op = generateOpFromDiff(diff, blockPath);
      this.submitOp(op);
    },

    /**
     * Generate and submit an operation after a block was deleted locally.
     *
     * @method
     * @param {number} index The index of the deleted block in its parent
     * @param {CanvasEditor.RealtimeCanvas.Block} block The deleted block
     */
    blockDeletedLocally(index, block) {
      const path = this.getPathToBlock(block, index);
      const op = [{ p: path, ld: toShareDBBlock(block) }];
      this.submitOp(op);
    },

    /**
     * Generate and submit an operation from a diff in a property of the block's
     * meta.
     *
     * Called when the block's meta is updated locally.
     *
     * @method
     * @param {CanvasEditor.RealtimeCanvas.Block} block The block whose meta
     *   was updated
     * @param {Array<string, number>} metaPath The path to the meta value
     * @param {object} oldValue The old value
     * @param {object} newValue The new value
     */
    blockMetaReplacedLocally(block, metaPath, oldValue, newValue) {
      const path = this.getPathToBlock(block).concat('meta').concat(metaPath);

      const op = [{
        p: path,
        od: oldValue,
        oi: newValue
      }];

      this.submitOp(op);
    },

    /**
     * Generate and submit an operation representing the replacement of one
     * block with another.
     *
     * Called when a block is replaced locally.
     *
     * @method
     * @param {?index} index The index of the replaced block in its parent
     * @param {CanvasEditor.RealtimeCanvas.Block} block The replaced block
     * @param {CanvasEditor.RealtimeCanvas.Block} newBlock The replacing block
     */
    blockReplacedLocally(index, block, newBlock) {
      const path = this.getPathToBlock(block, index);

      const op = [{
        p: path,
        ld: toShareDBBlock(block),
        li: toShareDBBlock(newBlock)
      }];

      this.submitOp(op);
    },

    /**
     * Fetch the templates for autocompletion.
     *
     * @method
     * @returns {Promise<Array<object>>} An array of templates
     */
    fetchTemplates() {
      if (!this.get('canvas.team.isInTeam')) return RSVP.resolve([]);
      if (this.get('templates')) return RSVP.resolve(this.get('templates'));

      const team = this.get('canvas.team.content');

      return team.fetchTemplates().then(res => {
        this.set('templates', res.data.map(template => {
          return Object.assign({ id: template.id }, template.attributes);
        }));

        return this.get('templates');
      }, err => {
        throw err;
      });
    },

    /**
     * Fetch a signature for uploading files.
     *
     * @method
     * @returns {Promise<CanvasWeb.UploadSignature>} An upload signature
     */
    fetchUploadSignature() {
      return this.get('store').findRecord('upload-signature', 'self');
    },

    /**
     * Set the filter term to a word that was clicked on.
     *
     * @method
     * @param {jQuery.Event} evt A `click` event
     */
    metaSelectText(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      const { pageX, pageY } = evt;
      const range = this.getRangeFromPoint(pageX, pageY);
      if (!range || !range.startContainer.wholeText) return;
      const { startContainer, startOffset } = range;
      const { wholeText } = startContainer;
      const startIndex = wholeText.lastIndexOf(' ', startOffset) + 1;
      const endIndex = wholeText.indexOf(' ', startOffset);
      const selectedWord = endIndex === -1 ? wholeText.slice(startIndex)
        : wholeText.slice(startIndex, endIndex);
      if (selectedWord.trim() !== '') {
        this.set('filterTerm', selectedWord);
        this.set('showFilter', true);
      }
    },

    /**
     * Generate an operation for a new block being inserted locally.
     *
     * @method
     * @param {number} index The index of the inserted block
     * @param {CanvasEditor.RealtimeCanvas.Block} block The new block
     */
    newBlockInsertedLocally(index, block) {
      const path = this.getPathToBlock(block, index);
      const op = [{ p: path, li: toShareDBBlock(block) }];
      this.submitOp(op);
    },

    /**
     * Action fired after a template is applied to the current canvas.
     *
     * @method
     */
    templateApplied() {
      this.get('segment').trackEvent('Instantiated Template',
                                { source: 'autocomplete' });
    },

    /**
     * Redo the next operation.
     *
     * @method
     * @param {jQuery.Event} evt The `redo` event
     */
    redo(evt) {
      evt.preventDefault();
      const redoOp = this.get('undoManager').redo();
      if (!redoOp) return;

      try {
        this.syncLocalSelection(redoOp);
      } catch (err) {
        console.warn(err);
      }

      OpApplication.applyOperation(this.get('canvas'), redoOp);
      this.submitOp(redoOp, true);
    },

    /**
     * Called when a template has been applied to the canvas.
     *
     * @method
     * @param {string} templateID The ID of the applied template
     */
    templateApplied(templateID) {
      this.get('canvas').updateTemplate(templateID);
    },

    /**
     * Undo the last operation
     *
     * @method
     * @param {jQuery.Event} evt The `undo` event
     */
    undo(evt) {
      evt.preventDefault();
      const undoOp = this.get('undoManager').undo();
      if (!undoOp) return;

      try {
        this.syncLocalSelection(undoOp);
      } catch (err) {
        console.warn(err);
      }

      OpApplication.applyOperation(this.get('canvas'), undoOp);
      this.submitOp(undoOp, true);
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

/**
 * Given a string diff, generate an operation.
 *
 * @method
 * @private
 * @param {Array<object>} diff The diff to generate an op from
 * @param {Array<number, string>} blockPath The path to the diffed block
 * @returns {Array<object>} An array of operation components
 */
function generateOpFromDiff(diff, blockPath) {
  const op = [];

  let offset = 0;

  for (const comp of diff) {
    switch (comp[0]) {
      case 1:
        op.push({ p: blockPath.concat(offset), si: comp[1] });
        offset += comp[1].length;
        break;
      case -1:
        op.push({ p: blockPath.concat(offset), sd: comp[1] });
        break;
      case 0:
        offset += comp[1].length;
        break;
      default:
        throw new Error('Unrecognized diff type.');
    }
  }

  return op;
}

/**
 * Turn a block into a ShareDB-compatible block by duplicating it.
 *
 * @method
 * @private
 * @param {CanvasEditor.RealtimeCanvas.Block} block The block to convert
 * @returns {object} A plain JS object representing the block for serialization
 */
function toShareDBBlock(block) {
  const json = {
    id: block.get('id'),
    type: block.get('type'),
    content: block.get('content'),
    meta: toJSON(block.get('meta'))
  };

  if (typeof block.get('content') === 'string') {
    json.content = block.get('content');
  } else if (block.get('blocks')) {
    json.blocks = block.get('blocks').map(toShareDBBlock);
  }

  return json;
}

/**
 * Convert a value to JSON recursively.
 *
 * @method
 * @private
 * @param {object} obj The object to JSONify
 * @returns {object} The JSONified object
 */
function toJSON(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toJSON);
  } else if (typeof obj === 'string') {
    return obj;
  } else if (!obj) {
    return obj;
  } else if (typeof obj === 'object') {
    return Object.keys(obj).reduce(function(json, key) {
      json[key] = toJSON(obj[key]);
      return json;
    }, {});
  }

  return obj;
}
