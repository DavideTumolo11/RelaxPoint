/* ===============================================
   RELAXPOINT - JAVASCRIPT DASHBOARD PROFESSIONISTA
   Gestisce tutte le funzionalità business del professionista
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard professionista caricato');

    // Inizializza tutte le funzionalità
    init();
});

// Oggetto principale per gestire la dashboard
const DashboardProfessionista = {
    init() {
        this.setupCountdowns();
        this.setupFileUploads();
        this.setupFormValidation();
        this.setupNotifications();
        this.setupAutoSave();
        console.log('Dashboard professionista inizializzato');
    },

    // ===============================================
    // COUNTDOWN TIMER PER CONFERME PRENOTAZIONI
    // ===============================================
    setupCountdowns() {
        const countdownElements = document.querySelectorAll('[id*="Countdown"]');

        countdownElements.forEach(element => {
            this.updateCountdown(element);
            setInterval(() => this.updateCountdown(element), 1000);
        });
    },

    updateCountdown(element) {
        if (!element) return;

        // Simula un countdown di 2 ore
        const now = new Date().getTime();
        const expiry = now + (2 * 60 * 60 * 1000) - (Math.random() * 30 * 60 * 1000);
        const distance = expiry - now;

        if (distance > 0) {
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            element.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Cambia colore se urgente
            if (distance < 30 * 60 * 1000) { // meno di 30 minuti
                element.style.color = '#ef4444';
            }
        } else {
            element.textContent = 'SCADUTO';
            element.style.color = '#ef4444';
        }
    },

    // ===============================================
    // GESTIONE FILE UPLOAD
    // ===============================================
    setupFileUploads() {
        const avatarInput = document.getElementById('avatarInput');
        const professionalAvatar = document.getElementById('professionalAvatar');

        if (professionalAvatar && avatarInput) {
            professionalAvatar.addEventListener('click', () => {
                avatarInput.click();
            });

            avatarInput.addEventListener('change', (event) => {
                this.handleAvatarUpload(event, professionalAvatar);
            });
        }
    },

    handleAvatarUpload(event, avatarElement) {
        const file = event.target.files[0];

        if (!file) return;

        // Validazione file
        if (!file.type.startsWith('image/')) {
            this.showNotification('Seleziona un file immagine valido', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            this.showNotification('Il file è troppo grande. Massimo 5MB', 'error');
            return;
        }

        // Preview immagine
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarElement.src = e.target.result;
            this.showNotification('Immagine caricata con successo', 'success');
        };
        reader.readAsDataURL(file);
    },

    // ===============================================
    // VALIDAZIONE FORM
    // ===============================================
    setupFormValidation() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    },

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Campo obbligatorio');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    },

    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';

        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('field-error')) {
            errorElement = document.createElement('div');
            errorElement.classList.add('field-error');
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }

        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '4px';
    },

    clearFieldError(field) {
        field.style.borderColor = '';

        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('field-error')) {
            errorElement.remove();
        }
    },

    // ===============================================
    // SISTEMA NOTIFICHE
    // ===============================================
    setupNotifications() {
        console.log('Sistema notifiche inizializzato');
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${this.escapeHtml(message)}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: this.getNotificationColor(type),
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '9999',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease'
        });

        document.body.appendChild(notification);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));

        setTimeout(() => this.removeNotification(notification), 4000);
    },

    getNotificationColor(type) {
        const colors = {
            success: '#16a34a',
            error: '#dc2626',
            warning: '#d97706',
            info: '#2563eb'
        };
        return colors[type] || colors.info;
    },

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    },

    // ===============================================
    // AUTO-SAVE E DATA MANAGEMENT
    // ===============================================
    setupAutoSave() {
        setInterval(() => {
            this.autoSave();
        }, 30000); // Ogni 30 secondi

        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    },

    autoSave() {
        // Simula salvataggio automatico
        const saveStatus = document.getElementById('saveStatus');
        if (saveStatus) {
            saveStatus.textContent = 'Salvato automaticamente ' + new Date().toLocaleTimeString();
            saveStatus.style.color = '#16a34a';
        }
    },

    hasUnsavedChanges() {
        // Simula controllo modifiche non salvate
        return false;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ===============================================
// FUNZIONI GLOBALI - ACCESSIBILI DA HTML
// ===============================================

function confirmBooking(bookingId) {
    console.log('Confermando prenotazione:', bookingId);
    DashboardProfessionista.showNotification('Prenotazione confermata con successo', 'success');
}

function rejectBooking(bookingId) {
    console.log('Rifiutando prenotazione:', bookingId);

    if (confirm('Sei sicuro di voler rifiutare questa prenotazione?')) {
        DashboardProfessionista.showNotification('Prenotazione rifiutata', 'info');
    }
}

function refreshBookings() {
    console.log('Aggiornando prenotazioni');
    DashboardProfessionista.showNotification('Prenotazioni aggiornate', 'info');
}

// Inizializzazione
function init() {
    DashboardProfessionista.init();
}

// ===============================================
// ESPORTAZIONE FUNZIONI GLOBALI
// ===============================================
window.DashboardProfessionista = DashboardProfessionista;
window.confirmBooking = confirmBooking;
window.rejectBooking = rejectBooking;
window.refreshBookings = refreshBookings;

// Aggiungi stili CSS per notifiche
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;

document.head.appendChild(notificationStyles);

console.log('Dashboard professionista completamente caricato');