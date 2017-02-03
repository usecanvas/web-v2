import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  createRecord() {
    return this.updateRecord(...arguments);
  },

  // Use PUT, the API for thread subs is create-or-replace.
  updateRecord(store, type, snapshot) {
    const data = {};
    const serializer = store.serializerFor(type.modelName);
    const id = snapshot.id;
    const url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

    serializer.serializeIntoHash(data, type, snapshot);
    return this.ajax(url, 'PUT', { data });
  }
});
