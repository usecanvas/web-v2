import CanvasAdapter from 'canvas-web/adapters/canvas';
import Ember from 'ember';
import ENV from 'canvas-web/config/environment';

const { computed } = Ember;

export default Ember.Component.extend({
  localClassNames: ['canvas-title-actions'],
  menuIsShowing: false,
  router: Ember.inject.service(),

  downloadURL: computed('canvas.team', 'canvas.id', function() {
    const path = CanvasAdapter.create().urlForFindRecord(
      this.get('canvas.id'),
      this.get('canvas.constructor.modelName'),
      { adapterOptions: { team: this.get('canvas.team') } });

    return `${ENV.apiURL.replace(/\/v1\/$/, '')}${path}.canvas`;
  }),

  actions: {
    deleteCanvas() {
      this.get('onDeleteCanvas')();
    },

    toggleMenu() {
      this.toggleProperty('menuIsShowing');
    }
  }
});
