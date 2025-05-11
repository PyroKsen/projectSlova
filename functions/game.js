const { ipcRenderer } = require('electron'); // Импортируем ipcRenderer
const { text } = require('express');
let datesb = []

function getWordsBySessionId(sessionId, database) {
    const result = database.filter(entry => entry.session_id === sessionId);
    return result.length > 0 ? result : null; 
}
function getUsernameById(playerId, players) {
    const player = players.find(entry => entry.player_id === playerId);
    return player ? player.username : null;
}
function getIdByUsername(username, players) {
    const player = players.find(entry => entry.username === username);
    return player ? player.player_id : null;
}
function checkWordExists(word, database) {
    return database.some(entry => entry.word === word);
}

document.addEventListener("DOMContentLoaded", function() {
    const dates = ipcRenderer.sendSync('getmass'); //1-id1 2-id2 3-ids
    const databasePlayer = ipcRenderer.sendSync('getdataBasePlayer')
    const databaseWordlist = ipcRenderer.sendSync('getdataWordlist');
    const dlinaBDwordlist = databaseWordlist.length
    datesb.push(dates[0])
    datesb.push(dates[1])
    datesb.push(dates[2])
    const id1 = dates[0]
    const id2 = dates[1]
    const ids = dates[2]

    const pname1 = getUsernameById(id1, databasePlayer)
    const pname2 = getUsernameById(id2, databasePlayer)

    const result = getWordsBySessionId(ids, databaseWordlist)
    if (result === null) {
        const w1 = 'начало'
        const w2 = 'окончание'
        const dlinaFor1p = dlinaBDwordlist + 1
        const dlinaFor2p = dlinaBDwordlist + 2
        const text1 = 'INSERT INTO wordlist(word_id, word, session_id, player_id) VALUES($1, $2, $3, $4) RETURNING *'
        const values1 = [`${dlinaFor1p}`, `${w1}`, `${ids}`, `${id1}`]
        const text2 = 'INSERT INTO wordlist(word_id, word, session_id, player_id) VALUES($1, $2, $3, $4) RETURNING *'
        const values2 = [`${dlinaFor2p}`, `${w2}`, `${ids}`, `${id2}`]
        const word1 = ipcRenderer.sendSync('pushWordPlayer1', text1, values1);
        const word2 = ipcRenderer.sendSync('pushWordPlayer2', text2, values2);
        document.getElementById('playerName').textContent = pname1;
        console.log(word1, word2)
    } else (
        console.log('error, слова в бд откуда взялись')
    )
});

function enter() {
    document.getElementById('wordInputButton').addEventListener('click', function(event) {
        event.preventDefault();
        const message = document.getElementById('messageForPlayer')
        const playerNameBoard = document.getElementById('playerName')
        const wordInput = document.getElementById('wordInput').value.trim().toLowerCase()
        const ids = datesb[2]
        const id2 = datesb[1]
        const id1 = datesb[0]
        const playerName = playerNameBoard.textContent
        const databasePlayer = ipcRenderer.sendSync('getdataBasePlayer')
        const pname1 = getUsernameById(id1, databasePlayer)
        const pname2 = getUsernameById(id2, databasePlayer)

        const databaseWordlist = ipcRenderer.sendSync('getdataWordlist');
        const result = getWordsBySessionId(ids, databaseWordlist)
        console.log(result)

        const check = checkWordExists(wordInput, result)

        if (wordInput.length < 1) {
            message.textContent = 'Слово не может быть меньше чем из 2х букв!'
            message.style.color = 'red';
            return
        } else if (wordInput.length === null || wordInput.length === undefined) {
            message.textContent = 'Слово не может быть c таким значением!'
            message.style.color = 'red';
            return
        } else if (check === true) {
            message.textContent = 'Такое слово уже есть!'
            message.style.color = 'red';
            return
        } else {
            const dlinaBDwordlist = databaseWordlist.length

            const wordId = dlinaBDwordlist + 1

            const playerId = getIdByUsername(playerName, databasePlayer)

            console.log(databaseWordlist)
            if (playerName === pname1) {
                const text1 = 'INSERT INTO wordlist(word_id, word, session_id, player_id) VALUES($1, $2, $3, $4) RETURNING *'
                const values1 = [`${wordId}`, `${wordInput}`, `${ids}`, `${playerId}`]
                const word = ipcRenderer.sendSync('pushWord', text1, values1);
                console.log(word, 'ok1')
                playerNameBoard.textContent = pname2
                document.getElementById('wordInput').value = ''
            } else if (playerName === pname2) {
                const text1 = 'INSERT INTO wordlist(word_id, word, session_id, player_id) VALUES($1, $2, $3, $4) RETURNING *'
                const values1 = [`${wordId}`, `${wordInput}`, `${ids}`, `${playerId}`]
                const word = ipcRenderer.sendSync('pushWord', text1, values1);
                console.log(word, 'ok2')
                playerNameBoard.textContent = pname1
                document.getElementById('wordInput').value = ''
            }
        }
    });
}

enter()