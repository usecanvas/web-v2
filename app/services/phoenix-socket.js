import Ember from 'ember';
import ENV from 'canvas-web/config/environment';
import Phoenix from 'canvas-web/lib/phoenix';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  liveURL: Ember.computed(_ => {
    const host = ENV.apiURL.replace(/^.+?\/\//, '').replace(/\/v1\/$/, '');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${host}/socket`;
  }),

  socket: Ember.computed(function() {
    return this.get('store').createRecord('token', {}).save().then(token => {
      const socket = new Phoenix.Socket(this.get('liveURL'), {
        heartbeatIntervalMs: 15000,
        params: { token: token.get('token') }
      });
      socket.connect();
      return socket;
    });
  })
});
