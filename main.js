import { app, BrowserWindow } from 'electron';
import pg from 'pg';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
});

export const client = new pg.Client({
  user: 'admin',
  host: 'localhost',
  database: 'slovadb',
  password: '123',
  port: 5432,
});