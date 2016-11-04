import { test } from 'qunit';
import { Response } from 'ember-cli-mirage';
import moduleForAcceptance from 'canvas-web/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | logged out');

test('visiting a route while logged out redirects to /login', assert => {
  server.get('/account', _ => {
    return new Response(401);
  });

  visit('/usecanvas');

  andThen(_ => {
    assert.equal(currentURL(), '/login');
  });
});
