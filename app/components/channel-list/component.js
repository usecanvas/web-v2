import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['channel-list'],

  channels: [
    {
      name: 'allevents'
    },
    {
      name: 'analytics'
    },
    {
      name: 'api'
    },
    {
      name: 'apple'
    }
  ]
});
