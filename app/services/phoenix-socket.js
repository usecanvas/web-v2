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

  /**
   * @member {Ember.Object} An object containing socket params that will be
   *   read anew each time the socket attempts to connect or reconnect
   */
  socketParams: Ember.computed(_ => Ember.Object.create()),

  socket: computed('currentAccount.loggedIn', function() {
    if (!this.get('currentAccount.loggedIn')) return RSVP.Promise.resolve(null);

    return this.setSocketToken().then(_ => {
      const socket = new Phoenix.Socket(this.get('liveURL'), {
        heartbeatIntervalMs: 15000,
        params: this.get('socketParams')
      });

      socket.connect();
      socket.onClose(this.setSocketToken.bind(this));

      this._socket = socket;
      return socket;
    });
  }),

  /**
   * Create an access token and set it as a property on the socket params.
   *
   * @method
   * @return {Promise<null>}
   */
  setSocketToken() {
    return this.get('store').createRecord('token', {}).save().then(token => {
      this.set('socketParams.token', token.get('token'));
      return null;
    });
  }
});
