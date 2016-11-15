import Ember from 'ember';
import ENV from 'canvas-web/config/environment';
import Raven from 'raven';
import RSVP from 'rsvp';

const { inject } = Ember;

/**
 * Top-level application route.
 *
 * @class CanvasWeb.ApplicationRoute
 * @extends Ember.Route
 */
export default Ember.Route.extend({
  /**
   * Services for managing desktop menus in Electron
   * @member {Ember.Service}
   */
  desktopMenus: inject.service(),

  /**
   * Service for the signed-in account
   * @member {Ember.Service}
   */
  currentAccount: inject.service(),

  /**
   * Service for flash messages
   * @member {Ember.Service}
   */
  flashMessages: inject.service(),

  /**
   * Service for the teams list
   * @member {Ember.Service}
   */
  teamsList: inject.service(),

  segment: inject.service(),

  /**
   * List of unauthenticated routes
   * @member {Array<string>}
   */
  unauthenticatedRoutes: 'login team.canvas.show'.w(),

  /**
   * Callback before model is loaded that fetches the logged-in account and
   * redirects accordingly.
   *
   * @method
   * @override
   * @param {object} transition An Ember route transition object
   * @returns {Ember.RSVP.Promise} A promise resolving once account state is
   *   determined
   */
  beforeModel({ targetName }) {
    this.get('desktopMenus').setup();

    return this.get('currentAccount')
      .fetch()
      .then(_ => this.onAccountFetch(targetName, true))
      .catch(_ => this.onAccountFetch(targetName, false));
  },

  model() {
    if (!this.get('currentAccount.currentAccount')) return null;

    return RSVP.hash({
      account: this.get('currentAccount.currentAccount'),
      teams: this.get('teamsList.teams')
    });
  },

  title(tokens) {
    tokens.unshift('Canvas');
    return `${tokens.reverse().join(' - ')}`;
  },

  identifyUser() {
    const currentAccount = this.get('currentAccount');
    const loggedIn = currentAccount.get('loggedIn');
    const intercomHash = currentAccount.get('currentAccount.intercomHash');
    const currentUser = currentAccount.get('currentUser');
    const isInTeam = currentUser.get('team.isInTeam');

    if (loggedIn && currentUser  && isInTeam) {
      const id = currentAccount.get('currentAccount.id');
      /* eslint-disable camelcase */
      const opts = { Intercom: { user_hash: intercomHash } };
      const company = { id: currentUser.get('team.id'),
        name: currentUser.get('team.domain') };
      const traits = Object.assign(currentUser.get('content').toJSON(),
        { company });
      this.get('segment').identifyUser(id, traits, opts);
    }
  },

  /**
   * Redirect the user to the login screen if they are not authenticated and not
   * visiting an unauthenticated route.
   *
   * @method
   * @param {string} targetName The name of the transition target
   * @param {boolean} signedIn Whether a user is signed in
   */
  onAccountFetch(targetName, signedIn) {
    if (!signedIn && !this.get('unauthenticatedRoutes').includes(targetName)) {
      this.replaceWith('login');
    } else if (ENV.isElectron && signedIn && targetName === 'login') {
      this.transitionTo('index');
    }
  },

  actions: {
    error(err) {
      Ember.Logger.error(err);

      // Once `ds-extended-errors` is enabled, switch to using that
      if (err.status === 404 ||
          err.errors && err.errors.detail === 'Page not found') {
        Raven.captureException(err, { level: 'info' });
        this.intermediateTransitionTo('not-found', 'not-found');
      } else {
        Raven.captureException(err);
        if (Raven.isSetup()) Raven.showReportDialog();
        this.intermediateTransitionTo('error');
      }
    }
  }
});
