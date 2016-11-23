import Ember from 'ember';
import ENV from 'canvas-web/config/environment';
import styles from './styles';

/**
 * A component which can wrap content in a team list
 *
 * @class CanvasWeb.TeamListWrapperComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  changelogURL: ENV.changelogURL,
  localClassNames: ['team-list-wrapper'],
  styles
});
