import ApplicationSerializer from 'canvas-web/serializers/application';

export default ApplicationSerializer.extend({
  /**
   * Do not set "blocks" on an update (they are changed in realtime).
   *
   * @method
   * @override
   */
  normalizeUpdateRecordResponse(store, klass, payload) {
    Reflect.deleteProperty(payload.data.attributes, 'blocks');
    return this._super(...arguments);
  },

  /**
   * Get the model name from the payload type.
   *
   * @method
   * @override
   */
  modelNameFromPayloadKey(payloadKey) {
    return payloadKey;
  },

  /**
   * Get the payload type from the canvas model name.
   *
   * @method
   * @override
   */
  payloadKeyFromModelName(modelName) {
    return modelName;
  },

  /**
   * Do not attempt to serialize and send "blocks" in a save.
   *
   * @method
   * @override
   */
  serializeAttribute(snapshot, json, key, attributes) {
    if (snapshot.record.get('isNew')) {
      this._super(...arguments);
      return;
    }

    if (key === 'blocks') return;

    if (snapshot.record.get('isNew') || snapshot.changedAttributes()[key]) {
      this._super(snapshot, json, key, attributes);
    }
  }
});
