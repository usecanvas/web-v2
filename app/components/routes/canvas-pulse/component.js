import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['route-canvas-pulse'],
  pulseEvents: Ember.computed(_ => []),
  slackScopesForPulse: `bot channels:history channels:read chat:write:bot
  commands team:read users:read`.w()
});
