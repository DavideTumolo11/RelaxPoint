/* ===============================================
   RELAXPOINT - JS DASHBOARD CLIENTE
   Integrato con il sistema esistente
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('🏠 Dashboard Cliente RelaxPoint inizializzata');

    // ===============================================
    // STATO GLOBALE DASHBOARD
    // ===============================================
    const dashboardState = {
        currentSection: 'dashboard',
        user: {
            name: 'Chiara',
            avatar: '../assets/images/users/Leonardo_Lightning_XL_A_hyperrealistic_frontfacing_portrait_of_0.jpg',
            isPremium: true
        },
        nextBooking: {
            countdown: null,
            timer: null
        }
    };

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const elements = {
        // Menu navigazione
        menuItems: document.querySelectorAll('.menu-item'),
        sections: document.querySelectorAll('.content-section'),

        // User info
        userName: document.getElementById('userName'),
        userAvatar: document.getElementById('userAvatar'),
        avatarInput: document.getElementById('avatarInput'),

        // Actions
        lastMinuteBtn: document.getElementById('lastMinuteBtn'),
        nuovaPrenotazioneBtn: document.getElementById('nuovaPrenotazioneBtn'),

        // Content
        nextBookingCountdown: document.getElementById('nextBookingCountdown'),
        actionCards: document.querySelectorAll('.action-item'), // CORRETTO: actionItems -> actionCards per coerenza con l'uso, o viceversa
        actionBtns: document.querySelectorAll('.btn-action'),
        viewBtns: document.querySelectorAll('.btn-view'), // NON UTILIZZATO nel codice fornito
        exploreBtn: document.querySelector('.btn-explore'), // NON UTILIZZATO nel codice fornito
        viewAllBtns: document.querySelectorAll('.view-all-btn'), // CORRETTO: Sintassi e posizionamento
        repeatBtns: document.querySelectorAll('.btn-repeat') // CORRETTO: Posizionamento
    };

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        setupNavigation();
        setupUserData();
        setupActions();
        setupCountdown();
        setupAvatarUpload(); // Chiama ancora per l'input change

        console.log('✅ Dashboard inizializzata completamente');
    }

    // ===============================================
    // NAVIGAZIONE MENU
    // ===============================================
    function setupNavigation() {
        elements.menuItems.forEach(item => {
            // Skip logout item
            if (item.classList.contains('logout')) return;

            item.addEventListener('click', function (e) {
                e.preventDefault();

                const targetSection = this.getAttribute('data-section');
                if (targetSection) {
                    switchSection(targetSection);
                    updateActiveMenuItem(this);
                }
            });
        });

        // View All buttons navigation
        if (elements.viewAllBtns) { // Aggiunto controllo per sicurezza
            elements.viewAllBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    const targetSection = this.getAttribute('data-section');
                    if (targetSection) {
                        switchSection(targetSection);
                        updateActiveMenuItem(document.querySelector(`.menu-item[data-section="${targetSection}"]`));
                    }
                });
            });
        }
    }

    function switchSection(sectionName) {
        // Nascondi tutte le sezioni
        elements.sections.forEach(section => {
            section.classList.remove('active');
        });

        // Mostra la sezione target
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            dashboardState.currentSection = sectionName;

            console.log(`📄 Sezione attiva: ${sectionName}`);

            // Trigger eventi specifici per sezione
            onSectionChange(sectionName);
        }
    }

    function updateActiveMenuItem(activeItem) {
        if (!activeItem) return; // Evita errori se l'elemento non viene trovato
        elements.menuItems.forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    function onSectionChange(sectionName) {
        // Azioni specifiche per ogni sezione
        switch (sectionName) {
            case 'prenotazioni':
                showNotification('Caricamento prenotazioni...', 'info');
                break;
            case 'pagamenti':
                showNotification('Caricamento storico pagamenti...', 'info');
                break;
            case 'recensioni':
                showNotification('Caricamento recensioni...', 'info');
                break;
            case 'preferiti':
                showNotification('Caricamento professionisti preferiti...', 'info');
                break;
            case 'profilo':
                showNotification('Caricamento dati profilo...', 'info');
                break;
            case 'notifiche':
                showNotification('Caricamento notifiche...', 'info');
                break;
            case 'impostazioni':
                showNotification('Caricamento impostazioni...', 'info');
                break;
        }
    }

    // ===============================================
    // GESTIONE DATI UTENTE
    // ===============================================
    function setupUserData() {
        // Aggiorna nome utente
        if (elements.userName) {
            elements.userName.textContent = dashboardState.user.name;
        }

        // Aggiorna avatar
        if (elements.userAvatar && dashboardState.user.avatar) {
            elements.userAvatar.src = dashboardState.user.avatar;
            elements.userAvatar.alt = `Avatar di ${dashboardState.user.name}`;
        }
    }

    function setupAvatarUpload() {
        if (elements.avatarInput) { // Rimosso elements.userAvatar dal check qui per evitare listener duplicati
            // Il click sull'avatar è gestito in setupAdvancedInteractions per il doppio click
            // Manteniamo solo il listener per il change dell'input file
            elements.avatarInput.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        if (elements.userAvatar) { // Check se userAvatar esiste prima di modificarlo
                            elements.userAvatar.src = e.target.result;
                        }
                        dashboardState.user.avatar = e.target.result;
                        showNotification('Avatar aggiornato con successo!', 'success');
                    };
                    reader.readAsDataURL(file);
                } else {
                    showNotification('Seleziona un file immagine valido', 'error');
                }
            });
        }
    }

    // ===============================================
    // AZIONI E BUTTONS
    // ===============================================
    function setupActions() {
        // Last Minute button
        if (elements.lastMinuteBtn) {
            elements.lastMinuteBtn.addEventListener('click', function () {
                console.log('🚨 Last Minute cliccato');
                showNotification('Caricamento servizi Last Minute...', 'info');

                setTimeout(() => {
                    window.location.href = '../pages/last-minute.html';
                }, 1000);
            });
        }

        // Nuova Prenotazione button (header)
        if (elements.nuovaPrenotazioneBtn) {
            elements.nuovaPrenotazioneBtn.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('📅 Nuova prenotazione cliccata');
                showNotification('Reindirizzamento a servizi...', 'info');

                setTimeout(() => {
                    window.location.href = '../pages/servizi.html';
                }, 800);
            });
        }

        // Action cards
        if (elements.actionCards) { // Aggiunto controllo
            elements.actionCards.forEach(card => {
                card.addEventListener('click', function () {
                    const action = this.getAttribute('data-action');
                    handleActionCard(action);
                });
            });
        }

        // Booking actions
        if (elements.actionBtns) { // Aggiunto controllo
            elements.actionBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    const action = this.textContent.toLowerCase().trim(); // Aggiunto trim() per sicurezza
                    console.log(`📋 Azione prenotazione: ${action}`);

                    if (action.includes('contatta')) {
                        showNotification('Apertura chat con il professionista...', 'info');
                    } else if (action.includes('modifica')) {
                        showNotification('Apertura modifica prenotazione...', 'info');
                        setTimeout(() => {
                            switchSection('prenotazioni');
                            updateActiveMenuItem(document.querySelector('.menu-item[data-section="prenotazioni"]'));
                        }, 1000);
                    }
                });
            });
        }

        // Repeat buttons
        if (elements.repeatBtns) { // Aggiunto controllo
            elements.repeatBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    console.log('👁️ Visualizza prenotazione');
                    showNotification('Apertura dettagli prenotazione...', 'info');
                });
            });
        }
    }

    function handleActionCard(action) {
        console.log(`⚡ Azione rapida: ${action}`);

        switch (action) {
            case 'prenota':
                showNotification('Apertura pagina prenotazioni...', 'info');
                setTimeout(() => {
                    window.location.href = '../pages/servizi.html';
                }, 800);
                break;

            case 'last-minute':
                showNotification('Caricamento servizi Last Minute...', 'info');
                setTimeout(() => {
                    window.location.href = '../pages/last-minute.html';
                }, 800);
                break;

            case 'supporto':
                showNotification('Apertura supporto clienti...', 'info');
                setTimeout(() => {
                    window.open('mailto:supporto@relaxpoint.it?subject=Richiesta supporto', '_blank');
                }, 800);
                break;

            case 'recensioni':
                switchSection('recensioni');
                updateActiveMenuItem(document.querySelector('.menu-item[data-section="recensioni"]'));
                break;

            default:
                showNotification('Funzione in sviluppo', 'info');
        }
    }

    // ===============================================
    // COUNTDOWN PROSSIMA PRENOTAZIONE
    // ===============================================
    function setupCountdown() {
        if (!elements.nextBookingCountdown) return;

        // Data target: tra 25 ore (domani alle 16:00)
        const targetDate = new Date();
        targetDate.setTime(targetDate.getTime() + (25 * 60 * 60 * 1000)); // 25 ore da ora

        dashboardState.nextBooking.countdown = targetDate;

        // Avvia countdown
        updateCountdown();
        dashboardState.nextBooking.timer = setInterval(updateCountdown, 1000);

        console.log('⏰ Countdown impostato per:', targetDate.toLocaleString('it-IT'));
    }

    function updateCountdown() {
        if (!dashboardState.nextBooking.countdown || !elements.nextBookingCountdown) return;

        const now = new Date();
        const timeLeft = dashboardState.nextBooking.countdown - now;

        if (timeLeft <= 0) {
            elements.nextBookingCountdown.textContent = "È ora!";
            clearInterval(dashboardState.nextBooking.timer);
            dashboardState.nextBooking.timer = null; // Resetta il timer
            showNotification('È ora della tua prenotazione!', 'success');
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        elements.nextBookingCountdown.textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // ===============================================
    // NOTIFICHE SISTEMA
    // ===============================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        // Per una migliore manutenibilità, considera di spostare questi stili in un file CSS
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        // Aggiungi icona
        const icon = getNotificationIcon(type);
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">${icon}</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animazione entrata
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100); // Piccolo delay per permettere il rendering iniziale con opacity 0

        // Rimozione automatica
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) { // Verifica che l'elemento esista ancora prima di rimuoverlo
                    notification.remove();
                }
            }, 300); // Tempo per l'animazione di uscita
        }, 3000); // Durata della notifica visibile
    }

    function getNotificationColor(type) {
        const colors = {
            success: 'var(--color-primary)', // Assicurati che queste variabili CSS siano definite
            error: '#ef4444',
            warning: '#f59e0b',
            info: 'var(--color-secondary)' // Assicurati che queste variabili CSS siano definite
        };
        return colors[type] || colors.info;
    }

    function getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // ===============================================
    // GESTIONE RESPONSIVE
    // ===============================================
    function setupResponsive() {
        // Mobile menu toggle se necessario
        if (window.innerWidth <= 1024) {
            // La sidebar diventa orizzontale su tablet/mobile
            console.log('📱 Layout responsive attivo');
        }

        // Gestione resize
        window.addEventListener('resize', function () {
            adaptMobileLayout(); // Chiamala sempre al resize per adattare se necessario
        });
        adaptMobileLayout(); // Chiamala anche all'inizio
    }

    function adaptMobileLayout() {
        if (window.innerWidth <= 768) {
            // Adatta layout per mobile
            console.log('📱 Adattamento layout mobile per <= 768px');
        } else {
            console.log('🖥️ Layout desktop o tablet > 768px');
        }
        // Aggiungi qui la logica specifica per l'adattamento
    }

    // ===============================================
    // GESTIONE EVENTI GLOBALI
    // ===============================================
    function setupGlobalEvents() {
        // Gestione visibilità tab
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden && dashboardState.currentSection === 'dashboard') {
                // Riprendi countdown quando tab diventa visibile
                if (!dashboardState.nextBooking.timer && dashboardState.nextBooking.countdown && dashboardState.nextBooking.countdown > new Date()) {
                    setupCountdown(); // O solo riavvia il timer se la data è ancora valida
                }
            } else if (document.hidden && dashboardState.nextBooking.timer) {
                // Considera se mettere in pausa il timer quando il tab non è visibile per risparmiare risorse
                // clearInterval(dashboardState.nextBooking.timer);
                // dashboardState.nextBooking.timer = null;
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function (e) {
            // Ctrl/Cmd + numero per navigazione rapida
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '8') {
                e.preventDefault();
                const shortcuts = [
                    'dashboard', 'prenotazioni', 'pagamenti', 'recensioni',
                    'preferiti', 'profilo', 'notifiche', 'impostazioni'
                ];
                const index = parseInt(e.key) - 1;
                if (shortcuts[index]) {
                    switchSection(shortcuts[index]);
                    updateActiveMenuItem(document.querySelector(`.menu-item[data-section="${shortcuts[index]}"]`));
                    showNotification(`Sezione ${shortcuts[index]} attivata`, 'info');
                }
            }

            // ESC per tornare alla dashboard
            if (e.key === 'Escape' && dashboardState.currentSection !== 'dashboard') {
                switchSection('dashboard');
                updateActiveMenuItem(document.querySelector('.menu-item[data-section="dashboard"]'));
            }
        });
    }

    // ===============================================
    // SIMULAZIONE DATI REAL-TIME
    // ===============================================
    function simulateRealTimeUpdates() {
        // Simula aggiornamenti ogni 30 secondi
        setInterval(() => {
            if (Math.random() > 0.8) { // 20% probabilità
                const messages = [
                    'Nuovo messaggio dal tuo professionista',
                    'Promemoria: prenotazione domani alle 16:00',
                    'Nuova offerta Last Minute disponibile',
                    'Recensione completata con successo'
                ];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                showNotification(randomMessage, 'info');
            }
        }, 30000);
    }

    // ===============================================
    // INTERAZIONI AVANZATE
    // ===============================================
    function setupAdvancedInteractions() {
        // Hover effects per le cards
        if (elements.actionCards) { // Aggiunto controllo
            elements.actionCards.forEach(card => {
                card.addEventListener('mouseenter', function () {
                    this.style.transform = 'translateY(-4px)';
                    this.style.transition = 'transform 0.2s ease-out'; // Aggiunta transizione per fluidità
                });

                card.addEventListener('mouseleave', function () {
                    this.style.transform = 'translateY(0)';
                });
            });
        }

        // Double click su avatar per upload rapido
        if (elements.userAvatar && elements.avatarInput) {
            let clickTimeout = null; // Spostato qui per essere accessibile da entrambi i listener
            elements.userAvatar.addEventListener('click', function () {
                if (clickTimeout) { // Se clickTimeout è già impostato, è un doppio click
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                    // Double click
                    console.log('Avatar double clicked');
                    if (elements.avatarInput) elements.avatarInput.click();
                } else {
                    // Imposta un timeout per il singolo click
                    clickTimeout = setTimeout(() => {
                        clickTimeout = null;
                        // Single click - mostra tooltip o altra azione
                        console.log('Avatar single clicked');
                        showNotification('Doppio click per cambiare avatar, trascina per aggiornare', 'info');
                    }, 300); // Tempo di attesa per distinguere doppio click
                }
            });
        }

        // Drag & Drop per avatar
        if (elements.userAvatar && elements.avatarInput) { // Aggiunto check avatarInput per sicurezza
            elements.userAvatar.addEventListener('dragover', function (e) {
                e.preventDefault();
                this.style.opacity = '0.7';
            });

            elements.userAvatar.addEventListener('dragleave', function (e) {
                this.style.opacity = '1';
            });

            elements.userAvatar.addEventListener('drop', function (e) {
                e.preventDefault();
                this.style.opacity = '1';

                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => { // Usato arrow function per mantenere 'this' se necessario
                        elements.userAvatar.src = event.target.result;
                        dashboardState.user.avatar = event.target.result; // Aggiorna anche lo stato
                        showNotification('Avatar aggiornato tramite drag & drop!', 'success');
                    };
                    reader.readAsDataURL(files[0]);
                } else {
                    showNotification('Trascina un file immagine valido.', 'error');
                }
            });
        }
    }

    // ===============================================
    // GESTIONE ERRORI E CLEANUP
    // ===============================================
    function setupErrorHandling() {
        window.addEventListener('error', function (e) {
            console.error('Errore Dashboard:', e.error, e.message, e.filename, e.lineno);
            showNotification('Si è verificato un errore imprevisto. Ricarica la pagina o contatta il supporto.', 'error');
        });

        window.addEventListener('unhandledrejection', function (event) {
            console.error('Unhandled promise rejection:', event.reason);
            showNotification('Operazione asincrona fallita. Controlla la console.', 'error');
        });

        // Cleanup quando si lascia la pagina
        window.addEventListener('beforeunload', function () {
            if (dashboardState.nextBooking.timer) {
                clearInterval(dashboardState.nextBooking.timer);
                dashboardState.nextBooking.timer = null;
            }
            // Qui potresti voler fare altre operazioni di cleanup, come salvare lo stato
        });
    }

    // ===============================================
    // FUNZIONI UTILITY
    // ===============================================
    function formatTime(date) {
        if (!(date instanceof Date)) date = new Date(date); // Assicura che sia un oggetto Date
        return date.toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatDate(date) {
        if (!(date instanceof Date)) date = new Date(date); // Assicura che sia un oggetto Date
        return date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // ===============================================
    // INIZIALIZZAZIONE COMPLETA
    // ===============================================
    init();
    setupResponsive();
    setupGlobalEvents();
    setupAdvancedInteractions();
    setupErrorHandling();
    simulateRealTimeUpdates();

    // Debug info
    console.log('🎯 Dashboard State:', JSON.parse(JSON.stringify(dashboardState))); // Deep copy per evitare modifiche accidentali via console
    console.log('📱 Mobile view (<=768px):', window.innerWidth <= 768);
    console.log('🚀 RelaxPoint Dashboard pronta!');

    // Export per debugging (solo development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.DashboardDebug = {
            state: dashboardState,
            switchSection: switchSection,
            showNotification: showNotification,
            elements: elements
        };
        console.log('🧪 Debug tools disponibili: window.DashboardDebug');
    }

});