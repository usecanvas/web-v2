import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized.map(block => {
      if (block.blocks) {
        block.blocks = block.blocks.map(childBlock => {
          return Ember.Object.create(childBlock);
        });
      }

      return Ember.Object.create(block);
    });
  },

  serialize(deserialized) {
    return deserialized;
  }
});
