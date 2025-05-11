const { ipcRenderer } = require('electron'); // Импортируем ipcRenderer

function create() {
    document.getElementById('createSessionButton').addEventListener('click', function(event) {
        const dataBaseSession = ipcRenderer.sendSync('getdataBaseSession');
        const creatPasswordInput = document.getElementById('createPasswordInput').value.trim();
        const dlinaBD = dataBaseSession.length + 1
        const text = 'INSERT INTO session(session_id, password) VALUES($1, $2) RETURNING *'
        const values = [`${dlinaBD}`, `${creatPasswordInput}`]
        const ok = ipcRenderer.sendSync('pushSession', text, values);
        console.log(ok)
    })
}

create()