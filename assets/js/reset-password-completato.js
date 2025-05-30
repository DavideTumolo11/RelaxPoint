/* ===============================================
   RELAXPOINT - JS RESET PASSWORD COMPLETATO
   Gestione redirect automatico e animazioni
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('🔐 Reset Password Completato - JS caricato');

    // ===============================================
    // COUNTDOWN REDIRECT AUTOMATICO
    // ===============================================
    let countdown = 30; // secondi
    const countdownElement = document.getElementById('countdown');
    const progressBar = document.querySelector('.progress-bar');

    function updateCountdown() {
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }

        // Aggiorna progress bar
        if (progressBar) {
            const progress = ((30 - countdown) / 30) * 100;
            progressBar.style.width = progress + '%';
        }

        countdown--;

        if (countdown < 0) {
            // Redirect a login
            window.location.href = 'login.html';
        }
    }

    // Avvia countdown
    const countdownInterval = setInterval(updateCountdown, 1000);

    // ===============================================
    // GESTIONE PULSANTI
    // ===============================================

    // Pulsante "Accedi Ora"
    const loginButton = document.querySelector('.btn-login-now');
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            clearInterval(countdownInterval);
            window.location.href = 'login.html';
        });
    }

    // Pulsante "Torna alla Home"
    const homeButton = document.querySelector('.btn-home');
    if (homeButton) {
        homeButton.addEventListener('click', function () {
            clearInterval(countdownInterval);
            window.location.href = 'index.html';
        });
    }

    // ===============================================
    // ANIMAZIONE SUCCESS ICON
    // ===============================================
    const successIcon = document.querySelector('.success-icon svg');
    if (successIcon) {
        // Animazione di "check" progressiva
        setTimeout(() => {
            successIcon.style.transform = 'scale(1.1)';
            successIcon.style.transition = 'transform 0.3s ease';

            setTimeout(() => {
                successIcon.style.transform = 'scale(1)';
            }, 300);
        }, 500);
    }

    // ===============================================
    // PARTICLES ANIMATION (opzionale)
    // ===============================================
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--color-primary);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.7;
            animation: float 3s ease-out forwards;
        `;

        // Posizione random attorno all'icona success
        const successCard = document.querySelector('.success-card');
        if (successCard) {
            const rect = successCard.getBoundingClientRect();
            particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
        }

        document.body.appendChild(particle);

        // Rimuovi dopo animazione
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 3000);
    }

    // Crea particelle ogni 2 secondi
    const particleInterval = setInterval(createParticle, 2000);

    // ===============================================
    // STOP ANIMAZIONI SE UTENTE LASCIA PAGINA
    // ===============================================
    window.addEventListener('beforeunload', function () {
        clearInterval(countdownInterval);
        clearInterval(particleInterval);
    });

    // ===============================================
    // GESTIONE VISIBILITÀ TAB
    // ===============================================
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            // Pausa countdown se tab non visibile
            clearInterval(countdownInterval);
        } else {
            // Riprendi countdown se tab torna visibile
            setInterval(updateCountdown, 1000);
        }
    });

    // ===============================================
    // CSS ANIMATION KEYFRAMES DINAMICI
    // ===============================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) scale(1);
                opacity: 0.7;
            }
            50% {
                transform: translateY(-30px) scale(1.2);
                opacity: 1;
            }
            100% {
                transform: translateY(-60px) scale(0.8);
                opacity: 0;
            }
        }

        .progress-bar {
            transition: width 1s linear;
        }

        .success-icon {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
    `;
    document.head.appendChild(style);

    console.log('✅ Reset Password Completato - Tutto inizializzato');
});