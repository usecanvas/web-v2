import DS from 'ember-data';
import ENV from 'canvas-web/config/environment';

export default DS.JSONAPIAdapter.extend({
  namespace: ENV.apiNamespace
});
