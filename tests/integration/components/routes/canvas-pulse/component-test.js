import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'canvas-web/tests/helpers/ember-test-selectors';

moduleForComponent('routes/canvas-pulse',
                   'Integration | Component | canvas pulse route', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{routes/canvas-pulse}}`);
  assert.ok(this.$(testSelector('pulse')).get(0));
});
