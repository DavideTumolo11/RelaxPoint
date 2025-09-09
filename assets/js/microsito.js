/* ===============================================
   MICROSITO PROFESSIONISTI - JS INTEGRATO CON ALBUM SYSTEM
   =============================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeMicrosite();
});

// Inizializzazione microsite
function initializeMicrosite() {
    setupServiceCards();
    setupCTAButtons();
    setupMobileMenu();
    setupFadeInAnimations();
    injectModalStyles();

    // NUOVO: Caricamento album dinamici
    loadDynamicAlbums();
    loadAboutText();
    setupDynamicLinks();

    console.log('Microsito inizializzato con sistema album');
}

// ===============================================
// CARICAMENTO ALBUM DINAMICI
// ===============================================

function loadDynamicAlbums() {
    // Simula caricamento da API/Database
    setTimeout(() => {
        loadGalleryAlbums();
        loadPodcastSeries();
        loadCorsiSeries();
    }, 500);
}

// Carica album Gallery/Ispirazioni
function loadGalleryAlbums() {
    const container = document.getElementById('ispirazioniAlbumsContainer');
    if (!container) return;

    // Dati di esempio - in produzione verrebbero da API
    const galleryAlbums = [
        {
            id: 'album1',
            title: 'Sessioni Mindfulness',
            photos: [
                '../../assets/images/Servizi/massage2.jpg',
                '../../assets/images/Servizi/YogaEndMeditazione.jpeg',
                '../../assets/images/Servizi/Beauty.jpg'
            ]
        },
        {
            id: 'album2',
            title: 'Coaching Nutrizionale',
            photos: [
                '../../assets/images/Servizi/Salute.jpg',
                '../../assets/images/Servizi/neoMamma.jpg',
                '../../assets/images/Servizi/Chef.jpg'
            ]
        },
        {
            id: 'album3',
            title: 'Trasformazioni Cliente',
            photos: [
                '../../assets/images/Servizi/Gym.jpg',
                '../../assets/images/Servizi/Fiosioterapia.Osteopatia.png',
                '../../assets/images/Servizi/Escursioni.jpg'
            ]
        }
    ];

    let albumsHTML = '<div class="ispirazioni-gallery-static">';

    galleryAlbums.forEach(album => {
        albumsHTML += `
            <div class="gallery-album-item" data-album-id="${album.id}" onclick="openGalleryAlbum('${album.id}')">
                <div class="album-preview" style="background-image: url('${album.photos[0]}');">
                    <div class="album-badge">
                        <i class="fas fa-images"></i>
                        <span>${album.photos.length}</span>
                    </div>
                    <div class="album-overlay">
                        <span class="album-title">${album.title}</span>
                    </div>
                </div>
            </div>
        `;
    });

    albumsHTML += '</div>';
    container.innerHTML = albumsHTML;

    // Setup hover effects
    setupGalleryAlbumHovers();
}

// Carica serie Podcast
function loadPodcastSeries() {
    const container = document.getElementById('podcastSeriesContainer');
    if (!container) return;

    // Dati di esempio - in produzione da API
    const podcastSeries = [
        {
            id: 'series1',
            title: 'Mindfulness Quotidiana',
            cover: '../../assets/images/podcast/sophia-cover-1.jpg',
            episodes: [
                { title: 'Inizia la giornata', duration: '12:30' },
                { title: 'Pausa pranzo mindful', duration: '8:45' },
                { title: 'Rilassamento serale', duration: '15:20' }
            ]
        },
        {
            id: 'series2',
            title: 'Benessere Olistico',
            cover: '../../assets/images/podcast/sophia-cover-2.jpg',
            episodes: [
                { title: 'Corpo e mente', duration: '18:15' },
                { title: 'Alimentazione consapevole', duration: '22:10' },
                { title: 'Movimento naturale', duration: '16:45' }
            ]
        }
    ];

    let seriesHTML = '<div class="podcast-microsito-gallery">';

    podcastSeries.forEach(series => {
        seriesHTML += `
            <div class="podcast-series-item" data-series-id="${series.id}" onclick="openPodcastSeries('${series.id}')">
                <div class="podcast-microsito-cover" style="background-image: url('${series.cover}');">
                    <div class="podcast-microsito-play">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="series-badge">
                        <i class="fas fa-list"></i>
                        <span>${series.episodes.length} ep.</span>
                    </div>
                </div>
                <div class="series-info">
                    <h4 class="series-title">${series.title}</h4>
                    <p class="series-episodes">${series.episodes.length} episodi</p>
                </div>
            </div>
        `;
    });

    seriesHTML += '</div>';
    container.innerHTML = seriesHTML;

    // Setup hover effects
    setupPodcastSeriesHovers();
}

// Carica serie Corsi
function loadCorsiSeries() {
    const container = document.getElementById('corsiSeriesContainer');
    if (!container) return;

    // Dati di esempio - in produzione da API
    const corsiSeries = [
        {
            id: 'corso1',
            title: 'Yoga Base',
            cover: '../../assets/images/corsi/yoga-principianti.jpg',
            type: 'presenza',
            lessons: [
                { title: 'Saluto al sole', duration: '45 min', type: 'pratica' },
                { title: 'Posizioni base', duration: '60 min', type: 'pratica' },
                { title: 'Respirazione yoga', duration: '30 min', type: 'teoria' }
            ]
        },
        {
            id: 'corso2',
            title: 'Mindfulness Avanzata',
            cover: '../../assets/images/corsi/mindfulness-base.jpg',
            type: 'online',
            lessons: [
                { title: 'Introduzione', duration: '20 min', type: 'video' },
                { title: 'Meditazione guidata', duration: '35 min', type: 'pratica' },
                { title: 'Integrazione quotidiana', duration: '25 min', type: 'teoria' }
            ]
        }
    ];

    let corsiHTML = '<div class="corsi-gallery-static">';

    corsiSeries.forEach(corso => {
        const typeClass = `corso-type-${corso.type}`;
        corsiHTML += `
            <div class="corso-series-item ${typeClass}" data-corso-id="${corso.id}" onclick="openCorsoSeries('${corso.id}')">
                <div class="corso-image" style="background-image: url('${corso.cover}');">
                    <div class="corso-badge">
                        <i class="fas fa-graduation-cap"></i>
                        <span>${corso.lessons.length}</span>
                    </div>
                    <div class="corso-type-badge">${corso.type}</div>
                </div>
                <div class="corso-info">
                    <h4 class="corso-title">${corso.title}</h4>
                    <p class="corso-lessons">${corso.lessons.length} lezioni</p>
                </div>
            </div>
        `;
    });

    corsiHTML += '</div>';
    container.innerHTML = corsiHTML;

    // Setup hover effects  
    setupCorsiSeriesHovers();
}

// ===============================================
// MODAL APERTURA ALBUM
// ===============================================

function openGalleryAlbum(albumId) {
    // Dati album - in produzione da API
    const albums = {
        'album1': {
            title: 'Sessioni Mindfulness',
            photos: [
                '../../assets/images/Servizi/massage2.jpg',
                '../../assets/images/Servizi/YogaEndMeditazione.jpeg',
                '../../assets/images/Servizi/Beauty.jpg'
            ]
        }
        // Altri album...
    };

    const album = albums[albumId];
    if (!album) return;

    const modal = document.createElement('div');
    modal.className = 'album-modal-overlay';
    modal.innerHTML = `
        <div class="album-modal">
            <div class="album-modal-header">
                <h3>${album.title}</h3>
                <button class="album-modal-close">&times;</button>
            </div>
            <div class="album-modal-body">
                <div class="album-carousel">
                    ${album.photos.map((photo, index) => `
                        <div class="album-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${photo}" alt="${album.title} - Foto ${index + 1}">
                        </div>
                    `).join('')}
                </div>
                <div class="album-navigation">
                    <button class="album-prev" onclick="changeAlbumSlide(-1)">❮</button>
                    <span class="album-counter">1 / ${album.photos.length}</span>
                    <button class="album-next" onclick="changeAlbumSlide(1)">❯</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Setup close handlers
    modal.querySelector('.album-modal-close').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // Setup carousel
    window.currentAlbumSlide = 0;
    window.totalAlbumSlides = album.photos.length;
}

function openPodcastSeries(seriesId) {
    // Implementazione apertura serie podcast con lista episodi
    console.log('Apertura serie podcast:', seriesId);
    // Modal con lista episodi, copertina fissa, player
}

function openCorsoSeries(corsoId) {
    // Implementazione apertura serie corso con lista lezioni  
    console.log('Apertura serie corso:', corsoId);
    // Modal con lista lezioni, copertina fissa, info corso
}

// ===============================================
// HOVER EFFECTS ALBUM
// ===============================================

function setupGalleryAlbumHovers() {
    const albums = document.querySelectorAll('.gallery-album-item');
    albums.forEach(album => {
        album.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });
        album.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

function setupPodcastSeriesHovers() {
    const series = document.querySelectorAll('.podcast-series-item');
    series.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px)';
        });
        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
}

function setupCorsiSeriesHovers() {
    const corsi = document.querySelectorAll('.corso-series-item');
    corsi.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });
        item.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

// ===============================================
// CAROUSEL NAVIGATION (per modal album)
// ===============================================

function changeAlbumSlide(direction) {
    const slides = document.querySelectorAll('.album-slide');
    const counter = document.querySelector('.album-counter');

    if (!slides.length) return;

    slides[window.currentAlbumSlide].classList.remove('active');

    window.currentAlbumSlide += direction;

    if (window.currentAlbumSlide >= window.totalAlbumSlides) {
        window.currentAlbumSlide = 0;
    }
    if (window.currentAlbumSlide < 0) {
        window.currentAlbumSlide = window.totalAlbumSlides - 1;
    }

    slides[window.currentAlbumSlide].classList.add('active');
    counter.textContent = `${window.currentAlbumSlide + 1} / ${window.totalAlbumSlides}`;
}

// ===============================================
// INTEGRAZIONE CON AUTH.JS - FUNZIONI INVARIATE
// ===============================================

function checkUserAuthenticationForBooking(callback) {
    if (window.auth && window.auth.isLoggedIn) {
        console.log('Utente autenticato, procedi con prenotazione');
        if (callback) callback();
        return true;
    }

    console.log('Utente non loggato, redirect a login');
    localStorage.setItem('returnUrl', window.location.href);
    showToast('Accedi per prenotare i servizi', 'info');

    const loginUrl = window.getCorrectPath ? window.getCorrectPath('login.html') : '/login.html';

    setTimeout(() => {
        window.location.href = loginUrl;
    }, 1500);

    return false;
}

function setupCTAButtons() {
    const heroCTA = document.querySelector('.hero-cta');
    const premiumCTA = document.querySelector('.premium-cta .cta-btn');
    const bookButtons = document.querySelectorAll('[onclick*="bookService"], .btn-book, .prenota-btn');

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

    if (premiumCTA) {
        premiumCTA.addEventListener('click', function (e) {
            e.preventDefault();
            checkUserAuthenticationForBooking(() => {
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

    bookButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            checkUserAuthenticationForBooking(() => {
                const originalOnclick = this.getAttribute('onclick');
                if (originalOnclick) {
                    eval(originalOnclick);
                }
            });
        });
    });
}

function setupServiceCards() {
    const serviceCards = document.querySelectorAll('.servizio-card');

    serviceCards.forEach(card => {
        card.addEventListener('click', function () {
            const serviceTitle = this.querySelector('.service-title')?.textContent;
            if (!serviceTitle) return;

            checkUserAuthenticationForBooking(() => {
                const serviceSlug = getServiceSlug(serviceTitle);
                const professionalId = getCurrentProfessionalId();
                const treatmentsUrl = `/pages/professionisti/servizio-trattamenti.html?servizio=${serviceSlug}&prof=${professionalId}`;

                console.log(`Navigazione autorizzata a trattamenti: ${serviceSlug}`);
                window.location.href = treatmentsUrl;
            });
        });

        card.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.03)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

// ===============================================
// FUNZIONI DI SUPPORTO INVARIATE
// ===============================================

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

function getCurrentProfessionalId() {
    const pathSegments = window.location.pathname.split('/');
    const profIndex = pathSegments.indexOf('professionisti');

    if (profIndex !== -1 && pathSegments[profIndex + 1]) {
        return pathSegments[profIndex + 1];
    }

    return 'sophia-rossi';
}

function setupDynamicLinks() {
    const professionalId = getCurrentProfessionalId();

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

    console.log('Collegamenti dinamici aggiornati per:', professionalId);
}

async function loadAboutText() {
    try {
        const response = await fetch('/pages/professionisti/about.html');
        const html = await response.text();

        const parser = new DOMParser();
        const aboutDoc = parser.parseFromString(html, 'text/html');

        const myStorySection = aboutDoc.querySelector('.chi-sono-text, .about-text, .my-story-text');

        let aboutText = "Sono una Wellness Coach certificata con anni di esperienza nel guidare persone verso il loro benessere ottimale.";

        if (myStorySection) {
            aboutText = myStorySection.textContent.trim();
            if (aboutText.length > 500) {
                aboutText = aboutText.substring(0, 500) + '...';
            }
        }

        const chiSonoTextElement = document.querySelector('.chi-sono-text');
        if (chiSonoTextElement) {
            chiSonoTextElement.innerHTML = `<p>${aboutText}</p>`;
            console.log('Testo About caricato nel microsito');
        }

    } catch (error) {
        console.log('Impossibile caricare testo About:', error);
    }
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

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

function showToast(message, type = 'info') {
    if (window.auth && window.auth.showMessage) {
        window.auth.showMessage(message, type);
        return;
    }

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

function injectModalStyles() {
    if (document.querySelector('#microsito-modal-styles')) return;

    const modalStyles = `
    .album-modal-overlay {
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
    
    .album-modal {
        background: white;
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .album-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .album-modal-header h3 {
        margin: 0;
        color: #1a202c;
        font-size: 18px;
        font-weight: 600;
    }
    
    .album-modal-close {
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
    
    .album-modal-close:hover {
        color: #2d3748;
        background-color: #f7fafc;
    }
    
    .album-carousel {
        position: relative;
        height: 400px;
        overflow: hidden;
    }
    
    .album-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .album-slide.active {
        opacity: 1;
    }
    
    .album-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .album-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: #f8f9fa;
    }
    
    .album-prev, .album-next {
        background: var(--color-primary);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.3s ease;
    }
    
    .album-prev:hover, .album-next:hover {
        background: var(--color-dark);
        transform: scale(1.1);
    }
    
    .album-counter {
        font-weight: 600;
        color: #4a5568;
    }`;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'microsito-modal-styles';
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
}

// Esportazione funzioni globali
window.getCurrentProfessionalId = getCurrentProfessionalId;
window.getServiceSlug = getServiceSlug;
window.changeAlbumSlide = changeAlbumSlide;

console.log('Microsito JS con sistema album attivo');