const { app, BrowserView, BrowserWindow, Tray, nativeImage, nativeTheme, ipcMain } = require('electron');
const path = require('path');
const trayIconImage = nativeImage.createFromPath(path.join(__dirname, 'assets', 'img', 'tray-icon.png'));
const webPreferences = {
  // nodeIntegration: true,
  preload: path.join(__dirname, 'preload.js')
};
const AVAILABLE_SERVICES = {
  messenger: {
    name: 'Messenger',
    url: 'https://app.slack.com/client/',
    defaultIcon: path.join(__dirname, 'assets', 'img', 'messenger-icon.png'),
  },
  slack: {
    name: 'Slack',
    url: 'https://messenger.com/',
    defaultIcon: path.join(__dirname, 'assets', 'img', 'slack-icon.png'),
  },
  discord: {
    name: 'Discord',
    url: 'https://discord.com/login?redirect_to=%2Fchannels%2F%40me',
    defaultIcon: path.join(__dirname, 'assets', 'img', 'discord-icon.png'),
  },
};
const MACOS = 'darwin';
const sidebarWidth = 112;

let appIcon;
let mainWindow;
let serviceViews = [];
let state = {
  windowIsResizing: false,
  currentAppIndex: 0,
  defaultAppIndex: 0
};

const loadConfig = () => {
  // TODO
};

const createServiceView = (serviceUrl = 'https://jsnulla.com') => {
  let childView = new BrowserView();
  childView.setAutoResize({
    width: true,
    height: true,
    horizontal: true,
    vertical: true
  });

  childView.webContents.loadURL(serviceUrl);

  return childView;
};

const adjustBounds = (width, height, delay = 100) => {
  if (state.windowIsResizing)
    return;

  state.windowIsResizing = true;
  setTimeout(() => {
    const serviceBrowserViews = mainWindow.getBrowserViews();
    for (let i = 0; i < serviceBrowserViews.length; i++) {
      serviceBrowserViews[i].setBounds({
        x: sidebarWidth,
        y: 0,
        width: width - sidebarWidth,
        height: height
      });
    }
    state.windowIsResizing = false;
  }, delay);
};

const loadServices = () => {
  serviceViews.push(createServiceView('https://app.slack.com/client'));
  serviceViews.push(createServiceView('https://messenger.com/'));
  serviceViews.push(createServiceView('https://discord.com/login?redirect_to=%2Fchannels%2F%40me'));

  for (let i = 0; i < serviceViews.length; i++) {
    mainWindow.addBrowserView(serviceViews[i]);
  }
};

const switchToApp = (appIndex) => {
  mainWindow.setBrowserView(serviceViews[appIndex]);
  const { width, height } = mainWindow.getBounds();
  serviceViews[appIndex].setBounds({
    x: sidebarWidth,
    y: 0,
    width: width - sidebarWidth,
    height: height
  });
  state.currentAppIndex = appIndex;
};

const configureEventHandlers = () => {
  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    adjustBounds(width, height);
  });

  // ipcMain.handle('dark-mode:system', () => {
  //   nativeTheme.themeSource = 'system';
  // });

  ipcMain.on('switchToApp', (event, appIndex) => {
    switchToApp(parseInt(appIndex, 10));
    event.returnValue = true;
  });

  ipcMain.on('getCurrentAppIndex', (event) => {
    event.returnValue = state.currentAppIndex;
  });

  ipcMain.on('getServices', (event) => {
    event.returnValue = [
      { details: AVAILABLE_SERVICES['slack'], sounds: true, enabled: true },
      { details: AVAILABLE_SERVICES['messenger'], sounds: true, enabled: true },
      { details: AVAILABLE_SERVICES['discord'], sounds: true, enabled: true },
    ];
  });
};

const startApp = (screenWidth = 800, screenHeight = 600) => {
  appIcon = new Tray(trayIconImage);
  mainWindow = new BrowserWindow({
    width: screenWidth,
    height: screenHeight,
    center: true,
    fullscreenable: true,
    webPreferences: webPreferences,
    show: false,
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, 'sidebar.html'));

  loadServices();
  switchToApp(state.defaultAppIndex);
  configureEventHandlers();

  if (process.env.ELECTRON_DEV === 'true')
    mainWindow.webContents.openDevTools({ mode: 'detach' });
};

app.whenReady().then(() => {
  startApp();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      startApp();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== MACOS)
    app.quit();
});
