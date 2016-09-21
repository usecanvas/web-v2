import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onDeleteCanvas() {
      return this.get('model').destroyRecord({
        adapterOptions: { team: this.get('model.team') }
      }).then(_ => {
        this.transitionToRoute('team');
      });
    }
  }
});
