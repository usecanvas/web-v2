import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'canvas-web/tests/helpers/ember-test-selectors';

moduleForComponent('canvas-pulse', 'Integration | Component | canvas pulse', {
  integration: true
});

test('it renders a list of items', function(assert) {
  this.set('pulse', [
    {
      type: 'reference_added',
      attachment: {
        type: 'unfurl',
        title: 'The Canvas Title',
        text: 'The canvas summary that we also show in the canvas list',
        url: 'https://github.com/usecanvas/pro-web/issues/2',
        authorName: '@jclem',
        providerUrl: 'https://github.com/',
        providerName: 'Github',
        providerIconUrl: 'https://s3.amazonaws.com/canvas-assets/provider-icons/github.png'
      }
    },
    {
      type: 'reference_added',
      attachment: {
        type: 'unfurl',
        title: 'The Canvas Title',
        text: 'The canvas summary that we also show in the canvas list',
        url: 'https://pro.usecanvas.com/usecanvas/76Ax31GQWYur5Q7nReI0Hy',
        authorUrl: '#',
        authorName: 'Oren Teich',
        providerUrl: 'https://pro.usecanvas.com/',
        providerName: 'Canvas',
        providerIconUrl: 'https://s3.amazonaws.com/canvas-assets/provider-icons/canvas.png',
        fields: [
          {
            label: 'Progress',
            short: true,
            value: 0.0
          }
        ]
      }
    },
    {
      type: 'canvas_created',
      attachment: {
        type: 'unfurl',
        title: 'The Canvas Title',
        text: 'The canvas summary that we also show in the canvas list',
        url: 'https://pro.usecanvas.com/usecanvas/76Ax31GQWYur5Q7nReI0Hy',
        authorUrl: '#',
        authorName: 'Oren Teich',
        providerUrl: 'https://pro.usecanvas.com/',
        providerName: 'Canvas',
        providerIconUrl: 'https://s3.amazonaws.com/canvas-assets/provider-icons/canvas.png',
      }
    }
  ]);

  this.render(hbs`{{canvas-pulse pulse=pulse}}`);

  assert.equal(this.$(testSelector('item')).length, 3);
});
