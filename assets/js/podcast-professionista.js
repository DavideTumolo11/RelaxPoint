/**
 * PODCAST PROFESSIONISTA PAGE JAVASCRIPT
 * Gestisce filtri e interazioni specifiche per la pagina del professionista
 */

// Stato globale professionista
let professionalPodcasts = [];
let filteredProfessionalPodcasts = [];
let isFollowing = false;

document.addEventListener('DOMContentLoaded', function () {
    initializeProfessionalPage();
});

/**
 * ===============================================
 * INIZIALIZZAZIONE PAGINA PROFESSIONISTA
 * =============================================== */
function initializeProfessionalPage() {
    loadProfessionalPodcasts();
    setupProfessionalFilters();
    setupProfessionalActions();
    setupProfessionalEventListeners();

    console.log('✅ Professional podcast page initialized');
}

/**
 * ===============================================
 * CARICAMENTO PODCAST PROFESSIONISTA
 * =============================================== */
function loadProfessionalPodcasts() {
    const podcastCards = document.querySelectorAll('#professionalPodcastGrid .podcast-card');

    professionalPodcasts = Array.from(podcastCards).map((card, index) => {
        return {
            id: `professional-${index + 1}`,
            title: card.querySelector('.podcast-title').textContent,
            description: card.querySelector('.podcast-description').textContent,
            author: 'Sophia Rossi',
            duration: card.querySelector('.podcast-duration').textContent,
            category: card.dataset.category,
            durationGroup: card.dataset.duration,
            date: card.dataset.date,
            cover: card.querySelector('.podcast-cover').style.backgroundImage,
            plays: card.querySelector('.podcast-plays').textContent,
            audioUrl: `../../assets/audio/sophia-podcast-${index + 1}.mp3`,
            element: card
        };
    });

    filteredProfessionalPodcasts = [...professionalPodcasts];
    setupProfessionalPodcastCards();
}

/**
 * ===============================================
 * SETUP CARD PODCAST PROFESSIONISTA
 * =============================================== */
function setupProfessionalPodcastCards() {
    professionalPodcasts.forEach(podcast => {
        const playBtn = podcast.element.querySelector('.podcast-play-btn');

        // Play button
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playProfessionalPodcast(podcast);
        });

        // Click sulla card per dettagli
        podcast.element.addEventListener('click', () => {
            showProfessionalPodcastDetails(podcast);
        });

        // Hover effects
        podcast.element.addEventListener('mouseenter', () => {
            podcast.element.style.transform = 'translateY(-6px)';
        });

        podcast.element.addEventListener('mouseleave', () => {
            podcast.element.style.transform = 'translateY(0)';
        });
    });
}

/**
 * ===============================================
 * FILTRI PROFESSIONISTA
 * =============================================== */
function setupProfessionalFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const durationFilter = document.getElementById('durationFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyProfessionalFilters);
    }

    if (durationFilter) {
        durationFilter.addEventListener('change', applyProfessionalFilters);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', applyProfessionalFilters);
    }

    // Search nel header
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleProfessionalSearch, 300));
    }
}

function applyProfessionalFilters() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const duration = document.getElementById('durationFilter')?.value || '';
    const sort = document.getElementById('sortFilter')?.value || 'newest';

    // Reset filteredPodcasts
    filteredProfessionalPodcasts = [...professionalPodcasts];

    // Filtra per categoria
    if (category) {
        filteredProfessionalPodcasts = filteredProfessionalPodcasts.filter(p => p.category === category);
    }

    // Filtra per durata
    if (duration) {
        filteredProfessionalPodcasts = filteredProfessionalPodcasts.filter(p => p.durationGroup === duration);
    }

    // Ordina
    sortProfessionalPodcasts(sort);

    // Renderizza
    renderFilteredProfessionalPodcasts();
}

function sortProfessionalPodcasts(sortType) {
    switch (sortType) {
        case 'popular':
            // Ordina per numero di ascolti (estrae numero da "2.1K ascolti")
            filteredProfessionalPodcasts.sort((a, b) => {
                const aPlays = parseFloat(a.plays.replace(/[^\d.]/g, ''));
                const bPlays = parseFloat(b.plays.replace(/[^\d.]/g, ''));
                return bPlays - aPlays;
            });
            break;
        case 'duration-asc':
            filteredProfessionalPodcasts.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
            break;
        case 'duration-desc':
            filteredProfessionalPodcasts.sort((a, b) => parseDuration(b.duration) - parseDuration(a.duration));
            break;
        default: // newest
            filteredProfessionalPodcasts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

function handleProfessionalSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm.length === 0) {
        applyProfessionalFilters();
        return;
    }

    filteredProfessionalPodcasts = professionalPodcasts.filter(podcast =>
        podcast.title.toLowerCase().includes(searchTerm) ||
        podcast.description.toLowerCase().includes(searchTerm) ||
        podcast.category.toLowerCase().includes(searchTerm)
    );

    renderFilteredProfessionalPodcasts();
}

function renderFilteredProfessionalPodcasts() {
    // Nascondi tutte le card
    professionalPodcasts.forEach(podcast => {
        podcast.element.style.display = 'none';
    });

    // Mostra solo quelle filtrate
    filteredProfessionalPodcasts.forEach(podcast => {
        podcast.element.style.display = 'block';
    });

    // Aggiorna statistiche
    updateProfessionalStats();
}

function updateProfessionalStats() {
    const episodesStat = document.querySelector('.professional-stats .stat-number');
    if (episodesStat) {
        episodesStat.textContent = filteredProfessionalPodcasts.length;
    }
}

