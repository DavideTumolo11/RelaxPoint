/**
 * PODCAST PROFESSIONISTA PAGE JAVASCRIPT - SERIE SYSTEM
 * Gestisce serie podcast con episodi multipli per singolo professionista
 */

// Stato globale professionista
let professionalSeries = [];
let filteredProfessionalSeries = [];
let isFollowing = false;

document.addEventListener('DOMContentLoaded', function () {
    initializeProfessionalPodcastPage();
});

/**
 * ===============================================
 * INIZIALIZZAZIONE PAGINA PROFESSIONISTA
 * =============================================== */
function initializeProfessionalPodcastPage() {
    loadProfessionalSeries();
    setupProfessionalFilters();
    setupProfessionalActions();
    setupProfessionalEventListeners();
    renderProfessionalSeries();

    console.log('Professional podcast series page initialized');
}

/**
 * ===============================================
 * CARICAMENTO SERIE PODCAST PROFESSIONISTA
 * =============================================== */
function loadProfessionalSeries() {
    // Dati serie podcast di Sophia Rossi
    professionalSeries = [
        {
            id: 'sophia_series_1',
            title: 'Mindfulness Quotidiana',
            description: 'Una serie dedicata alla pratica della mindfulness nella vita di tutti i giorni',
            category: 'mindfulness',
            cover: '../../assets/images/podcast/sophia-cover-1.jpg',
            createdAt: '2024-01-15',
            episodes: [
                {
                    number: 1,
                    title: 'Respirazione Consapevole',
                    description: 'Tecniche di base per una respirazione mindful',
                    duration: '15:30',
                    plays: '2.1K'
                },
                {
                    number: 2,
                    title: 'Camminata Meditativa',
                    description: 'Come trasformare una semplice camminata in meditazione',
                    duration: '18:45',
                    plays: '1.8K'
                },
                {
                    number: 3,
                    title: 'Pausa Pranzo Mindful',
                    description: 'Momenti di consapevolezza durante la giornata lavorativa',
                    duration: '12:20',
                    plays: '2.3K'
                }
            ]
        },
        {
            id: 'sophia_series_2',
            title: 'Gestione dello Stress',
            description: 'Strategie pratiche per affrontare e gestire lo stress quotidiano',
            category: 'stress',
            cover: '../../assets/images/podcast/sophia-cover-2.jpg',
            createdAt: '2024-01-10',
            episodes: [
                {
                    number: 1,
                    title: 'Riconoscere i Segnali',
                    description: 'Come identificare i primi segnali di stress',
                    duration: '20:15',
                    plays: '3.2K'
                },
                {
                    number: 2,
                    title: 'Tecniche di Rilassamento',
                    description: 'Esercizi pratici per rilassare corpo e mente',
                    duration: '25:30',
                    plays: '2.9K'
                }
            ]
        },
        {
            id: 'sophia_series_3',
            title: 'Benessere Olistico',
            description: 'Un approccio completo al benessere che integra corpo, mente e spirito',
            category: 'wellness',
            cover: '../../assets/images/podcast/sophia-cover-3.jpg',
            createdAt: '2024-01-05',
            episodes: [
                {
                    number: 1,
                    title: 'Equilibrio Mente-Corpo',
                    description: 'Come trovare armonia tra aspetti fisici e mentali',
                    duration: '28:45',
                    plays: '4.1K'
                },
                {
                    number: 2,
                    title: 'Alimentazione Consapevole',
                    description: 'Nutrire il corpo in modo mindful e sostenibile',
                    duration: '32:10',
                    plays: '3.8K'
                },
                {
                    number: 3,
                    title: 'Movimento Naturale',
                    description: 'Riscoprire il piacere del movimento corporeo',
                    duration: '24:20',
                    plays: '3.5K'
                }
            ]
        },
        {
            id: 'sophia_series_4',
            title: 'Meditazione Guidata',
            description: 'Sessioni di meditazione per tutti i livelli di esperienza',
            category: 'meditazione',
            cover: '../../assets/images/podcast/sophia-cover-4.jpg',
            createdAt: '2024-01-01',
            episodes: [
                {
                    number: 1,
                    title: 'Meditazione del Mattino',
                    description: 'Inizia la giornata con energia positiva',
                    duration: '15:00',
                    plays: '2.7K'
                },
                {
                    number: 2,
                    title: 'Rilassamento Serale',
                    description: 'Preparati al riposo con questa meditazione',
                    duration: '20:30',
                    plays: '3.1K'
                }
            ]
        },
        {
            id: 'sophia_series_5',
            title: 'Coaching di Vita',
            description: 'Strumenti e strategie per migliorare la qualità della vita',
            category: 'coaching',
            cover: '../../assets/images/podcast/sophia-cover-5.jpg',
            createdAt: '2023-12-28',
            episodes: [
                {
                    number: 1,
                    title: 'Definire i Tuoi Obiettivi',
                    description: 'Come stabilire obiettivi realistici e raggiungibili',
                    duration: '35:15',
                    plays: '1.9K'
                },
                {
                    number: 2,
                    title: 'Superare gli Ostacoli',
                    description: 'Strategie per affrontare le sfide della vita',
                    duration: '28:40',
                    plays: '2.2K'
                },
                {
                    number: 3,
                    title: 'Costruire Abitudini Positive',
                    description: 'Come creare e mantenere abitudini che ti supportano',
                    duration: '31:55',
                    plays: '2.5K'
                }
            ]
        },
        {
            id: 'sophia_series_6',
            title: 'Nutrizione Consapevole',
            description: 'Sviluppare una relazione sana e consapevole con il cibo',
            category: 'nutrizione',
            cover: '../../assets/images/podcast/sophia-cover-6.jpg',
            createdAt: '2023-12-20',
            episodes: [
                {
                    number: 1,
                    title: 'Ascoltare il Corpo',
                    description: 'Imparare a riconoscere i segnali di fame e sazietà',
                    duration: '22:30',
                    plays: '3.4K'
                },
                {
                    number: 2,
                    title: 'Superare le Restrizioni',
                    description: 'Liberarsi dalla mentalità dietetica',
                    duration: '26:15',
                    plays: '2.8K'
                }
            ]
        }
    ];

    filteredProfessionalSeries = [...professionalSeries];
    updateProfessionalStats();
}

