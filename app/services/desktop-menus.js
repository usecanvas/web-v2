import Ember from 'ember';
import ENV from 'canvas-web/config/environment';

/* globals requireNode */

const { computed, observer } = Ember;

export default Ember.Service.extend({
  setup() {
    if (!ENV.isElectron) return;

    const { remote } = requireNode('electron');
    const { Menu } = remote;
    const template = this.get('defaultTemplate');

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  },

  onMenuUpdate: observer('editMenu.[]', function() {
    if (!ENV.isElectron) return;
    this.setup();
  }),

  defaultTemplate: computed('applicationMenu.[]', 'editMenu.[]', function() {
    return [{
      label: 'Application',
      submenu: this.get('applicationMenu')
    }, {
      label: 'Edit',
      submenu: this.get('editMenu')
    }];
  }),

  applicationMenu: computed(function() {
    const quit = this.quit.bind(this);

    return [
      { label: 'About Canvas', selector: 'orderFrontStandardAboutPanel:' },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'Command+Q', click: quit }
    ];
  }),

  editMenu: computed(function() {
    return [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
    ];
  }),

  quit() {
    const { remote } = requireNode('electron');
    remote.app.quit();
  }
});
