import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('canvas-pulse-attachment',
                   'Integration | Component | canvas pulse attachment', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{canvas-pulse-attachment}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#canvas-pulse-attachment}}
      template block text
    {{/canvas-pulse-attachment}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
