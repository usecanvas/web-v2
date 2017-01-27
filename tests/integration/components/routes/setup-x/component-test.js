import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('routes/setup-x',
                   'Integration | Component | routes/setup x', {
  integration: true,
  beforeEach() {
    // stub out route actions as they do not resolve in component tests
    this.container.registry.registrations['helper:route-action'] =
      Ember.Helper.helper(_ => Ember.RSVP.resolve({}));
  }
});

test('it renders', function(assert) {
  this.set('teams', []);
  this.set('personalTeam', Ember.Object.create({ domain: 'domain' }));
  this.render(hbs`{{routes/setup-x personalTeam=personalTeam teams=teams}}`);
  assert.ok(this.$().text().trim().includes(
    'Set up your space for personal notes'));
});
