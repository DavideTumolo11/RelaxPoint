/* ===============================================
   RELAXPOINT - JS ISPIRAZIONI
   Gestione griglia Instagram, filtri e interazioni
   =============================================== */

// Stato globale applicazione
let appState = {
    currentFilter: 'all',
    currentSort: 'recent',
    currentType: 'all',
    currentLocation: 'all',
    isLoggedIn: false, // Simula stato login
    likedItems: new Set(),
    loadedItems: 0,
    totalItems: 1247,
    isLoading: false
};

// Dati mock ispirazioni (in produzione verrebbero da API)
const mockInspirations = [
    {
        id: 1,
        category: 'hair-makeup',
        type: 'photo',
        location: 'cagliari',
        professionalName: 'Giulia Rossi',
        professionalAvatar: '/assets/images/Professionisti/pr1.png',
        mediaUrl: '/assets/images/Professionisti/pr1.png',
        tags: ['Hair Styling', 'Sposa'],
        likes: 24,
        timestamp: Date.now() - 3600000
    },
    {
        id: 2,
        category: 'massaggi',
        type: 'video',
        location: 'sassari',
        professionalName: 'Marco Bianchi',
        professionalAvatar: '/assets/images/Professionisti/pr2.png',
        mediaUrl: '/assets/videos/massaggio-demo.mp4',
        videoDuration: '0:28',
        tags: ['Massaggio', 'Rilassante'],
        likes: 18,
        timestamp: Date.now() - 7200000
    },
    {
        id: 3,
        category: 'fitness',
        type: 'photo',
        location: 'olbia',
        professionalName: 'Laura Verdi',
        professionalAvatar: '/assets/images/Professionisti/pr3.png',
        mediaUrl: '/assets/images/Professionisti/pr3.png',
        tags: ['Personal Training', 'Outdoor'],
        likes: 32,
        timestamp: Date.now() - 10800000
    },
    // Aggiungere più dati mock...
];

// Inizializzazione app
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadInitialContent();
    setupInfiniteScroll();
    checkLoginStatus();
}

// Setup event listeners
function setupEventListeners() {
    // Filtri categoria
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });

    // Filtri secondari
    document.getElementById('orderFilter').addEventListener('change', handleSortChange);
    document.getElementById('typeFilter').addEventListener('change', handleTypeFilter);
    document.getElementById('locationFilter').addEventListener('change', handleLocationFilter);

    // Ricerca
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Modal login
    document.getElementById('closeModal').addEventListener('click', closeLoginModal);

    // Click fuori modal per chiudere
    document.getElementById('loginModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeLoginModal();
        }
    });

    // Event delegation per card dinamiche
    document.getElementById('inspirationGrid').addEventListener('click', handleCardClick);
    document.getElementById('inspirationGrid').addEventListener('dblclick', handleDoubleClick);
}

// Gestione filtro categoria
function handleCategoryFilter(e) {
    const filterBtn = e.currentTarget;
    const category = filterBtn.dataset.filter;

    // Update UI attiva
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    filterBtn.classList.add('active');

    // Update stato
    appState.currentFilter = category;

    // Ricarica contenuto
    loadFilteredContent();
}

// Gestione ordinamento
function handleSortChange(e) {
    appState.currentSort = e.target.value;
    loadFilteredContent();
}

// Gestione filtro tipo
function handleTypeFilter(e) {
    appState.currentType = e.target.value;
    loadFilteredContent();
}

// Gestione filtro location
function handleLocationFilter(e) {
    appState.currentLocation = e.target.value;
    loadFilteredContent();
}

// Gestione ricerca
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm.length === 0) {
        loadFilteredContent();
        return;
    }

    // Filtra in base al termine di ricerca
    const filteredItems = mockInspirations.filter(item => {
        return item.professionalName.toLowerCase().includes(searchTerm) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    });

    renderInspirations(filteredItems);
}

