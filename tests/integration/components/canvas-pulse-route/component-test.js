import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('canvas-pulse-route',
                   'Integration | Component | canvas pulse route', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{canvas-pulse-route}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#canvas-pulse-route}}
      template block text
    {{/canvas-pulse-route}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
