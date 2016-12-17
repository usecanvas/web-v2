import { moduleForModel, test } from 'ember-qunit';

moduleForModel('op', 'Unit | Model | op', {
  // Specify the other units that are required for this test.
  needs: 'model:canvas'.w()
});

test('it exists', function(assert) {
  const model = this.subject();
  assert.ok(Boolean(model));
});
