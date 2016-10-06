import Ember from 'ember';
import OauthMixin from 'canvas-web/mixins/oauth';
import { module, test } from 'qunit';

module('Unit | Mixin | oauth');

// Replace this with your real tests.
test('it works', function(assert) {
  const OauthObject = Ember.Object.extend(OauthMixin);
  const subject = OauthObject.create();
  assert.ok(subject);
});
