import { moduleForModel, test } from 'ember-qunit';

moduleForModel('pulse-event', 'Unit | Model | pulse event', {
  // Specify the other units that are required for this test.
  needs: ['model:canvas']
});

test('it exists', function(assert) {
  const model = this.subject();
  assert.ok(Boolean(model));
});
