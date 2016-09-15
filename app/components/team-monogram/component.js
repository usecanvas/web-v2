import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: null,

  monogram: computed('name', function() {
    const initials = [],
          words = this.get('name').split(' '),

    for (let i = 0; i < 2; i++) {
      initials.push(words[i].toUpperCase());
    }

    return initials.join('');
  })
});
