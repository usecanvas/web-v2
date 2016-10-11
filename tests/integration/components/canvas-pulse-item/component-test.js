import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'canvas-web/tests/helpers/ember-test-selectors';

moduleForComponent('canvas-pulse-item',
                   'Integration | Component | canvas pulse item', {
  integration: true
});

test('it renders', function(assert) {
  this.set('pulse', {
    icon: 'Bookmark',
    actor: {
      name: 'Author'
    },
    action: 'referenced this canvas',
    provider: {
      name: 'Provider',
      link: '#'
    },
    attachment: {}
  });

  this.render(hbs`{{canvas-pulse-item pulse=pulse}}`);

  assert.equal(this.$(testSelector('summary')).text()
    .replace(/\s+/gm, ' ')
    .trim(), 'Author referenced this canvas on Provider.');
});
