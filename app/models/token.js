import DS from 'ember-data';

export default DS.Model.extend({
  token: DS.attr(),
  expiresAt: DS.attr('date')
});
