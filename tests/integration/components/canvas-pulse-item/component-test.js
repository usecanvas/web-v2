import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('canvas-pulse-item',
                   'Integration | Component | canvas pulse item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{canvas-pulse-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#canvas-pulse-item}}
      template block text
    {{/canvas-pulse-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
