const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, ...data) => {
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, ...data);
            }
        },
        receive: (channel, func, once) => {
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                if (once) ipcRenderer.once(channel, (event, ...args) => func(...args));
                else ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        kill: (channel, func) => {
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.removeListener(channel, func)
            }
        }
    }
);
