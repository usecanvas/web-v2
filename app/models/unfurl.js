import DS from 'ember-data';

const { attr } = DS;

/**
 * A URL unfurl
 *
 * @class Unfurl
 * @extends DS.Model
 */
export default DS.Model.extend({
  attachments: attr(),
  fetched: attr(),
  fields: attr(),
  height: attr(),
  html: attr(),
  labels: attr(),
  providerIconUrl: attr(),
  providerName: attr(),
  providerUrl: attr(),
  text: attr(),
  thumbnailUrl: attr(),
  title: attr(),
  type: attr(),
  width: attr(),
  url: attr()
});
