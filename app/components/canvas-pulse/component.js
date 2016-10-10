import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['canvas-pulse'],

  pulse: [
    {
      actor: {
        name: '@soffes'
      },
      action: 'mentioned this canvas',
      provider: {
        name: 'Github',
        link: '#'
      },
      attachment: {}
    },
    {
      actor: {
        name: 'Max Schoening',
        link: '#'
      },
      action: 'mentioned this canvas',
      provider: {
        name: 'Slack',
        link: '#'
      },
      attachment: {}
    },
    {
      actor: {
        name: 'Oren Teich',
        link: '#'
      },
      action: 'references this canvas',
      attachment: {}
    },
    {
      actor: {
        name: 'Jonathan Clem',
        link: '#'
      },
      action: 'kicked off a discussion',
      attachment: {}
    },
    {
      actor: {
        name: 'Oren Teich',
        link: '#'
      },
      action: 'created this canvas'
    }
  ]
});
