import Ember from 'ember';
import RSVP from 'rsvp';
import ChannelIDs from 'canvas-web/mixins/channel-ids';
import WithDropzone from 'canvas-web/mixins/with-dropzone';
import layout from './template';
import styles from './styles';

const { inject, run } = Ember;

export default Ember.Component.extend(ChannelIDs, WithDropzone, {
  layout,
  localClassNames: ['teams-show-route'],
  styles,

  store: inject.service(),
  teamsList: inject.service(),

  disablePointer: Ember.String.htmlSafe('pointer-events: none'),

  processDrops({ dataTransfer }) {
    this.set('processingDrop', true);

    return this.readTemplates(dataTransfer).then(templates => {
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

    Reflect.deleteProperty(template, 'id');
    template.isTemplate = template.is_template;

    return this.get('store')
               .createRecord('canvas', Object.assign(template, {
                 slackChannelIds: this.get('channelIDs'),
                 team
               }))
               .save();
  },

  actions: {
    didCreateCanvas(canvas) {
      this.sendAction('didCreateCanvas', canvas);
    }
  }
});
