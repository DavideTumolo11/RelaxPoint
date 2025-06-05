/* ===============================================
   RELAXPOINT - JS PREFERITI CLIENTE
   Gestione professionisti preferiti con filtri e statistiche
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('❤️ Preferiti Cliente - JS caricato');

    // ===============================================
    // STATO GLOBALE APPLICAZIONE
    // ===============================================
    let appState = {
        favorites: [],
        filteredFavorites: [],
        filters: {
            category: 'all',
            sort: 'recent',
            search: ''
        },
        stats: {
            total: 0,
            topCategory: '',
            lastAdded: ''
        },
        isLoading: false
    };

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const elements = {
        // Filtri
        categoryFilter: document.getElementById('categoryFilter'),
        sortFilter: document.getElementById('sortFilter'),
        searchInput: document.getElementById('searchFavorites'),

        // Contenuto
        favoritesGrid: document.getElementById('favoritesGrid'),
        filteredCount: document.getElementById('filteredCount'),
        emptyState: document.getElementById('emptyState'),
        loadingSpinner: document.getElementById('loadingSpinner'),

        // Statistiche
        totalFavorites: document.getElementById('totalFavorites'),
        topCategory: document.getElementById('topCategory'),
        lastAdded: document.getElementById('lastAdded'),

        // Modal
        confirmModal: document.getElementById('confirmModal'),
        closeModal: document.getElementById('closeModal'),
        professionalName: document.getElementById('professionalName'),
        confirmRemove: document.getElementById('confirmRemove'),
        cancelRemove: document.getElementById('cancelRemove')
    };

    // ===============================================
    // DATI MOCK PREFERITI
    // ===============================================
    const mockFavorites = [
        {
            id: 1,
            name: 'Marco Rossi',
            category: 'massaggi',
            specialization: 'Massoterapista specializzato in tecniche decontratturanti',
            avatar: '../../assets/images/Professionisti/pr2.png',
            rating: 4.8,
            reviewCount: 127,
            lastBooking: '2024-07-15',
            totalBookings: 5,
            priceRange: '€60 - €80',
            averagePrice: 70,
            addedDate: '2024-06-20',
            slug: 'marco-rossi'
        },
        {
            id: 2,
            name: 'Laura Verdi',
            category: 'beauty',
            specialization: 'Estetista qualificata con specializzazione in skincare',
            avatar: '../../assets/images/Professionisti/pr3.png',
            rating: 4.9,
            reviewCount: 89,
            lastBooking: '2024-08-03',
            totalBookings: 3,
            priceRange: '€75 - €120',
            averagePrice: 95,
            addedDate: '2024-07-01',
            slug: 'laura-verdi'
        },
        {
            id: 3,
            name: 'Giulia Rossi',
            category: 'fitness',
            specialization: 'Personal trainer certificata specializzata in allenamento funzionale',
            avatar: '../../assets/images/Professionisti/pr1.png',
            rating: 4.9,
            reviewCount: 156,
            lastBooking: '2024-07-22',
            totalBookings: 8,
            priceRange: '€50 - €70',
            averagePrice: 60,
            addedDate: '2024-05-15',
            slug: 'giulia-rossi'
        },
        {
            id: 4,
            name: 'Sofia Moretti',
            category: 'hair-makeup',
            specialization: 'Make-up artist e hair stylist per eventi speciali',
            avatar: '../../assets/images/Professionisti/pr5.png',
            rating: 4.7,
            reviewCount: 73,
            lastBooking: '2024-06-28',
            totalBookings: 2,
            priceRange: '€80 - €150',
            averagePrice: 115,
            addedDate: '2024-07-20',
            slug: 'sofia-moretti'
        },
        {
            id: 5,
            name: 'Andrea Costa',
            category: 'fisioterapia',
            specialization: 'Fisioterapista laureato specializzato in riabilitazione ortopedica',
            avatar: '../../assets/images/Professionisti/pr4.png',
            rating: 4.6,
            reviewCount: 94,
            lastBooking: '2024-07-10',
            totalBookings: 4,
            priceRange: '€70 - €90',
            averagePrice: 80,
            addedDate: '2024-06-05',
            slug: 'andrea-costa'
        },
        {
            id: 6,
            name: 'Elena Ferrari',
            category: 'gravidanza',
            specialization: 'Ostetrica qualificata specializzata in assistenza pre e post parto',
            avatar: '../../assets/images/Professionisti/pr6.png',
            rating: 4.9,
            reviewCount: 68,
            lastBooking: '2024-07-05',
            totalBookings: 6,
            priceRange: '€90 - €120',
            averagePrice: 105,
            addedDate: '2024-06-10',
            slug: 'elena-ferrari'
        }
    ];

    let pendingRemoval = null;

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        setupEventListeners();
        loadFavorites();
        updateStatistics();
        console.log('✅ Preferiti - Tutto inizializzato');
    }

    // ===============================================
    // EVENT LISTENERS
    // ===============================================
    function setupEventListeners() {
        // Filtri
        if (elements.categoryFilter) {
            elements.categoryFilter.addEventListener('change', handleCategoryFilter);
        }

        if (elements.sortFilter) {
            elements.sortFilter.addEventListener('change', handleSortFilter);
        }

        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
        }

        // Modal
        if (elements.closeModal) {
            elements.closeModal.addEventListener('click', closeConfirmModal);
        }

        if (elements.cancelRemove) {
            elements.cancelRemove.addEventListener('click', closeConfirmModal);
        }

        if (elements.confirmRemove) {
            elements.confirmRemove.addEventListener('click', handleConfirmRemoval);
        }

        // Click fuori modal per chiudere
        if (elements.confirmModal) {
            elements.confirmModal.addEventListener('click', function (e) {
                if (e.target === this) {
                    closeConfirmModal();
                }
            });
        }

        // Event delegation per azioni dinamiche
        document.addEventListener('click', handleDynamicActions);
    }

    // ===============================================
    // GESTIONE FILTRI
    // ===============================================
    function handleCategoryFilter(e) {
        appState.filters.category = e.target.value;
        console.log(`🔍 Filtro categoria: ${appState.filters.category}`);
        applyFilters();
    }

    function handleSortFilter(e) {
        appState.filters.sort = e.target.value;
        console.log(`📊 Ordinamento: ${appState.filters.sort}`);
        applyFilters();
    }

    function handleSearch(e) {
        appState.filters.search = e.target.value.toLowerCase().trim();
        console.log(`🔍 Ricerca: "${appState.filters.search}"`);
        applyFilters();
    }

    function applyFilters() {
        if (appState.isLoading) return;

        showLoading();

        setTimeout(() => {
            let filtered = [...appState.favorites];

            // Filtro categoria
            if (appState.filters.category !== 'all') {
                filtered = filtered.filter(fav => fav.category === appState.filters.category);
            }

            // Filtro ricerca
            if (appState.filters.search) {
                filtered = filtered.filter(fav =>
                    fav.name.toLowerCase().includes(appState.filters.search) ||
                    fav.specialization.toLowerCase().includes(appState.filters.search) ||
                    fav.category.toLowerCase().includes(appState.filters.search)
                );
            }

            // Ordinamento
            switch (appState.filters.sort) {
                case 'alphabetical':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'rating':
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                case 'bookings':
                    filtered.sort((a, b) => b.totalBookings - a.totalBookings);
                    break;
                case 'recent':
                default:
                    filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
                    break;
            }

            appState.filteredFavorites = filtered;
            renderFavorites();
            updateFilteredCount();
            hideLoading();
        }, 300);
    }

    // ===============================================
    // CARICAMENTO E RENDERING
    // ===============================================
    function loadFavorites() {
        showLoading();

        // Simula caricamento da API
        setTimeout(() => {
            appState.favorites = [...mockFavorites];
            appState.filteredFavorites = [...mockFavorites];
            renderFavorites();
            updateStatistics();
            updateFilteredCount();
            hideLoading();
        }, 500);
    }

    function renderFavorites() {
        if (!elements.favoritesGrid) return;

        if (appState.filteredFavorites.length === 0) {
            showEmptyState();
            return;
        }

        hideEmptyState();

        const html = appState.filteredFavorites.map((favorite, index) => `
            <div class="favorite-card" data-category="${favorite.category}" data-professional="${favorite.slug}" style="animation-delay: ${index * 0.1}s">
                <div class="favorite-image">
                    <img src="${favorite.avatar}" alt="${favorite.name}">
                    <div class="favorite-overlay">
                        <button class="btn-remove-favorite" data-id="${favorite.id}" title="Rimuovi dai preferiti">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="favorite-info">
                    <div class="professional-header">
                        <h4 class="professional-name">${favorite.name}</h4>
                        <span class="professional-category">${getCategoryDisplayName(favorite.category)}</span>
                    </div>

                    <p class="professional-specialization">${favorite.specialization}</p>

                    <div class="professional-stats">
                        <div class="stat-row">
                            <div class="professional-rating">
                                <div class="stars">
                                    ${generateStars(favorite.rating)}
                                </div>
                                <span class="rating-value">${favorite.rating}</span>
                                <span class="review-count">(${favorite.reviewCount} recensioni)</span>
                            </div>
                        </div>

                        <div class="stat-row">
                            <div class="booking-stats">
                                <span class="last-booking">Ultima prenotazione: ${formatDate(favorite.lastBooking)}</span>
                                <span class="total-bookings">${favorite.totalBookings} prenotazioni totali</span>
                            </div>
                        </div>

                        <div class="stat-row">
                            <div class="price-info">
                                <span class="price-range">${favorite.priceRange}</span>
                                <span class="average-price">Media: €${favorite.averagePrice}</span>
                            </div>
                        </div>
                    </div>

                    <div class="favorite-actions">
                        <button class="btn-action primary" data-action="profile" data-professional="${favorite.slug}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            Vedi Profilo
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        elements.favoritesGrid.innerHTML = html;
    }

    // ===============================================
    // GESTIONE AZIONI
    // ===============================================
    function handleDynamicActions(e) {
        const removeBtn = e.target.closest('.btn-remove-favorite');
        const profileBtn = e.target.closest('[data-action="profile"]');

        if (removeBtn) {
            const favoriteId = parseInt(removeBtn.getAttribute('data-id'));
            showRemoveConfirmation(favoriteId);
        }

        if (profileBtn) {
            const professionalSlug = profileBtn.getAttribute('data-professional');
            handleViewProfile(professionalSlug);
        }
    }

    function showRemoveConfirmation(favoriteId) {
        const favorite = appState.favorites.find(f => f.id === favoriteId);
        if (!favorite) return;

        pendingRemoval = favoriteId;

        if (elements.professionalName) {
            elements.professionalName.textContent = favorite.name;
        }

        if (elements.confirmModal) {
            elements.confirmModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeConfirmModal() {
        pendingRemoval = null;

        if (elements.confirmModal) {
            elements.confirmModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    function handleConfirmRemoval() {
        if (!pendingRemoval) return;

        // Rimuovi dall'array
        appState.favorites = appState.favorites.filter(f => f.id !== pendingRemoval);

        // Riapplica filtri
        applyFilters();

        // Aggiorna statistiche
        updateStatistics();

        // Chiudi modal
        closeConfirmModal();

        // Mostra notifica
        showToast('Professionista rimosso dai preferiti', 'success');

        console.log(`❌ Preferito rimosso: ID ${pendingRemoval}`);
    }

    function handleViewProfile(professionalSlug) {
        console.log(`👁️ Visualizza profilo: ${professionalSlug}`);
        showToast('Apertura profilo professionista...', 'info');

        // In implementazione reale: redirect al profilo
        setTimeout(() => {
            window.location.href = `../../pages/professionista/${professionalSlug}.html`;
        }, 1000);
    }

    // ===============================================
    // STATISTICHE
    // ===============================================
    function updateStatistics() {
        const stats = calculateStatistics();
        appState.stats = stats;

        if (elements.totalFavorites) {
            elements.totalFavorites.textContent = stats.total;
        }

        if (elements.topCategory) {
            elements.topCategory.textContent = stats.topCategory;
        }

        if (elements.lastAdded) {
            elements.lastAdded.textContent = stats.lastAdded;
        }
    }

    function calculateStatistics() {
        const favorites = appState.favorites;

        // Calcola categoria più frequente
        const categoryCount = {};
        favorites.forEach(fav => {
            categoryCount[fav.category] = (categoryCount[fav.category] || 0) + 1;
        });

        const topCategory = Object.keys(categoryCount).reduce((a, b) =>
            categoryCount[a] > categoryCount[b] ? a : b, 'massaggi'
        );

        // Trova ultimo aggiunto
        const lastAddedFav = favorites.reduce((latest, current) =>
            new Date(current.addedDate) > new Date(latest.addedDate) ? current : latest,
            favorites[0]
        );

        const daysSinceAdded = Math.floor(
            (new Date() - new Date(lastAddedFav?.addedDate || new Date())) / (1000 * 60 * 60 * 24)
        );

        return {
            total: favorites.length,
            topCategory: getCategoryDisplayName(topCategory),
            lastAdded: daysSinceAdded === 0 ? 'Oggi' : `${daysSinceAdded} giorni fa`
        };
    }

    function updateFilteredCount() {
        if (elements.filteredCount) {
            elements.filteredCount.textContent = appState.filteredFavorites.length;
        }
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<span class="star filled">★</span>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<span class="star filled">★</span>';
            } else {
                stars += '<span class="star">★</span>';
            }
        }
        return stars;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    function getCategoryDisplayName(category) {
        const categoryNames = {
            'massaggi': 'Massaggi',
            'beauty': 'Beauty',
            'fitness': 'Fitness',
            'fisioterapia': 'Fisioterapia',
            'hair-makeup': 'Hair & Make-up',
            'gravidanza': 'Gravidanza'
        };
        return categoryNames[category] || category;
    }

    function showLoading() {
        appState.isLoading = true;
        if (elements.loadingSpinner) {
            elements.loadingSpinner.style.display = 'flex';
        }
        if (elements.favoritesGrid) {
            elements.favoritesGrid.style.opacity = '0.6';
        }
    }

    function hideLoading() {
        appState.isLoading = false;
        if (elements.loadingSpinner) {
            elements.loadingSpinner.style.display = 'none';
        }
        if (elements.favoritesGrid) {
            elements.favoritesGrid.style.opacity = '1';
        }
    }

    function showEmptyState() {
        if (elements.emptyState) {
            elements.emptyState.style.display = 'flex';
        }
        if (elements.favoritesGrid) {
            elements.favoritesGrid.style.display = 'none';
        }
    }

    function hideEmptyState() {
        if (elements.emptyState) {
            elements.emptyState.style.display = 'none';
        }
        if (elements.favoritesGrid) {
            elements.favoritesGrid.style.display = 'grid';
        }
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getToastColor(type)};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 350px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        const icon = getToastIcon(type);
        toast.innerHTML = `${icon}<span>${message}</span>`;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    function getToastColor(type) {
        const colors = {
            success: 'var(--color-primary)',
            error: '#ef4444',
            warning: '#f59e0b',
            info: 'var(--color-secondary)'
        };
        return colors[type] || colors.info;
    }

    function getToastIcon(type) {
        const icons = {
            success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>',
            error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/></svg>',
            warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/></svg>',
            info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/></svg>'
        };
        return icons[type] || icons.info;
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

    // ===============================================
    // KEYBOARD SHORTCUTS
    // ===============================================
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function (e) {
            // Ctrl/Cmd + F = Focus ricerca
            if ((e.ctrlKey || e.metaKey) && e.key === 'f' && elements.searchInput) {
                e.preventDefault();
                elements.searchInput.focus();
            }

            // Escape = Clear ricerca o chiudi modal
            if (e.key === 'Escape') {
                if (elements.confirmModal && elements.confirmModal.style.display === 'flex') {
                    closeConfirmModal();
                } else if (elements.searchInput) {
                    elements.searchInput.value = '';
                    elements.searchInput.dispatchEvent(new Event('input'));
                }
            }
        });
    }

    // ===============================================
    // RESPONSIVE UTILITIES
    // ===============================================
    function handleResize() {
        window.addEventListener('resize', debounce(() => {
            const isMobile = window.innerWidth < 768;

            // Adatta layout se necessario
            if (isMobile) {
                console.log('📱 Layout mobile attivo');
            }
        }, 250));
    }

    // ===============================================
    // ANALYTICS E TRACKING
    // ===============================================
    function trackEvent(eventName, eventData = {}) {
        console.log(`📊 Analytics: ${eventName}`, eventData);

        // In implementazione reale: Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                page_title: 'Dashboard Preferiti',
                page_location: window.location.href,
                ...eventData
            });
        }
    }

    // ===============================================
    // GESTIONE ERRORI
    // ===============================================
    function handleError(error, context = 'Operazione') {
        console.error(`❌ Errore in ${context}:`, error);
        showToast(`${context} fallita. Riprova più tardi.`, 'error');
    }

    // ===============================================
    // GESTIONE VISIBILITÀ TAB
    // ===============================================
    function handleVisibilityChange() {
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden && !appState.isLoading) {
                console.log('🔄 Tab visibile - Aggiornamento preferiti');
                // Potrebbero essere stati aggiunti nuovi preferiti in altre tab
            }
        });
    }

    // ===============================================
    // INIZIALIZZAZIONE AVANZATA
    // ===============================================
    function initAdvancedFeatures() {
        setupKeyboardShortcuts();
        handleResize();
        handleVisibilityChange();

        // Track page view
        trackEvent('page_view', {
            page_title: 'Dashboard Preferiti',
            user_type: 'cliente',
            total_favorites: appState.favorites.length
        });
    }

    // ===============================================
    // CLEANUP
    // ===============================================
    function cleanup() {
        window.addEventListener('beforeunload', () => {
            console.log('🧹 Cleanup dashboard preferiti');
            // Clear timeouts, intervals, etc.
        });
    }



    // ===============================================
    // AVVIO APPLICAZIONE
    // ===============================================
    try {
        init();
        initAdvancedFeatures();
        cleanup();

        console.log('🚀 Dashboard Preferiti completamente inizializzata');

        // Mostra messaggio di benvenuto
        setTimeout(() => {
            showToast('Preferiti caricati con successo', 'success');
        }, 1000);

    } catch (error) {
        handleError(error, 'Inizializzazione dashboard preferiti');
    }

    // ===============================================
    // EXPORT PER DEBUG (solo development)
    // ===============================================
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.FavoritesDebug = {
            state: appState,
            mockData: mockFavorites,
            functions: {
                loadFavorites,
                applyFilters,
                showToast,
                updateStatistics
            }
        };
        console.log('🧪 Debug tools available: window.FavoritesDebug');
    }

});