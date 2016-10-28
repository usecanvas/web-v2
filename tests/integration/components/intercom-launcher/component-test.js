import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('intercom-launcher',
                   'Integration | Component | intercom launcher', {
  integration: true
});

test('it renders with a #customer-intercom-link', function(assert) {
  this.set('intercomAppID', 'foobar');

  this.render(hbs`
    {{#intercom-launcher intercomAppID=intercomAppID}}
      template block text
    {{/intercom-launcher}}
  `);

  /*
   * The #custom-intercom-link is set in Segment and is required for the
   * integration to work.
   */
  assert.equal(
    this.$('#custom-intercom-link').text().trim(), 'template block text'
  );
});
