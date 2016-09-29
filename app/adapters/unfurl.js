import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindRecord(url) {
    return `${this.get('namespace')}/unfurls?url=${encodeURIComponent(url)}`;
  }
});
