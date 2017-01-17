import ApplicationSerializer from 'canvas-web/serializers/application';

export default ApplicationSerializer.extend({
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
   * Get the payload type from the model name.
   *
   * @method
   * @override
   */
  payloadKeyFromModelName(modelName) {
    return modelName;
  },
});
