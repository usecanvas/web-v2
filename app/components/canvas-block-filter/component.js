import Ember from 'ember';

const { $, on } = Ember;

export default Ember.Component.extend({
  filterTerm: '',
  inputSelector: '.js-input',
  localClassNames: ['canvas-block-filter'],

  focusInput: on('didInsertElement', function() {
    $(`${this.get('inputSelector')}`).focus();
  }),

  actions: {
    close() {
      this.get('onCloseFilter')();
      this.set('filterTerm', '');
    }
  }
});
