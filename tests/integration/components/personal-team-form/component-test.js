import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('personal-team-form',
                   'Integration | Component | personal team form', {
  integration: true
});

test('it renders', function(assert) {
  this.set('team', Ember.Object.create({ domain: '~domain' }));
  this.render(hbs`{{personal-team-form team=team}}`);

  assert.ok(this.$().text().trim().includes(
    'Where should your notes live? Dashes and numbers are A-OK!'));
});
