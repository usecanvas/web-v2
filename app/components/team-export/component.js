import Ember from 'ember';
import { task } from 'ember-concurrency';

const { Component, RSVP, computed, inject } = Ember;
const { URL } = window;

export default Component.extend({
  csrfToken: inject.service(),
  url: computed('team.id', function() {
    return `/v1/exports/${this.get('team.id')}`;
  }),

  fileName: computed('team.name', function() {
    return `canvas-export-${this.get('team.name').dasherize()}.zip`;
  }),

  getFile(url) {
    return new RSVP.Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.setRequestHeader('x-csf-token', this.get('csrfToken.token'));
      xhr.onload = res;
      xhr.onerror = rej;
      xhr.send();
    });
  },

  downloadFile(xhr) {
    if (xhr.status !== 200) throw xhr.status;
    const blob = xhr.response;
    const url = URL.createObjectURL(blob);
    const el = document.createElement('a');
    document.body.appendChild(el);
    el.setAttribute('href', url);
    el.setAttribute('download', this.get('fileName'));
    el.style.display = 'none';
    el.click();
    el.remove();
    URL.revokeObjectURL(url);
  },

  exportCanvases: task(function *() {
    try {
      const { target } = yield this.getFile(this.get('url'));
      this.downloadFile(target);
    } catch (_e) {
      this.set('exportFailed', true);
    }
  })
});
