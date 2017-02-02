import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import RealtimeCanvas from 'canvas-editor/lib/realtime-canvas';
import ShareDB from 'sharedb';

moduleForComponent('routes/canvas-show',
                   'Integration | Component | canvas show route', {
  integration: true,
  beforeEach() {
    // stub out route actions as they do not resolve in component tests
    this.container.registry.registrations['helper:route-action'] =
      Ember.Helper.helper(_ => Ember.RSVP.resolve({}));
  }
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
  this.render(hbs`{{routes/canvas-show canvas=canvas}}`);
  assert.ok(/Hello, World/.test(this.$().text()));
});
