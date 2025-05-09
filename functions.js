// functions.js
const baseId = '123';
const password = '57';

function setupEventListener() {
    document.getElementById('checkButton').addEventListener('click', function(event) {
        event.preventDefault();
        const idInput = document.getElementById('idInput').value;
        const passwordInput = document.getElementById('passwordInput').value;
        const messageDiv = document.getElementById('message');

        if (idInput.trim() === '' || passwordInput.trim() === '') {
            messageDiv.textContent = 'Пожалуйста, заполните поля.';
        } else if (idInput.trim() === baseId && passwordInput.trim() !== password.trim()) {
            messageDiv.textContent = `Почти верно, только пароль к этому ID: ${password}`;
            messageDiv.style.color = 'red';
        } else if (idInput.trim() === baseId.trim() && passwordInput.trim() === password.trim()) {
            messageDiv.textContent = 'Верно';
            messageDiv.style.color = 'green';
        } else {
            messageDiv.textContent = 'Неверный ID';
            messageDiv.style.color = 'red';
        }
    });
}

setupEventListener();