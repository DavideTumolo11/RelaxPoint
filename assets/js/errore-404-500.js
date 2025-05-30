/* ===============================================
   RELAXPOINT - JS ERRORE 404/500
   Gestione dinamica errori e funzionalità avanzate
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚨 Pagina Errore - JS caricato');

    // ===============================================
    // RILEVAMENTO TIPO ERRORE DA URL
    // ===============================================
    const urlParams = new URLSearchParams(window.location.search);
    const errorType = urlParams.get('type') || '404';

    // Configurazione errori
    const errorConfig = {
        '404': {
            code: '404',
            title: 'Pagina Non Trovata',
            message: 'La pagina che stai cercando non esiste o è stata spostata.',
            icon: '🔍',
            suggestions: [
                'Controlla che l\'URL sia corretto',
                'Torna alla homepage e riprova',
                'Usa la ricerca per trovare quello che cerchi'
            ]
        },
        '500': {
            code: '500',
            title: 'Errore del Server',
            message: 'Si è verificato un errore interno. I nostri tecnici sono già al lavoro.',
            icon: '⚠️',
            suggestions: [
                'Riprova tra qualche minuto',
                'Cancella cache e cookies del browser',
                'Contatta il supporto se il problema persiste'
            ]
        },
        '403': {
            code: '403',
            title: 'Accesso Negato',
            message: 'Non hai i permessi necessari per accedere a questa risorsa.',
            icon: '🔒',
            suggestions: [
                'Verifica di essere loggato correttamente',
                'Controlla i tuoi permessi di accesso',
                'Contatta l\'amministratore se necessario'
            ]
        }
    };

    // ===============================================
    // AGGIORNAMENTO CONTENUTI DINAMICI
    // ===============================================
    const currentError = errorConfig[errorType] || errorConfig['404'];

    // Aggiorna elementi pagina
    const errorCodeElement = document.getElementById('error-code');
    const errorTitleElement = document.getElementById('error-title');
    const errorMessageElement = document.getElementById('error-message');
    const errorIconElement = document.getElementById('error-icon');
    const suggestionsList = document.getElementById('suggestions-list');

    if (errorCodeElement) errorCodeElement.textContent = currentError.code;
    if (errorTitleElement) errorTitleElement.textContent = currentError.title;
    if (errorMessageElement) errorMessageElement.textContent = currentError.message;
    if (errorIconElement) errorIconElement.textContent = currentError.icon;

    // Aggiorna suggerimenti
    if (suggestionsList) {
        suggestionsList.innerHTML = currentError.suggestions
            .map(suggestion => `<li>${suggestion}</li>`)
            .join('');
    }

    // ===============================================
    // GESTIONE PULSANTI AZIONE
    // ===============================================

    // Pulsante Home
    const homeButton = document.getElementById('btn-home');
    if (homeButton) {
        homeButton.addEventListener('click', function () {
            logAction('home_clicked');
            window.location.href = 'index.html';
        });
    }

    // Pulsante Indietro
    const backButton = document.getElementById('btn-back');
    if (backButton) {
        backButton.addEventListener('click', function () {
            logAction('back_clicked');
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // Pulsante Ricarica
    const reloadButton = document.getElementById('btn-reload');
    if (reloadButton) {
        reloadButton.addEventListener('click', function () {
            logAction('reload_clicked');
            window.location.reload();
        });
    }

    // ===============================================
    // TOGGLE INFO TECNICHE
    // ===============================================
    const techInfoToggle = document.getElementById('tech-info-toggle');
    const techInfoContent = document.getElementById('tech-info-content');

    if (techInfoToggle && techInfoContent) {
        techInfoToggle.addEventListener('click', function () {
            const isVisible = techInfoContent.style.display === 'block';

            if (isVisible) {
                techInfoContent.style.display = 'none';
                techInfoToggle.textContent = 'Mostra Info Tecniche';
            } else {
                // Popola info tecniche
                populateTechInfo();
                techInfoContent.style.display = 'block';
                techInfoToggle.textContent = 'Nascondi Info Tecniche';
                logAction('tech_info_viewed');
            }
        });
    }

    // ===============================================
    // POPOLAMENTO INFO TECNICHE
    // ===============================================
    function populateTechInfo() {
        const techInfoContent = document.getElementById('tech-info-content');
        if (!techInfoContent) return;

        const techInfo = {
            'Timestamp': new Date().toISOString(),
            'User Agent': navigator.userAgent,
            'URL Richiesta': window.location.href,
            'Referrer': document.referrer || 'Diretto',
            'Risoluzione': `${screen.width}x${screen.height}`,
            'Lingua Browser': navigator.language,
            'Cookies Abilitati': navigator.cookieEnabled ? 'Sì' : 'No',
            'Connessione': navigator.onLine ? 'Online' : 'Offline'
        };

        const techInfoHTML = Object.entries(techInfo)
            .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
            .join('');

        techInfoContent.innerHTML = techInfoHTML;
    }

    // ===============================================
    // LINK POPOLARI DINAMICI
    // ===============================================
    const popularLinks = [
        { url: 'index.html', text: 'Homepage', icon: '🏠' },
        { url: 'pages/servizi.html', text: 'Servizi', icon: '💆' },
        { url: 'pages/professionisti.html', text: 'Professionisti', icon: '👥' },
        { url: 'pages/ispirazioni.html', text: 'Ispirazioni', icon: '✨' },
        { url: 'login.html', text: 'Accedi', icon: '🔐' }
    ];

    const popularLinksContainer = document.getElementById('popular-links');
    if (popularLinksContainer) {
        const linksHTML = popularLinks
            .map(link => `
                <a href="${link.url}" class="popular-link">
                    <span class="link-icon">${link.icon}</span>
                    <span class="link-text">${link.text}</span>
                </a>
            `)
            .join('');

        popularLinksContainer.innerHTML = linksHTML;
    }

    // ===============================================
    // LOGGING ERRORI PER ANALYTICS
    // ===============================================
    function logAction(action) {
        const logData = {
            timestamp: new Date().toISOString(),
            error_type: errorType,
            action: action,
            url: window.location.href,
            user_agent: navigator.userAgent,
            referrer: document.referrer
        };

        // In produzione: invia a servizio analytics
        console.log('📊 Error Page Analytics:', logData);

        // Simula invio a Google Analytics o servizio simile
        if (typeof gtag !== 'undefined') {
            gtag('event', 'error_page_interaction', {
                'error_type': errorType,
                'action': action
            });
        }
    }

    // ===============================================
    // ANIMAZIONI E EFFETTI VISUAL
    // ===============================================

    // Animazione entrata
    const errorCard = document.querySelector('.error-card');
    if (errorCard) {
        errorCard.style.opacity = '0';
        errorCard.style.transform = 'translateY(20px)';

        setTimeout(() => {
            errorCard.style.transition = 'all 0.5s ease-out';
            errorCard.style.opacity = '1';
            errorCard.style.transform = 'translateY(0)';
        }, 100);
    }

    // Hover effects sui pulsanti
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // ===============================================
    // AUTO-RELOAD PER ERRORI 500
    // ===============================================
    if (errorType === '500') {
        let autoReloadTimer = 30; // secondi
        const autoReloadElement = document.getElementById('auto-reload-timer');

        if (autoReloadElement) {
            const autoReloadInterval = setInterval(() => {
                autoReloadTimer--;
                autoReloadElement.textContent = autoReloadTimer;

                if (autoReloadTimer <= 0) {
                    clearInterval(autoReloadInterval);
                    logAction('auto_reload');
                    window.location.reload();
                }
            }, 1000);

            // Cancella auto-reload se utente interagisce
            document.addEventListener('click', () => {
                clearInterval(autoReloadInterval);
                if (autoReloadElement) {
                    autoReloadElement.textContent = 'Annullato';
                }
            });
        }
    }

    // ===============================================
    // GESTIONE KEYBOARD SHORTCUTS
    // ===============================================
    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'h':
            case 'H':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    logAction('keyboard_home');
                    window.location.href = 'index.html';
                }
                break;
            case 'r':
            case 'R':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    logAction('keyboard_reload');
                    window.location.reload();
                }
                break;
            case 'Escape':
                logAction('keyboard_back');
                window.history.back();
                break;
        }
    });

    // ===============================================
    // LOG INIZIALE ERRORE
    // ===============================================
    logAction('error_page_viewed');

    // CSS dinamico per animazioni
    const style = document.createElement('style');
    style.textContent = `
        .popular-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: 20px;
            text-decoration: none;
            color: var(--color-text);
            font-size: 14px;
            transition: all 0.3s ease;
            margin: 4px;
        }

        .popular-link:hover {
            background: var(--color-primary);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(45, 90, 61, 0.2);
        }

        .link-icon {
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);

    console.log(`✅ Errore ${errorType} - Tutto inizializzato`);
});