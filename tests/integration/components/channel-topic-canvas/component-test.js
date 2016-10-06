import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import RealtimeCanvas from 'canvas-editor/lib/realtime-canvas';

moduleForComponent('channel-topic-canvas',
                   'Integration | Component | channel topic canvas', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('canvas', RealtimeCanvas.create({ slackChannelIds: [] }));
  this.render(hbs`{{channel-topic-canvas canvas=canvas}}`);
  assert.ok(/Last edited/.test(this.$().text().trim()));
});
