const { ipcRenderer } = require('electron'); // Импортируем ipcRenderer

function createPlayer() {
    document.getElementById('createPlayerButton').addEventListener('click', function(event) {
        event.preventDefault()

        const dataBasePlayer = ipcRenderer.sendSync('getdataBasePlayer');
        const messageForPlayers = document.getElementById('messageForPlayers')
        const nI1 = document.getElementById('nameInput1').value.trim();
        const nI2 = document.getElementById('nameInput2').value.trim();

        const dlinaBD1 = dataBasePlayer.length + 1
        const dlinaBD2 = dataBasePlayer.length + 2

        if (nI1 === '' || nI1 === null || nI1 === undefined || nI2 === '' || nI2 === null || nI2 === undefined) {
            messageForPlayers.textContent = 'Переименуйтесь либо заполните оба поля!'
            messageForPlayers.style.color = 'red'
            return
        } else {
            const text1 = 'INSERT INTO player(player_id, username) VALUES($1, $2) RETURNING *'
            const values1 = [`${dlinaBD1}`, `${nI1}`]
    
            const text2 = 'INSERT INTO player(player_id, username) VALUES($1, $2) RETURNING *'
            const values2 = [`${dlinaBD2}`, `${nI2}`]
    
            const ok1 = ipcRenderer.sendSync('pushPlayer1', text1, values1);
            const ok2 = ipcRenderer.sendSync('pushPlayer2', text2, values2);
            console.log(ok1, ok2)
            messageForPlayers.textContent === 'Игроки созданы!'
            messageForPlayers.style.color = 'green'
            document.getElementById('createPlayerButton').disabled = true
            document.getElementById('goGameButton').disabled = false
        }
    })
}
function goGame() {
    document.getElementById('goGameButton').addEventListener('click', function(event) {
        event.preventDefault()

        const dataBaseSession = ipcRenderer.sendSync('getdataBaseSession');
        const dataBasePlayer = ipcRenderer.sendSync('getdataBasePlayer');
        // const dataBasePlayerSession = ipcRenderer.sendSync('getdataBasePlayerSession');

        const sessionId = dataBaseSession.length
        const playerId1 = dataBasePlayer.length - 1
        const playerId2 = dataBasePlayer.length - 0

        const text1 = 'INSERT INTO player_session(player_id, session_id) VALUES($1, $2) RETURNING *'
        const values1 = [`${playerId1}`, `${sessionId}`]
    
        const text2 = 'INSERT INTO player_session(player_id, session_id) VALUES($1, $2) RETURNING *'
        const values2 = [`${playerId2}`, `${sessionId}`]
    
        const ok1 = ipcRenderer.sendSync('pushPlayerSession1', text1, values1);
        const ok2 = ipcRenderer.sendSync('pushPlayerSession2', text2, values2);
        console.log(ok1, ok2)

        document.getElementById('goGameButton').disabled = true
    })
}

goGame()
createPlayer()