// Click singolo su card
function handleCardClick(e) {
    const card = e.target.closest('.inspiration-card');
    if (!card) return;

    // Evita doppio trigger se si clicca su like button
    if (e.target.closest('.like-btn')) return;

    const inspirationId = card.dataset.inspirationId;

    // Simula navigazione al portfolio professionista
    console.log(`Navigating to professional portfolio, inspiration ID: ${inspirationId}`);

    // In produzione:
    // window.location.href = `/professionista/${professionalSlug}/portfolio/${inspirationId}`;

    // Per ora mostra un alert
    showToast('Navigazione al portfolio del professionista (da implementare)', 'info');
}

// Doppio click per like
function handleDoubleClick(e) {
    e.preventDefault();

    const card = e.target.closest('.inspiration-card');
    if (!card) return;

    const inspirationId = card.dataset.inspirationId;

    if (!appState.isLoggedIn) {
        showLoginModal();
        return;
    }

    toggleLike(inspirationId, card);
}

// Toggle like
function toggleLike(inspirationId, cardElement) {
    const likeBtn = cardElement.querySelector('.like-btn');
    const likeCount = cardElement.querySelector('.like-count');
    const isLiked = appState.likedItems.has(inspirationId);

    if (isLiked) {
        // Remove like
        appState.likedItems.delete(inspirationId);
        likeBtn.setAttribute('data-liked', 'false');
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
        showToast('Mi piace rimosso', 'success');
    } else {
        // Add like
        appState.likedItems.add(inspirationId);
        likeBtn.setAttribute('data-liked', 'true');
        likeCount.textContent = parseInt(likeCount.textContent) + 1;

        // Animazione cuore
        animateHeart(likeBtn);
        showToast('Mi piace aggiunto', 'success');
    }
}

// Animazione cuore like
function animateHeart(likeBtn) {
    likeBtn.style.transform = 'scale(1.3)';
    likeBtn.style.transition = 'transform 0.2s ease';

    setTimeout(() => {
        likeBtn.style.transform = 'scale(1)';
    }, 200);
}

// Carica contenuto iniziale
function loadInitialContent() {
    showLoading();

    // Simula caricamento API
    setTimeout(() => {
        const initialItems = mockInspirations.slice(0, 12);
        renderInspirations(initialItems);
        appState.loadedItems = initialItems.length;
        hideLoading();
    }, 1000);
}

// Carica contenuto filtrato
function loadFilteredContent() {
    showLoading();

    setTimeout(() => {
        let filteredItems = [...mockInspirations];

        // Applica filtri
        if (appState.currentFilter !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === appState.currentFilter);
        }

        if (appState.currentType !== 'all') {
            filteredItems = filteredItems.filter(item => item.type === appState.currentType);
        }

        if (appState.currentLocation !== 'all') {
            filteredItems = filteredItems.filter(item => item.location === appState.currentLocation);
        }

        // Applica ordinamento
        switch (appState.currentSort) {
            case 'popular':
                filteredItems.sort((a, b) => b.likes - a.likes);
                break;
            case 'liked':
                filteredItems.sort((a, b) => {
                    const aLiked = appState.likedItems.has(a.id.toString());
                    const bLiked = appState.likedItems.has(b.id.toString());
                    return bLiked - aLiked;
                });
                break;
            case 'recent':
            default:
                filteredItems.sort((a, b) => b.timestamp - a.timestamp);
                break;
        }

        renderInspirations(filteredItems);
        updateFilterCounts();
        hideLoading();
    }, 500);
}

