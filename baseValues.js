import { ipcMain } from 'electron';
import pg from 'pg'; // Импортируем pg для работы с базой данных

const client = new pg.Client({
    user: 'admin',
    host: 'localhost',
    database: 'slovadb',
    password: '123',
    port: 5432,
});

// Обработчик для IPC
ipcMain.on('getData', (event) => {
    client.connect()
        .then(() => {
            return client.query('SELECT * FROM player');
        })
        .then(result => {
            event.reply('dataResponse', result.rows); // Отправляем данные обратно в рендерер
        })
        .catch(err => {
            console.error('error running query:', err);
            event.reply('dataResponse', null); // Отправляем null в случае ошибки
        })
        .finally(() => {
            client.end();
        });
});