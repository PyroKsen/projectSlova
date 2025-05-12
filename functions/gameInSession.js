const { ipcRenderer } = require('electron'); // Импортируем ipcRenderer
function getUsernameByPlayerId(playerId, players) {
    const player = players.find(p => p.player_id === playerId);
    return player ? player.username : null;
}
function loadWords(wordsData, playerNames) {
    const container = document.getElementById('wordsContainer');
    wordsData.forEach(item => {
        const playerName = playerNames[item.player_id];
        const wordElement = document.createElement('div');
        wordElement.className = 'word';
        wordElement.textContent = `${playerName}: ${item.word}`;
        container.appendChild(wordElement);
    });
}
document.addEventListener("DOMContentLoaded", function() {
    const sessionId = ipcRenderer.sendSync('getSid')
    document.getElementById('sessionId').textContent = sessionId
    const playerNameBoard = document.getElementById('playerName')
    const dataBasePlayerSession = ipcRenderer.sendSync('getdataBasePlayerSession', sessionId)
    const dataBaseWordlistById = ipcRenderer.sendSync('getdataWorldBySession', sessionId)
    let lastPlayerId
    if (dataBaseWordlistById.length !== 0) {
        lastPlayerId = dataBaseWordlistById[dataBaseWordlistById.length-2][`player_id`]
    } else {
        lastPlayerId = dataBasePlayerSession[0][`player_id`]
    }
    const playerId1 = dataBasePlayerSession[0][`player_id`]
    const playerId2 = dataBasePlayerSession[1][`player_id`]
    const player1 = ipcRenderer.sendSync('getdataPlayersById', playerId1)
    const player2 = ipcRenderer.sendSync('getdataPlayersById', playerId2)
    const players = []
    players.push(player1[0])
    players.push(player2[0])
    const playerNames = players.reduce((acc, player) => {
        acc[player.player_id] = player.username;
        return acc;
    }, {});
    const lastPlayerName = getUsernameByPlayerId(lastPlayerId, players)
    playerNameBoard.textContent = lastPlayerName
    loadWords(dataBaseWordlistById, playerNames)
});

function displayWords(database, playerName) {
    const wordsContainer = document.getElementById('wordsContainer');
    if (database.length > 0) {
        const lastEntry = database[database.length - 1];
        const wordElement = document.createElement('div');
        wordElement.className = 'word';
        wordElement.textContent = `${playerName}: ${lastEntry.word}`
        wordsContainer.appendChild(wordElement);
    }
}

function getPlayerIdByUsername(username, players) {
    const player = players.find(p => p.username === username);
    return player ? player.player_id : null;
}

function checkWordExists(word, database) {
    if (database === null) {
        return false
    } else {
        return database.some(entry => entry.word === word);
    }
}

function enter() {
    document.getElementById('wordInputButton').addEventListener('click', function(event) {
        event.preventDefault();
        const playerNameBoard = document.getElementById('playerName')
        const playerName = playerNameBoard.textContent
        const wordInput = document.getElementById('wordInput').value.trim().toLowerCase()
        const message = document.getElementById('messageForPlayer')
        const sessionId = ipcRenderer.sendSync('getSid')
        const dataBasePlayerSession = ipcRenderer.sendSync('getdataBasePlayerSession', sessionId)
        const playerId1 = dataBasePlayerSession[0][`player_id`]
        const playerId2 = dataBasePlayerSession[1][`player_id`]
        const player1 = ipcRenderer.sendSync('getdataPlayersById', playerId1)
        const player2 = ipcRenderer.sendSync('getdataPlayersById', playerId2)
        const databaseWordlist = ipcRenderer.sendSync('getdataWordlist');
        const players = []
        players.push(player1[0])
        players.push(player2[0])
        const result = ipcRenderer.sendSync('getdataWorldBySession', sessionId)
        const check = checkWordExists(wordInput, result)


                if (wordInput.length < 2) {
                    message.textContent = 'Слово не может быть меньше чем из 2х букв!'
                    message.style.color = 'red';
                    return
                } else if (wordInput.length === 'null' || wordInput.length === 'undefined') {
                    message.textContent = 'Слово не может быть c таким значением!'
                    message.style.color = 'red';
                    return
                } else if (check === true) {
                    message.textContent = 'Такое слово уже есть!'
                    message.style.color = 'red';
                    return
                } else {
                    message.textContent = 'Great!'
                    message.style.color = 'green';
                    const dlinaBDwordlist = databaseWordlist.length
                    const wordId = dlinaBDwordlist + 1
                    const playerId = getPlayerIdByUsername(playerName, players)
                    const pname1 = getUsernameByPlayerId(playerId1, players)
                    const pname2 = getUsernameByPlayerId(playerId2, players)
                    if (playerName === pname1) {
                        const text1 = 'INSERT INTO wordlist(word_id, word, session_id, player_id) VALUES($1, $2, $3, $4) RETURNING *'
                        const values1 = [`${wordId}`, `${wordInput}`, `${sessionId}`, `${playerId}`]
                        const word = ipcRenderer.sendSync('pushWord', text1, values1);
                        const dataBaseWordlistById = ipcRenderer.sendSync('getdataWorldBySession', sessionId)
                        displayWords(dataBaseWordlistById, playerName)
                        playerNameBoard.textContent = pname2
                        document.getElementById('wordInput').value = ''
                    } else if (playerName === pname2) {
                        const text1 = 'INSERT INTO wordlist(word_id, word, session_id, player_id) VALUES($1, $2, $3, $4) RETURNING *'
                        const values1 = [`${wordId}`, `${wordInput}`, `${sessionId}`, `${playerId}`]
                        const word = ipcRenderer.sendSync('pushWord', text1, values1);
                        const dataBaseWordlistById = ipcRenderer.sendSync('getdataWorldBySession', sessionId)
                        displayWords(dataBaseWordlistById, playerName)
                        playerNameBoard.textContent = pname1
                        document.getElementById('wordInput').value = ''
                    }
                }
    });
}

enter()