import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('canvas-pulse-route',
                   'Integration | Component | canvas pulse route', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{canvas-pulse-route}}`);

  assert.ok(this.$().text().trim().includes('referenced this canvas'), '');
});
