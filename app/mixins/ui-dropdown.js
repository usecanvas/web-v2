import Ember from 'ember';
import nsEvents from 'canvas-web/lib/ns-events';

const { $, on } = Ember;

export default Ember.Mixin.create({
  eventList: 'click touchstart',
  isOpen: false,
  onClose: Ember.K,
  onOpen: Ember.K,

  setUpEventHandlers: on('didInsertElement', function() {
    $(document).on(nsEvents(this, this.get('eventList')),
      Ember.run.bind(this, 'dropdownClick'));
  }),

  tearDownEventHandlers: on('willDestroyElement', function() {
    $(document).off(nsEvents(this, this.get('eventList')));
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
