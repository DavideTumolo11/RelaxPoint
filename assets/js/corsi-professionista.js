/**
 * CORSI PROFESSIONISTA PAGE JAVASCRIPT - SERIE SYSTEM
 * Gestisce serie corsi con lezioni multiple
 */

document.addEventListener('DOMContentLoaded', function () {
    window.corsiManager = new CorsiSeriesManager();
});

class CorsiSeriesManager {
    constructor() {
        this.allSeries = [];
        this.filteredSeries = [];
        this.isFollowing = false;
        this.currentPage = 1;
        this.SERIES_PER_PAGE = 6;
        this.init();
    }

    init() {
        this.loadSeriesData();
        this.setupEventListeners();
        this.setupFilters();
        this.renderSeries();
        this.setupFollowButton();
        this.setupPagination();
        console.log('Corsi Series Manager inizializzato');
    }

    loadSeriesData() {
        // Simula dati serie corsi caricati dal microsito-professionista
        this.allSeries = [
            {
                id: 'series_1',
                title: 'Mindfulness Base - Percorso Completo',
                description: 'Un percorso strutturato di 8 settimane per imparare i fondamenti della mindfulness',
                category: 'mindfulness',
                type: 'online',
                duration: 8,
                price: 199,
                rating: 5.0,
                reviews: 127,
                students: 240,
                cover: '../../assets/images/corsi/mindfulness-base.jpg',
                createdAt: '2024-01-15',
                lessons: [
                    {
                        number: 1,
                        title: 'Introduzione alla Mindfulness',
                        description: 'Scopri cosa significa essere consapevoli nel momento presente',
                        duration: '45 min',
                        type: 'video'
                    },
                    {
                        number: 2,
                        title: 'Respirazione Consapevole',
                        description: 'Tecniche base di respirazione mindful',
                        duration: '30 min',
                        type: 'pratica'
                    },
                    {
                        number: 3,
                        title: 'Body Scan Guidato',
                        description: 'Esplorazione consapevole del corpo',
                        duration: '40 min',
                        type: 'pratica'
                    },
                    {
                        number: 4,
                        title: 'Gestione dei Pensieri',
                        description: 'Come osservare i pensieri senza giudizio',
                        duration: '35 min',
                        type: 'teoria'
                    }
                ]
            },
            {
                id: 'series_2',
                title: 'Yoga per Principianti',
                description: 'Corso introduttivo allo yoga con lezioni in presenza per iniziare il tuo percorso',
                category: 'yoga',
                type: 'presenza',
                duration: 4,
                price: 149,
                rating: 5.0,
                reviews: 89,
                students: 156,
                cover: '../../assets/images/corsi/yoga-principianti.jpg',
                createdAt: '2024-01-12',
                lessons: [
                    {
                        number: 1,
                        title: 'Posizioni Base',
                        description: 'Le asana fondamentali per iniziare',
                        duration: '60 min',
                        type: 'pratica'
                    },
                    {
                        number: 2,
                        title: 'Saluto al Sole',
                        description: 'Sequenza dinamica mattutina',
                        duration: '50 min',
                        type: 'pratica'
                    },
                    {
                        number: 3,
                        title: 'Rilassamento Finale',
                        description: 'Tecniche di rilassamento profondo',
                        duration: '30 min',
                        type: 'pratica'
                    }
                ]
            },
            {
                id: 'series_3',
                title: 'Gestione Stress e Ansia',
                description: 'Tecniche avanzate per gestire stress e ansia nella vita quotidiana',
                category: 'coaching',
                type: 'ibrido',
                duration: 6,
                price: 249,
                rating: 5.0,
                reviews: 203,
                students: 412,
                cover: '../../assets/images/corsi/gestione-stress.jpg',
                createdAt: '2024-01-10',
                lessons: [
                    {
                        number: 1,
                        title: 'Riconoscere lo Stress',
                        description: 'Identificare i segnali di stress nel corpo e nella mente',
                        duration: '40 min',
                        type: 'teoria'
                    },
                    {
                        number: 2,
                        title: 'Tecniche di Respirazione',
                        description: 'Esercizi pratici per calmare il sistema nervoso',
                        duration: '35 min',
                        type: 'pratica'
                    },
                    {
                        number: 3,
                        title: 'Mindfulness per l\'Ansia',
                        description: 'Approcci mindful per gestire l\'ansia',
                        duration: '45 min',
                        type: 'pratica'
                    },
                    {
                        number: 4,
                        title: 'Ristrutturazione Cognitiva',
                        description: 'Cambiare i pattern di pensiero negativi',
                        duration: '50 min',
                        type: 'teoria'
                    },
                    {
                        number: 5,
                        title: 'Piano Personalizzato',
                        description: 'Creare il tuo piano anti-stress',
                        duration: '60 min',
                        type: 'pratica'
                    }
                ]
            },
            {
                id: 'series_4',
                title: 'Alimentazione Consapevole',
                description: 'Sviluppa una relazione sana con il cibo attraverso la mindful eating',
                category: 'nutrizione',
                type: 'online',
                duration: 5,
                price: 179,
                rating: 4.8,
                reviews: 164,
                students: 298,
                cover: '../../assets/images/corsi/alimentazione.jpg',
                createdAt: '2024-01-08',
                lessons: [
                    {
                        number: 1,
                        title: 'Mindful Eating Basics',
                        description: 'I principi dell\'alimentazione consapevole',
                        duration: '40 min',
                        type: 'teoria'
                    },
                    {
                        number: 2,
                        title: 'Ascolto del Corpo',
                        description: 'Riconoscere fame e sazietà',
                        duration: '35 min',
                        type: 'pratica'
                    },
                    {
                        number: 3,
                        title: 'Liberarsi dalle Diete',
                        description: 'Superare la mentalità dietetica',
                        duration: '45 min',
                        type: 'teoria'
                    }
                ]
            }
        ];

        this.filteredSeries = [...this.allSeries];
        this.updateStats();
    }

