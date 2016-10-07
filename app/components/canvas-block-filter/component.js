import Ember from 'ember';

export default Ember.Component.extend({
  filterTerm: '',
  localClassNames: ['canvas-block-filter'],

  actions: {
    close() {
      this.get('onCloseFilter')();
      this.set('filterTerm', '');
    }
  }
});
