import Cookies from 'cookies';
import Ember from 'ember';
import ENV from 'canvas-web/config/environment';

const { computed } = Ember;
let token;

if (window.requireNode) {
  const storage = window.requireNode('electron-json-storage');
  storage.get('csrf', (_, data) => {
    token = data;
  });
}

export default Ember.Service.extend({
  token: computed(function() {
    return ENV.isElectron ? token : Cookies.get('csrf_token');
  }).volatile()
});
