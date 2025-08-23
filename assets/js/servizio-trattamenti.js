/* ===============================================
   SERVIZIO TRATTAMENTI - JAVASCRIPT COMPLETO
   Gestisce la pagina intermedia dei trattamenti
   =============================================== */

// ===============================================
// CONFIGURAZIONE E DATI
// ===============================================

// Dati servizi e professionisti (in futuro dal database)
const SERVICES_DATA = {
    'wellness-coaching': {
        name: 'Wellness Coaching',
        description: 'Coaching olistico per trasformazione personale',
        icon: `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>`,
        color: '#2d5a3d'
    },
    'mindfulness-meditazione': {
        name: 'Mindfulness e Meditazione',
        description: 'Tecniche di consapevolezza e meditazione',
        icon: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
        color: '#52a373'
    },
    'coaching-nutrizionale': {
        name: 'Coaching Nutrizionale',
        description: 'Alimentazione consapevole e benessere',
        icon: `<path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L9.7 14.7l.71.71 4.49-4.49z"/>`,
        color: '#1e3a2e'
    }
    // Altri servizi...
};

const PROFESSIONALS_DATA = {
    'sophia-rossi': {
        name: 'Sophia Rossi',
        title: 'Wellness Coach certificata',
        micrositeUrl: '/microsito.html'
    }
    // Altri professionisti...
};

// ===============================================
// INIZIALIZZAZIONE PAGINA
// ===============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('🏥 Servizio Trattamenti - JavaScript caricato');

    initializePage();
    setupFilters();
    setupTreatmentCards();
    setupBookingButtons();
});

// ===============================================
// FUNZIONI INIZIALIZZAZIONE
// ===============================================
function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceType = urlParams.get('servizio') || 'wellness-coaching';
    const professionalId = urlParams.get('prof') || 'sophia-rossi';

    console.log(`📋 Caricamento servizio: ${serviceType} per ${professionalId}`);

    updatePageContent(serviceType, professionalId);
    updateBreadcrumb(serviceType, professionalId);
}

function updatePageContent(serviceType, professionalId) {
    const service = SERVICES_DATA[serviceType];
    const professional = PROFESSIONALS_DATA[professionalId];

    if (!service || !professional) {
        console.error('⚠️ Servizio o professionista non trovato');
        return;
    }

    // Aggiorna titolo e meta description
    const pageTitle = document.getElementById('pageTitle');
    const pageDescription = document.getElementById('pageDescription');

    if (pageTitle) {
        pageTitle.textContent = `${service.name} - ${professional.name} | RelaxPoint`;
    }

    if (pageDescription) {
        pageDescription.setAttribute('content',
            `Tutti i trattamenti di ${service.name} di ${professional.name}. ${service.description} personalizzati per il tuo benessere.`);
    }

    // Aggiorna header servizio
    updateServiceHeader(service, professional);

    // Aggiorna contatori
    updateServiceStats();
}

function updateServiceHeader(service, professional) {
    const serviceIcon = document.getElementById('serviceIcon');
    const serviceTitle = document.getElementById('serviceTitle');
    const serviceDescription = document.getElementById('serviceDescription');
    const professionalName = document.getElementById('professionalName');

    if (serviceIcon && service.icon) {
        serviceIcon.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">${service.icon}</svg>`;
        serviceIcon.style.background = `linear-gradient(135deg, ${service.color} 0%, #1e3a2e 100%)`;
    }

    if (serviceTitle) {
        serviceTitle.textContent = service.name;
    }

    if (serviceDescription && professionalName) {
        professionalName.textContent = professional.name;
    }
}

function updateBreadcrumb(serviceType, professionalId) {
    const service = SERVICES_DATA[serviceType];
    const professional = PROFESSIONALS_DATA[professionalId];

    const professionalBreadcrumb = document.getElementById('professionalBreadcrumb');
    const serviceBreadcrumb = document.getElementById('serviceBreadcrumb');

    if (professionalBreadcrumb && professional) {
        professionalBreadcrumb.textContent = professional.name;
        professionalBreadcrumb.href = professional.micrositeUrl;
    }

    if (serviceBreadcrumb && service) {
        serviceBreadcrumb.textContent = service.name;
    }
}

function updateServiceStats() {
    const treatmentCards = document.querySelectorAll('.treatment-card');
    const treatmentCount = document.getElementById('treatmentCount');
    const priceFrom = document.getElementById('priceFrom');

    if (treatmentCount) {
        treatmentCount.textContent = `${treatmentCards.length} trattamenti disponibili`;
    }

    if (priceFrom && treatmentCards.length > 0) {
        // Trova il prezzo più basso
        let minPrice = Infinity;
        treatmentCards.forEach(card => {
            const price = parseInt(card.dataset.price) || 0;
            if (price > 0 && price < minPrice) {
                minPrice = price;
            }
        });

        if (minPrice !== Infinity) {
            priceFrom.textContent = `€${minPrice}`;
        }
    }
}

// ===============================================
// SISTEMA FILTRI
// ===============================================
function setupFilters() {
    const sortSelect = document.getElementById('sortTreatments');
    const priceSelect = document.getElementById('filterPrice');
    const durationSelect = document.getElementById('filterDuration');

    if (sortSelect) {
        sortSelect.addEventListener('change', applySortFilter);
    }

    if (priceSelect) {
        priceSelect.addEventListener('change', applyFilters);
    }

    if (durationSelect) {
        durationSelect.addEventListener('change', applyFilters);
    }
}

