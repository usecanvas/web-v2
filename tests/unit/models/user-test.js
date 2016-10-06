import { moduleForModel, test } from 'ember-qunit';

moduleForModel('user', 'Unit | Model | user', {
  // Specify the other units that are required for this test.
  needs: 'model:canvas model:team'.w()
});

test('it exists', function(assert) {
  const model = this.subject();
  // let store = this.store();
  assert.ok(Boolean(model));
});
