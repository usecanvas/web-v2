import Ember from 'ember';
import ENV from 'canvas-web/config/environment';

export default Ember.Component.extend({
  intercomAppID: ENV.intercomAppID,
  localClassNames: ['intercom-launcher'],
  localClassNameBindings: ['intercomAppID::is-hidden']
});
