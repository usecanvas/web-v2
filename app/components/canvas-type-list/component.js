import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['canvas-type-list'],
  types: [
    { label: 'Metting Notes' },
    { label: 'OKR' },
    { label: 'Retrospective' },
    { label: 'Spec' },
    { label: 'Sprint Planning' },
    { label: 'Standup' },
    { label: 'Work log' }
  ]
});
