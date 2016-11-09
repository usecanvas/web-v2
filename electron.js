/* eslint-env node */
/* eslint-disable strict */

'use strict';

const electron = require('electron');
const path = require('path');
const storage = require('electron-json-storage');
const os = require('os');
const packageJSON = require('./package.json');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dirname = __dirname || path.resolve(path.dirname());
const emberAppLocation = `file://${dirname}/dist/index.html`;

require('electron-context-menu')();

let mainWindow = null;

app.on('window-all-closed', function onWindowAllClosed() {
  if (process.platform !== 'darwin') {
      app.quit();
  }
});

app.on('ready', function onReady() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    titleBarStyle: 'hidden-inset',
   'web-preferences': {
     'web-security': false
   }
  });

  Reflect.deleteProperty(mainWindow, 'module');

  try {
    autoUpdate();
  } catch (_err) {
    // Can not auto update in development.
  }

  // If you want to open up dev tools programmatically, call
  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  // By default, we'll open the Ember App by directly going to the
  // file system.
  //
  // Please ensure that you have set the locationType option in the
  // config/environment.js file to 'hash'. For more information,
  // please consult the ember-electron readme.
  mainWindow.loadURL(emberAppLocation);

  mainWindow.webContents.on('did-navigate', function(evt, url) {
    if (url.includes('/oauth/slack/callback')) {
      mainWindow.loadURL(emberAppLocation);
    }
  });

  mainWindow.webContents.on('crashed', () => {
    console.warn(
      'Your Ember app (or other code) in the main window has crashed.');
    console.warn(
      'This is a serious issue that needs to be handled and/or debugged.');
  });

  mainWindow.on('unresponsive', () => {
    console.warn(
      'Your Ember app (or other code) has made the window unresponsive.');
  });

  mainWindow.on('responsive', () => {
    console.warn('The main window has become responsive again.');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Figure out better way to filter out the urls
  electron.session.defaultSession.webRequest.onHeadersReceived(
    { urls: ['http://localhost:4000/*', 'https://pro-api.usecanvas.com/*'] }, (details, cb) => {
    if (details.url.includes(`oauth/slack/callback`)) {
      const cookies = (details.responseHeaders['set-cookie'] ||
                       details.responseHeaders['Set-Cookie'])[0].split('; ');
      const [, ...rest] = cookies[0].split('=');
      storage.set('csrf', rest.join('='));
    }
    cb({ cancel: false });
  });

  // Handle an unhandled error in the main thread
  //
  // Note that 'uncaughtException' is a crude mechanism for exception handling
  // intended to be used only as a last resort. The event should not be used as
  // an equivalent to "On Error Resume Next". Unhandled exceptions inherently
  // mean that an application is in an undefined state. Attempting to resume
  // application code without properly recovering from the exception can cause
  // additional unforeseen and unpredictable issues.
  //
  // Attempting to resume normally after an uncaught exception can be similar to
  // pulling out of the power cord when upgrading a computer -- nine out of ten
  // times nothing happens - but the 10th time, the system becomes corrupted.
  //
  // The correct use of 'uncaughtException' is to perform synchronous cleanup of
  // allocated resources (e.g. file descriptors, handles, etc) before shutting
  // down the process. It is not safe to resume normal operation after
  // 'uncaughtException'.
  process.on('uncaughtException', err => {
    console.warn('An exception in the main thread was not handled.');
    console.warn(
      'This is a serious issue that needs to be handled and/or debugged.');
    console.warn(`Exception: ${err}`);
  });
});

function autoUpdate() {
  const platform = `${os.platform()}_${os.arch()}`;
  const { version } = packageJSON;
  const { autoUpdater, dialog } = electron;

  autoUpdater.setFeedURL(
    `https://download.usecanvas.com/update/${platform}/${version}`);
  autoUpdater.checkForUpdates();

  autoUpdater.on('update-downloaded', _ => {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Restart', 'Later'],
      title: 'Canvas',
      message: `The new version of the Canvas app has been downloaded. Restart \
        the application to apply updates.`
    }, buttonIndex => {
      if (buttonIndex === 1) return;
      autoUpdater.quitAndInstall();
    });
  });
}
