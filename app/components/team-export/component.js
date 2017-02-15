import Ember from 'ember';
import ENV from 'canvas-web/config/environment';
import { task } from 'ember-concurrency';

const { Component, RSVP, computed, inject, run, $ } = Ember;

export default Component.extend({
  csrfToken: inject.service(),
  url: computed('team.domain', function() {
    return `/v1/export-tokens/${this.get('team.domain')}`;
  }),

  getToken(url) {
    return new RSVP.Promise((res, rej) => {
      return $.ajax({
        headers: {
          Accept: 'application/json',
          'x-csrf-token': this.get('csrfToken.token')
        },
        type: 'GET',
        url
      }).then(payload => run(null, res, JSON.parse(payload)),
        jqXHR => run(null, rej, jqXHR));
    });
  },

  downloadFile(url) {
    const el = document.createElement('a');
    document.body.appendChild(el);
    el.setAttribute('href', url);
    el.style.display = 'none';
    el.click();
    el.remove();
  },

  exportCanvases: task(function *() {
    try {
      const { token } = yield this.getToken(this.get('url'));
      const url = `${ENV.apiURL}exports/${token}`;
      this.downloadFile(url);
    } catch (_e) {
      this.set('exportFailed', true);
    }
  })
});
