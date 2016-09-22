import { runInDebug, warn } from 'ember-data/-private/debug';
import { TimeoutError, AbortError } from 'ember-data/adapters/errors';
import DS from 'ember-data';
import Ember from 'ember';
import parseResponseHeaders from 'ember-data/-private/utils/parse-response-headers';

const { run } = Ember;
const { Promise } = Ember.RSVP;

export default DS.JSONAPIAdapter.extend({
  namespace: '/v1',

  ajax(url, type, options) {
    const adapter = this; // eslint-disable-line consistent-this
    const requestData = { url, method: type };

    return new Promise((resolve, reject) => {
      const hash = this.ajaxOptions(url, type, options);

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
