import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('channel-list-add-to-slack',
                   'Integration | Component | channel list add to slack', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{channel-list-add-to-slack}}`);
  assert.ok(/Set up the Slack integration/.test(this.$().text()));
});
