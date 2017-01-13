import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pulse-settings',
  'Integration | Component | pulse settings', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{pulse-settings}}`);
  assert.ok(/Set Up/.test(this.$().text()));
});
