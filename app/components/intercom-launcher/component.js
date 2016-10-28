import Ember from 'ember';

const INTERCOM_APP_ID = 'htxi7bqv';

export default Ember.Component.extend({
  attributeBindings: ['href'],
  elementId: 'custom-intercom-link',
  href: `mailto:${INTERCOM_APP_ID}@incoming.intercom.io`,
  tagName: 'a'
});
