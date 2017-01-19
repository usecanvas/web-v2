export default function sharedConfig() { // eslint-ignore-line no-empty-function
}

export function testConfig() {
  this.namespace = '/v1';

  this.get('/account', _ => {
    return this.create('account');
  });

  this.get('/teams', schema => {
    return schema.teams.all();
  });

  this.get('/comments', schema => {
    return schema.comments.all();
  });

  this.post('/tokens', schema => {
    return schema.create('token');
  });

  this.get('/ui-dismissals', schema => {
    return schema.uiDismissals.all();
  });

  this.get('/teams/:domain', (schema, req) => {
    return schema.teams.findBy({ domain: req.params.domain });
  });

  this.get('/teams/:id/user', (schema, req) => {
    const team = schema.teams.find(req.params.id);
    return team.users.models[0];
  });
}
