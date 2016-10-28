import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('intercom-launcher',
                   'Integration | Component | intercom launcher', {
  integration: true
});

test('it renders', function(assert) {
  this.set('intercomAppID', 'foobar');

  this.render(hbs`
    {{#intercom-launcher intercomAppID=intercomAppID}}
      template block text
    {{/intercom-launcher}}
  `);

  assert.equal(
    this.$('#custom-intercom-link').text().trim(), 'template block text'
  );
});
