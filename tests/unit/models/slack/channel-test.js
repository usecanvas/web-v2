import { moduleForModel, test } from 'ember-qunit';

moduleForModel('slack/channel', 'Unit | Model | slack/channel', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  const model = this.subject();
  // let store = this.store();
  assert.ok(Boolean(model));
});
