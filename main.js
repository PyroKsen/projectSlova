import { app, BrowserWindow, ipcMain } from 'electron';
import pg from 'pg';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  // win.webContents.openDevTools();
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
};

ipcMain.on('getdataBaseSession', async (event) => {
  const dataSession = await dataSessionFu();
  event.returnValue = dataSession;
});

ipcMain.on('pushSession', async (event, text, values) => {
  const res = await client.query(text, values);
  event.returnValue = 'ok';
});

//PLAYER
const dataPlayerFu = () => {
  return new Promise((resolve) => {
    client.query('SELECT * FROM player', (_, result) => {
      resolve(result.rows);
    });
  });
};

ipcMain.on('getdataBasePlayer', async (event) => {
  const dataSession = await dataPlayerFu();
  event.returnValue = dataSession;
});

ipcMain.on('pushPlayer1', async (event, text, values) => {
  const res = await client.query(text, values);
  event.returnValue = 'ok';
});

ipcMain.on('pushPlayer2', async (event, text, values) => {
  const res = await client.query(text, values);
  event.returnValue = 'ok';
});

// PLAYER_SESSION

const dataPlayerSessionFu = (sessionId) => {
  return new Promise((resolve) => {
    client.query(`SELECT * FROM player_session WHERE session_id = ${sessionId}`, (_, result) => {
      resolve(result.rows);
    });
  });
};

ipcMain.on('getdataBasePlayerSession', async (event, sessionId) => {
  const dataSession = await dataPlayerSessionFu(sessionId);
  event.returnValue = dataSession;
});

ipcMain.on('pushPlayerSession1', async (event, text, values) => {
  const res = await client.query(text, values);
  event.returnValue = 'ok';
});

ipcMain.on('pushPlayerSession2', async (event, text, values) => {
  const res = await client.query(text, values);
  event.returnValue = 'ok';
});

//DATES
let id1;
let id2;
let ids;
let mass = [];
ipcMain.on('datesForGame', (event, idPl1, idPl2, sessionId) => {
  id1 = idPl1;
  id2 = idPl2;
  ids = sessionId;
  mass.push(id1);
  mass.push(id2);
  mass.push(ids);
  event.returnValue = 'ok';
});

let sId;
ipcMain.on('getSesId', async (event, sesId) => {
  sId = sesId;
  event.returnValue = 'ok';
});

ipcMain.on('getSid', async (event) => {
  event.returnValue = sId;
});

ipcMain.on('getmass', async (event) => {
  event.returnValue = mass;
});

// WORDLIST
const dataWordlistFu = () => {
  return new Promise((resolve) => {
    client.query('SELECT * FROM wordlist', (_, result) => {
      resolve(result.rows);
    });
  });
};

ipcMain.on('getdataWordlist', async (event) => {
  const dataSession = await dataWordlistFu();
  event.returnValue = dataSession;
});

ipcMain.on('pushWord', async (event, text, values) => {
  const res = await client.query(text, values);
  event.returnValue = 'ok';
});

const dataWorldBySessionFu = (sessionId) => {
  return new Promise((resolve) => {
    client.query(`SELECT * FROM wordlist WHERE session_id = ${sessionId}`, (_, result) => {
      resolve(result.rows);
    });
  });
};

ipcMain.on('getdataWorldBySession', async (event, sessionId) => {
  const dataSession = await dataWorldBySessionFu(sessionId);
  event.returnValue = dataSession;
});

const dataPlayersByIdFu = (playerid) => {
  return new Promise((resolve) => {
    client.query(`SELECT * FROM player WHERE player_id = ${playerid}`, (_, result) => {
      resolve(result.rows);
    });
  });
};

ipcMain.on('getdataPlayersById', async (event, playerid) => {
  const dataSession = await dataPlayersByIdFu(playerid);
  event.returnValue = dataSession;
});

app.whenReady().then(createWindow);
