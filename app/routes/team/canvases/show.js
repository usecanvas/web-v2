import ENV from 'canvas-web/config/environment';
import Ember from 'ember';
import RealtimeCanvas from 'canvas-editor/lib/realtime-canvas';
import ShareDB from 'sharedb';

const { computed } = Ember;

export default Ember.Route.extend({
  teamQuery: Ember.inject.service(),

  realtimeURL: computed(function() {
    const protocol = window.location.protocol === 'http:' ? 'ws:' : 'wss:';
    const host = ENV.realtimeHost;
    return `${protocol}//${host}`;
  }),

  model({ id }) {
    const domain = this.paramsFor('team').domain;

    return this.get('teamQuery').findByDomain(domain).then(team => {
      return this.get('store').findRecord('canvas', id, {
        adapterOptions: { team }
      });
    });
  },

  afterModel(canvas) {
    return this.shareDBConnect(canvas.get('team'), canvas);
  },

  shareDBConnect(team, canvas) {
    const socket = this.set('socket', new WebSocket(this.get('realtimeURL')));
    const connection = new ShareDB.Connection(socket);
    const shareDBDoc = connection.get(team.get('id'), canvas.get('id'));

    canvas.set('shareDBDoc', shareDBDoc);

    this.startPingInterval();

    return new Ember.RSVP.Promise((resolve, reject) => {
     shareDBDoc.subscribe(err => {
       if (err) return reject(err);

       canvas.set('blocks', shareDBDoc.data.map(block => {
         return RealtimeCanvas.createBlockFromJSON(block);
       }));

       return resolve(canvas);
     });
   });
 },

  deactivate() {
    this.get('socket').close();
    clearInterval(this.get('pingInterval'));
  },

  ping() {
    const socket = this.get('socket');
    const ping = JSON.stringify({ ping: true });
    if (socket.readyState === WebSocket.OPEN) socket.send(ping);
  },

  startPingInterval() {
    this.set('pingInterval', setInterval(this.ping.bind(this), 30000));
  }
});
