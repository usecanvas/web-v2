import Ember from 'ember';

const { inject } = Ember;

export default Ember.Component.extend({
  teamsList: inject.service()
});
