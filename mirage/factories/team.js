import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  domain(i) { return `domain-${i}`; },
  needs_slack_token: false,
  is_in_team: true,
  images: {},
  name(i) { return `name-${i}`; },
  slack_id(i) { return `slack_id-${i}`; },

  inserted_at() { return new Date().toISOString(); },
  updated_at() { return new Date().toISOString(); },

  afterCreate(team, server) {
    server.create('user', { team });
  }
});
