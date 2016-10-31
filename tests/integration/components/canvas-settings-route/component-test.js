import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'canvas-web/tests/helpers/ember-test-selectors';

/* eslint-disable max-len */
moduleForComponent('canvas-settings-route', 'Integration | Component | canvas settings route', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{canvas-settings-route}}`);
  assert.ok(this.$(testSelector('settings')).get(0));
});
