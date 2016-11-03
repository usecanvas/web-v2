import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('team-list-wrapper',
                   'Integration | Component | team list wrapper', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('teams', []);

  // Template block usage:
  this.render(hbs`
    {{#team-list-wrapper teams=teams}}
      template block text
    {{/team-list-wrapper}}
  `);

  assert.ok(this.$().text().trim().includes('template block text'));
});
