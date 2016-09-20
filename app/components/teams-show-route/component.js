import Ember from 'ember';
import RSVP from 'rsvp';
import layout from './template';
import styles from './styles';

const { computed, inject, run } = Ember;

export default Ember.Component.extend({
  layout,
  localClassNames: ['teams-show-route'],
  styles,

  store: inject.service(),
  teamsList: inject.service(),

  showDropzone: computed.or('draggingOver', 'processingDrop'),

  dragEnter() {
    this.set('draggingOver', true);
  },

  dragOver(evt) {
    evt.preventDefault();
  },

  dragLeave() {
    this.set('draggingOver', false);
  },

  drop(evt) {
    evt.preventDefault();
    this.set('draggingOver', false);
    this.processDrops(evt.originalEvent);
  },

  disablePointer: Ember.String.htmlSafe('pointer-events: none'),

  processDrop(file) {
    const reader = new FileReader();

    return new RSVP.Promise(resolve => {
      reader.onloadend = resolve;
      reader.readAsText(file);
    }).then(read => {
      try {
        return RSVP.resolve(JSON.parse(read.target.result));
      } catch (err) {
        return RSVP.reject(err);
      }
    });
  },

  processDrops({ dataTransfer }) {
    this.set('processingDrop', true);

    const files = Array.from(dataTransfer.files).filter(isJSONFile);
    const reads = files.map(run.bind(this, 'processDrop'));

    return RSVP.all(reads).then(templates => {
      const uploads = templates.map(run.bind(this, 'uploadTemplate'));
      return RSVP.all(uploads);
    }).then(_ => {
      this.set('processingDrop', false);
    }).catch(err => {
      this.set('processingDrop', false);
      throw err;
    });
  },

  uploadTemplate(template) {
    const team = this.get('team');

    template.isTemplate = template.is_template;

    return this.get('store')
               .createRecord('canvas', Object.assign(template, { team }))
               .save();
  },

  actions: {
    didCreateCanvas(canvas) {
      this.sendAction('didCreateCanvas', canvas);
    }
  }
});

function isCanvasFile({ name }) {
  return name.split('.').pop() === 'canvas';
}

function isJSONFile(file) {
  return file.type === 'application/json' || isCanvasFile(file);
}
