/* ===============================================
   RELAXPOINT - JAVASCRIPT DASHBOARD PROFESSIONISTA
   Core functionality per dashboard principale
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    initializeDashboard();
});

// ===============================================
// INIZIALIZZAZIONE DASHBOARD
// ===============================================
function initializeDashboard() {
    setupCountdownTimers();
    setupBusinessStats();
    setupAvatarUpload();
    setupNotificationSystem();

    console.log('Dashboard Professionista inizializzata correttamente');
}

// ===============================================
// COUNTDOWN TIMERS - BUSINESS CRITICAL
// ===============================================
function setupCountdownTimers() {
    // Timer per conferma prenotazioni (2h limite)
    const confirmationTimer = document.getElementById('confirmationCountdown');
    if (confirmationTimer) {
        startCountdown(confirmationTimer, 1, 47, 23); // 1h 47min 23sec
    }
}

function startCountdown(element, hours, minutes, seconds) {
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    const timer = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timer);
            element.textContent = '00:00:00';
            element.style.color = '#ef4444';
            showBusinessNotification('Tempo scaduto per conferma prenotazione', 'warning');
            return;
        }

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        element.textContent = `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        // Cambio colore quando urgente
        if (totalSeconds <= 300) { // Ultimi 5 minuti
            element.style.color = '#ef4444';
            element.parentElement.style.animation = 'urgent-pulse 1s infinite';
        } else if (totalSeconds <= 900) { // Ultimi 15 minuti
            element.style.color = '#f59e0b';
        }

        totalSeconds--;
    }, 1000);
}

// ===============================================
// BUSINESS STATS - ANIMAZIONI E AGGIORNAMENTI
// ===============================================
function setupBusinessStats() {
    animateNumbers();
    setupPerformanceHovers();
}

function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number, .performance-number');

    statNumbers.forEach(element => {
        const finalValue = element.textContent.replace(/[^\d]/g, '');
        if (finalValue && !isNaN(finalValue)) {
            animateValue(element, 0, parseInt(finalValue), 2000);
        }
    });
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const minTimer = 50;
    const stepTime = Math.abs(Math.floor(duration / range));
    const timer = stepTime < minTimer ? minTimer : stepTime;

    const startTime = new Date().getTime();
    const endTime = startTime + duration;

    function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - (remaining * range));

        // Mantieni formato originale per currency/decimali
        if (element.textContent.includes('.')) {
            element.textContent = (value / 10).toFixed(1);
        } else if (element.nextElementSibling?.textContent === 'EUR') {
            element.textContent = value.toLocaleString();
        } else {
            element.textContent = value;
        }

        if (value === end) {
            clearInterval(timer);
        }
    }

    const timer = setInterval(run, stepTime);
    run();
}

function setupPerformanceHovers() {
    const performanceItems = document.querySelectorAll('.performance-item');

    performanceItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            const icon = this.querySelector('.performance-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        item.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.performance-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// ===============================================
// UPLOAD AVATAR PROFESSIONISTA
// ===============================================
function setupAvatarUpload() {
    const avatar = document.getElementById('professionalAvatar');
    const avatarInput = document.getElementById('avatarInput');

    if (avatar && avatarInput) {
        avatar.addEventListener('click', () => {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                handleAvatarUpload(file, avatar);
            }
        });

        // Hover effect
        avatar.addEventListener('mouseenter', function () {
            this.style.opacity = '0.8';
            this.style.cursor = 'pointer';
        });

        avatar.addEventListener('mouseleave', function () {
            this.style.opacity = '1';
        });
    }
}

function handleAvatarUpload(file, avatarElement) {
    // Validazione file
    if (!file.type.startsWith('image/')) {
        showBusinessNotification('Seleziona un\'immagine valida', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
        showBusinessNotification('Immagine troppo grande (max 5MB)', 'error');
        return;
    }

    // Preview immediato
    const reader = new FileReader();
    reader.onload = function (e) {
        avatarElement.src = e.target.result;
        showBusinessNotification('Avatar aggiornato con successo', 'success');

        // In produzione: upload al server
        // uploadAvatarToServer(file);
    };
    reader.readAsDataURL(file);
}

// ===============================================
// AZIONI PRENOTAZIONI - BUSINESS LOGIC
// ===============================================
function confirmBooking(bookingId) {
    if (!bookingId) {
        showBusinessNotification('Errore: ID prenotazione mancante', 'error');
        return;
    }

    // Conferma con modale
    if (confirm('Confermi di accettare questa prenotazione?')) {
        // Simula chiamata API
        showBusinessNotification('Prenotazione confermata con successo', 'success');

        // Aggiorna UI
        updateBookingStatus(bookingId, 'confirmed');

        // In produzione: chiamata API
        // confirmBookingAPI(bookingId);
    }
}

function rejectBooking(bookingId) {
    if (!bookingId) {
        showBusinessNotification('Errore: ID prenotazione mancante', 'error');
        return;
    }

    const reason = prompt('Motivo del rifiuto (opzionale):');

    if (confirm('Sei sicuro di rifiutare questa prenotazione?')) {
        showBusinessNotification('Prenotazione rifiutata', 'info');

        // Aggiorna UI
        updateBookingStatus(bookingId, 'rejected');

        // In produzione: chiamata API
        // rejectBookingAPI(bookingId, reason);
    }
}

function updateBookingStatus(bookingId, newStatus) {
    const bookingCard = document.querySelector(`[data-booking-id="${bookingId}"]`);
    if (bookingCard) {
        const statusBadge = bookingCard.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.className = `status-badge ${newStatus}`;
            statusBadge.textContent = getStatusText(newStatus);
        }

        // Rimuovi card se rifiutata
        if (newStatus === 'rejected') {
            setTimeout(() => {
                bookingCard.style.animation = 'slideOut 0.5s ease-out';
                setTimeout(() => {
                    bookingCard.remove();
                }, 500);
            }, 2000);
        }
    }
}

function getStatusText(status) {
    const statusTexts = {
        'pending': 'Da Confermare',
        'confirmed': 'Confermata',
        'rejected': 'Rifiutata',
        'completed': 'Completata',
        'cancelled': 'Annullata'
    };
    return statusTexts[status] || status;
}

// ===============================================
// SISTEMA NOTIFICHE BUSINESS
// ===============================================
function setupNotificationSystem() {
    // Sistema notifiche già integrato con auth.js
    // Qui aggiungiamo solo le funzioni business-specific
}

function showBusinessNotification(message, type = 'info') {
    // Usa il sistema auth.js se disponibile
    if (window.auth && window.auth.showMessage) {
        window.auth.showMessage(message, type);
        return;
    }

    // Fallback sistema proprietario
    showToastNotification(message, type);
}

function showToastNotification(message, type) {
    const toast = document.createElement('div');
    toast.className = `business-toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${getToastIcon(type)}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;

    // Stili inline
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getToastColor(type),
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '9999',
        minWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        animation: 'slideInRight 0.3s ease-out'
    });

    document.body.appendChild(toast);

    // Auto-remove dopo 5 secondi
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

function getToastIcon(type) {
    const icons = {
        'success': '✓',
        'error': '✕',
        'warning': '⚠',
        'info': 'ℹ'
    };
    return icons[type] || 'ℹ';
}

function getToastColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// ===============================================
// CSS ANIMATIONS - DINAMICHE
// ===============================================
const additionalStyles = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

@keyframes slideOut {
    from { 
        opacity: 1; 
        transform: translateX(0); 
        max-height: 200px; 
    }
    to { 
        opacity: 0; 
        transform: translateX(-100%); 
        max-height: 0; 
        margin: 0;
        padding: 0;
    }
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.toast-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
}

.toast-close:hover {
    opacity: 0.8;
}
`;

// Aggiungi gli stili al documento
if (!document.querySelector('#business-dashboard-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'business-dashboard-styles';
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}

// ===============================================
// GESTIONE STATO LAST MINUTE
// ===============================================
function updateLastMinuteStatus(isActive) {
    const statusElement = document.getElementById('lastMinuteStatus');
    const toggleButton = document.querySelector('.btn-lastminute-main');

    if (statusElement) {
        if (isActive) {
            statusElement.className = 'status-online';
            statusElement.textContent = 'ONLINE';
        } else {
            statusElement.className = 'status-offline';
            statusElement.textContent = 'OFFLINE';
        }
    }

    if (toggleButton) {
        if (isActive) {
            toggleButton.textContent = 'GESTISCI LAST MINUTE';
            toggleButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        } else {
            toggleButton.textContent = 'ATTIVA LAST MINUTE';
            toggleButton.style.background = 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-dark) 100%)';
        }
    }
}

// ===============================================
// SIMULAZIONE DATI BUSINESS (DEVELOPMENT)
// ===============================================
function simulateBusinessActivity() {
    // Simula aggiornamenti real-time per sviluppo
    setInterval(() => {
        updateRandomStats();
    }, 30000); // Ogni 30 secondi

    // Simula nuove prenotazioni
    setTimeout(() => {
        simulateNewBooking();
    }, 45000); // Dopo 45 secondi
}

function updateRandomStats() {
    const performanceNumbers = document.querySelectorAll('.performance-number');

    performanceNumbers.forEach(element => {
        const currentValue = parseInt(element.textContent);
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, o +1
        const newValue = Math.max(0, currentValue + variation);

        if (variation !== 0) {
            element.textContent = newValue;
            element.style.animation = 'pulse 0.5s ease-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    });
}

function simulateNewBooking() {
    const bookingsContainer = document.querySelector('.bookings-grid');
    if (!bookingsContainer) return;

    const newBooking = createBookingElement({
        id: 'booking_' + Date.now(),
        service: 'Massaggio Rilassante',
        client: 'Anna M.',
        date: 'Oggi',
        time: '18:00',
        status: 'pending'
    });

    bookingsContainer.insertBefore(newBooking, bookingsContainer.firstChild);
    newBooking.style.animation = 'slideInLeft 0.5s ease-out';

    showBusinessNotification('Nuova prenotazione ricevuta!', 'info');
}

function createBookingElement(booking) {
    const bookingDiv = document.createElement('div');
    bookingDiv.className = 'booking-card urgent';
    bookingDiv.setAttribute('data-booking-id', booking.id);

    bookingDiv.innerHTML = `
        <div class="booking-service">
            <h3>${booking.service}</h3>
            <p class="service-client">Richiesto da: ${booking.client}</p>
            <div class="booking-date">
                <span class="date-label">${booking.date} - ${booking.time}</span>
                <span class="status-badge pending">Da Confermare</span>
            </div>
        </div>
        <div class="booking-countdown">
            <div class="countdown-container">
                <span class="countdown-label">Tempo rimasto per conferma:</span>
                <span class="countdown-time">1:59:59</span>
                <span class="countdown-note">Limite: 2 ore dalla prenotazione</span>
            </div>
        </div>
        <div class="booking-actions">
            <button class="btn-action primary" onclick="confirmBooking('${booking.id}')">Conferma</button>
            <button class="btn-action secondary" onclick="rejectBooking('${booking.id}')">Rifiuta</button>
        </div>
    `;

    return bookingDiv;
}

// ===============================================
// GESTIONE RESPONSIVE
// ===============================================
function handleResponsiveLayout() {
    const isMobile = window.innerWidth <= 768;
    const performanceGrid = document.querySelector('.performance-grid');
    const actionsGrid = document.querySelector('.actions-grid');

    if (isMobile) {
        if (performanceGrid) {
            performanceGrid.style.gridTemplateColumns = '1fr';
        }
        if (actionsGrid) {
            actionsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        }
    } else {
        if (performanceGrid) {
            performanceGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        }
        if (actionsGrid) {
            actionsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }
}

// Event listener per resize
window.addEventListener('resize', handleResponsiveLayout);

// ===============================================
// API PUBBLICHE GLOBALI
// ===============================================
window.confirmBooking = confirmBooking;
window.rejectBooking = rejectBooking;
window.updateLastMinuteStatus = updateLastMinuteStatus;
window.showBusinessNotification = showBusinessNotification;

// ===============================================
// INIZIALIZZAZIONE FINALE
// ===============================================
// Setup responsive layout iniziale
handleResponsiveLayout();

// Avvia simulazioni solo in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    simulateBusinessActivity();
}

console.log('🏢 Dashboard Professionista JavaScript caricato completamente');
console.log('📊 Funzioni disponibili:', {
    confirmBooking: typeof confirmBooking,
    rejectBooking: typeof rejectBooking,
    showBusinessNotification: typeof showBusinessNotification,
    updateLastMinuteStatus: typeof updateLastMinuteStatus
});