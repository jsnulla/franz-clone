const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  switchToApp: (appIndex) => {
    return ipcRenderer.sendSync('switchToApp', appIndex);
  },
  getCurrentAppIndex: () => {
    return ipcRenderer.sendSync('getCurrentAppIndex');
  },
  getServices: () => {
    return ipcRenderer.sendSync('getServices');
  }
});
