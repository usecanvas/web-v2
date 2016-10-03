import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  channels: [
    '#apple',
    '#general'
  ],

  channelList: computed('channels.[]', function() {
    return this.get('channels').join(', ');
  })
});
