import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  keyForAttribute(attribute) {
    return attribute.underscore();
  },

  keyForRelationship(relationship) {
    return relationship.underscore();
  }
});
