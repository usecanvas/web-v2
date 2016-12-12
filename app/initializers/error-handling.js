import Ember from 'ember';
import Raven from 'raven';
import RSVP from 'rsvp';

export default {
  name: 'error-handling',

  initialize() {
    this._oldWindowOnerror = window.onerror;

    Ember.onerror = this.handleEmberError.bind(this);
    RSVP.on('error', this.handleRSVPError.bind(this));
    window.onerror = this.handleWindowError.bind(this);
  },

  handleEmberError(err) {
    throw err;
  },

  handleRSVPError(reason) {
    if (reason && reason.name === 'TransitionAborted') return;

    const context = 'Unhandled Promise error detected';

    if (reason instanceof Error) {
      Raven.captureException(reason, { extra: { context } });
    } else {
      Raven.captureMessage(context, { extra: { reason } });
    }
  },

  handleWindowError(/* msg, source, line, col, err */) {
    this._oldWindowOnerror(...arguments);
  }
};
