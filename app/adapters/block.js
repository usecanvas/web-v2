import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  /**
  * Return a payload client-side so block finds will not fail when
  * the comment model requests the block through its relationship
  */
  findRecord(_store, _type, id) {
    return Ember.RSVP.resolve({ data: { id, type: 'block' } });
  }
});
