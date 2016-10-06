import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import RealtimeCanvas from 'canvas-editor/lib/realtime-canvas';
import ShareDB from 'sharedb';

moduleForComponent('canvases-show-route',
                   'Integration | Component | canvases show route', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('canvas',
    RealtimeCanvas.create({
      shareDBDoc: new ShareDB.Doc(),
      slackChannelIds: [],
      blocks: [{
        type: 'title',
        content: 'Hello, World',
        meta: {}
      }]
    }));
  this.render(hbs`{{canvases-show-route canvas=canvas}}`);
  assert.ok(/Hello, World/.test(this.$().text()));
});
