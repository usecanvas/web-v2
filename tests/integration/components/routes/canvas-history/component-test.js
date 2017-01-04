import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('routes/canvas-history',
                   'Integration | Component | routes/canvas history', {
  integration: true
});

test('it renders', function(assert) {
  const canvas = Ember.Object.create(
    { blocks: [{ content: 'Canvas Title' }], ops: [] });
  this.set('canvas', canvas);
  this.render(hbs`{{routes/canvas-history canvas=canvas}}`);
  assert.ok(this.$().text().includes('Canvas Title'));
});
