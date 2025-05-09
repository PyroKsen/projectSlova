import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Получаем текущий путь
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, 'preload.js'), // Используйте __dirname здесь
            contextIsolation: true // Включаем изоляцию контекста
        }
    });

    win.loadFile('index.html');
    win.webContents.openDevTools(); // Открываем инструменты разработчика
};

app.whenReady()
    .then(createWindow)
    .catch(err => {
        console.error('Error during app initialization:', err);
    });

//Uncaught TypeError: Failed to resolve module specifier "electron". Relative references must start with either "/", "./", or "../".