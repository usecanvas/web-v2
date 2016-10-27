import Ember from 'ember';

const INTERCOM_APP_ID = 'htxi7bqv';

export default Ember.Component.extend({
  attributeBindings: ['href', 'id'],
  href: `mailto:${INTERCOM_APP_ID}@incoming.intercom.io`,
  id: 'custom-intercom-link',
  tagName: 'a'
});
