import Cookies from 'cookies';
import Ember from 'ember';

const { computed } = Ember;

export default Ember.Service.extend({
  token: computed(function() {
    return Cookies.get('csrf_token');
  }).volatile()
});
