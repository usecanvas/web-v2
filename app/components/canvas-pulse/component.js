import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['canvas-pulse'],

  pulse: [
    {
      icon: 'Bookmark',
      actor: {
        name: '@soffes'
      },
      action: 'referenced this canvas',
      provider: {
        name: 'Github',
        link: '#'
      },
      attachment: {}
    },
    {
      icon: 'Bookmark',
      actor: {
        name: 'Max Schoening',
        link: '#'
      },
      action: 'referenced this canvas',
      provider: {
        name: 'Slack',
        link: '#'
      },
      attachment: {}
    },
    {
      icon: 'Bookmark',
      actor: {
        name: 'Oren Teich',
        link: '#'
      },
      action: 'referenced this canvas',
      attachment: {}
    },
    {
      icon: 'Chat',
      actor: {
        name: 'Jonathan Clem',
        link: '#'
      },
      action: 'kicked off a discussion',
      attachment: {}
    },
    {
      icon: 'Add',
      actor: {
        name: 'Oren Teich',
        link: '#'
      },
      action: 'created this canvas'
    }
  ]
});
