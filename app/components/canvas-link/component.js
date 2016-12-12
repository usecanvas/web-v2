import Ember from 'ember';
import Qs from 'qs';

const { computed } = Ember;

export default Ember.Component.extend({
  blockID: computed.oneWay('query.block'),
  filter: computed.oneWay('query.filter'),
  host: window.location.host,
  protocol: window.location.protocol,
  tagName: '',

  canvasID: computed('parsedURL', function() {
    return this.get('parsedURL.pathname')
               .split('/')
               .reject(part => !part)
               .get('lastObject');
  }),

  parsedURL: computed('url', function() {
    const link = document.createElement('a');
    link.href = this.get('url');
    return link;
  }),

  query: computed('parsedURL', function() {
    return Qs.parse(this.get('parsedURL.search').slice(1));
  })
});
