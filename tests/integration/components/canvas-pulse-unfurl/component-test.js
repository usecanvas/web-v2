import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'canvas-web/tests/helpers/ember-test-selectors';

moduleForComponent('canvas-pulse-unfurl',
                   'Integration | Component | canvas pulse unfurl', {
  integration: true
});

test('it renders', function(assert) {
  this.set('unfurled', {
    type: 'unfurl',
    title: 'The Unfurl Title',
    text: 'The unfurl summary',
    url: 'http://example.com/item',
    authorUrl: '#',
    authorName: 'Author',
    providerUrl: 'http://example.com/',
    providerName: 'Provider'
  });

  this.render(hbs`{{canvas-pulse-unfurl unfurled=unfurled}}`);

  assert.equal(this.$(testSelector('title')).text().trim(), 'The Unfurl Title');
});
