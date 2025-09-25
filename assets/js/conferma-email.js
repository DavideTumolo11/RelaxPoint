document.addEventListener('DOMContentLoaded', function () {
    // Gestione reinvio email con countdown
    const resendButton = document.getElementById('resendButton');
    const resendText = document.getElementById('resendText');
    let countdown = 60;
    let countdownInterval;

    // Simula email dall'URL o localStorage (in produzione verrebbe dal backend)
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || localStorage.getItem('confirmEmail') || 'mario.rossi@example.com';
    document.getElementById('userEmail').textContent = email;

    function startCountdown() {
        resendButton.disabled = true;
        countdown = 60;

        countdownInterval = setInterval(() => {
            countdown--;
            resendText.innerHTML = `
                <span class="countdown-timer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M15.29,10.29L11,14.59L8.71,12.29L7.29,13.71L11,17.41L16.71,11.71L15.29,10.29Z"/>
                    </svg>
                    Reinvia Email (${countdown}s)
                </span>
            `;

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                resendButton.disabled = false;
                resendText.innerHTML = 'Reinvia Email';
            }
        }, 1000);
    }

    // Gestione click reinvio
    resendButton.addEventListener('click', function () {
        if (!this.disabled) {
            // Simula invio email (in produzione: chiamata API)
            console.log(`Email di conferma reinviata a: ${email}`);

            // Feedback visivo
            showToast('Email di conferma reinviata con successo!', 'success');

            // Avvia countdown
            startCountdown();
        }
    });

    // Controllo automatico stato conferma (polling ogni 10 secondi)
    const checkConfirmationStatus = () => {
        // In produzione: chiamata API per verificare se email è stata confermata
        // fetch('/api/check-email-confirmation', { ... })
        console.log('Controllo stato conferma email...');
    };

    // Polling ogni 10 secondi
    setInterval(checkConfirmationStatus, 10000);

    // Toast notification function
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--color-primary)' : 'var(--color-secondary)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        toast.textContent = message;
        document.body.appendChild(toast);

        // Animazione entrata
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Rimozione automatica
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 4000);
    }

    // Log per debugging
    console.log('Pagina Conferma Email caricata per:', email);
});