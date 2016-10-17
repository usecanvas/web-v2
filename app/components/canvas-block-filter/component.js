import Ember from 'ember';
import Key from 'canvas-web/lib/key';

const { on } = Ember;

export default Ember.Component.extend({
  filterTerm: '',
  inputSelector: '.js-input',
  localClassNames: ['canvas-block-filter'],

  closeFilter() {
    this.get('onCloseFilter')();
    this.set('filterTerm', '');
  },

  focusInput: on('didInsertElement', function() {
    this.$(`${this.get('inputSelector')}`).focus();
  }),

  keyDown(evt) {
    const key = new Key(evt);
    if (key.is('esc')) {
      this.closeFilter();
    }
  }
});
