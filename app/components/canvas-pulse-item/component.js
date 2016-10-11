import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  localClassNames: ['canvas-pulse-item'],
  hideProvider: computed.equal('pulse.attachment.providerName', 'Canvas'),
  hideAttachment: computed.equal('pulse.type', 'canvas_created'),

  actionString: computed('pulse.type', function() {
    const type = this.get('pulse.type');

    switch (type) {
      case 'canvas_created':
        return 'created this canvas';
      case 'reference_added':
        return 'referenced this canvas';
      default:
        return 'foobar';
    }
  }),

  iconName: computed('pulse.type', function() {
    const type = this.get('pulse.type');

    switch (type) {
      case 'canvas_created':
        return 'Add';
      case 'reference_added':
        return 'Bookmark';
      default:
        return 'Notification';
    }
  })
});
