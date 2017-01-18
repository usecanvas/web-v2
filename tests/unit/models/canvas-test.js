import { moduleForModel, test } from 'ember-qunit';

moduleForModel('canvas', 'Unit | Model | canvas', {
  // Specify the other units that are required for this test.
  needs: 'model:comment model:op model:pulseEvent model:team model:user'.w()
});

test('it exists', function(assert) {
  const model = this.subject();
  assert.ok(Boolean(model));
});
