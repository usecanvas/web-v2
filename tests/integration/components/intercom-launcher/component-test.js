import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('intercom-launcher',
                   'Integration | Component | intercom launcher', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{intercom-launcher}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#intercom-launcher}}
      template block text
    {{/intercom-launcher}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
