import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('routes/team-settings', 'Integration | Component | routes/team settings', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{routes/team-settings}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#routes/team-settings}}
      template block text
    {{/routes/team-settings}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
