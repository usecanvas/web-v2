import DS from 'ember-data';
import Ember from 'ember';
import RSVP from 'rsvp';

const { attr, belongsTo } = DS;
const { computed } = Ember;

const TOPIC_REGEX =
  new RegExp(`https?://${window.location.host}/([^/]+)/([a-z0-9]{22})`, 'i');

export default DS.Model.extend({
  name: attr(),
  topic: attr(),

  team: belongsTo('team', { async: true, inverse: 'channels' }),

  topicCanvas: computed('topic', function() {
    const topic = this.get('topic') || '';
    const match = topic.match(TOPIC_REGEX);
    if (!match) return RSVP.resolve(null);

    const canvasID = match[2];

    return this.get('store').findRecord('canvas', canvasID, {
      adapterOptions: { team: this.get('team') }
    });
  })
}).reopenClass({
  modelName: 'slack-channel'
});
