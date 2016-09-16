import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const team = this.modelFor('application').teams.get('firstObject');
    return this.replaceWith('teams.show', team);
  }
});
