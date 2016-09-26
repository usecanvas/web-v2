import Ember from 'ember';
import Raven from 'raven';
import RSVP from 'rsvp';

export default {
  name: 'error-handling',

  initialize() {
    Ember.onerror = onEmberError;
    RSVP.on('error', onRSVPError);
  }
};


function onEmberError(err) {
  throw err;
}

function onRSVPError(reason) {
  const context = 'Unhandled Promise error detected';

  if (reason instanceof Error) {
    Raven.captureException(reason, { extra: { context } });
  } else {
    Raven.captureMessage(context, { extra: { reason } });
  }
}
