/* ===============================================
   RELAXPOINT - JS MANUTENZIONE
   Gestione countdown, progress bar e funzionalità
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===============================================
    // CONFIGURAZIONE MANUTENZIONE
    // ===============================================
    const MAINTENANCE_CONFIG = {
        // Data fine manutenzione (modificabile)
        endDate: new Date(Date.now() + (2 * 60 * 60 * 1000)), // 2 ore da ora

        // Progress bar configurazione
        totalSteps: 5,
        currentStep: 3,

        // Auto-refresh configurazione
        autoRefresh: true,
        refreshInterval: 30000, // 30 secondi

        // Notifiche
        showNotifications: true
    };

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const elements = {
        countdown: {
            days: document.getElementById('countdown-days'),
            hours: document.getElementById('countdown-hours'),
            minutes: document.getElementById('countdown-minutes'),
            seconds: document.getElementById('countdown-seconds')
        },
        progress: {
            bar: document.getElementById('progress-fill'),
            label: document.getElementById('progress-label'),
            percentage: document.getElementById('progress-percentage')
        },
        actions: {
            refresh: document.getElementById('refresh-btn'),
            home: document.getElementById('home-btn'),
            support: document.getElementById('support-btn')
        }
    };

    // ===============================================
    // COUNTDOWN TIMER
    // ===============================================
    function updateCountdown() {
        const now = new Date();
        const timeLeft = MAINTENANCE_CONFIG.endDate - now;

        if (timeLeft <= 0) {
            // Manutenzione completata
            handleMaintenanceComplete();
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Aggiorna display countdown
        if (elements.countdown.days) {
            elements.countdown.days.textContent = String(days).padStart(2, '0');
        }
        if (elements.countdown.hours) {
            elements.countdown.hours.textContent = String(hours).padStart(2, '0');
        }
        if (elements.countdown.minutes) {
            elements.countdown.minutes.textContent = String(minutes).padStart(2, '0');
        }
        if (elements.countdown.seconds) {
            elements.countdown.seconds.textContent = String(seconds).padStart(2, '0');
        }

        // Aggiorna title per notifiche
        document.title = `Manutenzione - ${hours}h ${minutes}m rimaste - RelaxPoint`;
    }

    // ===============================================
    // PROGRESS BAR
    // ===============================================
    function updateProgressBar() {
        const percentage = Math.round((MAINTENANCE_CONFIG.currentStep / MAINTENANCE_CONFIG.totalSteps) * 100);

        if (elements.progress.bar) {
            elements.progress.bar.style.setProperty('--progress-width', `${percentage}%`);
            elements.progress.bar.style.width = `${percentage}%`;
        }

        if (elements.progress.percentage) {
            elements.progress.percentage.textContent = `${percentage}%`;
        }

        if (elements.progress.label) {
            const stepText = getStepDescription(MAINTENANCE_CONFIG.currentStep);
            elements.progress.label.textContent = stepText;
        }
    }

    // ===============================================
    // DESCRIZIONI STEP MANUTENZIONE
    // ===============================================
    function getStepDescription(step) {
        const descriptions = {
            1: "Inizializzazione sistema...",
            2: "Backup database in corso...",
            3: "Aggiornamento infrastruttura...",
            4: "Test funzionalità...",
            5: "Finalizzazione e verifica..."
        };

        return descriptions[step] || "Elaborazione in corso...";
    }

    // ===============================================
    // GESTIONE FINE MANUTENZIONE
    // ===============================================
    function handleMaintenanceComplete() {
        // Aggiorna UI
        document.querySelector('.maintenance-title').textContent = "Manutenzione Completata!";
        document.querySelector('.maintenance-subtitle').textContent = "Il sistema è tornato online";

        // Nasconde countdown
        const countdownContainer = document.querySelector('.maintenance-countdown');
        if (countdownContainer) {
            countdownContainer.style.display = 'none';
        }

        // Progress bar al 100%
        if (elements.progress.bar) {
            elements.progress.bar.style.width = '100%';
            elements.progress.percentage.textContent = '100%';
            elements.progress.label.textContent = 'Sistema Online';
        }

        // Cambia icona
        const icon = document.querySelector('.maintenance-icon svg');
        if (icon) {
            icon.innerHTML = '<path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>';
            icon.style.color = 'var(--color-primary)';
        }

        // Auto-redirect dopo 5 secondi
        showCompletionNotification();
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 5000);
    }

    // ===============================================
    // NOTIFICAZIONI
    // ===============================================
    function showCompletionNotification() {
        if (!MAINTENANCE_CONFIG.showNotifications) return;

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                </svg>
                <span>Reindirizzamento automatico in 5 secondi...</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Rimuove notifica dopo 6 secondi
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 6000);
    }

    function showMaintenanceNotification(message) {
        if (!MAINTENANCE_CONFIG.showNotifications) return;

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(45, 90, 61, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            animation: fadeInUp 0.3s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // ===============================================
    // AUTO-REFRESH
    // ===============================================
    function setupAutoRefresh() {
        if (!MAINTENANCE_CONFIG.autoRefresh) return;

        setInterval(() => {
            // Controlla se manutenzione è finita
            fetch('/status.json')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'online') {
                        handleMaintenanceComplete();
                    }
                })
                .catch(() => {
                    // Se fetch fallisce, probabilmente ancora in manutenzione
                    console.log('Sistema ancora in manutenzione');
                });
        }, MAINTENANCE_CONFIG.refreshInterval);
    }

    // ===============================================
    // EVENT LISTENERS
    // ===============================================
    function setupEventListeners() {
        // Pulsante refresh
        if (elements.actions.refresh) {
            elements.actions.refresh.addEventListener('click', function () {
                showMaintenanceNotification('Aggiornamento stato...');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            });
        }

        // Pulsante home
        if (elements.actions.home) {
            elements.actions.home.addEventListener('click', function (e) {
                e.preventDefault();
                showMaintenanceNotification('Tentativo di accesso alla homepage...');
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
            });
        }

        // Pulsante supporto
        if (elements.actions.support) {
            elements.actions.support.addEventListener('click', function (e) {
                e.preventDefault();
                showMaintenanceNotification('Apertura supporto...');
                setTimeout(() => {
                    window.open('mailto:supporto@relaxpoint.it?subject=Supporto durante manutenzione', '_blank');
                }, 500);
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function (e) {
            switch (e.key) {
                case 'r':
                case 'R':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        window.location.reload();
                    }
                    break;
                case 'h':
                case 'H':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        window.location.href = '/index.html';
                    }
                    break;
            }
        });

        // Gestione visibilità tab
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                // Tab è tornata visibile, aggiorna dati
                updateCountdown();
                updateProgressBar();
            }
        });
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    function formatTimeUnit(value) {
        return String(value).padStart(2, '0');
    }

    function logMaintenanceEvent(event, data = {}) {
        // Log per debugging (in produzione invia a analytics)
        console.log(`[Maintenance] ${event}:`, {
            timestamp: new Date().toISOString(),
            ...data
        });
    }

    // ===============================================
    // SIMULAZIONE PROGRESSO (per demo)
    // ===============================================
    function simulateProgress() {
        const interval = setInterval(() => {
            if (MAINTENANCE_CONFIG.currentStep < MAINTENANCE_CONFIG.totalSteps) {
                MAINTENANCE_CONFIG.currentStep++;
                updateProgressBar();

                const stepText = getStepDescription(MAINTENANCE_CONFIG.currentStep);
                showMaintenanceNotification(stepText);

                logMaintenanceEvent('step_completed', {
                    step: MAINTENANCE_CONFIG.currentStep,
                    total: MAINTENANCE_CONFIG.totalSteps
                });
            } else {
                clearInterval(interval);
            }
        }, 15000); // Ogni 15 secondi avanza di uno step
    }

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        console.log('🔧 RelaxPoint Manutenzione inizializzata');

        // Setup iniziale
        updateCountdown();
        updateProgressBar();
        setupEventListeners();
        setupAutoRefresh();

        // Avvia timers
        const countdownInterval = setInterval(updateCountdown, 1000);

        // Simula progresso (solo per demo)
        simulateProgress();

        // Log evento
        logMaintenanceEvent('page_loaded', {
            endDate: MAINTENANCE_CONFIG.endDate,
            currentStep: MAINTENANCE_CONFIG.currentStep
        });

        console.log('🚀 Sistema manutenzione ready!');
    }

    // ===============================================
    // GESTIONE ERRORI
    // ===============================================
    window.addEventListener('error', function (e) {
        console.error('Errore pagina manutenzione:', e.error);
        logMaintenanceEvent('error', {
            message: e.error.message,
            filename: e.filename,
            lineno: e.lineno
        });
    });

    // ===============================================
    // AVVIO
    // ===============================================
    init();

    // ===============================================
    // EXPORT PER DEBUG (solo development)
    // ===============================================
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.MaintenanceDebug = {
            config: MAINTENANCE_CONFIG,
            forceComplete: handleMaintenanceComplete,
            showNotification: showMaintenanceNotification,
            updateStep: (step) => {
                MAINTENANCE_CONFIG.currentStep = step;
                updateProgressBar();
            }
        };
        console.log('🧪 Debug tools available: window.MaintenanceDebug');
    }

});