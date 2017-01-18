import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  findRecord(_store, _type, id) {
    return Ember.RSVP.resolve({ data: { id, type: 'block' } });
  }
});
