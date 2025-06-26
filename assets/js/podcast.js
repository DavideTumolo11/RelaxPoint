/**
 * PODCAST PAGE JAVASCRIPT
 * Gestisce player, filtri e interazioni
 */

// Stato globale del player
let currentPodcast = null;
let isPlaying = false;
let currentTime = 0;
let totalDuration = 0;
let volume = 0.7;

// Array di tutti i podcast (simulato)
let allPodcasts = [];
let filteredPodcasts = [];

// Elementi DOM
let podcastGrid;
let podcastPlayer;
let playPauseBtn;
let progressBar;
let progressFill;
let timeCurrentSpan;
let timeTotalSpan;
let volumeBar;
let volumeFill;

document.addEventListener('DOMContentLoaded', function () {
    initializePodcastPage();
});

/**
 * ===============================================
 * INIZIALIZZAZIONE
 * ===============================================
 */
function initializePodcastPage() {
    // Ottieni elementi DOM
    podcastGrid = document.getElementById('podcastGrid');
    podcastPlayer = document.getElementById('podcastPlayer');
    playPauseBtn = document.getElementById('playPauseBtn');
    progressBar = document.querySelector('.progress-bar');
    progressFill = document.querySelector('.progress-fill');
    timeCurrentSpan = document.querySelector('.time-current');
    timeTotalSpan = document.querySelector('.time-total');
    volumeBar = document.querySelector('.volume-bar');
    volumeFill = document.querySelector('.volume-fill');

    // Inizializza componenti
    loadPodcastData();
    setupEventListeners();
    setupFilters();
    setupPlayer();

    console.log('✅ Podcast page initialized');
}

/**
 * ===============================================
 * CARICAMENTO DATI PODCAST
 * ===============================================
 */
function loadPodcastData() {
    // Simula caricamento dal server
    allPodcasts = Array.from(document.querySelectorAll('.podcast-card')).map((card, index) => {
        return {
            id: index + 1,
            title: card.querySelector('.podcast-title').textContent,
            description: card.querySelector('.podcast-description').textContent,
            author: card.querySelector('.author-name').textContent,
            duration: card.querySelector('.podcast-duration').textContent,
            category: card.dataset.category,
            professional: card.dataset.professional,
            durationGroup: card.dataset.duration,
            cover: card.querySelector('.podcast-cover').style.backgroundImage,
            audioUrl: `../assets/audio/podcast-${index + 1}.mp3`, // URL audio simulato
            date: card.querySelector('.podcast-date').textContent,
            element: card
        };
    });

    filteredPodcasts = [...allPodcasts];
    setupPodcastCards();
}

/**
 * ===============================================
 * SETUP CARD PODCAST
 * ===============================================
 */
function setupPodcastCards() {
    allPodcasts.forEach(podcast => {
        const playBtn = podcast.element.querySelector('.podcast-play-btn');

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playPodcast(podcast);
        });

        // Click sulla card per dettagli
        podcast.element.addEventListener('click', () => {
            showPodcastDetails(podcast);
        });
    });
}

/**
 * ===============================================
 * PLAYER AUDIO
 * ===============================================
 */
function playPodcast(podcast) {
    if (currentPodcast && currentPodcast.id === podcast.id) {
        // Toggle play/pause dello stesso podcast
        togglePlayPause();
    } else {
        // Nuovo podcast
        currentPodcast = podcast;
        loadPodcastInPlayer(podcast);
        startPlayback();
    }
}

function loadPodcastInPlayer(podcast) {
    // Aggiorna UI del player
    document.querySelector('.player-cover').src = podcast.cover.slice(5, -2);
    document.querySelector('.player-title').textContent = podcast.title;
    document.querySelector('.player-author').textContent = podcast.author;
    document.querySelector('.time-total').textContent = podcast.duration;

    // Mostra player
    podcastPlayer.style.display = 'flex';

    // Simula caricamento audio
    totalDuration = parseDuration(podcast.duration);
    currentTime = 0;
    updateProgressBar();
}