/**
 * ===============================================
 * AZIONI PROFESSIONISTA
 * =============================================== */
function setupProfessionalActions() {
    const followBtn = document.querySelector('.follow-professional-btn');

    if (followBtn) {
        followBtn.addEventListener('click', toggleFollow);
    }
}

function toggleFollow() {
    const followBtn = document.querySelector('.follow-professional-btn');
    const icon = followBtn.querySelector('i');
    const text = followBtn.querySelector('i').nextSibling;

    isFollowing = !isFollowing;

    if (isFollowing) {
        followBtn.classList.add('following');
        icon.className = 'fas fa-bell-slash';
        text.textContent = ' Seguito';
        showProfessionalToast('Ora segui Sophia Rossi! Riceverai notifiche sui nuovi podcast.', 'success');
    } else {
        followBtn.classList.remove('following');
        icon.className = 'fas fa-bell';
        text.textContent = ' Segui';
        showProfessionalToast('Non segui più Sophia Rossi.', 'info');
    }
}

/**
 * ===============================================
 * PLAYER E MODAL PROFESSIONISTA
 * =============================================== */
function playProfessionalPodcast(podcast) {
    // Riusa la logica del player principale
    if (typeof playPodcast === 'function') {
        playPodcast(podcast);
    } else {
        // Fallback: player semplificato
        console.log(`🎵 Playing: ${podcast.title}`);
        showProfessionalToast(`Riproducendo: ${podcast.title}`, 'info');
    }
}

function showProfessionalPodcastDetails(podcast) {
    // Usa modal esistente ma con dati professionista
    if (typeof showPodcastDetails === 'function') {
        showPodcastDetails(podcast);
    } else {
        // Fallback: modal semplificato
        showSimplePodcastModal(podcast);
    }
}

function showSimplePodcastModal(podcast) {
    const modal = document.createElement('div');
    modal.className = 'podcast-modal professional-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">${podcast.title}</h2>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="podcast-detail-cover">
                    <div class="detail-cover-image" style="background-image: ${podcast.cover}">
                        <div class="detail-play-btn">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="podcast-detail-info">
                        <h3 class="detail-title">${podcast.title}</h3>
                        <p class="detail-author">di ${podcast.author}</p>
                        <div class="detail-meta">
                            <span><i class="far fa-clock"></i> ${podcast.duration}</span>
                            <span><i class="fas fa-headphones"></i> ${podcast.plays}</span>
                            <span><i class="fas fa-tag"></i> ${getCategoryName(podcast.category)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="podcast-detail-description">
                    <h4>Descrizione</h4>
                    <p>${podcast.description}</p>
                </div>
                
                <div class="podcast-detail-actions">
                    <button class="detail-action-btn play-full-btn">
                        <i class="fas fa-play"></i>
                        Ascolta Episodio
                    </button>
                    <button class="detail-action-btn share-btn">
                        <i class="fas fa-share"></i>
                        Condividi
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Setup events
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.modal-overlay').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.detail-play-btn').addEventListener('click', () => {
        playProfessionalPodcast(podcast);
        closeModal(modal);
    });
    modal.querySelector('.play-full-btn').addEventListener('click', () => {
        playProfessionalPodcast(podcast);
        closeModal(modal);
    });
    modal.querySelector('.share-btn').addEventListener('click', () => sharePodcast(podcast));

    // Animazione
    requestAnimationFrame(() => {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    });
}

function closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
    }, 300);
}

function sharePodcast(podcast) {
    if (navigator.share) {
        navigator.share({
            title: podcast.title,
            text: `Ascolta "${podcast.title}" di ${podcast.author}`,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showProfessionalToast('Link copiato negli appunti!', 'success');
    }
}

/**
 * ===============================================
 * EVENT LISTENERS
 * =============================================== */
function setupProfessionalEventListeners() {
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreProfessional');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProfessionalPodcasts);
    }

    // Keyboard shortcuts (eredita da podcast.js principale)
    document.addEventListener('keydown', handleProfessionalKeyboard);
}

function loadMoreProfessionalPodcasts() {
    const loadMoreBtn = document.getElementById('loadMoreProfessional');
    loadMoreBtn.textContent = 'Caricamento...';
    loadMoreBtn.disabled = true;

    // Simula caricamento
    setTimeout(() => {
        loadMoreBtn.textContent = 'Carica Altri Episodi';
        loadMoreBtn.disabled = false;
        showProfessionalToast('Caricati nuovi episodi!', 'success');
    }, 1500);
}

function handleProfessionalKeyboard(e) {
    // Gestisce shortcuts specifici per la pagina professionista
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'f':
                e.preventDefault();
                document.querySelector('.search-input')?.focus();
                break;
        }
    }
}

/**
 * ===============================================
 * UTILITY FUNCTIONS
 * =============================================== */
function parseDuration(durationStr) {
    const parts = durationStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function getCategoryName(category) {
    const categories = {
        'wellness': 'Wellness',
        'mindfulness': 'Mindfulness',
        'stress': 'Stress Management',
        'nutrizione': 'Nutrizione',
        'meditazione': 'Meditazione'
    };
    return categories[category] || category;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showProfessionalToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `professional-toast toast-${type}`;
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
        opacity: '0',
        maxWidth: '350px'
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
    }, 4000);
}

/**
 * ===============================================
 * ANALYTICS TRACKING
 * =============================================== */
function trackProfessionalInteraction(action, data) {
    console.log('📊 Professional interaction:', {
        action,
        professional: 'Sophia Rossi',
        data,
        timestamp: new Date().toISOString()
    });
}