// Renderizza ispirazioni
function renderInspirations(items) {
    const grid = document.getElementById('inspirationGrid');

    if (items.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();

    const html = items.map((item, index) => {
        const isLiked = appState.likedItems.has(item.id.toString());
        const isVideo = item.type === 'video';

        return `
            <div class="inspiration-item" data-category="${item.category}" data-type="${item.type}" data-location="${item.location}" style="animation-delay: ${index * 0.1}s">
                <div class="inspiration-card" data-inspiration-id="${item.id}">
                    <div class="inspiration-media">
                        ${isVideo ?
                `<video poster="${item.mediaUrl}" preload="none">
                                <source src="${item.mediaUrl}" type="video/mp4">
                            </video>` :
                `<img src="${item.mediaUrl}" alt="${item.tags[0]}" loading="lazy">`
            }
                        <div class="media-overlay">
                            <div class="media-type${isVideo ? ' video' : ''}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="${isVideo ? 'M8,5.14V19.14L19,12.14L8,5.14Z' : 'M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z'}" />
                                </svg>
                                ${isVideo ? `<span class="video-duration">${item.videoDuration}</span>` : ''}
                            </div>
                            <div class="inspiration-likes">
                                <button class="like-btn" data-liked="${isLiked}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                                    </svg>
                                </button>
                                <span class="like-count">${item.likes}</span>
                            </div>
                        </div>
                    </div>
                    <div class="inspiration-info">
                        <div class="professional-info">
                            <img src="${item.professionalAvatar}" alt="${item.professionalName}" class="professional-avatar">
                            <div class="professional-details">
                                <span class="professional-name">${item.professionalName}</span>
                                <span class="professional-location">${capitalizeFirst(item.location)}</span>
                            </div>
                        </div>
                        <div class="inspiration-tags">
                            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    grid.innerHTML = html;
}

// Aggiorna contatori filtri
function updateFilterCounts() {
    // Simula aggiornamento contatori
    // In produzione verrebbero da API
    document.getElementById('totalItems').textContent = appState.totalItems.toLocaleString();
}

// Infinite scroll
function setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !appState.isLoading && appState.loadedItems < appState.totalItems) {
            loadMoreContent();
        }
    }, {
        rootMargin: '100px'
    });

    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '1px';
    document.querySelector('.ispirazioni-content').appendChild(sentinel);

    observer.observe(sentinel);
}

// Carica più contenuto
function loadMoreContent() {
    if (appState.isLoading) return;

    appState.isLoading = true;
    showLoading();

    setTimeout(() => {
        // Simula caricamento più elementi
        const moreItems = mockInspirations.slice(appState.loadedItems, appState.loadedItems + 6);
        appendInspirations(moreItems);
        appState.loadedItems += moreItems.length;
        appState.isLoading = false;
        hideLoading();
    }, 1000);
}

// Appendi ispirazioni esistenti
function appendInspirations(items) {
    const grid = document.getElementById('inspirationGrid');
    const existingItems = grid.querySelectorAll('.inspiration-item').length;

    const html = items.map((item, index) => {
        const isLiked = appState.likedItems.has(item.id.toString());
        const isVideo = item.type === 'video';

        return `
            <div class="inspiration-item" data-category="${item.category}" data-type="${item.type}" data-location="${item.location}" style="animation-delay: ${(existingItems + index) * 0.1}s">
                <!-- HTML identico al renderInspirations -->
            </div>
        `;
    }).join('');

    grid.insertAdjacentHTML('beforeend', html);
}

// Mostra loading
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

// Nascondi loading
function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// Mostra empty state
function showEmptyState() {
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('inspirationGrid').style.display = 'none';
}

// Nascondi empty state
function hideEmptyState() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('inspirationGrid').style.display = 'grid';
}

// Mostra modal login
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Chiudi modal login
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Controlla stato login
function checkLoginStatus() {
    // Simula controllo login
    // In produzione verificherebbe token/session
    appState.isLoggedIn = false; // Cambia per testare
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-primary)' : 'var(--color-secondary)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    toast.textContent = message;
    document.body.appendChild(toast);

    // Animazione entrata
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);

    // Rimozione automatica
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

// Utility functions
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

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Gestione errori globali
window.addEventListener('error', function (e) {
    console.error('Errore JavaScript:', e.error);
    showToast('Si è verificato un errore. Riprova più tardi.', 'error');
});

// Prevenzione context menu su immagini (opzionale)
document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG' && e.target.closest('.inspiration-media')) {
        e.preventDefault();
    }
});

// Gestione lazy loading video
document.addEventListener('click', function (e) {
    const video = e.target.closest('video');
    if (video && !video.src) {
        const source = video.querySelector('source');
        if (source) {
            video.src = source.src;
            video.load();
        }
    }
});