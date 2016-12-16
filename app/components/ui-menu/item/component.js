import Ember from 'ember';

/**
 * Renders a menu item inside of a `ui-menu`.
 *
 * The item can be used to render:
 *
 * - A regular link tag (i.e. `<a href={{link}}></a>`)
 * - A `link-to` Component
 * - Or yield any component with a `click` action
 *
 * @class CanvasWeb.UIMenuItemComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  localClassNames: ['ui-menu-item'],

  /**
   * @member {string} The download attribute for a `link`.
   *
   * <a href={{link}} download={{download}}>{{yield}}</a>
   */
  download: null,

  /**
   * @member {string} A URL that will render the `ui-menu` item as a link:
   *
   * <a href={{link}}>{{yield}}</a>
   */
  link: null,

  /**
   * @member {array} An array to be passted to a link-to component's `params`
   *   property.
   *
   * {{link-to params=route}}{{yield}}{{/link-to}}
   */
  route: null,

  click() {
    const action = this.get('action');
    return action && action();
  }
});