function applySortFilter() {
    const sortValue = document.getElementById('sortTreatments').value;
    const container = document.getElementById('treatmentsGrid');
    const cards = Array.from(container.querySelectorAll('.treatment-card'));

    cards.sort((a, b) => {
        switch (sortValue) {
            case 'name':
                const nameA = a.querySelector('.treatment-name').textContent;
                const nameB = b.querySelector('.treatment-name').textContent;
                return nameA.localeCompare(nameB);

            case 'price-asc':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);

            case 'price-desc':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);

            case 'duration-asc':
                return parseInt(a.dataset.duration) - parseInt(b.dataset.duration);

            case 'duration-desc':
                return parseInt(b.dataset.duration) - parseInt(a.dataset.duration);

            default:
                return 0;
        }
    });

    // Riordina nel DOM
    cards.forEach(card => container.appendChild(card));

    console.log(`🔄 Ordinamento applicato: ${sortValue}`);
}

function applyFilters() {
    const priceFilter = document.getElementById('filterPrice').value;
    const durationFilter = document.getElementById('filterDuration').value;
    const cards = document.querySelectorAll('.treatment-card');

    let visibleCount = 0;

    cards.forEach(card => {
        let show = true;

        // Filtro prezzo
        if (priceFilter && show) {
            const price = parseInt(card.dataset.price);

            switch (priceFilter) {
                case '0-50':
                    show = price <= 50;
                    break;
                case '51-100':
                    show = price >= 51 && price <= 100;
                    break;
                case '101-150':
                    show = price >= 101 && price <= 150;
                    break;
                case '151+':
                    show = price >= 151;
                    break;
            }
        }

        // Filtro durata
        if (durationFilter && show) {
            const duration = parseInt(card.dataset.duration);

            switch (durationFilter) {
                case '30':
                    show = duration <= 30;
                    break;
                case '60':
                    show = duration <= 60;
                    break;
                case '90':
                    show = duration <= 90;
                    break;
                case '120':
                    show = duration >= 120;
                    break;
            }
        }

        // Mostra/nascondi card con animazione
        if (show) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            visibleCount++;
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    console.log(`🔍 Filtri applicati: ${visibleCount} trattamenti visibili`);
}

// ===============================================
// GESTIONE CARD TRATTAMENTI
// ===============================================
function setupTreatmentCards() {
    const treatmentCards = document.querySelectorAll('.treatment-card');

    treatmentCards.forEach(card => {
        // Click sulla card (eccetto pulsante prenota)
        card.addEventListener('click', function (e) {
            // Se il click è sul pulsante, non gestire il click della card
            if (e.target.closest('.btn-book-treatment')) {
                return;
            }

            const treatmentId = this.dataset.treatment;
            const urlParams = new URLSearchParams(window.location.search);
            const professionalId = urlParams.get('prof') || 'sophia-rossi';

            // Vai alla pagina servizio-template
            const templateUrl = `/pages/servizi/servizio-template.html?trattamento=${treatmentId}&prof=${professionalId}`;
            window.location.href = templateUrl;
        });

        // Hover effects avanzati
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        });
    });
}

// ===============================================
// SISTEMA PRENOTAZIONI
// ===============================================
function setupBookingButtons() {
    const bookingButtons = document.querySelectorAll('.btn-book-treatment');

    bookingButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation(); // Previeni il click sulla card

            const treatmentCard = this.closest('.treatment-card');
            const treatmentId = treatmentCard.dataset.treatment;
            const treatmentName = treatmentCard.querySelector('.treatment-name').textContent;

            console.log(`📅 Prenotazione trattamento: ${treatmentName} (ID: ${treatmentId})`);

            // Animazione click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Redirect a prenotazione
            bookTreatment(treatmentId);
        });
    });
}

function bookTreatment(treatmentId, professionalId = null) {
    const urlParams = new URLSearchParams(window.location.search);
    const prof = professionalId || urlParams.get('prof') || 'sophia-rossi';

    // Controlla se utente è loggato
    if (!window.auth || !window.auth.isLoggedIn) {
        console.log('🔒 Utente non loggato - redirect a login');

        // Salva URL di ritorno
        const returnUrl = `/pages/servizi/servizio-template.html?trattamento=${treatmentId}&prof=${prof}`;
        localStorage.setItem('returnUrl', returnUrl);

        // Toast informativo
        showToast('Accedi per prenotare questo trattamento', 'info');

        // Redirect a login dopo breve delay
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500);

        return;
    }

    // Se loggato, vai direttamente al servizio-template
    const templateUrl = `/pages/servizi/servizio-template.html?trattamento=${treatmentId}&prof=${prof}`;
    window.location.href = templateUrl;
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================
function showToast(message, type = 'info') {
    // Rimuovi toast esistenti
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Crea nuovo toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;

    // Stili inline
    const toastStyles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '10000',
        transition: 'all 0.3s ease',
        transform: 'translateX(100%)',
        opacity: '0',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    };

    // Colori per tipo
    const typeColors = {
        info: '#3b82f6',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    };

    Object.assign(toast.style, toastStyles);
    toast.style.backgroundColor = typeColors[type] || typeColors.info;

    document.body.appendChild(toast);

    // Animazione entrata
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 100);

    // Rimozione automatica
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 4000);
}

// ===============================================
// ESPOSIZIONE GLOBALE FUNZIONI
// ===============================================
window.bookTreatment = bookTreatment;
window.showToast = showToast;

// ===============================================
// DEBUG E LOGGING
// ===============================================
console.log('✅ Servizio Trattamenti - JavaScript inizializzato correttamente');
console.log('🔧 Funzioni disponibili: bookTreatment(), showToast()');
console.log('📊 Servizi configurati:', Object.keys(SERVICES_DATA).length);
console.log('👥 Professionisti configurati:', Object.keys(PROFESSIONALS_DATA).length);