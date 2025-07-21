/* ===============================================
   RELAXPOINT - JS RECENSIONI COMPLETO
   Sistema recensioni funzionale e pronto per produzione
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('⭐ Sistema Recensioni RelaxPoint inizializzato');

    // ===============================================
    // DATI RECENSIONI (simulazione database)
    // ===============================================
    const reviewsData = {
        pending: [
            {
                id: 1,
                service: 'Massaggio Decontratturante',
                professional: 'Marco Rossi',
                date: '2024-07-22',
                time: '16:00',
                image: '../../assets/images/Servizi/massage2.jpg',
                category: 'massaggi'
            },
            {
                id: 2,
                service: 'Trattamento Viso Purificante',
                professional: 'Sofia Moretti',
                date: '2024-07-20',
                time: '15:00',
                image: '../../assets/images/Servizi/Beauty.jpg',
                category: 'beauty'
            },
            {
                id: 3,
                service: 'Personal Training',
                professional: 'Andrea Verdi',
                date: '2024-07-18',
                time: '18:00',
                image: '../../assets/images/Servizi/PersonalTraining.jpg',
                category: 'fitness'
            }
        ],
        completed: [
            {
                id: 4,
                service: 'Massaggio Rilassante',
                professional: 'Giulia Bianchi',
                date: '2024-07-15',
                rating: 5,
                comment: 'Esperienza fantastica! Giulia è stata molto professionale e il massaggio è stato davvero rilassante. L\'ambiente era perfetto e mi sono sentita subito a mio agio.',
                response: {
                    author: 'Giulia Bianchi',
                    date: '2024-07-16',
                    text: 'Grazie mille Chiara! È stato un piacere prendermi cura di te. Spero di rivederti presto!'
                },
                category: 'massaggi'
            },
            {
                id: 5,
                service: 'Lezione di Yoga',
                professional: 'Elena Rossi',
                date: '2024-07-10',
                rating: 4,
                comment: 'Molto brava la professionista, ambiente tranquillo. Consiglio vivamente per chi vuole iniziare con lo yoga.',
                category: 'fitness'
            },
            {
                id: 6,
                service: 'Manicure Gel',
                professional: 'Francesca Neri',
                date: '2024-07-05',
                rating: 5,
                comment: 'Lavoro impeccabile! Le unghie sono durate più di due settimane senza problemi.',
                response: {
                    author: 'Francesca Neri',
                    date: '2024-07-06',
                    text: 'Grazie Chiara! La tua soddisfazione è la mia priorità. A presto!'
                },
                category: 'beauty'
            },
            {
                id: 7,
                service: 'Fisioterapia Posturale',
                professional: 'Dott. Roberto Marino',
                date: '2024-06-28',
                rating: 5,
                comment: 'Molto competente e professionale. Mi ha aiutato molto con i problemi alla schiena.',
                category: 'fisioterapia'
            },
            {
                id: 8,
                service: 'Massaggio Hot Stone',
                professional: 'Laura Conti',
                date: '2024-06-20',
                rating: 4,
                comment: 'Bellissima esperienza rilassante. Tornerò sicuramente.',
                category: 'massaggi'
            }
        ]
    };

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const elements = {
        // Statistiche
        totalReviews: document.getElementById('totalReviews'),
        pendingReviews: document.getElementById('pendingReviews'),
        averageRating: document.getElementById('averageRating'),
        pendingCount: document.getElementById('pendingCount'),
        completedCount: document.getElementById('completedCount'),

        // Liste
        pendingReviewsList: document.getElementById('pendingReviewsList'),
        reviewsList: document.getElementById('reviewsList'),

        // Filtri
        statusFilter: document.getElementById('statusFilter'),
        ratingFilter: document.getElementById('ratingFilter'),
        serviceFilter: document.getElementById('serviceFilter'),
        searchReviews: document.getElementById('searchReviews'),

        // Modal
        reviewModal: document.getElementById('reviewModal'),
        modalOverlay: document.getElementById('modalOverlay'),
        closeModal: document.getElementById('closeModal'),
        reviewForm: document.getElementById('reviewForm'),
        serviceInfo: document.getElementById('serviceInfo'),
        starsContainer: document.getElementById('starsContainer'),
        ratingText: document.getElementById('ratingText'),
        reviewComment: document.getElementById('reviewComment'),
        charCount: document.getElementById('charCount'),
        cancelReview: document.getElementById('cancelReview'),
        submitReview: document.getElementById('submitReview'),

        // Altri
        loadMoreBtn: document.getElementById('loadMoreBtn'),
        notificationContainer: document.getElementById('notificationContainer')
    };

    // ===============================================
    // STATO APPLICAZIONE
    // ===============================================
    let appState = {
        currentRating: 0,
        currentReviewId: null,
        filteredReviews: [...reviewsData.completed],
        currentFilters: {
            status: 'all',
            rating: 'all',
            service: 'all',
            search: ''
        }
    };

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        updateStatistics();
        renderPendingReviews();
        renderCompletedReviews();
        setupEventListeners();
        setupModalEvents();
        setupFilters();
        console.log('✅ Sistema recensioni pronto');
    }

    // ===============================================
    // AGGIORNAMENTO STATISTICHE
    // ===============================================
    function updateStatistics() {
        const totalCompleted = reviewsData.completed.length;
        const totalPending = reviewsData.pending.length;
        const total = totalCompleted + totalPending;

        const averageRating = totalCompleted > 0
            ? (reviewsData.completed.reduce((sum, review) => sum + review.rating, 0) / totalCompleted).toFixed(1)
            : '0.0';

        if (elements.totalReviews) elements.totalReviews.textContent = total;
        if (elements.pendingReviews) elements.pendingReviews.textContent = totalPending;
        if (elements.averageRating) elements.averageRating.textContent = averageRating;
        if (elements.pendingCount) elements.pendingCount.textContent = totalPending;
        if (elements.completedCount) elements.completedCount.textContent = totalCompleted;
    }

    // ===============================================
    // RENDER RECENSIONI DA COMPLETARE
    // ===============================================
    function renderPendingReviews() {
        if (!elements.pendingReviewsList) return;

        if (reviewsData.pending.length === 0) {
            elements.pendingReviewsList.innerHTML = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" class="empty-icon">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <h3>Tutte le recensioni completate!</h3>
                    <p>Non hai recensioni in sospeso. Ottimo lavoro!</p>
                </div>
            `;
            return;
        }

        const html = reviewsData.pending.map(review => `
            <div class="pending-review-item" data-review-id="${review.id}">
                <div class="review-service-info">
                    <img src="${review.image}" alt="${review.service}" class="service-image">
                    <div class="service-details">
                        <h4>${review.service}</h4>
                        <p class="service-provider">con ${review.professional}</p>
                        <p class="service-date">${formatDate(review.date)} alle ${review.time}</p>
                    </div>
                </div>
                <div class="review-actions">
                    <button class="btn-review" data-action="review" data-review-id="${review.id}">
                        Lascia Recensione
                    </button>
                </div>
            </div>
        `).join('');

        elements.pendingReviewsList.innerHTML = html;
    }

    // ===============================================
    // RENDER RECENSIONI COMPLETATE
    // ===============================================
    function renderCompletedReviews() {
        if (!elements.reviewsList) return;

        const filteredReviews = applyFilters();

        if (filteredReviews.length === 0) {
            elements.reviewsList.innerHTML = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" class="empty-icon">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <h3>Nessuna recensione trovata</h3>
                    <p>Prova a modificare i filtri di ricerca.</p>
                </div>
            `;
            return;
        }

        const html = filteredReviews.map(review => `
            <div class="review-item" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="review-service">
                        <h4>${review.service}</h4>
                        <p class="provider-name">con ${review.professional}</p>
                        <div class="review-stars">
                            <div class="stars">${generateStars(review.rating)}</div>
                            <span class="rating-text">${review.rating}/5</span>
                        </div>
                    </div>
                    <div class="review-date">${formatDate(review.date)}</div>
                </div>
                
                <div class="review-content">
                    <p>"${review.comment}"</p>
                </div>

                ${review.response ? `
                    <div class="review-response">
                        <div class="response-header">
                            <strong>Risposta di ${review.response.author}</strong>
                            <span class="response-date">${formatDate(review.response.date)}</span>
                        </div>
                        <p>${review.response.text}</p>
                    </div>
                ` : ''}
            </div>
        `).join('');

        elements.reviewsList.innerHTML = html;

        // Aggiorna contatore recensioni filtrate
        if (elements.completedCount) {
            elements.completedCount.textContent = filteredReviews.length;
        }
    }

    // ===============================================
    // SISTEMA FILTRI
    // ===============================================
    function applyFilters() {
        let filtered = [...reviewsData.completed];

        // Filtro per rating
        if (appState.currentFilters.rating !== 'all') {
            const targetRating = parseInt(appState.currentFilters.rating);
            filtered = filtered.filter(review => review.rating === targetRating);
        }

        // Filtro per servizio
        if (appState.currentFilters.service !== 'all') {
            filtered = filtered.filter(review => review.category === appState.currentFilters.service);
        }

        // Filtro per ricerca
        if (appState.currentFilters.search) {
            const searchTerm = appState.currentFilters.search.toLowerCase();
            filtered = filtered.filter(review =>
                review.service.toLowerCase().includes(searchTerm) ||
                review.professional.toLowerCase().includes(searchTerm) ||
                review.comment.toLowerCase().includes(searchTerm)
            );
        }

        // Ordina per data (più recenti prima)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        return filtered;
    }

    function setupFilters() {
        // Filtro rating
        if (elements.ratingFilter) {
            elements.ratingFilter.addEventListener('change', (e) => {
                appState.currentFilters.rating = e.target.value;
                renderCompletedReviews();
            });
        }

        // Filtro servizio
        if (elements.serviceFilter) {
            elements.serviceFilter.addEventListener('change', (e) => {
                appState.currentFilters.service = e.target.value;
                renderCompletedReviews();
            });
        }

        // Ricerca
        if (elements.searchReviews) {
            let searchTimeout;
            elements.searchReviews.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    appState.currentFilters.search = e.target.value;
                    renderCompletedReviews();
                }, 300);
            });
        }
    }

    // ===============================================
    // GESTIONE EVENTI
    // ===============================================
    function setupEventListeners() {
        // Click su recensioni da completare
        if (elements.pendingReviewsList) {
            elements.pendingReviewsList.addEventListener('click', (e) => {
                if (e.target.dataset.action === 'review') {
                    const reviewId = parseInt(e.target.dataset.reviewId);
                    openReviewModal(reviewId);
                }
            });
        }

        // Load more button
        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.addEventListener('click', loadMoreReviews);
        }
    }

    // ===============================================
    // GESTIONE MODAL
    // ===============================================
    function setupModalEvents() {
        // Chiusura modal
        [elements.closeModal, elements.modalOverlay, elements.cancelReview].forEach(element => {
            if (element) {
                element.addEventListener('click', closeReviewModal);
            }
        });

        // Prevenire chiusura cliccando contenuto modal
        if (elements.reviewModal) {
            elements.reviewModal.querySelector('.modal-content').addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Sistema stelle
        setupStarRating();

        // Contatore caratteri
        setupCharCounter();

        // Submit form
        if (elements.reviewForm) {
            elements.reviewForm.addEventListener('submit', submitReview);
        }
    }

    function openReviewModal(reviewId) {
        const review = reviewsData.pending.find(r => r.id === reviewId);
        if (!review) return;

        appState.currentReviewId = reviewId;
        appState.currentRating = 0;

        // Popola info servizio
        if (elements.serviceInfo) {
            elements.serviceInfo.innerHTML = `
                <img src="${review.image}" alt="${review.service}">
                <div class="service-info-details">
                    <h4>${review.service}</h4>
                    <p>con ${review.professional} • ${formatDate(review.date)}</p>
                </div>
            `;
        }

        // Reset form
        resetModalForm();

        // Mostra modal
        if (elements.reviewModal) {
            elements.reviewModal.style.display = 'flex';
            setTimeout(() => {
                elements.reviewModal.classList.add('active');
            }, 10);
        }

        // Blocca scroll
        document.body.style.overflow = 'hidden';
    }

    function closeReviewModal() {
        if (elements.reviewModal) {
            elements.reviewModal.classList.remove('active');
            setTimeout(() => {
                elements.reviewModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }

        resetModalForm();
        appState.currentReviewId = null;
        appState.currentRating = 0;
    }

    function resetModalForm() {
        // Reset stelle
        if (elements.starsContainer) {
            elements.starsContainer.dataset.rating = '0';
            elements.starsContainer.querySelectorAll('.star').forEach(star => {
                star.classList.remove('active');
            });
        }

        // Reset testo
        if (elements.ratingText) {
            elements.ratingText.textContent = 'Seleziona una valutazione';
        }

        // Reset commento
        if (elements.reviewComment) {
            elements.reviewComment.value = '';
        }

        // Reset contatore
        updateCharCounter();

        // Reset button
        if (elements.submitReview) {
            elements.submitReview.disabled = true;
        }
    }

    // ===============================================
    // SISTEMA RATING STELLE
    // ===============================================
    function setupStarRating() {
        if (!elements.starsContainer) return;

        const stars = elements.starsContainer.querySelectorAll('.star');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const rating = index + 1;
                setRating(rating);
            });

            star.addEventListener('mouseenter', () => {
                highlightStars(index + 1);
            });
        });

        elements.starsContainer.addEventListener('mouseleave', () => {
            highlightStars(appState.currentRating);
        });
    }

    function setRating(rating) {
        appState.currentRating = rating;
        elements.starsContainer.dataset.rating = rating;

        const ratingTexts = {
            1: 'Pessimo',
            2: 'Scarso',
            3: 'Sufficiente',
            4: 'Buono',
            5: 'Eccellente'
        };

        if (elements.ratingText) {
            elements.ratingText.textContent = ratingTexts[rating] || 'Seleziona una valutazione';
        }

        highlightStars(rating);
        validateForm();
    }

    function highlightStars(count) {
        const stars = elements.starsContainer.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // ===============================================
    // CONTATORE CARATTERI
    // ===============================================
    function setupCharCounter() {
        if (elements.reviewComment) {
            elements.reviewComment.addEventListener('input', updateCharCounter);
        }
    }

    function updateCharCounter() {
        if (!elements.reviewComment || !elements.charCount) return;

        const current = elements.reviewComment.value.length;
        const max = elements.reviewComment.getAttribute('maxlength') || 500;

        elements.charCount.textContent = `${current}/${max}`;

        // Cambia colore in base alla lunghezza
        elements.charCount.className = '';
        if (current > max * 0.9) {
            elements.charCount.classList.add('danger');
        } else if (current > max * 0.8) {
            elements.charCount.classList.add('warning');
        }

        validateForm();
    }

    // ===============================================
    // VALIDAZIONE FORM
    // ===============================================
    function validateForm() {
        const hasRating = appState.currentRating > 0;
        const hasComment = elements.reviewComment && elements.reviewComment.value.trim().length > 0;

        if (elements.submitReview) {
            elements.submitReview.disabled = !hasRating;
        }
    }

    // ===============================================
    // SUBMIT RECENSIONE
    // ===============================================
    function submitReview(e) {
        e.preventDefault();

        if (appState.currentRating === 0) {
            showNotification('Seleziona una valutazione', 'error');
            return;
        }

        const reviewData = {
            id: appState.currentReviewId,
            rating: appState.currentRating,
            comment: elements.reviewComment.value.trim()
        };

        // Simula invio al server
        setTimeout(() => {
            processReviewSubmission(reviewData);
        }, 1000);

        // Mostra loading
        if (elements.submitReview) {
            elements.submitReview.disabled = true;
            elements.submitReview.textContent = 'Pubblicando...';
        }
    }

    function processReviewSubmission(reviewData) {
        // Trova e rimuovi dalla lista pending
        const pendingIndex = reviewsData.pending.findIndex(r => r.id === reviewData.id);
        if (pendingIndex === -1) return;

        const pendingReview = reviewsData.pending[pendingIndex];
        reviewsData.pending.splice(pendingIndex, 1);

        // Aggiungi alla lista completed
        const completedReview = {
            ...pendingReview,
            rating: reviewData.rating,
            comment: reviewData.comment || 'Nessun commento aggiunto.',
            date: new Date().toISOString().split('T')[0]
        };

        reviewsData.completed.unshift(completedReview);

        // Aggiorna interfaccia
        updateStatistics();
        renderPendingReviews();
        renderCompletedReviews();
        closeReviewModal();

        // Notifica successo
        showNotification('Recensione pubblicata con successo!', 'success');

        console.log('✅ Recensione salvata:', reviewData);
    }

    // ===============================================
    // LOAD MORE
    // ===============================================
    function loadMoreReviews() {
        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.disabled = true;
            elements.loadMoreBtn.textContent = 'Caricamento...';

            setTimeout(() => {
                // Simula caricamento recensioni aggiuntive
                showNotification('Tutte le recensioni sono già caricate', 'info');

                elements.loadMoreBtn.disabled = false;
                elements.loadMoreBtn.textContent = 'Carica altre recensioni';
            }, 1500);
        }
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    function generateStars(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // ===============================================
    // SISTEMA NOTIFICHE
    // ===============================================
    function showNotification(message, type = 'info') {
        if (!elements.notificationContainer) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icons[type] || icons.info}</div>
                <div class="notification-text">
                    <div class="notification-message">${message}</div>
                </div>
            </div>
        `;

        elements.notificationContainer.appendChild(notification);

        // Animazione entrata
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Rimozione automatica
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // ===============================================
    // GESTIONE ERRORI
    // ===============================================
    window.addEventListener('error', (e) => {
        console.error('Errore recensioni:', e.error);
        showNotification('Si è verificato un errore. Riprova.', 'error');
    });

    // ===============================================
    // INIZIALIZZAZIONE COMPLETA
    // ===============================================
    init();

    // Debug per sviluppo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.ReviewsDebug = {
            data: reviewsData,
            state: appState,
            showNotification,
            elements
        };
        console.log('🔧 Debug recensioni disponibile: window.ReviewsDebug');
    }
});