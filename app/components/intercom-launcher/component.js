import Ember from 'ember';
import ENV from 'canvas-web/config/environment';

export default Ember.Component.extend({
  attributeBindings: ['href'],
  elementId: 'custom-intercom-link',
  href: `mailto:${ENV.intercomAppID}@incoming.intercom.io`,
  tagName: 'a'
});
