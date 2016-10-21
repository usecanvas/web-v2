import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  queryParams: 'block filter'.w(),
  block: null,
  filter: '',
  blockID: computed.readOnly('block')
});
