import Ember from 'ember';

const { $, on } = Ember;

export default Ember.Component.extend({
  filterTerm: '',
  inputClass: 'js-input',
  localClassNames: ['canvas-block-filter'],

  focusInput: on('didInsertElement', function() {
    $(`.${this.get('inputClass')}`).focus();
  }),

  actions: {
    close() {
      this.get('onCloseFilter')();
      this.set('filterTerm', '');
    }
  }
});
