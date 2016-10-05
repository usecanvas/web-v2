import ChannelIDs from 'canvas-web/mixins/channel-ids';
import Ember from 'ember';

export default Ember.Component.extend(ChannelIDs, {
  localClassNames: ['new-canvas-button'],
  localClassNameBindings: ['inline:new-canvas-button--inline'],
  store: Ember.inject.service(),

  didCreateCanvas: Ember.K,

  click() {
    const team = this.get('team');

    this.get('store').createRecord('canvas', {
      slackChannelIds: this.get('channelIDs'),
      team
    }).save().then(canvas => {
      this.sendAction('didCreateCanvas', canvas);
      this.get('didCreateCanvas')(canvas);
    });
  }
});
