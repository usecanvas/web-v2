import Ember from 'ember';
export default Ember.Helper.extend({
  uiDismissals: Ember.inject.service(),
  dismissalsChanged: Ember.observer('uiDismissals.dismissals.isFulfilled',
    'uiDismissals.dismissals.content.[]', function() {
      this.recompute();
    }),
  compute([scope, ui]) {
    const dismissals = this.get('uiDismissals.dismissals');
    ui = ui || scope;
    if (dismissals.get('isFulfilled')) {
      const combinations = generateCombinations(scope, ui);
      return dismissals.mapBy('identifier').any(i => combinations.includes(i));
    }
    return true;
  }
});

function generateCombinations(scope, ui) {
  const clients = ['*', 'web'];
  return [`${scope}.${ui}`, ui].reduce((p, n) =>
    p.concat(clients.map(c => `${c}.${n}`))
  , []);
}
