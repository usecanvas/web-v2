import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['canvas-list-item'],
  localClassNameBindings: ['canvas.isTemplate:is-template'],

  actions: {
    onClickDelete(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      this.get('onDeleteCanvas')(this.get('canvas'));
    }
  }
});