function startPlayback() {
    isPlaying = true;
    updatePlayButton();

    // Simula riproduzione (in produzione useresti HTMLAudioElement)
    simulateAudioPlayback();
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    updatePlayButton();

    if (isPlaying) {
        simulateAudioPlayback();
    }
}

function updatePlayButton() {
    const icon = playPauseBtn.querySelector('i');
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

function simulateAudioPlayback() {
    if (!isPlaying) return;

    // Simula avanzamento tempo (ogni secondo)
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }

        currentTime += 1;
        updateProgressBar();
        updateTimeDisplay();

        // Fine podcast
        if (currentTime >= totalDuration) {
            clearInterval(interval);
            endPodcast();
        }
    }, 1000);
}

function updateProgressBar() {
    const percentage = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
    progressFill.style.width = `${percentage}%`;

    const handle = document.querySelector('.progress-handle');
    if (handle) {
        handle.style.left = `${percentage}%`;
    }
}

function updateTimeDisplay() {
    timeCurrentSpan.textContent = formatTime(currentTime);
}

function endPodcast() {
    isPlaying = false;
    currentTime = 0;
    updatePlayButton();
    updateProgressBar();
    updateTimeDisplay();
}

/**
 * ===============================================
 * CONTROLLI PLAYER
 * ===============================================
 */
function setupPlayer() {
    // Play/Pause
    playPauseBtn.addEventListener('click', togglePlayPause);

    // Progress bar click
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        currentTime = Math.floor(totalDuration * percentage);
        updateProgressBar();
        updateTimeDisplay();
    });

    // Volume control
    volumeBar.addEventListener('click', (e) => {
        const rect = volumeBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        volume = clickX / rect.width;
        volumeFill.style.width = `${volume * 100}%`;
        updateVolumeIcon();
    });

    // Previous/Next (da implementare)
    document.getElementById('prevBtn').addEventListener('click', playPrevious);
    document.getElementById('nextBtn').addEventListener('click', playNext);

    // Close player
    document.getElementById('playerClose').addEventListener('click', closePlayer);
}

function playPrevious() {
    if (!currentPodcast) return;

    const currentIndex = allPodcasts.findIndex(p => p.id === currentPodcast.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : allPodcasts.length - 1;
    playPodcast(allPodcasts[prevIndex]);
}

function playNext() {
    if (!currentPodcast) return;

    const currentIndex = allPodcasts.findIndex(p => p.id === currentPodcast.id);
    const nextIndex = currentIndex < allPodcasts.length - 1 ? currentIndex + 1 : 0;
    playPodcast(allPodcasts[nextIndex]);
}

function closePlayer() {
    isPlaying = false;
    currentPodcast = null;
    podcastPlayer.style.display = 'none';
}

function updateVolumeIcon() {
    const volumeBtn = document.querySelector('.volume-btn i');
    if (volume === 0) {
        volumeBtn.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeBtn.className = 'fas fa-volume-down';
    } else {
        volumeBtn.className = 'fas fa-volume-up';
    }
}

/**
 * ===============================================
 * FILTRI
 * =============================================== */
function setupFilters() {
    // Filtri categoria
    const categoryBtns = document.querySelectorAll('.filter-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply filter
            const category = btn.dataset.category;
            filterByCategory(category);
        });
    });

    // Filtri dropdown
    document.getElementById('professionalFilter').addEventListener('change', applyFilters);
    document.getElementById('durationFilter').addEventListener('change', applyFilters);
    document.getElementById('sortFilter').addEventListener('change', applyFilters);

    // Search
    document.querySelector('.search-input').addEventListener('input', handleSearch);
}

function filterByCategory(category) {
    filteredPodcasts = category === 'all'
        ? [...allPodcasts]
        : allPodcasts.filter(p => p.category === category);

    applyAdditionalFilters();
    renderFilteredPodcasts();
}

