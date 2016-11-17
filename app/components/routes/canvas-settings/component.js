import Ember from 'ember';
import { task } from 'ember-concurrency';

const { computed, on } = Ember;
const { w } = Ember.String;

export default Ember.Component.extend({
  allowLinkAccess: false,
  permissions: w('view edit'),
  permission: 'view',

  setInitialPermissionState: on('init', function() {
    const state = this.get('canvas.linkAccess');
    if (state === 'none') return;
    this.set('allowLinkAccess', true);
    this.set('permission',
      state === 'edit' ? 'edit' : 'view');
  }),

  currentPermissionState: computed('allowLinkAccess',
                                   'permission', function() {
    const { allowLinkAccess, permission } =
      this.getProperties('allowLinkAccess', 'permission');
    if (!allowLinkAccess) {
      return 'none';
    } else if (permission === 'view') {
      return 'read';
    }
    return 'edit';
  }),

  persistPermissionState: task(function *() {
    const newState = this.get('currentPermissionState');
    const canvas = this.get('canvas');
    if (canvas.get('linkAccess') !== newState) {
      canvas.set('linkAccess', newState);
      yield canvas.save();
    }
  }).keepLatest(),

  actions: {
    toggleIsTemplate() {
      this.toggleProperty('canvas.isTemplate');
      this.get('canvas').save();
    },

    toggleLinkAccess() {
      this.toggleProperty('allowLinkAccess');
      this.get('persistPermissionState').perform();
    },

    updatePermission({ target: { value } }) {
      this.set('permission', value);
      this.get('persistPermissionState').perform();
    }
  }
});
