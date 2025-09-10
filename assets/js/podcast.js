/**
 * PODCAST PAGE JAVASCRIPT - SERIE SYSTEM
 * Gestisce serie podcast con episodi multipli
 */

document.addEventListener('DOMContentLoaded', function () {
    window.podcastManager = new PodcastSeriesManager();
});

class PodcastSeriesManager {
    constructor() {
        this.currentEpisode = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.totalDuration = 0;
        this.volume = 0.7;
        this.allSeries = [];
        this.filteredSeries = [];
        this.init();
    }

    init() {
        this.loadSeriesData();
        this.setupEventListeners();
        this.setupFilters();
        this.setupPlayer();
        this.renderSeries();
        console.log('Podcast Series Manager inizializzato');
    }

    loadSeriesData() {
        // Simula dati serie podcast caricati dal microsito-professionista
        this.allSeries = [
            {
                id: 'series_1',
                title: 'Benessere Quotidiano',
                description: 'Una serie dedicata al benessere nella vita di tutti i giorni',
                author: 'Sophia Rossi',
                category: 'wellness',
                professional: 'sophia-rossi',
                cover: '../assets/images/podcast/cover-1.jpg',
                createdAt: '2024-01-15',
                episodes: [
                    {
                        number: 1,
                        title: 'Equilibrio Mente-Corpo',
                        description: 'Come trovare l\'armonia tra benessere fisico e mentale',
                        duration: '23:45',
                        audioUrl: '../assets/audio/episode-1-1.mp3'
                    },
                    {
                        number: 2,
                        title: 'Routine Mattutina',
                        description: 'Creare una routine che energizza la giornata',
                        duration: '18:30',
                        audioUrl: '../assets/audio/episode-1-2.mp3'
                    },
                    {
                        number: 3,
                        title: 'Gestione dello Stress',
                        description: 'Tecniche pratiche per affrontare lo stress quotidiano',
                        duration: '26:15',
                        audioUrl: '../assets/audio/episode-1-3.mp3'
                    }
                ]
            },
            {
                id: 'series_2',
                title: 'Mindfulness in Pratica',
                description: 'Esercizi guidati di mindfulness per principianti',
                author: 'Marco Bianchi',
                category: 'mindfulness',
                professional: 'marco-bianchi',
                cover: '../assets/images/podcast/cover-2.jpg',
                createdAt: '2024-01-10',
                episodes: [
                    {
                        number: 1,
                        title: 'Respirazione Consapevole',
                        description: 'Le basi della respirazione mindful',
                        duration: '12:30',
                        audioUrl: '../assets/audio/episode-2-1.mp3'
                    },
                    {
                        number: 2,
                        title: 'Attenzione al Presente',
                        description: 'Come rimanere focalizzati sul momento presente',
                        duration: '15:45',
                        audioUrl: '../assets/audio/episode-2-2.mp3'
                    }
                ]
            },
            {
                id: 'series_3',
                title: 'Alimentazione Consapevole',
                description: 'Nutrire corpo e mente attraverso scelte alimentari consapevoli',
                author: 'Elena Verdi',
                category: 'nutrizione',
                professional: 'elena-verdi',
                cover: '../assets/images/podcast/cover-3.jpg',
                createdAt: '2024-01-08',
                episodes: [
                    {
                        number: 1,
                        title: 'Alimentazione Intuitiva',
                        description: 'Ascoltare i segnali del proprio corpo',
                        duration: '31:15',
                        audioUrl: '../assets/audio/episode-3-1.mp3'
                    },
                    {
                        number: 2,
                        title: 'Mindful Eating',
                        description: 'Mangiare con consapevolezza e gratitudine',
                        duration: '24:50',
                        audioUrl: '../assets/audio/episode-3-2.mp3'
                    },
                    {
                        number: 3,
                        title: 'Superfoods Naturali',
                        description: 'Alimenti che nutrono corpo e mente',
                        duration: '28:40',
                        audioUrl: '../assets/audio/episode-3-3.mp3'
                    }
                ]
            },
            {
                id: 'series_4',
                title: 'Fitness Funzionale',
                description: 'Allenamento che migliora la qualità di vita quotidiana',
                author: 'Luca Ferrari',
                category: 'fitness',
                professional: 'luca-ferrari',
                cover: '../assets/images/podcast/cover-4.jpg',
                createdAt: '2024-01-05',
                episodes: [
                    {
                        number: 1,
                        title: 'Allenamento Funzionale',
                        description: 'Principi e benefici dell\'allenamento funzionale',
                        duration: '52:20',
                        audioUrl: '../assets/audio/episode-4-1.mp3'
                    }
                ]
            },
            {
                id: 'series_5',
                title: 'Stress Management',
                description: 'Strategie efficaci per gestire lo stress nella vita moderna',
                author: 'Sophia Rossi',
                category: 'stress',
                professional: 'sophia-rossi',
                cover: '../assets/images/podcast/cover-5.jpg',
                createdAt: '2024-01-01',
                episodes: [
                    {
                        number: 1,
                        title: 'Gestire lo Stress Lavorativo',
                        description: 'Mantenere il benessere nell\'ambiente professionale',
                        duration: '28:10',
                        audioUrl: '../assets/audio/episode-5-1.mp3'
                    },
                    {
                        number: 2,
                        title: 'Rilassamento Progressivo',
                        description: 'Tecniche di rilassamento per corpo e mente',
                        duration: '35:20',
                        audioUrl: '../assets/audio/episode-5-2.mp3'
                    }
                ]
            }
        ];

        this.filteredSeries = [...this.allSeries];
        this.updateStats();
    }

