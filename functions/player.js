const { ipcRenderer } = require('electron'); // Импортируем ipcRenderer

function createPlayer() {
    document.getElementById('createPlayerButton').addEventListener('click', function(event) {
        event.preventDefault()

        const dataBasePlayer = ipcRenderer.sendSync('getdataBasePlayer');
        const messageForPlayers = document.getElementById('messageForPlayers')
        const nI1 = document.getElementById('nameInput1').value.trim();
        const nI2 = document.getElementById('nameInput2').value.trim();

        const idp1 = (nI1) => {
            const player = dataBasePlayer.find(entry => entry.username === nI1);
            return player ? player.player_id : false;
        }

        const idp2 = (nI2) => {
            const player = dataBasePlayer.find(entry => entry.username === nI2);
            return player ? player.player_id : false;
        }

        const dlinaBD1 = dataBasePlayer.length + 1
        const dlinaBD2 = dataBasePlayer.length + 2

        const text1 = 'INSERT INTO player(player_id, username) VALUES($1, $2) RETURNING *'
        const values1 = [`${dlinaBD1}`, `${nI1}`]

        const text2 = 'INSERT INTO player(player_id, username) VALUES($1, $2) RETURNING *'
        const values2 = [`${dlinaBD2}`, `${nI2}`]

        if (nI1 === '' || nI1 === null || nI1 === undefined || nI2 === '' || nI2 === null || nI2 === undefined) {
            messageForPlayers.textContent = 'Переименуйтесь либо заполните оба поля!'
            messageForPlayers.style.color = 'red'
            return
        } else if (idp1(nI1) && idp2(nI2)) {
            messageForPlayers.textContent = 'Игроки уже созданы!'
            messageForPlayers.style.color = 'green'
            document.getElementById('createPlayerButton').disabled = true
            document.getElementById('goGameButton').disabled = false
            console.log('all ok')
        } else if (idp1(nI1) && (idp2(nI2) === false)) {
            messageForPlayers.textContent = 'Игрок 1 уже создан!'
            messageForPlayers.style.color = 'green'
            document.getElementById('createPlayerButton').disabled = true
            document.getElementById('goGameButton').disabled = false
            const ok2 = ipcRenderer.sendSync('pushPlayer2', text2, values2);
            console.log(ok2, 'p 01')
        } else if ((idp1(nI1) === false) && idp2(nI2)) {
            messageForPlayers.textContent = 'Игрок 2 уже создан!'
            messageForPlayers.style.color = 'green'
            document.getElementById('createPlayerButton').disabled = true
            document.getElementById('goGameButton').disabled = false
            const ok1 = ipcRenderer.sendSync('pushPlayer2', text1, values1);
            console.log(ok1, 'p 10')
        } else {
            const ok1 = ipcRenderer.sendSync('pushPlayer1', text1, values1);
            const ok2 = ipcRenderer.sendSync('pushPlayer2', text2, values2);
            console.log(ok1, ok2, 'p 11')
            messageForPlayers.textContent = 'Игроки созданы!'
            messageForPlayers.style.color = 'green'
            document.getElementById('createPlayerButton').disabled = true
            document.getElementById('goGameButton').disabled = false
        }
    })
}
function goGame() {
    document.getElementById('goGameButton').addEventListener('click', function(event) {

        const nI1 = document.getElementById('nameInput1').value.trim();
        const nI2 = document.getElementById('nameInput2').value.trim();
        console.log(nI1, nI2)

        const dataBaseSession = ipcRenderer.sendSync('getdataBaseSession');
        const dataBasePlayer = ipcRenderer.sendSync('getdataBasePlayer');
        const sessionId = dataBaseSession.length

        const text1 = 'INSERT INTO player_session(player_id, session_id) VALUES($1, $2) RETURNING *'
        const text2 = 'INSERT INTO player_session(player_id, session_id) VALUES($1, $2) RETURNING *'

        const idp1 = (nI1) => {
            const player = dataBasePlayer.find(entry => entry.username === nI1);
            return player ? player.player_id : false;
        }

        const idp2 = (nI2) => {
            const player = dataBasePlayer.find(entry => entry.username === nI2);
            return player ? player.player_id : false;
        }

        const iidp1 = idp1(nI1)
        const iidp2 = idp2(nI2)
        console.log(iidp1, iidp2)
        let idPl1 = iidp1
        let idPl2 = iidp1

        if (iidp1 && iidp2) {
            const values1 = [`${iidp1}`, `${sessionId}`]
            const values2 = [`${iidp2}`, `${sessionId}`]
            idPl1 = iidp1
            idPl2 = iidp2
            const ok1 = ipcRenderer.sendSync('pushPlayerSession1', text1, values1);
            const ok2 = ipcRenderer.sendSync('pushPlayerSession2', text2, values2);
            console.log(ok1, ok2, '11')
        } else if ((iidp1 === false) && iidp2) {
            const ipPlayer1 = dataBasePlayer.length - 0
            const values1 = [`${ipPlayer1}`, `${sessionId}`]
            const values2 = [`${iidp2}`, `${sessionId}`]
            idPl1 = ipPlayer1
            idPl2 = iidp2
            const ok1 = ipcRenderer.sendSync('pushPlayerSession1', text1, values1);
            const ok2 = ipcRenderer.sendSync('pushPlayerSession2', text2, values2);
            console.log(ok1, ok2, '01')
        } else if (iidp1 && (iidp2 === false)) {
            const ipPlayer2 = dataBasePlayer.length - 0
            const values1 = [`${iidp1}`, `${sessionId}`]
            const values2 = [`${ipPlayer2}`, `${sessionId}`]
            idPl1 = iidp1
            idPl2 = ipPlayer2
            const ok1 = ipcRenderer.sendSync('pushPlayerSession1', text1, values1);
            const ok2 = ipcRenderer.sendSync('pushPlayerSession2', text2, values2);
            console.log(ok1, ok2, '10')
        } else {
            const ipPlayer1 = dataBasePlayer.length - 1
            const ipPlayer2 = dataBasePlayer.length - 0
            const values1 = [`${ipPlayer1}`, `${sessionId}`]
            const values2 = [`${ipPlayer2}`, `${sessionId}`]
            idPl1 = ipPlayer1
            idPl2 = ipPlayer2
            const ok1 = ipcRenderer.sendSync('pushPlayerSession1', text1, values1);
            const ok2 = ipcRenderer.sendSync('pushPlayerSession2', text2, values2);
            console.log(ok1, ok2, '00')
        }
        const datesForGame = ipcRenderer.sendSync('datesForGame', idPl1, idPl2, sessionId)
        console.log(datesForGame)
        document.getElementById('goGameButton').disabled = true
    })
}

goGame()
createPlayer()