function applyFilters() {
    const professional = document.getElementById('professionalFilter').value;
    const duration = document.getElementById('durationFilter').value;
    const sort = document.getElementById('sortFilter').value;

    // Riapplica filtro categoria attivo
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    filterByCategory(activeCategory);

    applyAdditionalFilters();
}

function applyAdditionalFilters() {
    const professional = document.getElementById('professionalFilter').value;
    const duration = document.getElementById('durationFilter').value;
    const sort = document.getElementById('sortFilter').value;

    // Filtra per professionista
    if (professional) {
        filteredPodcasts = filteredPodcasts.filter(p => p.professional === professional);
    }

    // Filtra per durata
    if (duration) {
        filteredPodcasts = filteredPodcasts.filter(p => p.durationGroup === duration);
    }

    // Ordina
    sortPodcasts(sort);
    renderFilteredPodcasts();
}

function sortPodcasts(sortType) {
    switch (sortType) {
        case 'popular':
            // Ordina per popolarità (simulato)
            filteredPodcasts.sort((a, b) => Math.random() - 0.5);
            break;
        case 'duration-asc':
            filteredPodcasts.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
            break;
        case 'duration-desc':
            filteredPodcasts.sort((a, b) => parseDuration(b.duration) - parseDuration(a.duration));
            break;
        case 'alphabetical':
            filteredPodcasts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default: // newest
            filteredPodcasts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm.length === 0) {
        applyFilters();
        return;
    }

    filteredPodcasts = allPodcasts.filter(podcast =>
        podcast.title.toLowerCase().includes(searchTerm) ||
        podcast.description.toLowerCase().includes(searchTerm) ||
        podcast.author.toLowerCase().includes(searchTerm)
    );

    renderFilteredPodcasts();
}

function renderFilteredPodcasts() {
    // Nascondi tutte le card
    allPodcasts.forEach(podcast => {
        podcast.element.style.display = 'none';
    });

    // Mostra solo quelle filtrate
    filteredPodcasts.forEach(podcast => {
        podcast.element.style.display = 'block';
    });

    // Update stats
    updatePodcastStats();
}

function updatePodcastStats() {
    const totalSpan = document.querySelector('.stat-number');
    if (totalSpan) {
        totalSpan.textContent = filteredPodcasts.length;
    }
}

/**
 * ===============================================
 * EVENTI
 * =============================================== */
