import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  avatar_url(i) { return `https://gravatar.com/avatar/${i}`; },
  email(i) { return `user-${i}@example.com`; },
  images: {},
  name(i) { return `User ${i}`; },
  slack_id(i) { return `slack_id-${i}`; },

  inserted_at() { return new Date().toISOString(); },
  updated_at() { return new Date().toISOString(); }
});
