import Ember from 'ember';

export default Ember.Mixin.create({
  channelIDs: Ember.computed('channel', 'team.channels.[]', function() {
    const channelName = this.get('channel');
    if (!channelName) return [];
    const channel = this.get('team.channels').findBy('name', channelName);
    if (!channel) return [];
    return [channel.get('id')];
  })
});
