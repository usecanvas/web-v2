import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'canvas-web/tests/helpers/ember-test-selectors';

moduleForComponent('canvas-pulse-item',
                   'Integration | Component | canvas pulse item', {
  integration: true
});

test('it renders', function(assert) {
  this.set('pulseEvent', {
    type: 'reference_added',
    providerName: 'Provider',
    referencer: {
      name: 'Author'
    }
  });

  this.render(hbs`{{canvas-pulse-item pulseEvent=pulseEvent}}`);

  assert.equal(this.$(testSelector('summary')).text()
    .replace(/\s+/gm, ' ')
    .trim(), 'Author referenced this canvas on Provider.');
});
