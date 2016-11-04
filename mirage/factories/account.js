import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  intercom_hash: 'intercom_hash',

  inserted_at() { return new Date().toISOString(); },
  updated_at() { return new Date().toISOString(); }
});
