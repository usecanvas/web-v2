import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['route-canvas-pulse'],
  pulseEvents: Ember.computed(_ => [])
});
