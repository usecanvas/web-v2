import Ember from 'ember';
import { task } from 'ember-concurrency';

const { computed, on } = Ember;
const { w } = Ember.String;

export default Ember.Component.extend({
  allowPublicAccess: false,
  permissions: w('view edit'),
  permission: 'view',
  
  setInitialPermissionState: on('init', function() {
    const state = this.get('canvas.linkAccess');
    if (state === 'none') return;
    this.set('allowPublicAccess', true);
    this.set('permission',
      state === 'edit' ? 'edit' : 'view');
  }),
  
  currentPermissionState: computed('allowPublicAccess',
                                   'permission', function() {
    const { allowPublicAccess, permission } =
      this.getProperties('allowPublicAccess', 'permission');
    if (!allowPublicAccess) {
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
    togglePublicAccess() {
      this.toggleProperty('allowPublicAccess');
      this.get('persistPermissionState').perform();
    },

    updatePermission({ target: { value } }) {
      this.set('permission', value);
      this.get('persistPermissionState').perform();
    }
  }
});
