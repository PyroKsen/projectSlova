// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Экспортируем методы для использования в рендерере
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
});