/**
 * ===============================================
 * RENDERIZZAZIONE SERIE
 * =============================================== */
function renderProfessionalSeries() {
    const podcastGrid = document.getElementById('professionalPodcastGrid');

    if (filteredProfessionalSeries.length === 0) {
        podcastGrid.innerHTML = '<div class="loading-placeholder"><p>Nessuna serie podcast disponibile</p></div>';
        return;
    }

    let seriesHTML = '';

    filteredProfessionalSeries.forEach(series => {
        const totalEpisodes = series.episodes.length;
        const totalPlays = series.episodes.reduce((sum, ep) => {
            const plays = parseFloat(ep.plays.replace('K', '')) * 1000;
            return sum + plays;
        }, 0);
        const formattedPlays = (totalPlays / 1000).toFixed(1) + 'K';

        seriesHTML += `
            <div class="podcast-card" onclick="openSeriesModal('${series.id}')">
                <div class="podcast-cover" style="background-image: url('${series.cover}');">
                    <div class="podcast-play-btn" onclick="event.stopPropagation(); playFirstEpisode('${series.id}')">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="episodes-badge">
                        <i class="fas fa-list"></i>
                        <span>${totalEpisodes} ep.</span>
                    </div>
                    <div class="podcast-category">${getCategoryName(series.category)}</div>
                </div>
                <div class="podcast-info">
                    <h3 class="podcast-title">${series.title}</h3>
                    <p class="podcast-description">${series.description}</p>
                    <div class="podcast-meta">
                        <span class="podcast-date">${formatDate(series.createdAt)}</span>
                        <span class="podcast-plays">${formattedPlays} ascolti</span>
                    </div>
                </div>
            </div>
        `;
    });

    podcastGrid.innerHTML = seriesHTML;
}

/**
 * ===============================================
 * MODAL SERIE E PLAYER
 * =============================================== */
