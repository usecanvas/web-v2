import Ember from 'ember';
import ENV from 'canvas-web/config/environment';
import Phoenix from 'canvas-web/lib/phoenix';

const { computed, inject, observer, RSVP } = Ember;

export default Ember.Service.extend({
  currentAccount: inject.service(),
  store: inject.service(),

  liveURL: computed(_ => {
    const host = ENV.apiURL.replace(/^.+?\/\//, '').replace(/\/v1\/$/, '');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${host}/socket`;
  }),

  loggedOut: observer('currentAccount.loggedIn', function() {
    if (!this.get('currentAccount.loggedIn') || this._socket) {
      this.get('store').unloadAll('token');
      this._socket.disconnect();
    }
  }),

  socket: computed('currentAccount.loggedIn', function() {
    if (!this.get('currentAccount.loggedIn')) return RSVP.Promise.resolve(null);

    return this.get('store').createRecord('token', {}).save().then(token => {
      const socket = new Phoenix.Socket(this.get('liveURL'), {
        heartbeatIntervalMs: 15000,
        params: { token: token.get('token') }
      });
      socket.connect();
      this._socket = socket;
      return socket;
    });
  })
});
