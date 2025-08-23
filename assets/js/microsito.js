/* ===============================================
   MICROSITO PROFESSIONISTI - JS INTEGRATO CON AUTH
   =============================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeMicrosite();
});

// Inizializzazione microsite
function initializeMicrosite() {
    setupServiceCards();
    setupIspirationGallery();
    setupCTAButtons();
    setupMobileMenu();
    setupFadeInAnimations();
    injectModalStyles();
    manageIspirations();

    // ✅ INTEGRAZIONE: Caricamento contenuto About + Setup link dinamici
    loadAboutText();
    setupDynamicLinks();

    console.log('🏠 Microsito inizializzato con integrazione auth completa');
}

// ===============================================
// INTEGRAZIONE CON AUTH.JS - FUNZIONI UNIFICATE
// ===============================================

/**
 * ✅ USA AUTH.JS - Controllo autenticazione integrato
 * Rimuove la funzione duplicata e usa window.auth.isLoggedIn
 */
function checkUserAuthenticationForBooking(callback) {
    // ✅ USA L'AUTH.JS ESISTENTE
    if (window.auth && window.auth.isLoggedIn) {
        console.log('✅ Utente autenticato (via auth.js), procedi con prenotazione');
        if (callback) callback();
        return true;
    }

    console.log('🔒 Utente non loggato, redirect a login (via auth.js)');

    // ✅ USA LE FUNZIONI AUTH.JS per gestire il returnUrl
    localStorage.setItem('returnUrl', window.location.href);

    // Mostra toast informativo
    showToast('Accedi per prenotare i servizi', 'info');

    // ✅ USA getCorrectPath dell'auth.js
    const loginUrl = window.getCorrectPath ? window.getCorrectPath('login.html') : '/login.html';

    // Redirect a login dopo breve delay
    setTimeout(() => {
        window.location.href = loginUrl;
    }, 1500);

    return false;
}

/**
 * ✅ UNICA FUNZIONE setupCTAButtons - Integrata con auth
 */
function setupCTAButtons() {
    const heroCTA = document.querySelector('.hero-cta');
    const premiumCTA = document.querySelector('.premium-cta .cta-btn');
    const bookButtons = document.querySelectorAll('[onclick*="bookService"], .btn-book, .prenota-btn');

    // Hero CTA - Scroll to servizi
    if (heroCTA) {
        heroCTA.addEventListener('click', function (e) {
            e.preventDefault();
            const serviziSection = document.querySelector('.servizi-section');
            if (serviziSection) {
                serviziSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Premium CTA - ✅ INTEGRATO: Controllo autenticazione con auth.js
    if (premiumCTA) {
        premiumCTA.addEventListener('click', function (e) {
            e.preventDefault();

            checkUserAuthenticationForBooking(() => {
                // Se loggato, scroll to servizi
                const serviziSection = document.querySelector('.servizi-section');
                if (serviziSection) {
                    serviziSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    showToast('Scegli il servizio che preferisci per prenotare', 'info');
                }
            });
        });
    }

    // ✅ INTEGRATO: Altri pulsanti prenota con controllo auth
    bookButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            checkUserAuthenticationForBooking(() => {
                // Se loggato, procedi con prenotazione originale
                const originalOnclick = this.getAttribute('onclick');
                if (originalOnclick) {
                    eval(originalOnclick);
                }
            });
        });
    });
}

// ===============================================
// SETUP SERVICE CARDS - INTEGRATO
// ===============================================

