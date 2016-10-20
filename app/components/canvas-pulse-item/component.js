import Ember from 'ember';

const { computed, inject } = Ember;

export default Ember.Component.extend({
  localClassNames: ['canvas-pulse-item'],
  hideProvider: computed.equal('pulseEvent.providerName', 'Canvas'),
  hideUnfurl: computed.equal('pulseEvent.type', 'canvas_created'),
  unfurler: inject.service(),

  actionString: computed('pulseEvent.type', function() {
    const type = this.get('pulseEvent.type');

    switch (type) {
      case 'canvas_created':
        return 'created this canvas';
      case 'reference_added':
        return 'referenced this canvas';
      case 'reference_removed':
        return 'removed a reference to this canvas';
      case 'mentioned':
        return 'mentioned this canvas';
      default:
        throw new Error(`unrecognized event type: ${type}`);
    }
  }),

  iconName: computed('pulseEvent.type', function() {
    const type = this.get('pulseEvent.type');

    switch (type) {
      case 'canvas_created':
        return 'Add';
      case 'reference_added':
      case 'reference_removed':
        return 'Bookmark';
      default:
        return 'Notification';
    }
  }),

  actions: {
    unfurlEvent(event) {
      return this.get('unfurler').unfurl(event.get('url'));
    }
  }
});
