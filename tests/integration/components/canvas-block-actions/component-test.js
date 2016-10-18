import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('canvas-block-actions',
                   'Integration | Component | canvas block actions', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{canvas-block-actions}}`);
  assert.ok(true);
});
