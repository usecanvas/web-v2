import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'canvas-web/tests/helpers/ember-test-selectors';

moduleForComponent('canvas-pulse', 'Integration | Component | canvas pulse', {
  integration: true
});

test('it renders a list of items', function(assert) {
  this.set('pulse', [
    {
      icon: 'Bookmark',
      actor: {
        name: '@user'
      },
      action: 'referenced this canvas',
      provider: {
        name: 'Provider1',
        link: '#'
      },
      attachment: {}
    },
    {
      icon: 'Bookmark',
      actor: {
        name: 'User1',
        link: '#'
      },
      action: 'referenced this canvas',
      provider: {
        name: 'Provider2',
        link: '#'
      },
      attachment: {}
    },
    {
      icon: 'Bookmark',
      actor: {
        name: 'User2',
        link: '#'
      },
      action: 'referenced this canvas',
      attachment: {}
    },
  ]);

  this.render(hbs`{{canvas-pulse pulse=pulse}}`);

  assert.equal(this.$(testSelector('item')).length, 3);
});
