/**
 * ISPIRAZIONI PAGE JAVASCRIPT - ALBUM SYSTEM
 * Gestisce album foto con carousel interno
 */

document.addEventListener('DOMContentLoaded', function () {
    window.ispirazioniManager = new IspirazioniAlbumManager();
});

class IspirazioniAlbumManager {
    constructor() {
        this.allAlbums = [];
        this.filteredAlbums = [];
        this.currentPage = 1;
        this.ALBUMS_PER_PAGE = 20;
        this.currentAlbum = null;
        this.currentSlide = 0;
        this.init();
    }

    init() {
        this.loadAlbumsData();
        this.setupEventListeners();
        this.setupFilters();
        this.renderAlbums();
        this.setupPagination();
        console.log('Ispirazioni Album Manager inizializzato');
    }

    loadAlbumsData() {
        // Simula dati album caricati dai professionisti
        this.allAlbums = [
            {
                id: 'album_1',
                title: 'Sessione Yoga Mattutina',
                description: 'Una serie di pose yoga per iniziare la giornata con energia e serenità',
                category: 'fitness',
                professional: 'sophia-rossi',
                professionalName: 'Sophia Rossi',
                createdAt: '2024-01-15',
                likes: 156,
                photos: [
                    {
                        url: '../../assets/images/ispirazioni/yoga-1.jpg',
                        alt: 'Yoga pose sunrise'
                    },
                    {
                        url: '../../assets/images/ispirazioni/yoga-2.jpg',
                        alt: 'Meditation in nature'
                    },
                    {
                        url: '../../assets/images/ispirazioni/yoga-3.jpg',
                        alt: 'Warrior pose'
                    },
                    {
                        url: '../../assets/images/ispirazioni/yoga-4.jpg',
                        alt: 'Relaxation pose'
                    }
                ]
            },
            {
                id: 'album_2',
                title: 'Trattamento Viso Rilassante',
                description: 'Una sequenza completa di trattamenti beauty per il benessere del viso',
                category: 'beauty',
                professional: 'elena-verdi',
                professionalName: 'Elena Verdi',
                createdAt: '2024-01-14',
                likes: 203,
                photos: [
                    {
                        url: '../../assets/images/ispirazioni/beauty-1.jpg',
                        alt: 'Facial treatment setup'
                    },
                    {
                        url: '../../assets/images/ispirazioni/beauty-2.jpg',
                        alt: 'Skincare products'
                    },
                    {
                        url: '../../assets/images/ispirazioni/beauty-3.jpg',
                        alt: 'Relaxing facial massage'
                    },
                    {
                        url: '../../assets/images/ispirazioni/beauty-4.jpg',
                        alt: 'Final glow result'
                    },
                    {
                        url: '../../assets/images/ispirazioni/beauty-5.jpg',
                        alt: 'Natural skincare'
                    }
                ]
            },
            {
                id: 'album_3',
                title: 'Massaggio Hot Stone',
                description: 'Il rilassamento profondo attraverso la terapia con pietre calde',
                category: 'massage',
                professional: 'marco-bianchi',
                professionalName: 'Marco Bianchi',
                createdAt: '2024-01-13',
                likes: 89,
                photos: [
                    {
                        url: '../../assets/images/ispirazioni/massage-1.jpg',
                        alt: 'Hot stones preparation'
                    },
                    {
                        url: '../../assets/images/ispirazioni/massage-2.jpg',
                        alt: 'Massage therapy room'
                    },
                    {
                        url: '../../assets/images/ispirazioni/massage-3.jpg',
                        alt: 'Stone placement technique'
                    }
                ]
            },
            {
                id: 'album_4',
                title: 'Workout Funzionale',
                description: 'Allenamento completo per forza, resistenza e flessibilità',
                category: 'fitness',
                professional: 'luca-neri',
                professionalName: 'Luca Neri',
                createdAt: '2024-01-12',
                likes: 142,
                photos: [
                    {
                        url: '../../assets/images/ispirazioni/fitness-1.jpg',
                        alt: 'Functional training setup'
                    },
                    {
                        url: '../../assets/images/ispirazioni/fitness-2.jpg',
                        alt: 'Exercise demonstration'
                    },
                    {
                        url: '../../assets/images/ispirazioni/fitness-3.jpg',
                        alt: 'Strength training'
                    },
                    {
                        url: '../../assets/images/ispirazioni/fitness-4.jpg',
                        alt: 'Cool down stretching'
                    },
                    {
                        url: '../../assets/images/ispirazioni/fitness-5.jpg',
                        alt: 'Post workout recovery'
                    },
                    {
                        url: '../../assets/images/ispirazioni/fitness-6.jpg',
                        alt: 'Healthy nutrition'
                    }
                ]
            },
            {
                id: 'album_5',
                title: 'Meditazione in Natura',
                description: 'Pratiche di mindfulness immersi nella bellezza naturale',
                category: 'wellness',
                professional: 'sophia-rossi',
                professionalName: 'Sophia Rossi',
                createdAt: '2024-01-11',
                likes: 267,
                photos: [
                    {
                        url: '../../assets/images/ispirazioni/wellness-1.jpg',
                        alt: 'Meditation in forest'
                    },
                    {
                        url: '../../assets/images/ispirazioni/wellness-2.jpg',
                        alt: 'Breathing exercise'
                    },
                    {
                        url: '../../assets/images/ispirazioni/wellness-3.jpg',
                        alt: 'Nature connection'
                    },
                    {
                        url: '../../assets/images/ispirazioni/wellness-4.jpg',
                        alt: 'Peaceful moment'
                    },
                    {
                        url: '../../assets/images/ispirazioni/wellness-5.jpg',
                        alt: 'Sunset meditation'
                    },
                    {
                        url: '../../assets/images/ispirazioni/wellness-6.jpg',
                        alt: 'Gratitude practice'
                    },
                    {
                        url: '../../assets/images/ispirazioni/wellness-7.jpg',
                        alt: 'Walking meditation'
                    }
                ]
            },
            {
                id: 'album_6',
                title: 'Trattamento Anti-Age',
                description: 'Protocollo completo per contrastare i segni del tempo',
                category: 'beauty',
                professional: 'elena-verdi',
                professionalName: 'Elena Verdi',
                createdAt: '2024-01-10',
                likes: 178,
                photos: [
                    {
                        url: '../../assets/images/ispirazioni/antiage-1.jpg',
                        alt: 'Anti-aging consultation'
                    },
                    {
                        url: '../../assets/images/ispirazioni/antiage-2.jpg',
                        alt: 'Professional skincare'
                    },
                    {
                        url: '../../assets/images/ispirazioni/antiage-3.jpg',
                        alt: 'Treatment application'
                    },
                    {
                        url: '../../assets/images/ispirazioni/antiage-4.jpg',
                        alt: 'Facial massage technique'
                    },
                    {
                        url: '../../assets/images/ispirazioni/antiage-5.jpg',
                        alt: 'Visible results'
                    },
                    {
                        url: '../../assets/images/ispirazioni/antiage-6.jpg',
                        alt: 'Maintenance routine'
                    },
                    {
                        url: '../../assets/images/ispirazioni/antiage-7.jpg',
                        alt: 'Product recommendations'
                    },
                    {
                        url: '../../assets/images/ispirazioni/antiage-8.jpg',
                        alt: 'Happy client'
                    }
                ]
            },
            {
                id: 'album_7',
                title: 'Massaggio Decontratturante',
                description: 'Tecniche specializzate per sciogliere tensioni muscolari',
                category: 'massage',
                professional: 'marco-bianchi',
                professionalName: 'Marco Bianchi',
                createdAt: '2024-01-09',
                likes: 134,
                photos: [
                    {
                        url: '../../assets/images/ispirazioni/decontract-1.jpg',
                        alt: 'Muscle assessment'
                    },
                    {
                        url: '../../assets/images/ispirazioni/decontract-2.jpg',
                        alt: 'Deep tissue technique'
                    },
                    {
                        url: '../../assets/images/ispirazioni/decontract-3.jpg',
                        alt: 'Trigger point therapy'
                    },
                    {
                        url: '../../assets/images/ispirazioni/decontract-4.jpg',
                        alt: 'Stretching integration'
                    },
                    {
                        url: '../../assets/images/ispirazioni/decontract-5.jpg',
                        alt: 'Recovery advice'
                    }
                ]
            },
            {
                id: 'album_8',
                title: 'HIIT Training Session',
                description: 'Allenamento ad alta intensità per massimi risultati',
                category: 'fitness',
                professional: 'luca-neri',
                professionalName: 'Luca Neri',
                createdAt: '2024-01-08',
                likes: 198,
                photos: [
                    {
                        url: '../../assets/images/ispirazioni/hiit-1.jpg',
                        alt: 'HIIT warm up'
                    },
                    {
                        url: '../../assets/images/ispirazioni/hiit-2.jpg',
                        alt: 'High intensity exercises'
                    },
                    {
                        url: '../../assets/images/ispirazioni/hiit-3.jpg',
                        alt: 'Rest intervals'
                    },
                    {
                        url: '../../assets/images/ispirazioni/hiit-4.jpg',
                        alt: 'Final push'
                    },
                    {
                        url: '../../assets/images/ispirazioni/hiit-5.jpg',
                        alt: 'Cool down'
                    },
                    {
                        url: '../../assets/images/ispirazioni/hiit-6.jpg',
                        alt: 'Achievement celebration'
                    }
                ]
            }
        ];

        this.filteredAlbums = [...this.allAlbums];
        this.updateStats();
    }

