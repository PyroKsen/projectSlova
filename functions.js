import { baseId, password } from "./baseValues.js";

function setupEventListener() {
    document.getElementById('checkButton').addEventListener('click', function(event) {
        event.preventDefault();
        
        const idInput = document.getElementById('idInput').value;
        const passwordInput = document.getElementById('passwordInput').value;

        const messageDiv = document.getElementById('message');
        let currentPassword = password
        let currentBaseId = baseId;

        if (idInput.trim() === '' || passwordInput.trim() === '') {
            messageDiv.textContent = 'Пожалуйста, заполните поля.';
        } else if (idInput.trim() === currentBaseId && passwordInput.trim() !== currentPassword.trim()) {
            messageDiv.textContent = `Почти верно, только пароль к этому ID: ${currentPassword}`;
            messageDiv.style.color = 'red';
        } else if (idInput.trim() === currentBaseId.trim() && passwordInput.trim() === currentPassword.trim()) {
            messageDiv.textContent = 'Верно';
            messageDiv.style.color = 'green';
        } else {
            messageDiv.textContent = `Неверный ID`;
            messageDiv.style.color = 'red';
        }
    });
}

setupEventListener();