    setupEventListeners() {
        // Filtri serie
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
                this.updateActiveFilter(e.target);
            });
        });

        // Gestione tasti per player
        document.addEventListener('keydown', (e) => {
            if (this.currentEpisode) {
                this.handleKeyboardShortcuts(e);
            }
        });

        // Click fuori dal modal per chiudere
        document.getElementById('seriesModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('series-modal-overlay')) {
                this.closeSeriesModal();
            }
        });

        // Load more
        document.getElementById('loadMore').addEventListener('click', () => {
            this.loadMoreSeries();
        });

        // Search
        document.querySelector('.search-input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }

    setupFilters() {
        // Filtri dropdown
        document.getElementById('professionalFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('durationFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sortFilter').addEventListener('change', () => this.applyFilters());
    }

    setupPlayer() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const progressBar = document.querySelector('.progress-bar');
        const volumeBar = document.querySelector('.volume-bar');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const closeBtn = document.getElementById('playerClose');

        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        progressBar.addEventListener('click', (e) => this.seekTo(e));
        volumeBar.addEventListener('click', (e) => this.adjustVolume(e));
        prevBtn.addEventListener('click', () => this.playPrevious());
        nextBtn.addEventListener('click', () => this.playNext());
        closeBtn.addEventListener('click', () => this.closePlayer());
    }

    renderSeries() {
        const podcastGrid = document.getElementById('podcastGrid');

        if (this.filteredSeries.length === 0) {
            podcastGrid.innerHTML = '<div class="loading-placeholder"><p>Nessuna serie podcast disponibile</p></div>';
            return;
        }

        let seriesHTML = '';

        this.filteredSeries.forEach(series => {
            const totalEpisodes = series.episodes.length;
            const categoryName = this.getCategoryName(series.category);

            seriesHTML += `
                <div class="podcast-card" data-series-id="${series.id}" onclick="openSeriesModal('${series.id}')">
                    <div class="podcast-cover" style="background-image: url('${series.cover}');">
                        <div class="podcast-play-btn" onclick="event.stopPropagation(); playFirstEpisode('${series.id}')">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="episodes-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span>${totalEpisodes} episodi</span>
                        </div>
                        <div class="podcast-category">${categoryName}</div>
                    </div>
                    <div class="podcast-info">
                        <h3 class="podcast-title">${series.title}</h3>
                        <p class="podcast-description">${series.description}</p>
                        <div class="podcast-meta">
                            <div class="podcast-author">
                                <img src="../assets/images/professionisti/${series.professional}.jpg" alt="${series.author}" class="author-avatar">
                                <span class="author-name">${series.author}</span>
                            </div>
                            <span class="podcast-date">${this.formatDate(series.createdAt)}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        podcastGrid.innerHTML = seriesHTML;
    }

    openSeriesModal(seriesId) {
        const series = this.allSeries.find(s => s.id === seriesId);
        if (!series) return;

        // Aggiorna contenuto modal
        document.getElementById('seriesModalTitle').textContent = series.title;
        document.getElementById('seriesCoverLarge').style.backgroundImage = `url('${series.cover}')`;
        document.getElementById('seriesDetailTitle').textContent = series.title;
        document.getElementById('seriesDetailAuthor').textContent = `di ${series.author}`;
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
            ${this.getCategoryName(series.category)}
        `;

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

    closeSeriesModal() {
        document.getElementById('seriesModal').style.display = 'none';
        document.body.style.overflow = '';
    }

    playFirstEpisode(seriesId) {
        const series = this.allSeries.find(s => s.id === seriesId);
        if (series && series.episodes.length > 0) {
            this.playEpisode(seriesId, 1);
        }
    }

    playEpisode(seriesId, episodeNumber) {
        const series = this.allSeries.find(s => s.id === seriesId);
        if (!series) return;

        const episode = series.episodes.find(ep => ep.number === episodeNumber);
        if (!episode) return;

        this.currentEpisode = {
            series,
            episode,
            seriesId,
            episodeNumber
        };

        this.loadEpisodeInPlayer();
        this.startPlayback();
    }

    loadEpisodeInPlayer() {
        const { series, episode } = this.currentEpisode;

        // Aggiorna UI del player
        document.querySelector('.player-cover').src = series.cover;
        document.querySelector('.player-title').textContent = `${episode.title} - Ep. ${episode.number}`;
        document.querySelector('.player-author').textContent = series.author;
        document.querySelector('.time-total').textContent = episode.duration;

        // Mostra player
        document.getElementById('podcastPlayer').style.display = 'flex';

        // Simula caricamento audio
        this.totalDuration = this.parseDuration(episode.duration);
        this.currentTime = 0;
        this.updateProgressBar();
        this.updateTimeDisplay();
    }

    startPlayback() {
        this.isPlaying = true;
        this.updatePlayButton();
        this.simulateAudioPlayback();
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();

        if (this.isPlaying) {
            this.simulateAudioPlayback();
        }
    }

    updatePlayButton() {
        const icon = document.querySelector('#playPauseBtn i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    simulateAudioPlayback() {
        if (!this.isPlaying) return;

        const interval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(interval);
                return;
            }

            this.currentTime += 1;
            this.updateProgressBar();
            this.updateTimeDisplay();

            if (this.currentTime >= this.totalDuration) {
                clearInterval(interval);
                this.endEpisode();
            }
        }, 1000);
    }

    updateProgressBar() {
        const percentage = this.totalDuration > 0 ? (this.currentTime / this.totalDuration) * 100 : 0;
        document.querySelector('.progress-fill').style.width = `${percentage}%`;

        const handle = document.querySelector('.progress-handle');
        if (handle) {
            handle.style.left = `${percentage}%`;
        }
    }

    updateTimeDisplay() {
        document.querySelector('.time-current').textContent = this.formatTime(this.currentTime);
    }

    endEpisode() {
        this.isPlaying = false;
        this.updatePlayButton();

        // Auto-play next episode
        this.playNext();
    }

    playPrevious() {
        if (!this.currentEpisode) return;

        const { series, episodeNumber } = this.currentEpisode;

        if (episodeNumber > 1) {
            this.playEpisode(series.id, episodeNumber - 1);
        }
    }

    playNext() {
        if (!this.currentEpisode) return;

        const { series, episodeNumber } = this.currentEpisode;

        if (episodeNumber < series.episodes.length) {
            this.playEpisode(series.id, episodeNumber + 1);
        }
    }

    closePlayer() {
        this.isPlaying = false;
        this.currentEpisode = null;
        document.getElementById('podcastPlayer').style.display = 'none';
    }

    seekTo(e) {
        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        this.currentTime = Math.floor(this.totalDuration * percentage);
        this.updateProgressBar();
        this.updateTimeDisplay();
    }

    adjustVolume(e) {
        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        this.volume = clickX / rect.width;
        document.querySelector('.volume-fill').style.width = `${this.volume * 100}%`;
    }

    filterByCategory(category) {
        this.filteredSeries = category === 'all'
            ? [...this.allSeries]
            : this.allSeries.filter(s => s.category === category);

        this.applyAdditionalFilters();
        this.renderSeries();
    }

    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    applyFilters() {
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        this.filterByCategory(activeCategory);
    }

    applyAdditionalFilters() {
        const professional = document.getElementById('professionalFilter').value;
        const duration = document.getElementById('durationFilter').value;
        const sort = document.getElementById('sortFilter').value;

        // Filtra per professionista
        if (professional) {
            this.filteredSeries = this.filteredSeries.filter(s => s.professional === professional);
        }

        // Filtra per durata media episodi
        if (duration) {
            this.filteredSeries = this.filteredSeries.filter(series => {
                const avgDuration = this.calculateAverageDuration(series.episodes);
                return this.matchesDurationFilter(avgDuration, duration);
            });
        }

        // Ordina
        this.sortSeries(sort);
    }

    calculateAverageDuration(episodes) {
        if (episodes.length === 0) return 0;

        const totalSeconds = episodes.reduce((sum, episode) => {
            return sum + this.parseDuration(episode.duration);
        }, 0);

        return Math.floor(totalSeconds / episodes.length);
    }

    matchesDurationFilter(avgDuration, filter) {
        switch (filter) {
            case 'short':
                return avgDuration < 15 * 60; // meno di 15 minuti
            case 'medium':
                return avgDuration >= 15 * 60 && avgDuration <= 45 * 60; // 15-45 minuti
            case 'long':
                return avgDuration > 45 * 60; // più di 45 minuti
            default:
                return true;
        }
    }

    sortSeries(sortType) {
        switch (sortType) {
            case 'popular':
                this.filteredSeries.sort((a, b) => Math.random() - 0.5);
                break;
            case 'episodes-desc':
                this.filteredSeries.sort((a, b) => b.episodes.length - a.episodes.length);
                break;
            case 'episodes-asc':
                this.filteredSeries.sort((a, b) => a.episodes.length - b.episodes.length);
                break;
            case 'alphabetical':
                this.filteredSeries.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default: // newest
                this.filteredSeries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        if (term.length === 0) {
            this.applyFilters();
            return;
        }

        this.filteredSeries = this.allSeries.filter(series =>
            series.title.toLowerCase().includes(term) ||
            series.description.toLowerCase().includes(term) ||
            series.author.toLowerCase().includes(term) ||
            series.episodes.some(episode =>
                episode.title.toLowerCase().includes(term) ||
                episode.description.toLowerCase().includes(term)
            )
        );

        this.renderSeries();
        this.updateStats();
    }

    loadMoreSeries() {
        const loadingDiv = document.getElementById('podcastLoading');
        loadingDiv.style.display = 'flex';

        setTimeout(() => {
            loadingDiv.style.display = 'none';
            console.log('Caricate altre serie podcast...');
        }, 1500);
    }

    handleKeyboardShortcuts(e) {
        if (!this.currentEpisode) return;

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                this.currentTime = Math.max(0, this.currentTime - 10);
                this.updateProgressBar();
                this.updateTimeDisplay();
                break;
            case 'ArrowRight':
                this.currentTime = Math.min(this.totalDuration, this.currentTime + 10);
                this.updateProgressBar();
                this.updateTimeDisplay();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.volume = Math.min(1, this.volume + 0.1);
                document.querySelector('.volume-fill').style.width = `${this.volume * 100}%`;
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.volume = Math.max(0, this.volume - 0.1);
                document.querySelector('.volume-fill').style.width = `${this.volume * 100}%`;
                break;
        }
    }

    updateStats() {
        const totalEpisodes = this.allSeries.reduce((sum, series) => sum + series.episodes.length, 0);
        const totalSeries = this.allSeries.length;

        document.getElementById('totalEpisodes').textContent = totalEpisodes;
        document.getElementById('totalSeries').textContent = totalSeries;
    }

    // Utility Functions
    parseDuration(durationStr) {
        const parts = durationStr.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    formatDate(dateStr) {
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

    getCategoryName(category) {
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
}

// ===============================================
// FUNZIONI GLOBALI
// ===============================================

function openSeriesModal(seriesId) {
    window.podcastManager.openSeriesModal(seriesId);
}

function closeSeriesModal() {
    window.podcastManager.closeSeriesModal();
}

function playFirstEpisode(seriesId) {
    window.podcastManager.playFirstEpisode(seriesId);
}

function playEpisode(seriesId, episodeNumber) {
    window.podcastManager.playEpisode(seriesId, episodeNumber);
}

// ===============================================
// GESTIONE ERRORI
// ===============================================
window.addEventListener('error', (e) => {
    console.error('Errore podcast series manager:', e.error);

    if (document.getElementById('podcastPlayer')) {
        document.getElementById('podcastPlayer').style.display = 'none';
    }
});

console.log('Podcast Series System JS caricato');