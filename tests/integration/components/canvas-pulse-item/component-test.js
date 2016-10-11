import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'canvas-web/tests/helpers/ember-test-selectors';

moduleForComponent('canvas-pulse-item',
                   'Integration | Component | canvas pulse item', {
  integration: true
});

test('it renders', function(assert) {
  this.set('pulse', {
    type: 'reference_added',
    attachment: {
      type: 'unfurl',
      title: 'The Unfurl Title',
      text: 'The unfurl summary',
      url: 'http://example.com/item',
      authorUrl: '#',
      authorName: 'Author',
      providerUrl: 'http://example.com/',
      providerName: 'Provider',
    }
  });

  this.render(hbs`{{canvas-pulse-item pulse=pulse}}`);

  assert.equal(this.$(testSelector('summary')).text()
    .replace(/\s+/gm, ' ')
    .trim(), 'Author referenced this canvas on Provider.');
});
