import Ember from 'ember';
import WithDropzoneMixin from 'canvas-web/mixins/with-dropzone';
import { module, test } from 'qunit';

module('Unit | Mixin | with dropzone');

// Replace this with your real tests.
test('it works', function(assert) {
  let WithDropzoneObject = Ember.Object.extend(WithDropzoneMixin);
  let subject = WithDropzoneObject.create();
  assert.ok(subject);
});
