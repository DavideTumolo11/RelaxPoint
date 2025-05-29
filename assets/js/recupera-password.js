/* ===============================================
   RELAXPOINT - JS RECUPERA PASSWORD
   Gestione reset password e countdown reinvio
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {

    // Gestione form recupero password
    const resetForm = document.getElementById('resetPasswordForm');
    if (resetForm) {
        resetForm.addEventListener('submit', handlePasswordReset);
    }

});

// Gestisce invio form recupero password
function handlePasswordReset(e) {
    e.preventDefault();

    // Validazione captcha
    const captchaAnswer = document.getElementById('captcha_answer').value;
    if (captchaAnswer !== '8') {
        showError('Risposta di sicurezza incorretta. 5 + 3 = 8');
        return;
    }

    // Validazione email
    const email = document.getElementById('reset_email').value;
    if (!isValidEmail(email)) {
        showError('Inserisci un indirizzo email valido');
        return;
    }

    // Ottieni tipo account selezionato
    const tipoAccount = document.querySelector('input[name="tipo_account"]:checked').value;

    // Simula invio email
    processPasswordReset(email, tipoAccount);
}

// Processa reset password
function processPasswordReset(email, tipoAccount) {
    // Mostra loading sul pulsante
    const submitButton = document.querySelector('#resetPasswordForm button[type="submit"]');
    const originalText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.classList.add('loading');
    submitButton.innerHTML = '<span>Invio in corso...</span>';

    // Simula chiamata API
    setTimeout(() => {
        // Nasconde form reset e mostra card successo
        document.getElementById('resetCard').style.display = 'none';
        document.getElementById('successCard').style.display = 'block';

        // Mostra email nella card successo
        document.getElementById('emailSentTo').innerHTML = `<strong>${email}</strong>`;

        // Avvia countdown per reinvio
        startResendCountdown();

        // Log per debugging (rimuovere in produzione)
        console.log(`Password reset richiesto per: ${email} (${tipoAccount})`);

    }, 2000); // Simula delay rete
}

// Avvia countdown per reinvio email
function startResendCountdown() {
    const resendButton = document.getElementById('resendButton');
    let countdown = 60;

    const interval = setInterval(() => {
        countdown--;
        resendButton.innerHTML = `<span>Reinvia Email (${countdown}s)</span>`;

        if (countdown <= 0) {
            clearInterval(interval);
            resendButton.disabled = false;
            resendButton.innerHTML = '<span>Reinvia Email</span>';
            resendButton.classList.remove('auth-button-secondary');
            resendButton.classList.add('auth-button');
        }
    }, 1000);

    // Gestisce click reinvio
    resendButton.addEventListener('click', function () {
        if (!this.disabled) {
            handleResendEmail();
        }
    });
}

// Gestisce reinvio email
function handleResendEmail() {
    const resendButton = document.getElementById('resendButton');
    const email = document.getElementById('emailSentTo').textContent.trim();

    // Mostra conferma reinvio
    showSuccess('Email reinviata con successo!');

    // Disabilita pulsante e riavvia countdown
    resendButton.disabled = true;
    resendButton.classList.remove('auth-button');
    resendButton.classList.add('auth-button-secondary');

    // Riavvia countdown
    startResendCountdown();

    // Log per debugging
    console.log(`Email reinviata a: ${email}`);
}

// Valida formato email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostra messaggio di errore
function showError(message) {
    // Crea o aggiorna elemento errore
    let errorElement = document.getElementById('error-message');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.className = 'form-error-message';
        errorElement.style.cssText = `
            background: #fef2f2;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 16px 0;
            font-size: 14px;
            border: 1px solid #fecaca;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        // Inserisce prima del pulsante
        const form = document.getElementById('resetPasswordForm');
        const submitButton = form.querySelector('button[type="submit"]');
        form.insertBefore(errorElement, submitButton);
    }

    errorElement.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
        </svg>
        ${message}
    `;

    // Rimuove messaggio dopo 5 secondi
    setTimeout(() => {
        if (errorElement && errorElement.parentNode) {
            errorElement.remove();
        }
    }, 5000);
}

// Mostra messaggio di successo
function showSuccess(message) {
    // Crea elemento successo temporaneo
    const successElement = document.createElement('div');
    successElement.className = 'form-success-message';
    successElement.style.cssText = `
        background: #f0f9f5;
        color: var(--color-primary);
        padding: 12px 16px;
        border-radius: 8px;
        margin: 16px 0;
        font-size: 14px;
        border: 1px solid rgba(45, 90, 61, 0.2);
        display: flex;
        align-items: center;
        gap: 8px;
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;

    successElement.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
        </svg>
        ${message}
    `;

    document.body.appendChild(successElement);

    // Rimuove dopo 3 secondi con animazione
    setTimeout(() => {
        successElement.style.opacity = '0';
        successElement.style.transform = 'translateX(100%)';
        successElement.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            if (successElement && successElement.parentNode) {
                successElement.remove();
            }
        }, 300);
    }, 3000);
}

// Gestione cambio tipo account (per eventuali logiche future)
document.addEventListener('change', function (e) {
    if (e.target.name === 'tipo_account') {
        const tipoSelezionato = e.target.value;
        console.log(`Tipo account selezionato: ${tipoSelezionato}`);

        // Qui si possono aggiungere logiche specifiche per tipo account
        // Ad esempio cambiare il testo del form o mostrare campi aggiuntivi
    }
});

// Previene invio multipli
let formSubmitting = false;

document.addEventListener('submit', function (e) {
    if (e.target.id === 'resetPasswordForm') {
        if (formSubmitting) {
            e.preventDefault();
            return false;
        }
        formSubmitting = true;

        // Reset flag dopo 3 secondi
        setTimeout(() => {
            formSubmitting = false;
        }, 3000);
    }
});