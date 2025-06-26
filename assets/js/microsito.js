/* ===============================================
   MICROSITO PROFESSIONISTI - JS MIGLIORATO
   =============================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeMicrosite();
});

// Funzione per caricare il testo dalla pagina About
async function loadAboutText() {
    try {
        // Carica la pagina About
        const response = await fetch('/pages/professionisti/about.html');
        const html = await response.text();

        // Crea un parser per estrarre il testo
        const parser = new DOMParser();
        const aboutDoc = parser.parseFromString(html, 'text/html');

        // Estrai il testo dalla sezione principale dell'About
        // (dovrai adattare il selettore a come sarà strutturata la pagina About)
        const aboutText = aboutDoc.querySelector('.about-content')?.textContent ||
            aboutDoc.querySelector('.main-content')?.textContent ||
            "Testo di default se About non è disponibile.";

        // Inserisci il testo nella card Chi Sono
        const chiSonoText = document.querySelector('.chi-sono-text');
        if (chiSonoText) {
            chiSonoText.innerHTML = `<p>${aboutText.trim()}</p>`;
        }

    } catch (error) {
        console.log('Impossibile caricare il testo About:', error);
        // Mantieni il testo di default
    }
}

// Chiama la funzione quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function () {
    // ... altre inizializzazioni esistenti ...
    loadAboutText();
});

// Inizializzazione microsite
function initializeMicrosite() {
    setupServiceCards();
    setupIspirationGallery();
    setupCTAButtons();
    setupMobileMenu();
    setupFadeInAnimations();
    injectModalStyles();
    manageIspirations(); // <-- AGGIUNGI QUESTA RIGA
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

// Setup Inspiration Gallery - Stile Facebook
function setupIspirationGallery() {
    const inspirationImages = document.querySelectorAll('.ispirazioni-image');

    inspirationImages.forEach(image => {
        image.addEventListener('click', function () {
            const imageTitle = this.getAttribute('data-title');
            const imageSrc = this.style.backgroundImage.slice(5, -2); // Rimuove url(" e ")

            // Apri lightbox galleria
            showGalleryLightbox(imageTitle, imageSrc);
        });

        // Smooth hover animation
        image.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.02)';
        });

        image.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

}

// Setup CTA Buttons
function setupCTAButtons() {
    const heroCTA = document.querySelector('.hero-cta');
    const premiumCTA = document.querySelector('.premium-cta .cta-btn');

    if (heroCTA) {
        heroCTA.addEventListener('click', function (e) {
            e.preventDefault();
            // Scroll smooth to servizi section
            const serviziSection = document.querySelector('.servizi-section');
            if (serviziSection) {
                serviziSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    if (premiumCTA) {
        premiumCTA.addEventListener('click', function (e) {
            e.preventDefault();
            // Scroll to servizi per prenotazione
            const serviziSection = document.querySelector('.servizi-section');
            if (serviziSection) {
                serviziSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                showToast('Scegli il servizio che preferisci per prenotare', 'info');
            }
        });
    }
}

// Setup Mobile Menu (eredita da header base)
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (mobileMenuToggle && navbarMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
        });
    }
}

// Setup Fade In Animations - SENZA PARALLAX
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

    // Osserva solo le sezioni principali (NON HERO)
    const sections = document.querySelectorAll('.chi-sono-section, .servizi-section, .ispirazioni-section, .certificazioni-section, .recensioni-section, .premium-cta');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

// Ottieni data di domani per input date
function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

// Mostra toast notification
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

    // Stili inline per il toast
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

    // Applica stili
    Object.assign(toast.style, toastStyles);
    toast.style.backgroundColor = typeColors[type] || typeColors.info;

    // Aggiungi al DOM
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
// MODAL FUNCTIONS
// ===============================================

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

// Mostra lightbox singola immagine
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

    // Close lightbox handlers
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.remove();
    });

    lightbox.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === lightbox.querySelector('.modal-overlay')) {
            lightbox.remove();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            lightbox.remove();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// Mostra galleria completa
function showFullGallery() {
    const images = document.querySelectorAll('.ispirazioni-image');
    const imageData = Array.from(images).map(img => ({
        title: img.getAttribute('data-title'),
        src: img.style.backgroundImage.slice(5, -2)
    }));

    const gallery = document.createElement('div');
    gallery.className = 'full-gallery-modal';
    gallery.innerHTML = `
        <div class="modal-overlay">
            <div class="full-gallery-content">
                <div class="modal-header">
                    <h3>Tutte le Ispirazioni di Sophia</h3>
                    <button class="gallery-close">&times;</button>
                </div>
                <div class="full-gallery-grid">
                    ${imageData.map(img => `
                        <div class="gallery-item" style="background-image: url('${img.src}')" data-title="${img.title}">
                            <div class="gallery-overlay">
                                <span>${img.title}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(gallery);
    gallery.style.display = 'flex';

    // Setup gallery item clicks
    gallery.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const src = item.style.backgroundImage.slice(5, -2);
            gallery.remove();
            showGalleryLightbox(title, src);
        });
    });

    // Close gallery handlers
    gallery.querySelector('.gallery-close').addEventListener('click', () => {
        gallery.remove();
    });

    gallery.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === gallery.querySelector('.modal-overlay')) {
            gallery.remove();
        }
    });
}

// Configurazione ispirazioni
const MAX_ISPIRAZIONI_MICROSITO = 10; // Limite totale
const ISPIRAZIONI_PER_RIGA = 10; // Quante per riga

// Gestione dinamica delle ispirazioni (max configurabile, multi-riga)
function manageIspirations() {
    const ispirazioniContainer = document.querySelector('.ispirazioni-gallery-static');
    if (!ispirazioniContainer) return;

    const ispirazioniImages = ispirazioniContainer.querySelectorAll('.ispirazioni-image');

    // Se ci sono più elementi del limite, rimuovi quelli in eccesso
    if (ispirazioniImages.length > MAX_ISPIRAZIONI_MICROSITO) {
        for (let i = MAX_ISPIRAZIONI_MICROSITO; i < ispirazioniImages.length; i++) {
            ispirazioniImages[i].remove();
        }
    }

    // Aggiorna la grid per supportare più righe
    updateGridLayout();
}

// Aggiorna il layout della grid per multi-riga
function updateGridLayout() {
    const container = document.querySelector('.ispirazioni-gallery-static');
    if (!container) return;

    const elementCount = container.querySelectorAll('.ispirazioni-image').length;
    const righe = Math.ceil(elementCount / ISPIRAZIONI_PER_RIGA);

    // Grid con righe multiple
    container.style.gridTemplateColumns = `repeat(${ISPIRAZIONI_PER_RIGA}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${righe}, 1fr)`;
}

/**
 * PODCAST MICROSITO FUNCTIONS - DA AGGIUNGERE AL MICROSITO-FIXED.JS
 */

