import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  queryParams: ['channel'],
  channel: null
});
