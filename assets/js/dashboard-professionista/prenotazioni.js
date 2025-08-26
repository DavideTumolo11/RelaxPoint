/* ===============================================
   RELAXPOINT - JAVASCRIPT PRENOTAZIONI PROFESSIONISTA
   Gestisce funzionalità specifiche per prenotazioni business
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 Prenotazioni JS - Inizializzazione...');

    // Inizializzazione sistema prenotazioni
    const prenotazioniManager = new PrenotazioniManager();
    prenotazioniManager.init();

    // Rendi disponibile globalmente per debug
    window.prenotazioniManager = prenotazioniManager;

    console.log('✅ Prenotazioni JS - Caricato con successo');
    console.log('🔧 Debug disponibile: window.prenotazioniManager');
});

/* ===============================================
   CLASSE PRINCIPALE - GESTIONE PRENOTAZIONI
   =============================================== */
class PrenotazioniManager {
    constructor() {
        // Configurazione timer e intervalli
        this.countdownTimers = new Map();
        this.updateInterval = null;
        this.refreshInterval = 30000; // 30 secondi

        // Stati applicazione
        this.currentFilter = 'pending';
        this.searchTerm = '';
        this.dateFilter = '';

        // Dati prenotazioni (simulati - in produzione da API)
        this.bookingsData = this.generateMockBookings();

        // Binding dei metodi
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDateFilter = this.handleDateFilter.bind(this);
        this.updateCountdowns = this.updateCountdowns.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    /* ===============================================
       INIZIALIZZAZIONE
       =============================================== */
    init() {
        this.setupEventListeners();
        this.startCountdowns();
        this.startAutoRefresh();
        this.updateStats();
        this.filterBookings();

        console.log('✅ PrenotazioniManager inizializzato');
    }

    setupEventListeners() {
        // Filtri tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.currentTarget.getAttribute('data-filter');
                this.handleFilterChange(filter);
            });
        });

        // Ricerca
        const searchInput = document.getElementById('searchBookings');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch);
        }

        // Filtro data
        const dateInput = document.getElementById('dateFilter');
        if (dateInput) {
            dateInput.addEventListener('change', this.handleDateFilter);
        }

        // Pulsante refresh
        const refreshBtn = document.querySelector('[onclick="refreshBookings()"]');
        if (refreshBtn) {
            refreshBtn.onclick = (e) => {
                e.preventDefault();
                this.refreshData();
            };
        }

        // Filtri storico
        const historyPeriod = document.getElementById('historyPeriod');
        const historyStatus = document.getElementById('historyStatus');

        if (historyPeriod) {
            historyPeriod.addEventListener('change', () => this.filterBookings());
        }

        if (historyStatus) {
            historyStatus.addEventListener('change', () => this.filterBookings());
        }

        console.log('✅ Event listeners configurati');
    }

    /* ===============================================
       GESTIONE FILTRI
       =============================================== */
    handleFilterChange(filter) {
        // Aggiorna stato corrente
        this.currentFilter = filter;

        // Aggiorna UI tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-filter') === filter) {
                tab.classList.add('active');
            }
        });

        // Mostra/nasconde sezioni
        this.showSection(filter);

        // Aggiorna conteggi
        this.updateStats();

        console.log(`🔍 Filtro cambiato: ${filter}`);
    }

    showSection(sectionId) {
        // Nasconde tutte le sezioni
        const sections = document.querySelectorAll('.bookings-section');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Mostra sezione selezionata
        const activeSection = document.getElementById(sectionId + 'Section');
        if (activeSection) {
            activeSection.style.display = 'block';
        }

        // Gestione sezioni speciali
        this.handleSpecialSections(sectionId);
    }

    handleSpecialSections(sectionId) {
        switch (sectionId) {
            case 'pending':
                this.updatePendingBookings();
                break;
            case 'confirmed':
                this.updateConfirmedBookings();
                break;
            case 'in-progress':
                this.updateInProgressBookings();
                break;
            case 'completed':
                this.updateCompletedBookings();
                break;
            case 'history':
                this.updateHistoryBookings();
                break;
        }
    }

    handleSearch(event) {
        this.searchTerm = event.target.value.toLowerCase();
        this.filterBookings();
        console.log(`🔍 Ricerca: "${this.searchTerm}"`);
    }

    handleDateFilter(event) {
        this.dateFilter = event.target.value;
        this.filterBookings();
        console.log(`📅 Filtro data: ${this.dateFilter}`);
    }

    filterBookings() {
        // Implementa la logica di filtro per ricerca e data
        // In produzione userebbe i dati reali
        console.log('🔄 Applicando filtri...');
        this.updateStats();
    }

    /* ===============================================
       COUNTDOWN TIMERS
       =============================================== */
    startCountdowns() {
        // Avvia tutti i timer countdown
        const timers = document.querySelectorAll('[data-expires]');
        timers.forEach(timer => {
            const expiryTime = timer.getAttribute('data-expires');
            const timerId = 'timer-' + Math.random().toString(36).substr(2, 9);
            this.countdownTimers.set(timerId, {
                element: timer,
                expiry: new Date(expiryTime),
                active: true
            });
        });

        // Aggiorna ogni secondo
        this.updateInterval = setInterval(this.updateCountdowns, 1000);

        console.log(`⏰ ${this.countdownTimers.size} countdown timer avviati`);
    }

    updateCountdowns() {
        const now = new Date();

        this.countdownTimers.forEach((timer, id) => {
            if (!timer.active) return;

            const timeLeft = timer.expiry - now;

            if (timeLeft <= 0) {
                // Timer scaduto
                this.handleExpiredTimer(timer, id);
                return;
            }

            // Calcola ore, minuti, secondi
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            // Formatta display
            const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Aggiorna elemento
            const timeSpan = timer.element.querySelector('.time-remaining');
            if (timeSpan) {
                timeSpan.textContent = display;

                // Cambia colore se urgente (< 30 minuti)
                if (timeLeft < 30 * 60 * 1000) {
                    timeSpan.style.color = 'var(--color-red)';
                    timeSpan.style.animation = 'blink 1.5s infinite';
                }
            }
        });
    }

    handleExpiredTimer(timer, id) {
        timer.active = false;

        // Aggiorna UI per timer scaduto
        const timeSpan = timer.element.querySelector('.time-remaining');
        if (timeSpan) {
            timeSpan.textContent = 'SCADUTO';
            timeSpan.style.color = 'var(--color-red)';
            timeSpan.style.animation = 'blink 1.5s infinite';
        }

        // Notifica utente
        this.showNotification('Prenotazione scaduta!', 'Una prenotazione ha superato il limite di 2 ore per la conferma.', 'error');

        // Rimuovi dalla lista attiva
        this.countdownTimers.delete(id);

        console.log(`⏰ Timer ${id} scaduto`);
    }

    /* ===============================================
       AZIONI PRENOTAZIONI
       =============================================== */
    confirmBooking(bookingId) {
        console.log(`✅ Confermando prenotazione: ${bookingId}`);

        // Mostra loading
        this.showLoading();

        // Simula chiamata API
        setTimeout(() => {
            this.hideLoading();

            // Aggiorna stato prenotazione
            this.updateBookingStatus(bookingId, 'confirmed');

            // Notifica successo
            this.showNotification(
                'Prenotazione Confermata!',
                'La prenotazione è stata confermata con successo. Il cliente riceverà una notifica.',
                'success'
            );

            // Refresh dati
            this.refreshData();

        }, 1500);
    }

    rejectBooking(bookingId) {
        console.log(`❌ Rifiutando prenotazione: ${bookingId}`);

        // Conferma azione
        if (!confirm('Sei sicuro di voler rifiutare questa prenotazione?')) {
            return;
        }

        // Mostra loading
        this.showLoading();

        // Simula chiamata API
        setTimeout(() => {
            this.hideLoading();

            // Aggiorna stato prenotazione
            this.updateBookingStatus(bookingId, 'rejected');

            // Notifica
            this.showNotification(
                'Prenotazione Rifiutata',
                'La prenotazione è stata rifiutata. Il cliente riceverà una notifica.',
                'info'
            );

            // Refresh dati
            this.refreshData();

        }, 1000);
    }

    startService(bookingId) {
        console.log(`🚀 Iniziando servizio: ${bookingId}`);

        // Aggiorna stato
        this.updateBookingStatus(bookingId, 'in-progress');

        // Notifica
        this.showNotification(
            'Servizio Iniziato!',
            'Il timer del servizio è ora attivo. Buon lavoro!',
            'success'
        );

        // Avvia timer servizio
        this.startServiceTimer(bookingId);

        // Refresh dati
        this.refreshData();
    }

    confirmCompletion(bookingId) {
        console.log(`✅ Confermando completamento: ${bookingId}`);

        // Mostra form note completamento
        this.showCompletionModal(bookingId);
    }

    viewBookingDetails(bookingId) {
        console.log(`👁️ Visualizzando dettagli: ${bookingId}`);

        // In produzione aprirebbe un modal con dettagli completi
        this.showNotification(
            'Dettagli Prenotazione',
            'In produzione qui si aprirebbero i dettagli completi della prenotazione.',
            'info'
        );
    }

    openChat(bookingId) {
        console.log(`💬 Aprendo chat: ${bookingId}`);

        // In produzione aprirebbe la chat
        window.location.href = `chat.html?booking=${bookingId}`;
    }

    /* ===============================================
       GESTIONE STATI E DATI
       =============================================== */
    updateBookingStatus(bookingId, newStatus) {
        // In produzione aggiornerebbe il database
        const booking = this.bookingsData.find(b => b.id === bookingId);
        if (booking) {
            booking.status = newStatus;
            booking.lastUpdated = new Date();
        }

        console.log(`🔄 Stato prenotazione ${bookingId} aggiornato a: ${newStatus}`);
    }

    refreshData() {
        console.log('🔄 Refreshing dati prenotazioni...');

        // Mostra indicatore refresh
        const refreshBtn = document.querySelector('[onclick="refreshBookings()"]');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="animation: spin 1s linear infinite;"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg> Aggiornando...';
        }

        // Simula chiamata API
        setTimeout(() => {
            // In produzione ricaricherebbe da API
            this.updateStats();
            this.filterBookings();

            // Ripristina pulsante
            if (refreshBtn) {
                refreshBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg> Aggiorna';
            }

            this.showNotification('Dati Aggiornati', 'Le prenotazioni sono state aggiornate con successo.', 'success');

        }, 2000);
    }

    updateStats() {
        // Calcola statistiche dai dati
        const stats = this.calculateStats();

        // Aggiorna contatori
        this.updateStatElement('pendingCount', stats.pending);
        this.updateStatElement('confirmedCount', stats.confirmed);
        this.updateStatElement('todayCount', stats.today);
        this.updateStatElement('revenueWeek', `€${stats.revenue}`);

        // Aggiorna badge nei filtri
        this.updateBadgeElement('pendingBadge', stats.pending);
        this.updateBadgeElement('confirmedBadge', stats.confirmed);
        this.updateBadgeElement('inProgressBadge', stats.inProgress);
        this.updateBadgeElement('completedBadge', stats.completed);

        console.log('📊 Statistiche aggiornate:', stats);
    }

    calculateStats() {
        // Simula calcolo statistiche
        return {
            pending: Math.floor(Math.random() * 5) + 1,
            confirmed: Math.floor(Math.random() * 10) + 5,
            today: Math.floor(Math.random() * 3) + 1,
            inProgress: Math.floor(Math.random() * 2),
            completed: Math.floor(Math.random() * 3) + 1,
            revenue: Math.floor(Math.random() * 500) + 200
        };
    }

    updateStatElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;

            // Animazione numerica
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }

    updateBadgeElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;

            // Mostra/nasconde badge se valore 0
            element.style.display = value > 0 ? 'inline-block' : 'none';
        }
    }

    /* ===============================================
       AUTO-REFRESH E TIMER
       =============================================== */
    startAutoRefresh() {
        // Refresh automatico ogni 30 secondi
        setInterval(this.refreshData, this.refreshInterval);
        console.log(`🔄 Auto-refresh attivo ogni ${this.refreshInterval / 1000}s`);
    }

    startServiceTimer(bookingId) {
        // Avvia timer per servizio in corso
        console.log(`⏱️ Timer servizio avviato per: ${bookingId}`);

        // In produzione gestirebbe il timer del servizio
    }

    /* ===============================================
       AGGIORNAMENTO SEZIONI SPECIFICHE
       =============================================== */
    updatePendingBookings() {
        console.log('🔄 Aggiornando prenotazioni pendenti...');
        // In produzione aggiornerebbe la lista delle prenotazioni pending
    }

    updateConfirmedBookings() {
        console.log('🔄 Aggiornando prenotazioni confermate...');
        // In produzione aggiornerebbe la lista delle prenotazioni confermate
    }

    updateInProgressBookings() {
        console.log('🔄 Aggiornando servizi in corso...');
        // In produzione aggiornerebbe la lista dei servizi attivi
    }

    updateCompletedBookings() {
        console.log('🔄 Aggiornando completamenti...');
        // In produzione aggiornerebbe la lista dei servizi da confermare
    }

    updateHistoryBookings() {
        console.log('🔄 Aggiornando storico...');
        // In produzione aggiornerebbe lo storico con filtri
    }

    /* ===============================================
       UI HELPERS E MODALS
       =============================================== */
    showNotification(title, message, type = 'info') {
        // Sistema notifiche professionale
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Stili inline per notifica
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? 'var(--color-primary)' :
                type === 'error' ? 'var(--color-red)' :
                    'var(--color-secondary)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '9999',
            minWidth: '300px',
            maxWidth: '400px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animazione ingresso
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remove dopo 5 secondi
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);

        // Click to close
        notification.querySelector('.notification-close').onclick = () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
    }

    showLoading() {
        // Mostra overlay loading
        let loading = document.getElementById('loadingOverlay');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'loadingOverlay';
            loading.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <p>Elaborazione in corso...</p>
                </div>
            `;

            Object.assign(loading.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '10000',
                opacity: '0',
                transition: 'opacity 0.3s ease'
            });

            const content = loading.querySelector('.loading-content');
            Object.assign(content.style, {
                background: 'white',
                padding: '40px',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            });

            document.body.appendChild(loading);
        }

        loading.style.display = 'flex';
        setTimeout(() => {
            loading.style.opacity = '1';
        }, 10);
    }

    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 300);
        }
    }

    showCompletionModal(bookingId) {
        // Modal per note completamento servizio
        console.log(`📝 Modal completamento per: ${bookingId}`);

        const modal = document.createElement('div');
        modal.className = 'completion-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <h3>Conferma Completamento Servizio</h3>
                    <div class="form-group">
                        <label>Note servizio (facoltative):</label>
                        <textarea id="completionNotes" rows="3" placeholder="Aggiungi eventuali note sul servizio svolto..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Durata effettiva:</label>
                        <input type="number" id="actualDuration" value="90" min="15" max="240"> minuti
                    </div>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="window.prenotazioniManager.processCompletion('${bookingId}')">Conferma Completamento</button>
                        <button class="btn-secondary" onclick="window.prenotazioniManager.closeModal()">Annulla</button>
                    </div>
                </div>
            </div>
        `;

        // Stili modal
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10000'
        });

        document.body.appendChild(modal);
        this.currentModal = modal;
    }

    processCompletion(bookingId) {
        const notes = document.getElementById('completionNotes')?.value || '';
        const duration = document.getElementById('actualDuration')?.value || 90;

        console.log(`✅ Processando completamento ${bookingId}:`, { notes, duration });

        // Chiudi modal
        this.closeModal();

        // Aggiorna stato
        this.updateBookingStatus(bookingId, 'completed');

        // Notifica
        this.showNotification(
            'Servizio Completato!',
            'Il servizio è stato completato con successo. Il cliente può ora lasciare una recensione.',
            'success'
        );

        // Refresh
        this.refreshData();
    }

    closeModal() {
        if (this.currentModal && this.currentModal.parentNode) {
            this.currentModal.parentNode.removeChild(this.currentModal);
            this.currentModal = null;
        }
    }

    /* ===============================================
       DATI MOCK PER SVILUPPO
       =============================================== */
    generateMockBookings() {
        // Genera dati mock per sviluppo
        return [
            {
                id: 'booking-1',
                clientName: 'Maria Rossi',
                clientType: 'Premium',
                service: 'Massaggio Svedese',
                duration: 90,
                date: '2025-01-26',
                time: '15:30',
                location: 'Via Roma 123, Cagliari',
                mode: 'domicilio',
                amount: 80.00,
                status: 'pending',
                paymentStatus: 'paid',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 ore fa
                expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 min da ora
            },
            {
                id: 'booking-2',
                clientName: 'Luca Bianchi',
                clientType: 'Standard',
                service: 'Riflessologia Plantare',
                duration: 60,
                date: '2025-01-27',
                time: '18:00',
                location: 'Studio RelaxPoint',
                mode: 'studio',
                amount: 55.00,
                status: 'pending',
                paymentStatus: 'paid',
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 ora fa
                expiresAt: new Date(Date.now() + 90 * 60 * 1000) // 90 min da ora
            }
        ];
    }

    /* ===============================================
       CLEANUP E DISTRUZIONE
       =============================================== */
    destroy() {
        // Cleanup timer e intervalli
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        // Cleanup countdown timers
        this.countdownTimers.forEach(timer => {
            timer.active = false;
        });
        this.countdownTimers.clear();

        // Rimuovi event listeners
        // In produzione rimuoverebbe tutti gli event listeners

        console.log('🧹 PrenotazioniManager cleanup completato');
    }
}