/**
 * ===============================================
 * GESTIONE PODCAST MICROSITO
 * =============================================== */
function initPodcastMicrosito() {
    const podcastCards = document.querySelectorAll('.podcast-microsito-card');

    if (podcastCards.length === 0) return;

    // Limita a massimo 10 podcast
    managePodcastLimit();

    // Setup event listeners per ogni card
    podcastCards.forEach((card, index) => {
        setupPodcastCard(card, index);
    });

    console.log('✅ Podcast microsito initialized');
}

/**
 * Limita i podcast a massimo 10 elementi
 */
function managePodcastLimit() {
    const MAX_PODCAST_MICROSITO = 10;
    const podcastContainer = document.querySelector('.podcast-microsito-gallery');

    if (!podcastContainer) return;

    const podcastCards = podcastContainer.querySelectorAll('.podcast-microsito-card');

    // Se ci sono più di 10 elementi, rimuovi quelli in eccesso
    if (podcastCards.length > MAX_PODCAST_MICROSITO) {
        for (let i = MAX_PODCAST_MICROSITO; i < podcastCards.length; i++) {
            podcastCards[i].remove();
        }
    }

    // Aggiorna layout grid
    updatePodcastGridLayout();
}

/**
 * Aggiorna il layout della grid podcast
 */
function updatePodcastGridLayout() {
    const container = document.querySelector('.podcast-microsito-gallery');
    if (!container) return;
}

/**
 * Setup eventi per singola card podcast
 */
