import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  channelIds: computed(_ => []),
  localClassNames: ['canvas-channel-list'],
  isEditingChannels: false,

  canvasChannels: computed('channelIds.[]', 'channels.[]', function() {
    return this.get('channelIds')
               .map(id => this.get('channels').findBy('id', id))
               .compact();
  }),

  selectedChannels: computed(function() {
    return this.get('canvasChannels');
  }),

  actions: {
    persistChannels() {
      this.set('isEditingChannels', false);
      this.get('updateCanvasChannels')(this.get('selectedChannels'));
    }
  }
});
