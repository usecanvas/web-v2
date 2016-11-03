import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('routes/setup-x',
                   'Integration | Component | routes/setup x', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{routes/setup-x}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#routes/setup-x}}
      template block text
    {{/routes/setup-x}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
