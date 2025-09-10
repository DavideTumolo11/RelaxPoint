/* ===============================================
   MEDIA PAGE - ALBUM SYSTEM JAVASCRIPT
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    window.mediaGallery = new MediaGalleryManager();
});

class MediaGalleryManager {
    constructor() {
        this.currentSlide = 0;
        this.currentAlbum = null;
        this.albums = [];
        this.videos = [];
        this.init();
    }

    init() {
        this.loadMediaData();
        this.setupEventListeners();
        this.renderMedia();
        console.log('Media Gallery Manager inizializzato');
    }

    loadMediaData() {
        // Simula dati album caricati dal microsito-professionista
        this.albums = [
            {
                id: 'album_1',
                title: 'Sessioni Mindfulness',
                type: 'album',
                photos: [
                    {
                        src: '../assets/images/Servizi/massage2.jpg',
                        alt: 'Sessione mindfulness 1'
                    },
                    {
                        src: '../assets/images/Servizi/YogaEndMeditazione.jpeg',
                        alt: 'Sessione mindfulness 2'
                    },
                    {
                        src: '../assets/images/Servizi/Beauty.jpg',
                        alt: 'Sessione mindfulness 3'
                    },
                    {
                        src: '../assets/images/Servizi/Salute.jpg',
                        alt: 'Sessione mindfulness 4'
                    }
                ]
            },
            {
                id: 'album_2',
                title: 'Percorsi di Trasformazione',
                type: 'album',
                photos: [
                    {
                        src: '../assets/images/Servizi/Fiosioterapia.Osteopatia.png',
                        alt: 'Trasformazione 1'
                    },
                    {
                        src: '../assets/images/Servizi/neoMamma.jpg',
                        alt: 'Trasformazione 2'
                    },
                    {
                        src: '../assets/images/Servizi/Gym.jpg',
                        alt: 'Trasformazione 3'
                    }
                ]
            },
            {
                id: 'album_3',
                title: 'Coaching Nutrizionale',
                type: 'album',
                photos: [
                    {
                        src: '../assets/images/Servizi/Beauty.jpg',
                        alt: 'Coaching nutrizionale 1'
                    },
                    {
                        src: '../assets/images/Servizi/Salute.jpg',
                        alt: 'Coaching nutrizionale 2'
                    },
                    {
                        src: '../assets/images/Servizi/massage2.jpg',
                        alt: 'Coaching nutrizionale 3'
                    },
                    {
                        src: '../assets/images/Servizi/Hair and make-up.png',
                        alt: 'Coaching nutrizionale 4'
                    }
                ]
            },
            {
                id: 'album_4',
                title: 'Fitness & Benessere',
                type: 'album',
                photos: [
                    {
                        src: '../assets/images/Servizi/Gym.jpg',
                        alt: 'Fitness 1'
                    },
                    {
                        src: '../assets/images/Servizi/Fiosioterapia.Osteopatia.png',
                        alt: 'Fitness 2'
                    },
                    {
                        src: '../assets/images/Servizi/YogaEndMeditazione.jpeg',
                        alt: 'Fitness 3'
                    }
                ]
            },
            {
                id: 'album_5',
                title: 'Styling & Immagine',
                type: 'album',
                photos: [
                    {
                        src: '../assets/images/Servizi/Hair and make-up.png',
                        alt: 'Styling 1'
                    },
                    {
                        src: '../assets/images/Servizi/Beauty.jpg',
                        alt: 'Styling 2'
                    }
                ]
            }
        ];

        // Video di esempio
        this.videos = [
            {
                id: 'video_1',
                title: 'Introduzione al Wellness Coaching',
                type: 'video',
                thumbnail: null,
                duration: '5:30'
            },
            {
                id: 'video_2',
                title: 'Tecniche di Respirazione',
                type: 'video',
                thumbnail: null,
                duration: '8:15'
            },
            {
                id: 'video_3',
                title: 'Esercizi di Mindfulness',
                type: 'video',
                thumbnail: null,
                duration: '12:20'
            }
        ];
    }

    setupEventListeners() {
        // Filtri media
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterMedia(e.target.dataset.filter);
                this.updateActiveFilter(e.target);
            });
        });

        // Gestione tasti freccia per carousel
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('albumModal');
            if (modal.style.display !== 'none') {
                if (e.key === 'ArrowLeft') {
                    this.changeAlbumSlide(-1);
                } else if (e.key === 'ArrowRight') {
                    this.changeAlbumSlide(1);
                } else if (e.key === 'Escape') {
                    this.closeAlbumModal();
                }
            }
        });

        // Click fuori dal modal per chiudere
        document.getElementById('albumModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('album-modal-overlay')) {
                this.closeAlbumModal();
            }
        });
    }

    renderMedia() {
        const mediaGrid = document.getElementById('mediaGrid');
        const allMedia = [...this.albums, ...this.videos];

        if (allMedia.length === 0) {
            mediaGrid.innerHTML = '<div class="loading-placeholder"><p>Nessun contenuto disponibile</p></div>';
            return;
        }

        let mediaHTML = '';

        // Renderizza album
        this.albums.forEach(album => {
            const firstPhoto = album.photos[0];
            mediaHTML += `
                <div class="media-item" data-type="album" data-id="${album.id}">
                    <div class="media-content" style="background-image: url('${firstPhoto.src}');" onclick="openAlbumModal('${album.id}')">
                        <div class="album-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
                            </svg>
                            <span>${album.photos.length}</span>
                        </div>
                        <div class="media-overlay">
                            <div class="media-info">
                                <h3>${album.title}</h3>
                                <span class="media-type">Album</span>
                            </div>
                            <button class="media-view-btn">Visualizza Album</button>
                        </div>
                    </div>
                </div>
            `;
        });

        // Renderizza video
        this.videos.forEach(video => {
            mediaHTML += `
                <div class="media-item" data-type="video" data-id="${video.id}">
                    <div class="media-content video-placeholder" onclick="playVideo('${video.id}')">
                        <div class="video-play-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <div class="media-overlay">
                            <div class="media-info">
                                <h3>${video.title}</h3>
                                <span class="media-type">Video · ${video.duration}</span>
                            </div>
                            <button class="media-view-btn">Riproduci</button>
                        </div>
                    </div>
                </div>
            `;
        });

        mediaGrid.innerHTML = mediaHTML;
    }

    filterMedia(filter) {
        const mediaItems = document.querySelectorAll('.media-item');

        mediaItems.forEach(item => {
            const itemType = item.dataset.type;

            if (filter === 'all' || itemType === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    openAlbumModal(albumId) {
        const album = this.albums.find(a => a.id === albumId);
        if (!album) return;

        this.currentAlbum = album;
        this.currentSlide = 0;

        // Aggiorna titolo modal
        document.getElementById('albumModalTitle').textContent = album.title;

        // Crea slides
        const carouselContainer = document.getElementById('albumCarouselContainer');
        carouselContainer.innerHTML = album.photos.map(photo =>
            `<div class="album-slide" style="background-image: url('${photo.src}');"></div>`
        ).join('');

        // Crea indicatori
        const indicators = document.getElementById('albumIndicators');
        indicators.innerHTML = album.photos.map((_, index) =>
            `<div class="album-indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>`
        ).join('');

        // Mostra modal
        document.getElementById('albumModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Aggiorna navigazione
        this.updateNavigation();
    }

    closeAlbumModal() {
        document.getElementById('albumModal').style.display = 'none';
        document.body.style.overflow = '';
        this.currentAlbum = null;
        this.currentSlide = 0;
    }

    changeAlbumSlide(direction) {
        if (!this.currentAlbum) return;

        const totalSlides = this.currentAlbum.photos.length;
        this.currentSlide += direction;

        if (this.currentSlide >= totalSlides) {
            this.currentSlide = 0;
        } else if (this.currentSlide < 0) {
            this.currentSlide = totalSlides - 1;
        }

        this.updateCarousel();
        this.updateIndicators();
        this.updateNavigation();
    }

    goToSlide(slideIndex) {
        if (!this.currentAlbum) return;

        this.currentSlide = slideIndex;
        this.updateCarousel();
        this.updateIndicators();
        this.updateNavigation();
    }

    updateCarousel() {
        const container = document.getElementById('albumCarouselContainer');
        const translateX = -this.currentSlide * 100;
        container.style.transform = `translateX(${translateX}%)`;
    }

    updateIndicators() {
        const indicators = document.querySelectorAll('.album-indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    updateNavigation() {
        const prevBtn = document.querySelector('.album-nav-btn.prev');
        const nextBtn = document.querySelector('.album-nav-btn.next');

        if (!this.currentAlbum || this.currentAlbum.photos.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }

    playVideo(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (!video) return;

        // Placeholder per riproduzione video
        alert(`Riproduzione video: ${video.title}\nDurata: ${video.duration}\n\n(Funzionalità video da implementare)`);
    }
}

// ===============================================
// FUNZIONI GLOBALI
// ===============================================

function openAlbumModal(albumId) {
    window.mediaGallery.openAlbumModal(albumId);
}

function closeAlbumModal() {
    window.mediaGallery.closeAlbumModal();
}

function changeAlbumSlide(direction) {
    window.mediaGallery.changeAlbumSlide(direction);
}

function goToSlide(slideIndex) {
    window.mediaGallery.goToSlide(slideIndex);
}

function playVideo(videoId) {
    window.mediaGallery.playVideo(videoId);
}

console.log('Media Album System JS caricato');