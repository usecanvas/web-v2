import { test } from 'qunit';
import moduleForAcceptance from 'canvas-web/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | needs slack id');

test('visiting a team that needs a Slack ID', assert => {
  server.create('team', { domain: 'usecanvas', needs_slack_token: true });

  visit('/usecanvas');

  andThen(function() {
    assert.equal(currentURL(), '/usecanvas/slack');
  });
});
