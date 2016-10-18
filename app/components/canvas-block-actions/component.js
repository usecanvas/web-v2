import Ember from 'ember';
import copyText from 'canvas-web/lib/copy-text';

const { computed } = Ember;

export default Ember.Component.extend({
  localClassNames: ['canvas-block-actions'],

  actions: {
    copyWebUrl() {
      copyText(this.get('canvas').getWebUrl(this.get('block.id')));
    }
  }
});
