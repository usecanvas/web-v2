import Ember from 'ember';
import ENV from 'canvas-web/config/environment';

export default Ember.Component.extend({
  attributeBindings: ['href'],
  elementId: 'custom-intercom-link',
  intercomAppID: ENV.intercomAppID,
  localClassNames: ['intercom-launcher'],
  localClassNameBindings: ['intercomAppID::is-hidden']
});
