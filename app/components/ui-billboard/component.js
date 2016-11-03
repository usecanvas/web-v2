import Ember from 'ember';

export default Ember.Component.extend({
  fullScreen: false,
  localClassNames: ['ui-billboard'],
  localClassNameBindings: ['fullScreen:full-screen']
});