function openSeriesModal(seriesId) {
    const series = professionalSeries.find(s => s.id === seriesId);
    if (!series) return;

    // Aggiorna contenuto modal
    document.getElementById('seriesModalTitle').textContent = series.title;
    document.getElementById('seriesCoverLarge').style.backgroundImage = `url('${series.cover}')`;
    document.getElementById('seriesDetailTitle').textContent = series.title;
    document.getElementById('seriesDetailAuthor').textContent = 'di Sophia Rossi';
    document.getElementById('seriesDetailDescription').textContent = series.description;
    document.getElementById('seriesDetailEpisodes').innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        ${series.episodes.length} episodi
    `;
    document.getElementById('seriesDetailCategory').innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2l-3.37.84z"/>
        </svg>
        ${getCategoryName(series.category)}
    `;

    // Setup bottone riproduci serie
    const playAllBtn = document.getElementById('seriesPlayAllBtn');
    playAllBtn.onclick = () => playFirstEpisode(series.id);

    // Genera lista episodi
    const episodesContainer = document.getElementById('episodesContainer');
    let episodesHTML = '';

    series.episodes.forEach(episode => {
        episodesHTML += `
            <div class="episode-item" onclick="playEpisode('${series.id}', ${episode.number})">
                <div class="episode-number">${episode.number}</div>
                <div class="episode-content">
                    <h5 class="episode-title">${episode.title}</h5>
                    <p class="episode-description">${episode.description}</p>
                </div>
                <div class="episode-duration">${episode.duration}</div>
                <div class="episode-plays">${episode.plays} ascolti</div>
                <button class="episode-play-btn" onclick="event.stopPropagation(); playEpisode('${series.id}', ${episode.number})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
    });

    episodesContainer.innerHTML = episodesHTML;

    // Mostra modal
    document.getElementById('seriesModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSeriesModal() {
    document.getElementById('seriesModal').style.display = 'none';
    document.body.style.overflow = '';
}

function playFirstEpisode(seriesId) {
    const series = professionalSeries.find(s => s.id === seriesId);
    if (series && series.episodes.length > 0) {
        playEpisode(seriesId, 1);
    }
}

function playEpisode(seriesId, episodeNumber) {
    const series = professionalSeries.find(s => s.id === seriesId);
    if (!series) return;

    const episode = series.episodes.find(ep => ep.number === episodeNumber);
    if (!episode) return;

    // Aggiorna player
    document.querySelector('.player-cover').src = series.cover;
    document.querySelector('.player-title').textContent = `${episode.title} - Ep. ${episode.number}`;
    document.querySelector('.player-author').textContent = 'Sophia Rossi';
    document.querySelector('.time-total').textContent = episode.duration;

    // Mostra player
    document.getElementById('podcastPlayer').style.display = 'flex';

    console.log(`Playing: ${episode.title} from series ${series.title}`);
}

/**
 * ===============================================
 * FILTRI E RICERCA
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

    // Reset filteredSeries
    filteredProfessionalSeries = [...professionalSeries];

    // Filtra per categoria
    if (category) {
        filteredProfessionalSeries = filteredProfessionalSeries.filter(s => s.category === category);
    }

    // Filtra per durata serie (numero episodi)
    if (duration) {
        filteredProfessionalSeries = filteredProfessionalSeries.filter(series => {
            const episodeCount = series.episodes.length;
            switch (duration) {
                case 'short': return episodeCount < 5;
                case 'medium': return episodeCount >= 5 && episodeCount <= 10;
                case 'long': return episodeCount > 10;
                default: return true;
            }
        });
    }

    // Ordina serie
    sortProfessionalSeries(sort);

    // Renderizza
    renderProfessionalSeries();
}

function sortProfessionalSeries(sortType) {
    switch (sortType) {
        case 'popular':
            // Ordina per ascolti totali
            filteredProfessionalSeries.sort((a, b) => {
                const aTotalPlays = a.episodes.reduce((sum, ep) => sum + parseFloat(ep.plays.replace('K', '')), 0);
                const bTotalPlays = b.episodes.reduce((sum, ep) => sum + parseFloat(ep.plays.replace('K', '')), 0);
                return bTotalPlays - aTotalPlays;
            });
            break;
        case 'episodes-desc':
            filteredProfessionalSeries.sort((a, b) => b.episodes.length - a.episodes.length);
            break;
        case 'episodes-asc':
            filteredProfessionalSeries.sort((a, b) => a.episodes.length - b.episodes.length);
            break;
        case 'alphabetical':
            filteredProfessionalSeries.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default: // newest
            filteredProfessionalSeries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}

function handleProfessionalSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm.length === 0) {
        applyProfessionalFilters();
        return;
    }

    filteredProfessionalSeries = professionalSeries.filter(series =>
        series.title.toLowerCase().includes(searchTerm) ||
        series.description.toLowerCase().includes(searchTerm) ||
        series.episodes.some(episode =>
            episode.title.toLowerCase().includes(searchTerm) ||
            episode.description.toLowerCase().includes(searchTerm)
        )
    );

    renderProfessionalSeries();
}

/**
 * ===============================================
 * AZIONI E INTERAZIONI
 * =============================================== */
function setupProfessionalActions() {
    const followBtn = document.querySelector('.follow-professional-btn');
    if (followBtn) {
        followBtn.addEventListener('click', toggleFollow);
    }

    // Chiudi player
    const playerClose = document.getElementById('playerClose');
    if (playerClose) {
        playerClose.addEventListener('click', () => {
            document.getElementById('podcastPlayer').style.display = 'none';
        });
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

function setupProfessionalEventListeners() {
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreProfessional');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProfessionalSeries);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', handleProfessionalKeyboard);
}

function loadMoreProfessionalSeries() {
    const loadMoreBtn = document.getElementById('loadMoreProfessional');
    loadMoreBtn.textContent = 'Caricamento...';
    loadMoreBtn.disabled = true;

    // Simula caricamento
    setTimeout(() => {
        loadMoreBtn.textContent = 'Carica Altre Serie';
        loadMoreBtn.disabled = false;
        showProfessionalToast('Caricate nuove serie!', 'success');
    }, 1500);
}

function handleProfessionalKeyboard(e) {
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
function updateProfessionalStats() {
    const totalEpisodes = professionalSeries.reduce((sum, series) => sum + series.episodes.length, 0);
    const totalSeries = professionalSeries.length;

    const totalSeriesEl = document.getElementById('totalSeries');
    const totalEpisodesEl = document.getElementById('totalEpisodes');

    if (totalSeriesEl) totalSeriesEl.textContent = totalSeries;
    if (totalEpisodesEl) totalEpisodesEl.textContent = totalEpisodes;
}

function getCategoryName(category) {
    const categories = {
        'wellness': 'Wellness',
        'mindfulness': 'Mindfulness',
        'stress': 'Stress Management',
        'nutrizione': 'Nutrizione',
        'meditazione': 'Meditazione',
        'coaching': 'Life Coaching'
    };
    return categories[category] || category;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 giorno fa';
    if (diffDays <= 7) return `${diffDays} giorni fa`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} settimane fa`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} mesi fa`;
    return `${Math.ceil(diffDays / 365)} anni fa`;
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