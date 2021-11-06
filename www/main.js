const { app } = require('electron')
const { BrowserWindow } = require('@electron/remote')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')

  require('@electron/remote').getGlobal('receiveSodium')(require('libsodium-wrappers'))
}

app.whenReady().then(() => {
  createWindow()
})