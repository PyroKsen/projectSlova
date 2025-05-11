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

//СЕССИЯ
const dataSessionFu = () => {
  return new Promise((resolve) => {
    client.query('SELECT * FROM session', (_, result) => {
      resolve(result.rows);
    });
  });
}

ipcMain.on('getdataBaseSession', async (event) => {
  const dataSession = await dataSessionFu();
  console.log(dataSession)
  event.returnValue = dataSession
});

ipcMain.on('pushSession', async (event, text, values) => {
  const res = await client.query(text, values)
  event.returnValue = 'ok'
});
//PLAYER
const dataPlayerFu = () => {
  return new Promise((resolve) => {
    client.query('SELECT * FROM player', (_, result) => {
      resolve(result.rows);
    });
  });
}

ipcMain.on('getdataBasePlayer', async (event) => {
  const dataSession = await dataPlayerFu();
  console.log(dataSession)
  event.returnValue = dataSession
});

ipcMain.on('pushPlayer1', async (event, text, values) => {
  const res = await client.query(text, values)
  event.returnValue = 'ok'
});

ipcMain.on('pushPlayer2', async (event, text, values) => {
  const res = await client.query(text, values)
  event.returnValue = 'ok'
});
// PLAYER_SESSION
// const dataPlayerSessionFu = () => {
//   return new Promise((resolve) => {
//     client.query('SELECT * FROM player_session', (_, result) => {
//       resolve(result.rows);
//     });
//   });
// }

// ipcMain.on('getdataBasePlayerSession', async (event) => {
//   const dataSession = await dataPlayerSessionFu();
//   console.log(dataSession)
//   event.returnValue = dataSession
// });

ipcMain.on('pushPlayerSession1', async (event, text, values) => {
  const res = await client.query(text, values)
  event.returnValue = 'ok'
});

ipcMain.on('pushPlayerSession2', async (event, text, values) => {
  const res = await client.query(text, values)
  event.returnValue = 'ok'
});
//DATES
let id1
let id2
let ids
let mass = []
ipcMain.on('datesForGame', (event, idPl1, idPl2, sessionId) => {
  id1 = idPl1
  id2 = idPl2
  ids = sessionId
  mass.push(id1)
  mass.push(id2)
  mass.push(ids)
  event.returnValue = 'ok'
});

ipcMain.on('getmass', async (event) => {
  event.returnValue = mass
});

// WORDLIST
const dataWordlistFu = () => {
  return new Promise((resolve) => {
    client.query('SELECT * FROM wordlist', (_, result) => {
      resolve(result.rows);
    });
  });
}

ipcMain.on('getdataWordlist', async (event) => {
  const dataSession = await dataWordlistFu();
  console.log(dataSession)
  event.returnValue = dataSession
});

ipcMain.on('pushWordPlayer1', async (event, text, values) => {
  const res = await client.query(text, values)
  event.returnValue = 'ok'
});

ipcMain.on('pushWordPlayer2', async (event, text, values) => {
  const res = await client.query(text, values)
  event.returnValue = 'ok'
});

ipcMain.on('pushWord', async (event, text, values) => {
  const res = await client.query(text, values)
  event.returnValue = 'ok'
});

app.whenReady().then(createWindow)