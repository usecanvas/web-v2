import { moduleForModel, test } from 'ember-qunit';
import 'canvas-web/models/custom-inflector-rules';

moduleForModel('team', 'Unit | Model | team', {
  // Specify the other units that are required for this test.
  needs: 'model:canvas model:slack-channel model:user'.w()
});

test('it exists', function(assert) {
  const model = this.subject();
  // let store = this.store();
  assert.ok(Boolean(model));
});
