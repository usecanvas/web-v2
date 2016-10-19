import DMP from 'diff-match-patch';
import Ember from 'ember';
import Key from 'canvas-web/lib/key';
import Rangy from 'rangy';
import RealtimeCanvas from 'canvas-editor/lib/realtime-canvas';
import RSVP from 'rsvp';
import SelectionState from 'canvas-editor/lib/selection-state';
import WithDropzone from 'canvas-web/mixins/with-dropzone';
import nsEvents from 'canvas-web/lib/ns-events';
import { getTargetBlock, parseListPath, parseObjectPath, parseStringPath } from 'canvas-web/lib/sharedb-path';
import { task, timeout } from 'ember-concurrency';

const differ = new DMP();
const { $, computed, inject, observer, on, run } = Ember;

export default Ember.Component.extend(WithDropzone, {
  currentAccount: inject.service(),
  isFiltered: computed.bool('filterTerm'),
  localClassNames: ['canvas-show-route'],
  showFilter: false,
  store: inject.service(),

  bindOpEvents: on('didInsertElement', function() {
    this.get('canvas.shareDBDoc').on('op', (op, isLocalOp) => {
      if (isLocalOp) return;

      run.join(_ => {
        this.syncLocalSelection(op);
        this.applyOpToLocalModel(op);
      });
    });
  }),

  bindKeyboardShortcuts: on('didInsertElement', function() {
    $(document).on(nsEvents(this, 'keydown'),
                   Ember.run.bind(this, this.handleKeyboardShortcut));
  }),

  initFilterState: on('init', function() {
    if (this.get('filterQueryParam')) {
      this.set('filterTerm', this.get('filterQueryParam'));
      this.set('showFilter', true);
    }
  }),

  handleKeyboardShortcut(evt) {
    const key = new Key(evt);
    if (evt.target.nodeName === 'INPUT' || this.isInEditor(evt)) return;
    if (key.is('slash')) {
      this.set('showFilter', true);
      evt.preventDefault();
    } else if (key.is('esc')) {
      this.set('showFilter', false);
      this.set('filterTerm', '');
    }
  },

  isInEditor(evt) {
    return $.contains(this.$('.canvas-editor')[0], evt.target) ||
      this.$('[data-card-block-selected=true]').length;
  },

  updateFilterQP: task(function *() {
    yield timeout(500);
    this.set('filterQueryParam', this.get('filterTerm'));
  }).drop().observes('filterTerm'),

  unbindKeyboardShortcuts: on('willDestroyElement', function() {
    $(document).off(nsEvents(this, 'keydown'));
  }),

  dragEnter() {
    if (this.get('canvas.blocks.length') > 1) return;
    if (this.get('canvas.blocks.firstObject.content')) return;
    this._super(...arguments);
  },

  processDrops({ dataTransfer }) {
    this.set('processingDrop', true);

    return this.readTemplates(dataTransfer).then(templates => {
      const template = templates[0]; // Ignore more than one.
      this.set('canvas.fillTemplate', template);
      this.set('processingDrop', false);
    }).catch(err => {
      throw err;
    });
  },

  scrollToTop: observer('canvas', function() {
    run.scheduleOnce('afterRender', _ => {
      const mainClass =
        Ember.getOwner(this)
             .lookup('controller:team.canvas')
             .get('styles.main');
      Ember.$(`.${mainClass}`).get(0).scrollTop = 0;
    });
  }),

  applyOpToLocalModel(op) {
    for (const comp of op) {
      for (const compKey in comp) {
        if (!comp.hasOwnProperty(compKey)) continue;
        switch (compKey) {
          case 'si':
            this.applyComponentStringInsert(comp.p, comp.si);
            break;
          case 'sd':
            this.applyComponentStringDelete(comp.p, comp.sd);
            break;
          case 'li':
            this.applyComponentListInsert(comp.p, comp.li);
            break;
          case 'ld':
            this.applyComponentListDelete(comp.p, comp.ld);
            break;
          case 'oi':
            this.applyComponentObjectInsert(comp.p, comp.oi);
            break;
          case 'od':
            this.applyComponentObjectDelete(comp.p, comp.od);
            break;
          case 'p': // Ignore "path".
            break;
          default:
            throw new Error(`Cannot apply component: ${comp}`);
        }
      }
    }
  },

  applyComponentListDelete(path, _block) {
    const { parent, property, index } =
      parseListPath(path, this.get('canvas'));
    parent.get(property).removeAt(index);
  },

  applyComponentListInsert(path, block) {
    const { parent, property, index } =
      parseListPath(path, this.get('canvas'));
    const realtimeBlock = RealtimeCanvas.createBlockFromJSON(block);
    if (parent.get('isGroup')) realtimeBlock.set('parent', parent);
    parent.get(property).replace(index, 0, [realtimeBlock]);
  },

  applyComponentObjectInsert(path, value) {
    const { block, metaPath } = parseObjectPath(path, this.get('canvas'));
    block.set(metaPath.join('.'), value);
  },

  applyComponentObjectDelete(path, _value) {
    const { block, metaPath } = parseObjectPath(path, this.get('canvas'));
    block.set(metaPath.join('.'), null);
  },

  applyComponentStringDelete(path, string) {
    const { block, property, offset } =
      parseStringPath(path, this.get('canvas'));
    const content = block.get(property);
    const newContent =
      content.slice(0, offset) + content.slice(offset + string.length);
    block.set('content', newContent);
  },

  applyComponentStringInsert(path, string) {
    const { block, property, offset } =
      parseStringPath(path, this.get('canvas'));
    const content = block.get(property);
    const newContent =
      content.slice(0, offset) + string + content.slice(offset);
    block.set('content', newContent);
  },

  /* eslint-disable max-statements */
  syncLocalSelection(op) {
    let activeElement =
      this.$(window.getSelection().anchorNode).closest('.canvas-block').get(0);

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
        activeElement = this.$(`[data-block-id=${prevBlock.get('id')}]`).get(0);
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

  getPathToBlock(block, index) {
    const parent = block.get('parent') || this.get('canvas');

    if (typeof index !== 'number') {
      index = parent.get('blocks').indexOf(block);
    }

    if (!block.get('parent')) return [index];
    const groupIndex = this.get('canvas.blocks').indexOf(block.get('parent'));
    return [groupIndex, 'blocks', index];
  },

  getPreviousBlock(block) {
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

  submitOp(op) {
    this.set('canvas.editedAt', new Date());
    this.get('canvas.shareDBDoc').submitOp(op);
  },

  actions: {
    blockContentUpdatedLocally(block) {
      const lastContent = block.get('lastContent');
      const content = block.get('content');
      const diff = differ.diff_main(lastContent, content);
      const blockPath = this.getPathToBlock(block).concat('content');
      const op = generateOpFromDiff(diff, blockPath);
      this.submitOp(op);
    },

    blockMetaReplacedLocally(block, metaPath, oldValue, newValue) {
      const path = this.getPathToBlock(block).concat('meta').concat(metaPath);

      const op = [{
        p: path,
        od: oldValue,
        oi: newValue
      }];

      this.submitOp(op);
    },

    blockReplacedLocally(index, block, newBlock) {
      const path = this.getPathToBlock(block, index);

      const op = [{
        p: path,
        ld: toShareDBBlock(block),
        li: toShareDBBlock(newBlock)
      }];

      this.submitOp(op);
    },

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

    newBlockInsertedLocally(index, block) {
      const path = this.getPathToBlock(block, index);
      const op = [{ p: path, li: toShareDBBlock(block) }];
      this.submitOp(op);
    },

    blockDeletedLocally(index, block) {
      const path = this.getPathToBlock(block, index);
      const op = [{ p: path, ld: toShareDBBlock(block) }];
      this.submitOp(op);
    },

    fetchTemplates() {
      if (this.get('templates')) return RSVP.resolve(this.get('templates'));

      const team = this.get('canvas.team');

      return new RSVP.Promise(resolve => {
        const url = `/v1/teams/${team.get('id')}/templates`;

        return Ember.$.getJSON(url).then(res => {
          this.set('templates', res.data.mapBy('attributes'));
          resolve(this.get('templates'));
        }, err => {
          throw err;
        });
      });
    },

    unfurlBlock(block) {
      return this.get('store').findRecord('unfurl', block.get('meta.url'));
    }
  }
});

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