    setupEventListeners() {
        // Click fuori dal modal per chiudere
        document.getElementById('courseSeriesModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('course-series-modal-overlay')) {
                this.closeCourseSeriesModal();
            }
        });

        // Search
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    setupFilters() {
        // Filtri dropdown
        const categoryFilter = document.getElementById('categoryFilter');
        const typeFilter = document.getElementById('typeFilter');
        const durationFilter = document.getElementById('durationFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (categoryFilter) categoryFilter.addEventListener('change', () => this.applyFilters());
        if (typeFilter) typeFilter.addEventListener('change', () => this.applyFilters());
        if (durationFilter) durationFilter.addEventListener('change', () => this.applyFilters());
        if (sortFilter) sortFilter.addEventListener('change', () => this.applyFilters());
    }

    setupFollowButton() {
        const followBtn = document.querySelector('.follow-professional-btn');
        if (followBtn) {
            followBtn.addEventListener('click', () => {
                this.isFollowing = !this.isFollowing;

                if (this.isFollowing) {
                    followBtn.innerHTML = '<i class="fas fa-bell"></i> Seguendo';
                    followBtn.classList.add('following');
                    this.showToast('Ora segui i corsi di Sophia Rossi!', 'success');
                } else {
                    followBtn.innerHTML = '<i class="fas fa-bell"></i> Segui Corsi';
                    followBtn.classList.remove('following');
                    this.showToast('Non segui più i corsi di Sophia Rossi', 'info');
                }
            });
        }
    }

    setupPagination() {
        const loadMoreBtn = document.getElementById('loadMoreCorsi');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderSeries();
            });
        }
    }

    renderSeries() {
        const corsiGrid = document.getElementById('corsiGrid');

        if (this.filteredSeries.length === 0) {
            corsiGrid.innerHTML = '<div class="loading-placeholder"><p>Nessuna serie corso disponibile</p></div>';
            return;
        }

        const startIndex = 0;
        const endIndex = this.currentPage * this.SERIES_PER_PAGE;
        const seriesToShow = this.filteredSeries.slice(startIndex, endIndex);

        let seriesHTML = '';

        seriesToShow.forEach(series => {
            const totalLessons = series.lessons.length;
            const stars = '★'.repeat(Math.floor(series.rating)) + '☆'.repeat(5 - Math.floor(series.rating));

            seriesHTML += `
                <div class="corso-card" data-series-id="${series.id}" onclick="openCourseSeriesModal('${series.id}')">
                    <div class="corso-cover" style="background-image: url('${series.cover}');">
                        <div class="corso-play-button" onclick="event.stopPropagation(); openCourseSeriesModal('${series.id}')">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="lessons-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span>${totalLessons} lezioni</span>
                        </div>
                        <div class="corso-type-badge ${series.type}">${this.getTypeBadgeText(series.type)}</div>
                        <div class="corso-duration">${series.duration} settimane</div>
                    </div>
                    <div class="corso-info">
                        <h3 class="corso-title">${series.title}</h3>
                        <p class="corso-description">${series.description}</p>
                        <div class="corso-meta">
                            <div class="corso-price">€${series.price}</div>
                            <div class="corso-rating">
                                <span class="rating-stars">${stars}</span>
                                <span class="rating-count">(${series.reviews})</span>
                            </div>
                        </div>
                        <div class="corso-details">
                            <span class="corso-lessons"><i class="fas fa-video"></i> ${totalLessons} lezioni</span>
                            <span class="corso-students"><i class="fas fa-users"></i> ${series.students} studenti</span>
                        </div>
                    </div>
                </div>
            `;
        });

        corsiGrid.innerHTML = seriesHTML;

        // Aggiorna paginazione
        this.updatePaginationButton();
    }

    openCourseSeriesModal(seriesId) {
        const series = this.allSeries.find(s => s.id === seriesId);
        if (!series) return;

        // Aggiorna contenuto modal
        document.getElementById('courseSeriesModalTitle').textContent = series.title;
        document.getElementById('courseSeriesCoverLarge').style.backgroundImage = `url('${series.cover}')`;
        document.getElementById('courseSeriesDetailTitle').textContent = series.title;
        document.getElementById('courseSeriesDetailAuthor').textContent = 'di Sophia Rossi';
        document.getElementById('courseSeriesDetailDescription').textContent = series.description;
        document.getElementById('courseSeriesDetailLessons').innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            ${series.lessons.length} lezioni
        `;
        document.getElementById('courseSeriesDetailDuration').innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            ${series.duration} settimane
        `;
        document.getElementById('courseSeriesDetailPrice').innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 15h2c0 1.08 1.37 2 3 2s3-.92 3-2c0-1.1-1.04-1.5-3.24-2.03C9.64 12.44 7 11.78 7 9c0-1.79 1.47-3.31 3.5-3.82V3h3v2.18C15.53 5.69 17 7.21 17 9h-2c0-1.08-1.37-2-3-2s-3 .92-3 2c0 1.1 1.04 1.5 3.24 2.03C14.36 11.56 17 12.22 17 15c0 1.79-1.47 3.31-3.5 3.82V21h-3v-2.18C8.47 18.31 7 16.79 7 15z"/>
            </svg>
            €${series.price}
        `;

        // Setup bottone iscrizione
        const enrollBtn = document.getElementById('courseEnrollBtn');
        enrollBtn.onclick = () => this.enrollCourse(series);

        // Genera lista lezioni
        const lessonsContainer = document.getElementById('lessonsContainer');
        let lessonsHTML = '';

        series.lessons.forEach(lesson => {
            lessonsHTML += `
                <div class="lesson-item">
                    <div class="lesson-number">${lesson.number}</div>
                    <div class="lesson-content">
                        <h5 class="lesson-title">${lesson.title}</h5>
                        <p class="lesson-description">${lesson.description}</p>
                    </div>
                    <div class="lesson-duration">${lesson.duration}</div>
                    <div class="lesson-type">${lesson.type}</div>
                </div>
            `;
        });

        lessonsContainer.innerHTML = lessonsHTML;

        // Mostra modal
        document.getElementById('courseSeriesModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeCourseSeriesModal() {
        document.getElementById('courseSeriesModal').style.display = 'none';
        document.body.style.overflow = '';
    }

    enrollCourse(series) {
        // Simula processo di iscrizione
        const enrollBtn = document.getElementById('courseEnrollBtn');
        enrollBtn.textContent = 'Elaborazione...';
        enrollBtn.disabled = true;

        setTimeout(async () => {
            try {
                // Simula pagamento completato
                const paymentData = {
                    userId: 'user_123',
                    professionalId: 'prof_sophia',
                    type: 'course_series',
                    serviceId: series.id,
                    serviceName: series.title,
                    price: series.price,
                    paymentId: 'pay_' + Date.now(),
                    courseData: {
                        lessons: series.lessons.length,
                        duration: series.duration,
                        seriesId: series.id
                    }
                };

                // Genera codice accesso tramite sistema unificato
                if (window.RelaxPointAccess) {
                    const accessCode = await window.RelaxPointAccess.generateAccessCode(paymentData);
                    console.log('✅ Codice accesso generato:', accessCode.code);
                }

                this.closeCourseSeriesModal();
                this.showToast(`Iscrizione al corso "${series.title}" completata!`, 'success');

            } catch (error) {
                console.error('Error enrolling course:', error);
                this.showToast('Errore durante l\'iscrizione', 'error');

                enrollBtn.innerHTML = '<i class="fas fa-graduation-cap"></i> Iscriviti al Corso';
                enrollBtn.disabled = false;
            }
        }, 2000);
    }

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const typeFilter = document.getElementById('typeFilter')?.value || '';
        const durationFilter = document.getElementById('durationFilter')?.value || '';
        const sortFilter = document.getElementById('sortFilter')?.value || 'recent';

        // Filtra serie
        this.filteredSeries = this.allSeries.filter(series => {
            const matchCategory = !categoryFilter || series.category === categoryFilter;
            const matchType = !typeFilter || series.type === typeFilter;

            let matchDuration = true;
            if (durationFilter === 'brevi') {
                matchDuration = series.duration <= 4;
            } else if (durationFilter === 'medi') {
                matchDuration = series.duration >= 5 && series.duration <= 8;
            } else if (durationFilter === 'lunghi') {
                matchDuration = series.duration >= 9;
            }

            return matchCategory && matchType && matchDuration;
        });

        // Ordina serie
        this.sortSeries(sortFilter);

        // Reset paginazione
        this.currentPage = 1;
        this.renderSeries();
    }

    sortSeries(sortType) {
        switch (sortType) {
            case 'popular':
                this.filteredSeries.sort((a, b) => b.students - a.students);
                break;
            case 'lessons-desc':
                this.filteredSeries.sort((a, b) => b.lessons.length - a.lessons.length);
                break;
            case 'lessons-asc':
                this.filteredSeries.sort((a, b) => a.lessons.length - b.lessons.length);
                break;
            case 'price-low':
                this.filteredSeries.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredSeries.sort((a, b) => b.price - a.price);
                break;
            default: // recent
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
            series.lessons.some(lesson =>
                lesson.title.toLowerCase().includes(term) ||
                lesson.description.toLowerCase().includes(term)
            )
        );

        this.currentPage = 1;
        this.renderSeries();
    }

    updatePaginationButton() {
        const loadMoreBtn = document.getElementById('loadMoreCorsi');
        if (!loadMoreBtn) return;

        const totalShown = this.currentPage * this.SERIES_PER_PAGE;
        const hasMore = totalShown < this.filteredSeries.length;

        if (hasMore) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = `Carica Altre Serie (${this.filteredSeries.length - totalShown} rimanenti)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    updateStats() {
        const totalLessons = this.allSeries.reduce((sum, series) => sum + series.lessons.length, 0);
        const totalSeries = this.allSeries.length;

        const totalSeriesEl = document.getElementById('totalSeries');
        const totalLessonsEl = document.getElementById('totalLessons');

        if (totalSeriesEl) totalSeriesEl.textContent = totalSeries;
        if (totalLessonsEl) totalLessonsEl.textContent = totalLessons;
    }

    getTypeBadgeText(type) {
        switch (type) {
            case 'online': return 'Online';
            case 'presenza': return 'In Presenza';
            case 'ibrido': return 'Ibrido';
            default: return 'Online';
        }
    }

    showToast(message, type = 'info') {
        // Rimuovi toast esistenti
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
}

// ===============================================
// FUNZIONI GLOBALI
// ===============================================

function openCourseSeriesModal(seriesId) {
    window.corsiManager.openCourseSeriesModal(seriesId);
}

function closeCourseSeriesModal() {
    window.corsiManager.closeCourseSeriesModal();
}

// ===============================================
// GESTIONE ERRORI
// ===============================================
window.addEventListener('error', (e) => {
    console.error('Errore corsi series manager:', e.error);
});

console.log('Corsi Series System JS caricato');