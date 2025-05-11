const { ipcRenderer } = require('electron'); // Импортируем ipcRenderer
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('playerName').textContent = 'работает';
    // const dates = ipcRenderer.sendSync('getmass'); //1-id1 2-id2 3-ids
    const databaseWordlist = ipcRenderer.sendSync('getdataWordlist');
    console.log(databaseWordlist)
});

// const text1 = 'INSERT INTO player(player_id, username) VALUES($1, $2) RETURNING *'
// const values1 = [`${dlinaBD1}`, `${nI1}`]
// const ok1 = ipcRenderer.sendSync('pushPlayer1', text1, values1);