    setupEventListeners() {
        // Click fuori dal modal per chiudere
        document.getElementById('albumModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('album-modal-overlay')) {
                this.closeAlbumModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.currentAlbum) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextSlide();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        this.closeAlbumModal();
                        break;
                }
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
        // Filtri categoria
        const categoryBtns = document.querySelectorAll('[data-category]');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterByCategory(btn.dataset.category);
            });
        });

        // Filtri dropdown
        const sortFilter = document.getElementById('sortFilter');
        const professionalFilter = document.getElementById('professionalFilter');
        const photoCountFilter = document.getElementById('photoCountFilter');

        if (sortFilter) sortFilter.addEventListener('change', () => this.applyFilters());
        if (professionalFilter) professionalFilter.addEventListener('change', () => this.applyFilters());
        if (photoCountFilter) photoCountFilter.addEventListener('change', () => this.applyFilters());
    }

    setupPagination() {
        const loadMoreBtn = document.getElementById('loadMoreAlbums');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderAlbums();
            });
        }
    }

    renderAlbums() {
        const ispirazioniGrid = document.getElementById('ispirazioniGrid');

        if (this.filteredAlbums.length === 0) {
            ispirazioniGrid.innerHTML = '<div class="loading-placeholder"><p>Nessun album disponibile</p></div>';
            return;
        }

        const startIndex = 0;
        const endIndex = this.currentPage * this.ALBUMS_PER_PAGE;
        const albumsToShow = this.filteredAlbums.slice(startIndex, endIndex);

        let albumsHTML = '';

        albumsToShow.forEach((album, index) => {
            const photoCount = album.photos.length;
            const coverPhoto = album.photos[0];

            albumsHTML += `
                <div class="inspiration-item" data-album-id="${album.id}" onclick="openAlbum('${album.id}')" style="animation-delay: ${index * 0.1}s">
                    <div class="inspiration-card">
                        <div class="inspiration-media" style="background-image: url('${coverPhoto.url}');">
                            <div class="album-overlay">
                                <div class="album-info">
                                    <h4 class="album-title">${album.title}</h4>
                                    <p class="album-author">di ${album.professionalName}</p>
                                </div>
                            </div>
                            <div class="album-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
                                </svg>
                                <span>${photoCount}</span>
                            </div>
                            <div class="category-badge ${album.category}">${this.getCategoryName(album.category)}</div>
                        </div>
                        <div class="inspiration-actions">
                            <button class="like-btn ${Math.random() > 0.7 ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike('${album.id}')">
                                <i class="fas fa-heart"></i>
                                <span>${album.likes}</span>
                            </button>
                            <span class="inspiration-date">${this.formatDate(album.createdAt)}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        ispirazioniGrid.innerHTML = albumsHTML;

        // Aggiorna paginazione
        this.updatePaginationButton();
    }

    openAlbum(albumId) {
        const album = this.allAlbums.find(a => a.id === albumId);
        if (!album) return;

        this.currentAlbum = album;
        this.currentSlide = 0;

        // Aggiorna modal header
        document.getElementById('albumModalTitle').textContent = album.title;
        document.getElementById('albumModalAuthor').textContent = `di ${album.professionalName}`;
        document.getElementById('albumDescription').textContent = album.description;

        // Genera carousel
        this.generateCarousel();
        this.generateIndicators();
        this.updateCarouselPosition();

        // Mostra modal
        document.getElementById('albumModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    generateCarousel() {
        const carousel = document.getElementById('albumCarousel');
        let carouselHTML = '';

        this.currentAlbum.photos.forEach((photo, index) => {
            carouselHTML += `
                <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                    <img src="${photo.url}" alt="${photo.alt}" loading="lazy">
                </div>
            `;
        });

        carousel.innerHTML = carouselHTML;
    }

    generateIndicators() {
        const indicators = document.getElementById('carouselIndicators');
        let indicatorsHTML = '';

        this.currentAlbum.photos.forEach((_, index) => {
            indicatorsHTML += `
                <button class="carousel-indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></button>
            `;
        });

        indicators.innerHTML = indicatorsHTML;
    }

    updateCarouselPosition() {
        const carousel = document.getElementById('albumCarousel');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');

        // Aggiorna slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // Aggiorna indicatori
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Anima carousel
        const offset = -this.currentSlide * 100;
        carousel.style.transform = `translateX(${offset}%)`;
    }

    nextSlide() {
        if (!this.currentAlbum) return;

        this.currentSlide = (this.currentSlide + 1) % this.currentAlbum.photos.length;
        this.updateCarouselPosition();
    }

    previousSlide() {
        if (!this.currentAlbum) return;

        this.currentSlide = this.currentSlide === 0
            ? this.currentAlbum.photos.length - 1
            : this.currentSlide - 1;
        this.updateCarouselPosition();
    }

    goToSlide(slideIndex) {
        if (!this.currentAlbum) return;

        this.currentSlide = slideIndex;
        this.updateCarouselPosition();
    }

    closeAlbumModal() {
        document.getElementById('albumModal').style.display = 'none';
        document.body.style.overflow = '';
        this.currentAlbum = null;
        this.currentSlide = 0;
    }

    filterByCategory(category) {
        this.filteredAlbums = category === 'all'
            ? [...this.allAlbums]
            : this.allAlbums.filter(album => album.category === category);

        this.applyAdditionalFilters();
        this.renderAlbums();
    }

    applyFilters() {
        this.applyAdditionalFilters();
        this.renderAlbums();
    }

    applyAdditionalFilters() {
        const sortFilter = document.getElementById('sortFilter')?.value || 'recent';
        const professionalFilter = document.getElementById('professionalFilter')?.value || '';
        const photoCountFilter = document.getElementById('photoCountFilter')?.value || '';

        // Filtra per professionista
        if (professionalFilter) {
            this.filteredAlbums = this.filteredAlbums.filter(album =>
                album.professional === professionalFilter
            );
        }

        // Filtra per numero foto
        if (photoCountFilter) {
            this.filteredAlbums = this.filteredAlbums.filter(album => {
                const photoCount = album.photos.length;
                switch (photoCountFilter) {
                    case 'small': return photoCount >= 1 && photoCount <= 3;
                    case 'medium': return photoCount >= 4 && photoCount <= 7;
                    case 'large': return photoCount >= 8 && photoCount <= 10;
                    default: return true;
                }
            });
        }

        // Ordina
        this.sortAlbums(sortFilter);

        // Reset paginazione
        this.currentPage = 1;
    }

    sortAlbums(sortType) {
        switch (sortType) {
            case 'popular':
                this.filteredAlbums.sort((a, b) => b.likes - a.likes);
                break;
            case 'photos-desc':
                this.filteredAlbums.sort((a, b) => b.photos.length - a.photos.length);
                break;
            case 'photos-asc':
                this.filteredAlbums.sort((a, b) => a.photos.length - b.photos.length);
                break;
            default: // recent
                this.filteredAlbums.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        if (term.length === 0) {
            this.applyFilters();
            return;
        }

        this.filteredAlbums = this.allAlbums.filter(album =>
            album.title.toLowerCase().includes(term) ||
            album.description.toLowerCase().includes(term) ||
            album.professionalName.toLowerCase().includes(term) ||
            this.getCategoryName(album.category).toLowerCase().includes(term)
        );

        this.currentPage = 1;
        this.renderAlbums();
    }

    updatePaginationButton() {
        const loadMoreBtn = document.getElementById('loadMoreAlbums');
        if (!loadMoreBtn) return;

        const totalShown = this.currentPage * this.ALBUMS_PER_PAGE;
        const hasMore = totalShown < this.filteredAlbums.length;

        if (hasMore) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = `Carica Altri Album (${this.filteredAlbums.length - totalShown} rimanenti)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    updateStats() {
        const totalAlbums = this.allAlbums.length;
        const totalPhotos = this.allAlbums.reduce((sum, album) => sum + album.photos.length, 0);

        const totalAlbumsEl = document.getElementById('totalAlbums');
        const totalPhotosEl = document.getElementById('totalPhotos');

        if (totalAlbumsEl) totalAlbumsEl.textContent = totalAlbums;
        if (totalPhotosEl) totalPhotosEl.textContent = totalPhotos.toLocaleString();
    }

    toggleLike(albumId) {
        const album = this.allAlbums.find(a => a.id === albumId);
        if (!album) return;

        // Toggle like (simulazione)
        const likeBtn = document.querySelector(`[onclick*="${albumId}"] .like-btn`);
        const isLiked = likeBtn.classList.contains('liked');

        if (isLiked) {
            album.likes--;
            likeBtn.classList.remove('liked');
        } else {
            album.likes++;
            likeBtn.classList.add('liked');
        }

        likeBtn.querySelector('span').textContent = album.likes;
    }

    getCategoryName(category) {
        const categories = {
            'beauty': 'Beauty',
            'fitness': 'Fitness',
            'massage': 'Massaggi',
            'wellness': 'Wellness'
        };
        return categories[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Oggi';
        if (diffDays === 1) return 'Ieri';
        if (diffDays < 7) return `${diffDays} giorni fa`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} settimane fa`;
        return `${Math.floor(diffDays / 30)} mesi fa`;
    }
}

// ===============================================
// FUNZIONI GLOBALI
// ===============================================

function openAlbum(albumId) {
    window.ispirazioniManager.openAlbum(albumId);
}

function closeAlbumModal() {
    window.ispirazioniManager.closeAlbumModal();
}

function nextSlide() {
    window.ispirazioniManager.nextSlide();
}

function previousSlide() {
    window.ispirazioniManager.previousSlide();
}

function goToSlide(slideIndex) {
    window.ispirazioniManager.goToSlide(slideIndex);
}

function toggleLike(albumId) {
    window.ispirazioniManager.toggleLike(albumId);
}

// ===============================================
// GESTIONE ERRORI
// ===============================================
window.addEventListener('error', (e) => {
    console.error('Errore ispirazioni album manager:', e.error);
});

console.log('Ispirazioni Album System JS caricato');