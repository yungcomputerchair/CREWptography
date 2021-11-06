const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const crypto = require('./crypto')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    }
  })

  win.loadFile('index.html')

  ipcMain.on("toMain", (event, args) => {
    console.log("got " + args);
    win.webContents.send("fromMain", crypto.generate_keypair());
  });
}

app.whenReady().then(() => {
  createWindow()
})
