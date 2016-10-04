import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  queryParams: ['channel'],
  channel: null,

  filteredCanvases: computed(
    'channel',
    'model.channels.[]',
    'model.canvases.@each.slackChannelIds', function() {
      const canvases = this.get('model.canvases');
      const channel = this.get('model.channels')
                          .findBy('name', this.get('channel'));

      if (!channel) return canvases;

      return canvases.filter(canvas => {
        return canvas.get('slackChannelIds').includes(channel.get('id'));
      });
    })
});