function setupPodcastCard(card, index) {
    const playBtn = card.querySelector('.podcast-microsito-play');
    const title = card.dataset.title;
    const duration = card.dataset.duration;

    // Podcast data simulato
    const podcastData = {
        id: `microsito-${index}`,
        title: title,
        duration: duration,
        author: 'Sophia Rossi',
        cover: card.querySelector('.podcast-microsito-cover').style.backgroundImage,
        description: `Episodio dedicato a ${title.toLowerCase()}. In questo podcast esploriamo tecniche e strategie per migliorare il tuo benessere quotidiano.`,
        audioUrl: `../../assets/audio/sophia-podcast-${index + 1}.mp3`
    };

    // Click sul play button
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playPodcastMicrosito(podcastData);
    });

    // Click sulla card per dettagli (apre modal come nella pagina principale)
    card.addEventListener('click', () => {
        showPodcastDetailsMicrosito(podcastData);
    });

    // Hover effects
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
}

/**
 * Riproduce podcast dal microsito (usa stesso player della pagina principale)
 */
function playPodcastMicrosito(podcastData) {
    // Crea o mostra player fisso
    createMicrositoPlayer(podcastData);

    // Simula riproduzione
    console.log(`🎵 Playing podcast: ${podcastData.title}`);

    // Feedback visivo
    showPodcastToast(`Riproducendo: ${podcastData.title}`, 'info');
}

/**
 * Mostra dettagli podcast in modal (versione microsito)
 */
function showPodcastDetailsMicrosito(podcastData) {
    // Usa stessa logica del modal principale ma con dati microsito
    const modal = document.createElement('div');
    modal.className = 'podcast-modal microsito-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">${podcastData.title}</h2>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="podcast-detail-cover">
                    <div class="detail-cover-image" style="background-image: ${podcastData.cover}">
                        <div class="detail-play-btn" data-podcast-id="${podcastData.id}">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="podcast-detail-info">
                        <h3 class="detail-title">${podcastData.title}</h3>
                        <p class="detail-author">di ${podcastData.author}</p>
                        <div class="detail-meta">
                            <span class="detail-duration">
                                <i class="far fa-clock"></i> ${podcastData.duration}
                            </span>
                            <span class="detail-category">
                                <i class="fas fa-tag"></i> Wellness
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="podcast-detail-description">
                    <h4>Descrizione</h4>
                    <p>${podcastData.description}</p>
                </div>
                
                <div class="podcast-detail-actions">
                    <button class="detail-action-btn follow-btn">
                        <i class="fas fa-bell"></i>
                        Segui ${podcastData.author}
                    </button>
                    <button class="detail-action-btn share-btn">
                        <i class="fas fa-share"></i>
                        Condividi
                    </button>
                    <a href="/pages/professionisti/tutti-i-podcast.html" class="detail-action-btn">
                        <i class="fas fa-list"></i>
                        Altri Podcast
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Setup modal events
    setupMicrositoModalEvents(modal, podcastData);

    // Animazione entrata
    requestAnimationFrame(() => {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    });
}

/**
 * Setup eventi per modal microsito
 */
function setupMicrositoModalEvents(modal, podcastData) {
    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', () => closeMicrositoModal(modal));
    overlay.addEventListener('click', () => closeMicrositoModal(modal));

    // ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeMicrositoModal(modal);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Play button
    const playBtn = modal.querySelector('.detail-play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            playPodcastMicrosito(podcastData);
            closeMicrositoModal(modal);
        });
    }

    // Action buttons
    const followBtn = modal.querySelector('.follow-btn');
    const shareBtn = modal.querySelector('.share-btn');

    if (followBtn) {
        followBtn.addEventListener('click', () => {
            showPodcastToast(`Ora segui ${podcastData.author}!`, 'success');
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: podcastData.title,
                    text: `Ascolta "${podcastData.title}" di ${podcastData.author}`,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                showPodcastToast('Link copiato negli appunti!', 'success');
            }
        });
    }
}

/**
 * Chiude modal microsito
 */
function closeMicrositoModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
    }, 300);
}

/**
 * Crea player per microsito (versione semplificata)
 */
