import ApplicationAdapter from './application';
import Ember from 'ember';
import RSVP from 'rsvp';

const { run } = Ember;

export default ApplicationAdapter.extend({
  // coalesceFindRequests: true,

  /**
   * Find multiple models by using the bulk endpoint.
   *
   * @method
   * @override
   */
  findMany(_store, _type, ids) {
    return new RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        type: 'POST',
        url: `${this.urlPrefix()}/bulk`,
        contentType: 'application/json',
        headers: this.get('headers'),
        data: this.prepareBulkData(ids)
      }).then(
        ({ data }) => this.handleBulkSuccess(resolve, data),
        jqXHR      => this.handleBulkFailure(reject, jqXHR)
      );
    });
  },

  prepareBulkData(ids) {
    return JSON.stringify({
      data: ids.map(id => {
        return { method: 'GET', path: this.urlForFindRecord(id) };
      })
    });
  },

  handleBulkSuccess(resolve, data) {
    run(null, resolve, { data: data.map(datum => datum.body.data) });
  },

  handleBulkFailure(reject, jqXHR) {
    jqXHR.then = null;
    run(null, reject, jqXHR);
  },

  urlForFindRecord(url) {
    return `${this.urlPrefix()}/unfurls?url=${encodeURIComponent(url)}`;
  }
});
