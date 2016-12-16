import Ember from 'ember';

/**
 * Renders a menu item inside of a `ui-menu`.
 *
 * The item can be used to render:
 *
 * 1. A regular link tag (i.e. `<a href={{link}}></a>`)
 * 2. A `link-to` component
 * 3. Or calling a closure action
 *
 * 1. A UI menu as a link tag for external links:
 *
 * {{#ui-menu link='https://example.com'}}
 *   Example
 * {{/ui-menu}}
 *
 * 2. A UI menu using a `link-to` component for internal routes:
 *
 * {{#ui-menu route=(array 'foo' 'bar' 'baz'}}
 *   Example
 * {{/ui-menu}}
 *
 * 3. A UI menu using a closure action:
 *
 * {{#ui-menu action=(action 'beep')}}
 *   Example
 * {{/ui-menu}}
 *
 * @class CanvasWeb.UIMenuItemComponent
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  localClassNames: ['ui-menu-item'],

  /**
   * @member {?Function} The closure action to be called:
   */
  action: null,

  /**
   * @member {?string} The download attribute for a `link`:
   */
  download: null,

  /**
   * @member {?string} A URL that will render the `ui-menu` item as a link:
   */
  link: null,

  /**
   * @member {?Array} An array to be passted to a link-to component's `params`
   *   property:
   */
  route: null,

  /**
   * Calls the passed in `action` when the user clicks on the item.
   *
   * @method
   */
  click() {
    const action = this.get('action');
    if (action) action();
  }
});
