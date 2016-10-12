import { moduleForModel, test } from 'ember-qunit';

moduleForModel('canvas', 'Unit | Model | canvas', {
  // Specify the other units that are required for this test.
  needs: 'model:pulseEvent model:team model:user'.w()
});

test('it exists', function(assert) {
  const model = this.subject();
  // let store = this.store();
  assert.ok(Boolean(model));
});