function createMicrositoPlayer(podcastData) {
    // Rimuovi player esistente se presente
    const existingPlayer = document.getElementById('micrositoPlayer');
    if (existingPlayer) {
        existingPlayer.remove();
    }

    // Crea nuovo player
    const player = document.createElement('div');
    player.id = 'micrositoPlayer';
    player.className = 'microsito-player';
    player.innerHTML = `
        <div class="microsito-player-info">
            <img src="../../assets/images/professionisti/sophia.jpg" alt="Sophia" class="microsito-player-avatar">
            <div class="microsito-player-text">
                <h4 class="microsito-player-title">${podcastData.title}</h4>
                <span class="microsito-player-author">${podcastData.author}</span>
            </div>
        </div>
        
        <div class="microsito-player-controls">
            <button class="microsito-control-btn microsito-play-pause">
                <i class="fas fa-pause"></i>
            </button>
        </div>
        
        <div class="microsito-player-progress">
            <span class="microsito-time">0:00 / ${podcastData.duration}</span>
        </div>
        
        <button class="microsito-player-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(player);

    // Setup player events
    setupMicrositoPlayerEvents(player, podcastData);

    // Mostra player con animazione
    setTimeout(() => {
        player.style.transform = 'translateY(0)';
    }, 100);
}

/**
 * Setup eventi player microsito
 */
function setupMicrositoPlayerEvents(player, podcastData) {
    const playPauseBtn = player.querySelector('.microsito-play-pause');
    const closeBtn = player.querySelector('.microsito-player-close');

    let isPlaying = true;

    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        const icon = playPauseBtn.querySelector('i');
        icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';

        console.log(`🎵 ${isPlaying ? 'Playing' : 'Paused'}: ${podcastData.title}`);
    });

    // Close
    closeBtn.addEventListener('click', () => {
        player.style.transform = 'translateY(100%)';
        setTimeout(() => player.remove(), 300);
    });
}

/**
 * Toast notifications per podcast
 */
function showPodcastToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `podcast-toast toast-${type}`;
    toast.textContent = message;

    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '10001',
        transition: 'all 0.3s ease',
        transform: 'translateX(100%)',
        opacity: '0'
    };

    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        error: '#ef4444'
    };

    Object.assign(toast.style, styles);
    toast.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * ===============================================
 * INIZIALIZZAZIONE - DA AGGIUNGERE ALLA FUNZIONE PRINCIPALE
 * =============================================== */

// Aggiungi questa chiamata nella funzione initMicrositoFeatures() esistente:
// initPodcastMicrosito();

// ===============================================
// INJECT MODAL STYLES
// ===============================================
function injectModalStyles() {
    const modalStyles = `
    .booking-modal, .gallery-lightbox, .full-gallery-modal {
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
    
    .modal-content, .lightbox-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .full-gallery-content {
        background: white;
        border-radius: 12px;
        max-width: 900px;
        width: 95%;
        max-height: 90vh;
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
        font-size: 18px;
        font-weight: 600;
    }
    
    .modal-close, .lightbox-close, .gallery-close {
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
    
    .modal-close:hover, .lightbox-close:hover, .gallery-close:hover {
        color: #2d3748;
        background-color: #f7fafc;
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
        transition: border-color 0.3s ease;
    }

    .booking-date:focus, .booking-time:focus {
        outline: none;
        border-color: #2d5a3d;
        box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.1);
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

    .full-gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        padding: 20px;
    }

    .gallery-item {
        aspect-ratio: 1;
        background-size: cover;
        background-position: center;
        border-radius: 8px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: transform 0.3s ease;
    }

    .gallery-item:hover {
        transform: scale(1.05);
    }

    .gallery-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        color: white;
        padding: 12px;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .gallery-item:hover .gallery-overlay {
        opacity: 1;
    }

    @media (max-width: 768px) {
        .modal-content, .lightbox-content {
            width: 95%;
            max-height: 90vh;
        }

        .full-gallery-content {
            width: 98%;
            max-height: 95vh;
        }

        .full-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            padding: 16px;
        }

        .modal-header {
            padding: 16px;
        }

        .modal-header h3 {
            font-size: 16px;
        }
    }
`;

    // Inietta CSS per modals se non esiste già
    if (!document.querySelector('#microsito-modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'microsito-modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
}