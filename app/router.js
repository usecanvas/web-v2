import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('logout');
  this.route('teams.show', { path: '/:domain' });
  this.route('canvases.show', { path: '/:team.domain/:id/TITLE_HERE' });
});

export default Router;
