import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute(attribute) {
    return attribute.underscore();
  }
});
