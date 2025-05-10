import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { setTimeout } from 'timers';

// Получаем текущий путь

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true, // Включаем Node.js в рендерере
          contextIsolation: false // Отключаем изоляцию контекста
      }
    });

    win.loadFile('index.html');
    win.webContents.openDevTools(); // Открываем инструменты разработчика
};           

const client = new pg.Client({
  user: 'admin',
  host: 'localhost',
  database: 'slovadb',
  password: '123',
  port: 5432,
});

client.connect(function (err) {
  if (err) {
    console.error('error connecting:', err);
    return;
  }
  console.log('connected');
});


const prikol = () => {
  return new Promise((resolve) => {
    client.query('SELECT * FROM session', (_, result) => {
      resolve(result.rows); // Разрешаем промис с полученными данными
    });
  });
}

ipcMain.on('getdataBaseSession', async (event) => {
  const dataSession = await prikol(); // Ждем, пока промис выполнится
  console.log(dataSession)
  event.returnValue = dataSession
});

ipcMain.on('pushSession', async (event, text, values) => {
  const res = await client.query(text, values)
  event.returnValue = 'ok'
});


app.whenReady().then(createWindow)