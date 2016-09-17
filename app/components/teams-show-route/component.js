import Ember from 'ember';
import layout from './template';
import styles from './styles';

export default Ember.Component.extend({
  layout,
  localClassNames: ['teams-show-route'],
  styles,

  store: Ember.inject.service(),
  teamsList: Ember.inject.service(),

  actions: {
    onNewCanvas() {
      const team = this.get('team');

      this.get('store').createRecord('canvas', { team }).save();
    }
  }
});
