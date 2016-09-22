import Ember from 'ember';
import nsEvents from 'canvas-web/lib/ns-events';

const { $, on } = Ember;

export default Ember.Mixin.create({
  closeOnEscape: true,
  isOpen: false,
  onClose: Ember.K,
  onOpen: Ember.K,

  setUpEventHandlers: on('didInsertElement', function() {
    $(document).on(nsEvents(this, 'click touchstart'),
      _ => Ember.run(this, 'dropdownClick'));
  }),

  tearDownEventHandlers: on('willDestroyElement', function() {
    $(document).off(nsEvents(this, 'click touchstart'));
  }),

  click(event) {
    event.stopPropagation();
  },

  dropdownClick() {
    this.send('closeDropdown');
  },

  actions: {
    closeDropdown() {
      this.set('isOpen', false);
      this.get('onClose')();
    },

    openDropdown() {
      this.set('isOpen', true);
      this.get('onOpen')();
    },

    toggleDropdown() {
      this.toggleProperty('isOpen');

      if (this.get('isOpen')) {
        this.get('onOpen')();
      } else {
        this.get('onClose')();
      }
    }
  }
});
