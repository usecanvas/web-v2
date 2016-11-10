import { runInDebug, warn } from 'ember-data/-private/debug';
import { TimeoutError, AbortError } from 'ember-data/adapters/errors';
import DS from 'ember-data';
import Ember from 'ember';
import ENV from 'canvas-web/config/environment';
import parseResponseHeaders from 'ember-data/-private/utils/parse-response-headers';

const { computed, inject, run } = Ember;
const { Promise } = Ember.RSVP;

export default DS.JSONAPIAdapter.extend({
  csrfToken: inject.service(),

  host: computed(function() {
    if (ENV.isElectron) return ENV.apiURL;
    return null;
  }),

  namespace: computed(function() {
    if (ENV.isElectron) return '';
    return '/v1';
  }),

  /*
   * Relationships come back from the API with `v1` attached already, so we
   * need to de-duplicate that when fetching relationships.
   */
  urlPrefix() {
    const prefix = this._super(...arguments);
    return prefix.replace(/v1\/+v1/g, 'v1');
  },

  headers: computed(function() {
    return { 'x-csrf-token': this.get('csrfToken.token') };
  }).volatile(),

  ajax(url, type, options) {
    const adapter = this; // eslint-disable-line consistent-this
    const requestData = { url, method: type };

    return new Promise((resolve, reject) => {
      const hash = this.ajaxOptions(url, type, options);
      // Handle serialization of query params inside of urlForQuery...

      hash.success = function(payload, textStatus, jqXHR) {
        const response = ajaxSuccess(adapter, jqXHR, payload, requestData);
        Ember.run.join(null, resolve, response);
      };

      hash.error = function(jqXHR, textStatus, errorThrown) {
        const responseData = { textStatus, errorThrown };
        const error = ajaxError(adapter, jqXHR, requestData, responseData);
        run.join(null, reject, error);
      };

      adapter._ajaxRequest(hash);
    }, `DS: RESTAdapter#ajax ${type} to ${url}`);
  },

  genericQuery(method, store, type, query) {
    const url = this.buildURL(type.modelName, null, null, method, query);
    return this.ajax(url, 'GET', {});
  },

  query() {
    return this.genericQuery('query', ...arguments);
  },

   queryRecord() {
     return this.genericQuery('queryRecord', ...arguments);
   }
});

function ajaxSuccess(adapter, jqXHR, payload, requestData) {
  let response;

  try {
    response = adapter.handleResponse(
      jqXHR.status,
      parseResponseHeaders(jqXHR.getAllResponseHeaders()),
      payload,
      requestData
    );
  } catch (error) {
    return Promise.reject(error);
  }

  if (response && response.isAdapterError) return Promise.reject(response);
  return response;
}

function ajaxError(adapter, jqXHR, requestData, responseData) {
  runInDebug(function() {
    const message =
      `The server returned an empty string for ${requestData.method} \
       ${requestData.url}, which cannot be parsed into a valid JSON. Return \
       either null or {}.`;
    const validJSONString =
      !(responseData.textStatus === 'parsererror' && jqXHR.responseText === '');
    warn(message, validJSONString, {
      id: 'ds.adapter.returned-empty-string-as-JSON'
    });
  });

  let error;

  if (responseData.errorThrown instanceof Error) {
    error = responseData.errorThrown;
  } else if (responseData.textStatus === 'timeout') {
    error = new TimeoutError();
  } else if (responseData.textStatus === 'abort') {
    error = new AbortError();
  } else {
    try {
      error = adapter.handleResponse(
        jqXHR.status,
        parseResponseHeaders(jqXHR.getAllResponseHeaders()),
        adapter.parseErrorResponse(jqXHR.responseText) ||
          responseData.errorThrown,
        requestData
      );
    } catch (e) {
      error = e;
    }
  }

  return error;
}