/* ===============================================
   FUNZIONI GLOBALI - COMPATIBILITÀ HTML
   =============================================== */

// Funzioni chiamabili dall'HTML
function confirmBooking(bookingId) {
    if (window.prenotazioniManager) {
        window.prenotazioniManager.confirmBooking(bookingId);
    }
}

function rejectBooking(bookingId) {
    if (window.prenotazioniManager) {
        window.prenotazioniManager.rejectBooking(bookingId);
    }
}

function startService(bookingId) {
    if (window.prenotazioniManager) {
        window.prenotazioniManager.startService(bookingId);
    }
}

function confirmCompletion(bookingId) {
    if (window.prenotazioniManager) {
        window.prenotazioniManager.confirmCompletion(bookingId);
    }
}

function viewBookingDetails(bookingId) {
    if (window.prenotazioniManager) {
        window.prenotazioniManager.viewBookingDetails(bookingId);
    }
}

function openChat(bookingId) {
    if (window.prenotazioniManager) {
        window.prenotazioniManager.openChat(bookingId);
    }
}

function refreshBookings() {
    if (window.prenotazioniManager) {
        window.prenotazioniManager.refreshData();
    }
}

// Stili CSS dinamici per animazioni
const additionalStyles = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-gray-light);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

.modal-overlay {
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.modal-content {
    background: white;
    padding: 32px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-content h3 {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 24px 0;
    line-height: 1.25;
    letter-spacing: -0.015em;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 8px;
    line-height: 1.4;
}

.form-group textarea,
.form-group input {
    width: 100%;
    resize: none;
    border-radius: 8px;
    border: 1px solid var(--color-light);
    background-color: var(--color-background);
    color: var(--color-text);
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4;
    outline: none;
    transition: border-color 0.3s ease;
}

.form-group textarea:focus,
.form-group input:focus {
    border-color: var(--color-primary);
}

.form-group textarea {
    min-height: 80px;
    resize: vertical;
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 32px;
}

.modal-actions .btn-primary,
.modal-actions .btn-secondary {
    display: flex;
    min-width: 120px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 8px;
    height: 40px;
    padding: 0 20px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.015em;
    border: none;
    transition: all 0.3s ease;
    text-decoration: none;
}

.notification {
    font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
}

.notification-content {
    margin-right: 12px;
}

.notification-content strong {
    display: block;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 4px;
    line-height: 1.4;
}

.notification-content p {
    font-size: 13px;
    line-height: 1.4;
    margin: 0;
    opacity: 0.9;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.notification-close:hover {
    opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
    .modal-content {
        padding: 24px;
        margin: 20px;
    }
    
    .modal-actions {
        flex-direction: column;
    }
    
    .modal-actions .btn-primary,
    .modal-actions .btn-secondary {
        width: 100%;
    }
    
    .notification {
        right: 10px;
        left: 10px;
        min-width: auto;
        max-width: none;
    }
}
`;

// Aggiungi gli stili al documento
if (!document.querySelector('#prenotazioni-dynamic-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'prenotazioni-dynamic-styles';
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}

/* ===============================================
   ESPORTAZIONE E LOG FINALE
   =============================================== */

// Esporta funzioni per debug
window.confirmBooking = confirmBooking;
window.rejectBooking = rejectBooking;
window.startService = startService;
window.confirmCompletion = confirmCompletion;
window.viewBookingDetails = viewBookingDetails;
window.openChat = openChat;
window.refreshBookings = refreshBookings;

console.log('🔧 Prenotazioni JS - Funzioni globali esportate');
console.log('📋 Funzioni disponibili:', {
    confirmBooking,
    rejectBooking,
    startService,
    confirmCompletion,
    viewBookingDetails,
    openChat,
    refreshBookings
});
console.log('🎯 Sistema prenotazioni professionista pronto!');