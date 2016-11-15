import Ember from 'ember';
import RSVP from 'rsvp';

const { computed } = Ember;

export default Ember.Mixin.create({
  showDropzone: computed.or('draggingOver', 'processingDrop'),

  dragEnter() {
    this.set('draggingOver', true);
  },

  dragOver(evt) {
    evt.preventDefault();
  },

  drop(evt) {
    evt.preventDefault();
    this.set('draggingOver', false);
    this.processDrops(evt.originalEvent);
  },

  readFile(file) {
    const reader = new FileReader();

    return new RSVP.Promise(resolve => {
      reader.onloadend = resolve;
      reader.readAsText(file);
    });
  },

  readJSONFile(file) {
    return this.readFile(file).then(read => {
      try {
        return RSVP.resolve(JSON.parse(read.target.result));
      } catch (err) {
        return RSVP.reject(err);
      }
    });
  },

  readTextFile(file) {
    return this.readFile(file).then(read => {
      try {
        return RSVP.resolve(read.target.result);
      } catch (err) {
        return RSVP.reject(err);
      }
    });
  },

  processDrops: Ember.K,

  readTemplates(dataTransfer) {
    const files = Array.from(dataTransfer.files).filter(isJSONFile);
    const reads = files.map(file => this.readJSONFile(file));
    return RSVP.all(reads);
  },

  readMarkdownFiles(dataTransfer) {
    const files = Array.from(dataTransfer.files).filter(isMarkdownFile);
    const reads = files.map(file => this.readTextFile(file));
    return RSVP.all(reads);
  }
});

function isCanvasFile({ name }) {
  return name.split('.').pop() === 'canvas';
}

function isMarkdownFile({ name }) {
  return ['md', 'markdown'].includes(name.split('.').pop());
}

function isJSONFile(file) {
  return file.type === 'application/json' || isCanvasFile(file);
}
