import Ember from 'ember';

const { computed, inject } = Ember;

/**
 * A controller for our 404 page to give us access to the current user session.
 *
 * @class CanvasWeb.NotFoundController
 * @extends Ember.Controller
 */
export default Ember.Controller.extend({
  /**
   * @member {CanvasWeb.CurrentAccountService} A service exposing the current
   *   user account
   */
  currentAccount: inject.service(),

  /**
   * @member {boolean} Whether the current user is logged in
   */
  loggedIn: computed.readOnly('currentAccount.loggedIn')
});
