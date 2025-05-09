import { app, BrowserWindow } from 'electron'; // Используем import вместо require
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

const client = new pg.Client({
  user: 'admin',
  host: 'localhost',
  database: 'slovadb',
  password: '1234',
  port: 5432,
});

client.connect(function (err) {
  if (err) {
    console.error('error connecting:', err);
    return;
  }
  console.log('connected');

  // Запрос к базе данных
  client.query('SELECT * FROM player', function (err, result) {
    if (err) {
      console.error('error running query:', err);
    } else {
      console.log(result.rows);
    }
    client.end();
  });
});