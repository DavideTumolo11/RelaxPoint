/* ===============================================
   MICROSITO PROFESSIONISTI - JS
   =============================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeMicrosite();
});

// Inizializzazione microsite
function initializeMicrosite() {
    setupServiceCards();
    setupPortfolioCards();
    setupCTAButtons();
    setupMobileMenu();
    setupScrollEffects();
}

// Setup Service Cards
function setupServiceCards() {
    const serviceCards = document.querySelectorAll('.servizio-card');

    serviceCards.forEach(card => {
        card.addEventListener('click', function () {
            const serviceTitle = this.querySelector('.service-title').textContent;
            const servicePrice = this.querySelector('.service-price').textContent;

            // Simula apertura modale prenotazione
            showBookingModal(serviceTitle, servicePrice);
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

// Setup Portfolio Cards
function setupPortfolioCards() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioCards.forEach(card => {
        card.addEventListener('click', function () {
            const portfolioTitle = this.querySelector('.service-title').textContent;

            // Simula apertura lightbox portfolio
            showPortfolioLightbox(portfolioTitle);
        });
    });
}

// Setup CTA Buttons
function setupCTAButtons() {
    const heroCTA = document.querySelector('.hero-cta');
    const premiumCTA = document.querySelector('.premium-cta .cta-btn');

    if (heroCTA) {
        heroCTA.addEventListener('click', function () {
            // Scroll to servizi section
            const serviziSection = document.querySelector('.servizi-section');
            if (serviziSection) {
                serviziSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (premiumCTA) {
        premiumCTA.addEventListener('click', function (e) {
            e.preventDefault();
            showToast('Reindirizzamento a pagina Premium', 'info');
            // In produzione: window.location.href = '../premium.html';
        });
    }
}

// Setup Mobile Menu (eredita da header base)
function setupMobileMenu() {
    // Mobile menu toggle se presente
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (mobileMenuToggle && navbarMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
        });
    }
}

// Setup Scroll Effects
function setupScrollEffects() {
    // Parallax effect per hero section
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');

        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // Fade in animation per sezioni
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

    // Osserva tutte le sezioni
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Mostra modal prenotazione
function showBookingModal(serviceTitle, servicePrice) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Prenota: ${serviceTitle}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Prezzo:</strong> ${servicePrice}</p>
                    <p><strong>Professionista:</strong> Sophia Rossi</p>
                    <p>Seleziona data e ora per la tua sessione di wellness coaching.</p>
                    <div class="booking-form">
                        <input type="date" class="booking-date" min="${getTomorrowDate()}">
                        <select class="booking-time">
                            <option value="">Seleziona orario</option>
                            <option value="09:00">09:00</option>
                            <option value="10:30">10:30</option>
                            <option value="14:00">14:00</option>
                            <option value="15:30">15:30</option>
                            <option value="17:00">17:00</option>
                        </select>
                        <button class="booking-confirm">Prenota Ora</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Close modal handlers
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            modal.remove();
        }
    });

    // Booking confirm handler
    modal.querySelector('.booking-confirm').addEventListener('click', () => {
        const date = modal.querySelector('.booking-date').value;
        const time = modal.querySelector('.booking-time').value;

        if (date && time) {
            showToast(`Prenotazione confermata per ${date} alle ${time}`, 'success');
            modal.remove();
        } else {
            showToast('Seleziona data e orario', 'error');
        }
    });
}

// Mostra lightbox portfolio
function showPortfolioLightbox(portfolioTitle) {
    const lightbox = document.createElement('div');
    lightbox.className = 'portfolio-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay">
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <h3>${portfolioTitle}</h3>
                <div class="lightbox-image"></div>
                <p>Esempio di lavoro svolto durante le sessioni di wellness coaching con focus su risultati tangibili e benessere del cliente.</p>
            </div>
        </div>
    `;

    document.body.appendChild(lightbox);
    lightbox.style.display = 'flex';

    // Close lightbox handlers
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.remove();
    });

    lightbox.querySelector('.lightbox-overlay').addEventListener('click', (e) => {
        if (e.target === lightbox.querySelector('.lightbox-overlay')) {
            lightbox.remove();
        }
    });
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Colori CSS diretti invece di variabili CSS
    const colors = {
        success: '#2d5a3d',
        error: '#e53e3e',
        info: '#4a5568'
    };

    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: colors[type] || colors.info
    });

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    // Hide toast
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Utility: Get tomorrow date
function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

// CSS per modals (iniettato dinamicamente)
const modalStyles = `
    .booking-modal, .portfolio-lightbox {
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
    }
    
    .modal-content, .lightbox-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
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
    }
    
    .modal-close, .lightbox-close {
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
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .booking-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 20px;
    }
    
    .booking-date, .booking-time {
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
    }
    
    .booking-confirm {
        background-color: #2d5a3d;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    
    .booking-confirm:hover {
        background-color: #1e3a2e;
    }
    
    .lightbox-content {
        text-align: center;
        padding: 20px;
    }
    
    .lightbox-image {
        width: 100%;
        height: 300px;
        background-color: #f7fafc;
        background-size: cover;
        background-position: center;
        border-radius: 8px;
        margin: 20px 0;
    }
`;

// Inietta CSS per modals
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);