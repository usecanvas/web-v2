import Ember from 'ember';
import styles from './styles';
import layout from './template';

export default Ember.Component.extend({
  layout,
  localClassNames: ['dropzone'],
  localClassNameBindings: ['showDropzone'],
  styles,

  dragLeave() {
    this.set('draggingOver', false);
  }
});