function setupEventListeners() {
    // Load more button
    document.getElementById('loadMore').addEventListener('click', loadMorePodcasts);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function loadMorePodcasts() {
    // Simula caricamento di più podcast
    const loadingDiv = document.getElementById('podcastLoading');
    loadingDiv.style.display = 'flex';

    setTimeout(() => {
        loadingDiv.style.display = 'none';
        // In produzione: aggiungi nuovi podcast al DOM
        console.log('Caricati più podcast...');
    }, 1500);
}

function handleKeyboardShortcuts(e) {
    if (!currentPodcast) return;

    switch (e.code) {
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowLeft':
            currentTime = Math.max(0, currentTime - 10);
            updateProgressBar();
            updateTimeDisplay();
            break;
        case 'ArrowRight':
            currentTime = Math.min(totalDuration, currentTime + 10);
            updateProgressBar();
            updateTimeDisplay();
            break;
        case 'ArrowUp':
            e.preventDefault();
            volume = Math.min(1, volume + 0.1);
            volumeFill.style.width = `${volume * 100}%`;
            updateVolumeIcon();
            break;
        case 'ArrowDown':
            e.preventDefault();
            volume = Math.max(0, volume - 0.1);
            volumeFill.style.width = `${volume * 100}%`;
            updateVolumeIcon();
            break;
    }
}

/**
 * ===============================================
 * UTILITY FUNCTIONS
 * =============================================== */
function parseDuration(durationStr) {
    // Converte "23:45" in secondi
    const parts = durationStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showPodcastDetails(podcast) {
    // Crea modal dettagli
    const modal = document.createElement('div');
    modal.className = 'podcast-modal';
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
                        <div class="detail-play-btn" data-podcast-id="${podcast.id}">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="podcast-detail-info">
                        <h3 class="detail-title">${podcast.title}</h3>
                        <p class="detail-author">di ${podcast.author}</p>
                        <div class="detail-meta">
                            <span class="detail-duration">
                                <i class="far fa-clock"></i> ${podcast.duration}
                            </span>
                            <span class="detail-category">
                                <i class="fas fa-tag"></i> ${getCategoryName(podcast.category)}
                            </span>
                            <span class="detail-date">
                                <i class="far fa-calendar"></i> ${podcast.date}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="podcast-detail-description">
                    <h4>Descrizione</h4>
                    <p>${podcast.description}</p>
                    <p>In questo episodio esploriamo in dettaglio i temi del benessere e della crescita personale. Scoprirai tecniche pratiche e consigli esperti per migliorare la tua qualità di vita quotidiana.</p>
                </div>
                
                <div class="podcast-detail-player">
                    <div class="detail-player-controls">
                        <button class="detail-control-btn" id="detailPrevBtn">
                            <i class="fas fa-step-backward"></i>
                        </button>
                        <button class="detail-control-btn detail-play-pause" data-podcast-id="${podcast.id}">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="detail-control-btn" id="detailNextBtn">
                            <i class="fas fa-step-forward"></i>
                        </button>
                    </div>
                    
                    <div class="detail-progress-container">
                        <span class="detail-time-current">0:00</span>
                        <div class="detail-progress-bar">
                            <div class="detail-progress-fill"></div>
                            <div class="detail-progress-handle"></div>
                        </div>
                        <span class="detail-time-total">${podcast.duration}</span>
                    </div>
                    
                    <div class="detail-volume-container">
                        <button class="detail-control-btn detail-volume-btn">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <div class="detail-volume-bar">
                            <div class="detail-volume-fill" style="width: 70%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="podcast-detail-actions">
                    <button class="detail-action-btn follow-btn">
                        <i class="fas fa-bell"></i>
                        Segui ${podcast.author}
                    </button>
                    <button class="detail-action-btn share-btn">
                        <i class="fas fa-share"></i>
                        Condividi
                    </button>
                    <button class="detail-action-btn download-btn">
                        <i class="fas fa-download"></i>
                        Download
                    </button>
                </div>
                
                <div class="podcast-detail-author">
                    <div class="author-info">
                        <img src="../assets/images/professionisti/${podcast.professional}.jpg" alt="${podcast.author}" class="author-large-avatar">
                        <div class="author-details">
                            <h4>${podcast.author}</h4>
                            <p>Wellness Coach certificata con oltre 8 anni di esperienza nel supportare persone nel loro percorso di benessere.</p>
                            <a href="../professionisti/${podcast.professional}.html" class="author-profile-btn">Vedi Profilo</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Setup modal events
    setupModalEvents(modal, podcast);

    // Animazione entrata
    requestAnimationFrame(() => {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    });
}

function setupModalEvents(modal, podcast) {
    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', () => closeModal(modal));
    overlay.addEventListener('click', () => closeModal(modal));

    // ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Play buttons
    const playBtns = modal.querySelectorAll('[data-podcast-id]');
    playBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playPodcastInModal(podcast, modal);
        });
    });

    // Progress bar nel modal
    const progressBar = modal.querySelector('.detail-progress-bar');
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        updateModalProgress(percentage, modal);
    });

    // Volume nel modal
    const volumeBar = modal.querySelector('.detail-volume-bar');
    volumeBar.addEventListener('click', (e) => {
        const rect = volumeBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const volumePercentage = clickX / rect.width;
        updateModalVolume(volumePercentage, modal);
    });

    // Action buttons
    modal.querySelector('.follow-btn').addEventListener('click', () => followAuthor(podcast.author));
    modal.querySelector('.share-btn').addEventListener('click', () => sharePodcast(podcast));
    modal.querySelector('.download-btn').addEventListener('click', () => downloadPodcast(podcast));
}

function closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
    }, 300);
}

function playPodcastInModal(podcast, modal) {
    // Avvia anche il player fisso
    playPodcast(podcast);

    // Update modal UI
    const playBtn = modal.querySelector('.detail-play-pause i');
    playBtn.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';

    // Simula progress nel modal
    if (isPlaying) {
        simulateModalProgress(modal);
    }
}

function simulateModalProgress(modal) {
    const progressFill = modal.querySelector('.detail-progress-fill');
    const timeSpan = modal.querySelector('.detail-time-current');

    const interval = setInterval(() => {
        if (!isPlaying || !document.body.contains(modal)) {
            clearInterval(interval);
            return;
        }

        const percentage = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
        progressFill.style.width = `${percentage}%`;
        timeSpan.textContent = formatTime(currentTime);
    }, 1000);
}

function updateModalProgress(percentage, modal) {
    currentTime = Math.floor(totalDuration * percentage);
    const progressFill = modal.querySelector('.detail-progress-fill');
    const timeSpan = modal.querySelector('.detail-time-current');

    progressFill.style.width = `${percentage * 100}%`;
    timeSpan.textContent = formatTime(currentTime);
}

function updateModalVolume(percentage, modal) {
    volume = percentage;
    const volumeFill = modal.querySelector('.detail-volume-fill');
    volumeFill.style.width = `${percentage * 100}%`;

    // Update anche il player fisso
    if (volumeFill) {
        document.querySelector('.volume-fill').style.width = `${percentage * 100}%`;
    }
}

function getCategoryName(category) {
    const categories = {
        'wellness': 'Wellness',
        'mindfulness': 'Mindfulness',
        'nutrizione': 'Nutrizione',
        'fitness': 'Fitness',
        'stress': 'Stress Management',
        'coaching': 'Life Coaching',
        'meditazione': 'Meditazione'
    };
    return categories[category] || category;
}

function followAuthor(authorName) {
    // Simula follow
    console.log(`Seguendo ${authorName}...`);
    // Mostra toast di conferma
    showToast(`Ora segui ${authorName}! Riceverai notifiche sui nuovi podcast.`, 'success');
}

function sharePodcast(podcast) {
    // Simula condivisione
    if (navigator.share) {
        navigator.share({
            title: podcast.title,
            text: `Ascolta "${podcast.title}" di ${podcast.author}`,
            url: window.location.href
        });
    } else {
        // Fallback: copia link
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copiato negli appunti!', 'success');
    }
}

function downloadPodcast(podcast) {
    // Simula download
    console.log(`Scaricando ${podcast.title}...`);
    showToast('Download avviato!', 'info');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
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
    }, 4000);
}

/**
 * ===============================================
 * PERFORMANCE OPTIMIZATION
 * =============================================== */
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

// Debounce search for better performance
const debouncedSearch = debounce(handleSearch, 300);
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
    }
});

/**
 * ===============================================
 * GESTIONE ERRORI
 * =============================================== */
window.addEventListener('error', (e) => {
    console.error('Errore podcast player:', e.error);

    // Fallback: nascondi player in caso di errore
    if (podcastPlayer) {
        podcastPlayer.style.display = 'none';
    }
});

/**
 * ===============================================
 * ANALYTICS (SIMULATO)
 * =============================================== */
function trackPodcastPlay(podcast) {
    // Simula tracking analytics
    console.log('📊 Podcast played:', {
        id: podcast.id,
        title: podcast.title,
        author: podcast.author,
        timestamp: new Date().toISOString()
    });
}

function trackPodcastComplete(podcast) {
    // Simula tracking completamento
    console.log('📊 Podcast completed:', {
        id: podcast.id,
        title: podcast.title,
        duration: podcast.duration,
        timestamp: new Date().toISOString()
    });
}