import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('routes/settings-x', 'Integration | Component | routes/settings x', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{routes/settings-x}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#routes/settings-x}}
      template block text
    {{/routes/settings-x}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
