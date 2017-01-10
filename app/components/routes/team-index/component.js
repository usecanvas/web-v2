import Ember from 'ember';
import RSVP from 'rsvp';
import ChannelIDs from 'canvas-web/mixins/channel-ids';
import WithDropzone from 'canvas-web/mixins/with-dropzone';
import layout from './template';
import styles from './styles';

const { computed, inject, run } = Ember;

export default Ember.Component.extend(ChannelIDs, WithDropzone, {
  layout,
  localClassNames: ['route-team-index'],
  styles,
  topicCanvas: true,

  // An array that contains any canvases created between clicking the new button
  // and the route transition to team.canvas.show
  newCanvases: computed(() => []),
  store: inject.service(),
  teamsList: inject.service(),

  disablePointer: Ember.String.htmlSafe('pointer-events: none'),

  channelModel: computed('channel', 'team.channels.[]', function() {
    if (this.get('channel')) {
      return this.get('team.channels').findBy('name', this.get('channel'));
    }
    return null;
  }),

  filteredCanvases: computed(
    'channel',
    'newCanvases.[]',
    'team.channels.[]',
    'team.canvases.@each.slackChannelIds', function() {
      const newCanvases = this.get('newCanvases');
      const canvases = this.get('team.canvases')
        .filter(canvas => canvas.get('id') &&
          !newCanvases.includes(canvas.get('id')));
      const channel = this.get('team.channels')
        .findBy('name', this.get('channel'));

      if (!channel) return canvases;

      return canvases.filter(canvas => {
        return canvas.get('slackChannelIds').includes(channel.get('id'));
      });
    }),


  processDrops({ dataTransfer }) {
    this.set('processingDrop', true);

    return RSVP.all([this.readTemplates(dataTransfer),
    this.readMarkdownFiles(dataTransfer)])
    .then(([templates, mdFiles]) => {
      const uploads = templates.map(run.bind(this, 'uploadTemplate'));
      const canvases = mdFiles.map(run.bind(this, 'convertMarkdown'));
      return RSVP.all([uploads, canvases]);
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

  convertMarkdown(markdown) {
    const team = this.get('team');
    return this.get('store')
      .createRecord('canvas', {
        markdown,
        slackChannelIds: this.get('channelIDs'),
        team
      })
      .save();
  },

  actions: {
    dismiss(identifier) {
      return this.get('store')
        .createRecord('ui-dismissal', { identifier })
        .save();
    },

    didCreateCanvas(canvas) {
      this.get('newCanvases').pushObject(canvas.get('id'));
      this.sendAction('didCreateCanvas', canvas);
    }
  }
});