function setupServiceCards() {
    const serviceCards = document.querySelectorAll('.servizio-card');

    serviceCards.forEach(card => {
        card.addEventListener('click', function () {
            const serviceTitle = this.querySelector('.service-title')?.textContent;

            if (!serviceTitle) return;

            // ✅ INTEGRATO: Controllo auth prima di navigare
            checkUserAuthenticationForBooking(() => {
                // Se loggato, vai alla pagina trattamenti
                const serviceSlug = getServiceSlug(serviceTitle);
                const professionalId = getCurrentProfessionalId();

                const treatmentsUrl = `/pages/professionisti/servizio-trattamenti.html?servizio=${serviceSlug}&prof=${professionalId}`;

                console.log(`🔗 Navigazione autorizzata a trattamenti: ${serviceSlug}`);
                window.location.href = treatmentsUrl;
            });
        });

        // Hover effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.03)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

// ===============================================
// FUNZIONI DI SUPPORTO
// ===============================================

/**
 * Converte titolo servizio in slug per URL
 */
function getServiceSlug(serviceTitle) {
    const slugMap = {
        'Wellness Coaching': 'wellness-coaching',
        'Mindfulness & Meditazione': 'mindfulness-meditazione',
        'Coaching Nutrizionale': 'coaching-nutrizionale',
        'Trasformazione Olistica': 'trasformazione-olistica',
        'Consulenza Benessere': 'consulenza-benessere',
        'Fitness Personalizzato': 'fitness-personalizzato'
    };

    return slugMap[serviceTitle] || serviceTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

/**
 * Estrae ID professionista dall'URL o usa default
 */
function getCurrentProfessionalId() {
    const pathSegments = window.location.pathname.split('/');
    const profIndex = pathSegments.indexOf('professionisti');

    if (profIndex !== -1 && pathSegments[profIndex + 1]) {
        return pathSegments[profIndex + 1];
    }

    // Default per microsito Sophia Rossi
    return 'sophia-rossi';
}

/**
 * Setup collegamenti dinamici per tutte le sezioni
 */
function setupDynamicLinks() {
    const professionalId = getCurrentProfessionalId();

    // Aggiorna tutti i link dinamici
    const linkMappings = {
        '.corsi-view-all': `/pages/professionisti/tutti-i-corsi.html?prof=${professionalId}`,
        '.podcast-view-all': `/pages/professionisti/tutti-i-podcast.html?prof=${professionalId}`,
        '.ispirazioni-view-all': `/pages/professionisti/media.html?prof=${professionalId}`,
        '.scopri-di-piu-btn': `/pages/professionisti/about.html?prof=${professionalId}`
    };

    Object.entries(linkMappings).forEach(([selector, url]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.href = url;
        }
    });

    console.log('🔗 Collegamenti dinamici aggiornati per:', professionalId);
}

/**
 * ✅ INTEGRATO: Caricamento automatico contenuto About → Chi Sono
 */
async function loadAboutText() {
    try {
        const response = await fetch('/pages/professionisti/about.html');
        const html = await response.text();

        const parser = new DOMParser();
        const aboutDoc = parser.parseFromString(html, 'text/html');

        // Cerca specificamente la sezione "La Mia Storia"
        const myStorySection = aboutDoc.querySelector('.chi-sono-text, .about-text, .my-story-text');

        let aboutText = "Sono una Wellness Coach certificata con anni di esperienza nel guidare persone verso il loro benessere ottimale.";

        if (myStorySection) {
            aboutText = myStorySection.textContent.trim();
            // Limita il testo per il microsito (primi 500 caratteri)
            if (aboutText.length > 500) {
                aboutText = aboutText.substring(0, 500) + '...';
            }
        }

        // Inserisci il testo nella card Chi Sono del microsito
        const chiSonoTextElement = document.querySelector('.chi-sono-text');
        if (chiSonoTextElement) {
            chiSonoTextElement.innerHTML = `<p>${aboutText}</p>`;
            console.log('✅ Testo About caricato nel microsito');
        }

    } catch (error) {
        console.log('⚠️ Impossibile caricare testo About:', error);
        // Mantieni testo di default nel microsito
    }
}

// ===============================================
// GALLERY E MODALS - INVARIATE
// ===============================================

function setupIspirationGallery() {
    const inspirationImages = document.querySelectorAll('.ispirazioni-image');

    inspirationImages.forEach(image => {
        image.addEventListener('click', function () {
            const imageTitle = this.getAttribute('data-title');
            const imageSrc = this.style.backgroundImage.slice(5, -2);
            showGalleryLightbox(imageTitle, imageSrc);
        });

        // Hover animation
        image.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.02)';
        });

        image.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (mobileMenuToggle && navbarMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
        });
    }
}

function setupFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.chi-sono-section, .servizi-section, .ispirazioni-section, .certificazioni-section, .recensioni-section, .premium-cta');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ===============================================
// GESTIONE ISPIRAZIONI
// ===============================================

const MAX_ISPIRAZIONI_MICROSITO = 10;
const ISPIRAZIONI_PER_RIGA = 10;

function manageIspirations() {
    const ispirazioniContainer = document.querySelector('.ispirazioni-gallery-static');
    if (!ispirazioniContainer) return;

    const ispirazioniImages = ispirazioniContainer.querySelectorAll('.ispirazioni-image');

    if (ispirazioniImages.length > MAX_ISPIRAZIONI_MICROSITO) {
        for (let i = MAX_ISPIRAZIONI_MICROSITO; i < ispirazioniImages.length; i++) {
            ispirazioniImages[i].remove();
        }
    }

    updateGridLayout();
}

function updateGridLayout() {
    const container = document.querySelector('.ispirazioni-gallery-static');
    if (!container) return;

    const elementCount = container.querySelectorAll('.ispirazioni-image').length;
    const righe = Math.ceil(elementCount / ISPIRAZIONI_PER_RIGA);

    container.style.gridTemplateColumns = `repeat(${ISPIRAZIONI_PER_RIGA}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${righe}, 1fr)`;
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

/**
 * ✅ INTEGRATO: Toast notifications che non conflittano con auth.js
 */
function showToast(message, type = 'info') {
    // ✅ USA LA FUNZIONE AUTH.JS SE DISPONIBILE
    if (window.auth && window.auth.showMessage) {
        window.auth.showMessage(message, type);
        return;
    }

    // Fallback se auth.js non è disponibile
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;

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

    const typeColors = {
        info: '#3b82f6',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    };

    Object.assign(toast.style, toastStyles);
    toast.style.backgroundColor = typeColors[type] || typeColors.info;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 100);

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
// MODAL FUNCTIONS - SEMPLIFICATE
// ===============================================

function showGalleryLightbox(title, imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = `
        <div class="modal-overlay">
            <div class="lightbox-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="lightbox-close">&times;</button>
                </div>
                <div class="lightbox-image" style="background-image: url('${imageSrc}')"></div>
                <p style="text-align: center; margin: 16px 0; color: #666;">${title}</p>
            </div>
        </div>
    `;

    document.body.appendChild(lightbox);
    lightbox.style.display = 'flex';

    // Close handlers
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.remove();
    });

    lightbox.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === lightbox.querySelector('.modal-overlay')) {
            lightbox.remove();
        }
    });

    // ESC key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            lightbox.remove();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function injectModalStyles() {
    if (document.querySelector('#microsito-modal-styles')) return;

    const modalStyles = `
    .gallery-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
    }
    
    .lightbox-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #1a202c;
        font-size: 18px;
        font-weight: 600;
    }
    
    .lightbox-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #718096;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .lightbox-close:hover {
        color: #2d3748;
        background-color: #f7fafc;
    }
    
    .lightbox-image {
        width: 100%;
        height: 300px;
        background-color: #f7fafc;
        background-size: cover;
        background-position: center;
        border-radius: 8px;
        margin: 20px;
        width: calc(100% - 40px);
    }

    @media (max-width: 768px) {
        .lightbox-content {
            width: 95%;
            max-height: 90vh;
        }
        
        .modal-header {
            padding: 16px;
        }
        
        .modal-header h3 {
            font-size: 16px;
        }
    }`;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'microsito-modal-styles';
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
}

// ===============================================
// ✅ ESPORTAZIONE FUNZIONI GLOBALI NECESSARIE
// ===============================================
window.getCurrentProfessionalId = getCurrentProfessionalId;
window.getServiceSlug = getServiceSlug;

console.log('🔧 Microsito JS integrato con auth.js - Sistema unificato attivo');