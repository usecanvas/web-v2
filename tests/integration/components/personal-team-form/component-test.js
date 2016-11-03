import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('personal-team-form',
                   'Integration | Component | personal team form', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('team', Ember.Object.create({ domain: '~domain' }));
  this.render(hbs`{{personal-team-form team=team}}`);
  assert.equal(this.$().text().trim(),
    'This is where your personal notes live. Give this space a name:');
});
