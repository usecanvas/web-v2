import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const { canvas } = this.modelFor('team.canvas');

    return canvas.get('pulseEvents').then(pulseEvents => {
      return [this.get('store').createRecord('pulseEvent', {
        providerName: 'Canvas',
        providerUrl: 'https://pro.usecanvas.com',
        type: 'canvas_created',
        referencer: {
          id: canvas.get('creator.id'),
          avatarUrl: canvas.get('creator.avatarUrl'),
          email: canvas.get('creator.email'),
          name: canvas.get('creator.name'),
          url: `mailto:${canvas.get('creator.email')}`
        }
      })].unshiftObjects(pulseEvents.toArray());
    });
  }
});
