import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('canvas-block-filter',
                   'Integration | Component | canvas block filter', {
  integration: true
});

test('it binds a filter term', function(assert) {
  this.set('filterTerm', 'Foo');
  this.render(hbs`{{canvas-block-filter filterTerm=filterTerm}}`);
  assert.equal(this.$('input').val(), 'Foo');
  this.$('input').val('Bar').trigger('input');
  assert.equal(this.get('filterTerm'), 'Bar');
});

test('it clears the filter when closing', function(assert) {
  this.set('filterTerm', 'Foo');
  this.set('onCloseFilter', Ember.K);
  this.render(hbs`{{canvas-block-filter
                    onCloseFilter=onCloseFilter
                    filterTerm=filterTerm}}`);
  this.$('button').click();
  assert.equal(this.get('filterTerm'), '');
});

test('it calls a close callback', function(assert) {
  this.set('onCloseFilter', _ => assert.ok(true));
  this.render(hbs`{{canvas-block-filter onCloseFilter=onCloseFilter}}`);
  this.$('button').click();
});
