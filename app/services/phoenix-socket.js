import Ember from 'ember';
import RSVP from 'rsvp';
import ENV from 'canvas-web/config/environment';
import Phoenix from 'canvas-web/lib/phoenix';
import { task } from 'ember-concurrency';

const { computed, inject, run } = Ember;

export default Ember.Service.extend({
  currentAccount: inject.service(),
  store: inject.service(),

  liveURL: computed(_ => {
    const host = ENV.apiURL.replace(/^.+?\/\//, '').replace(/\/v1\/$/, '');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${host}/socket`;
  }),

  /**
   * @member {Ember.Object} An object containing socket params that will be
   *   read anew each time the socket attempts to connect or reconnect
   */
  socketParams: Ember.computed(_ => Ember.Object.create()),

  socket: computed('currentAccount.loggedIn', function() {
    if (!this.get('currentAccount.loggedIn')) return RSVP.Promise.resolve(null);

    return this.get('setSocketToken').perform().then(_ => {
      const socket = new Phoenix.Socket(this.get('liveURL'), {
        heartbeatIntervalMs: 15000,
        params: this.get('socketParams')
      });

      socket.connect();

      socket.onClose(run.bind(this, function() {
        this.get('setSocketToken').perform();
      }));

      this._socket = socket;
      return socket;
    });
  }),

  /**
   * Create an access token and set it as a property on the socket params.
   *
   * @method
   */
  setSocketToken: task(function *() {
    try {
      const token = yield this.get('store').createRecord('token', {}).save();
      this.set('socketParams.token', token.get('token'));
    } catch (_err) {
      // Ignore failed token creation
    }
  })
});
