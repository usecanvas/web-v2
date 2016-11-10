import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindRecord() {
    return `${this.urlPrefix()}/upload-signature`;
  }
});
