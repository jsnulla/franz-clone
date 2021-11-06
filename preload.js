const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('mainAPI', {
  desktop: true
})
