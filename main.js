const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const MACOS = 'darwin'
const path = require('path')

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  window.loadFile('pages/index/index.html')

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== MACOS)
    app.quit()
})
