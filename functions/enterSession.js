const { ipcRenderer } = require('electron');

function setupEventListener() {
    document.getElementById('checkButton').addEventListener('click', function(event) {
        event.preventDefault();

        const dataBaseSession = ipcRenderer.sendSync('getdataBaseSession');
        const idInput = document.getElementById('idInput').value;
        const inButton = document.getElementById('inButton');
        const passwordInput = document.getElementById('passwordInput').value;
        const messageDiv = document.getElementById('message');

        if ((idInput.trim() === '' && passwordInput.trim() === '') || idInput.trim() === '') {
            messageDiv.textContent = 'Пожалуйста, заполните поля.';
            messageDiv.style.color = 'red';
            return;
        }

        const sessionId = parseInt(idInput, 10);

        const sessionEntry = dataBaseSession.find(entry => entry.session_id === sessionId);

        if (sessionEntry) {
            if (sessionEntry.password === null && (passwordInput.trim() === '' || passwordInput.trim() === null)) {
                messageDiv.textContent = 'Верно (пароль не установлен).';
                messageDiv.style.color = 'green';
                const sesId = ipcRenderer.sendSync('getSesId', idInput);
                inButton.disabled = false
            } else if (sessionEntry.password === passwordInput.trim()) {
                messageDiv.textContent = 'Верно';
                messageDiv.style.color = 'green';
                const sesId = ipcRenderer.sendSync('getSesId', idInput);
                inButton.disabled = false
            } else {
                inButton.disabled = true
                messageDiv.textContent = `Почти верно, только пароль к этому ID: ${sessionEntry.password}`;
                messageDiv.style.color = 'red';
            }
        } else {
            inButton.disabled = true
            messageDiv.textContent = 'Неверный ID';
            messageDiv.style.color = 'red';
        }
    });
}


setupEventListener();