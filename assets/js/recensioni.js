/* ===============================================
   RELAXPOINT - JS RECENSIONI DASHBOARD
   Gestione completa sezione recensioni
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('⭐ Dashboard Recensioni RelaxPoint inizializzata');

    // ===============================================
    // STATO GLOBALE RECENSIONI
    // ===============================================
    const reviewsState = {
        currentFilter: 'all',
        pendingReviews: [],
        writtenReviews: [],
        currentReview: null,
        rating: 0
    };

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const elements = {
        // Filter buttons
        filterBtns: document.querySelectorAll('.filter-btn'),
        reviewItems: document.querySelectorAll('.review-item'),
        loadMoreBtn: document.querySelector('.btn-load-more'),

        // Stars
        starsContainers: document.querySelectorAll('.stars-container'),

        // Modal
        reviewModal: document.getElementById('reviewModal'),
        modalServiceName: document.getElementById('modalServiceName'),
        modalProviderName: document.getElementById('modalProviderName'),
        modalStars: document.getElementById('modalStars'),
        reviewComment: document.getElementById('reviewComment'),
        charCount: document.querySelector('.char-count'),

        // Buttons
        btnSubmit: document.querySelector('.btn-submit'),

        // User elements
        userName: document.getElementById('userName'),
        userAvatarMain: document.getElementById('userAvatarMain'),
        avatarInput: document.getElementById('avatarInput')
    };

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        setupStarsInteraction();
        setupFilters();
        setupModal();
        setupUserData();
        setupCharCounter();
        setupLoadMore();
        console.log('✅ Recensioni inizializzate completamente');
    }

    // ===============================================
    // GESTIONE STELLE RATING
    // ===============================================
    function setupStarsInteraction() {
        elements.starsContainers.forEach(container => {
            const stars = container.querySelectorAll('.star');

            stars.forEach((star, index) => {
                star.addEventListener('mouseenter', function () {
                    highlightStars(container, index + 1);
                });

                star.addEventListener('click', function () {
                    const rating = index + 1;
                    setRating(container, rating);

                    if (container.id === 'modalStars') {
                        reviewsState.rating = rating;
                        updateSubmitButton();
                    }
                });
            });

            container.addEventListener('mouseleave', function () {
                const currentRating = parseInt(this.getAttribute('data-rating') || '0');
                highlightStars(this, currentRating);
            });
        });
    }

    function highlightStars(container, count) {
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    function setRating(container, rating) {
        container.setAttribute('data-rating', rating);
        highlightStars(container, rating);
        console.log(`⭐ Rating impostato: ${rating} stelle`);
    }

    // ===============================================
    // FILTRI RECENSIONI
    // ===============================================
    function setupFilters() {
        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');
                applyFilter(filter);
                updateActiveFilter(this);
            });
        });
    }

    function applyFilter(filter) {
        reviewsState.currentFilter = filter;

        elements.reviewItems.forEach(item => {
            const itemRating = item.getAttribute('data-rating');

            if (filter === 'all' || itemRating === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                item.style.display = 'none';
            }
        });

        console.log(`🔍 Filtro applicato: ${filter}`);
        showNotification(`Filtro applicato: ${getFilterLabel(filter)}`, 'info');
    }

    function updateActiveFilter(activeBtn) {
        elements.filterBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    function getFilterLabel(filter) {
        const labels = {
            'all': 'Tutte le recensioni',
            '5': '5 stelle',
            '4': '4 stelle',
            '3': '3 stelle'
        };
        return labels[filter] || filter;
    }

    // ===============================================
    // GESTIONE MODAL RECENSIONE
    // ===============================================
    function setupModal() {
        if (elements.reviewComment) {
            elements.reviewComment.addEventListener('input', updateCharCounter);
        }

        // Close modal on overlay click
        if (elements.reviewModal) {
            elements.reviewModal.addEventListener('click', function (e) {
                if (e.target === this) {
                    closeReviewModal();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && elements.reviewModal.style.display !== 'none') {
                closeReviewModal();
            }
        });
    }

    // Funzioni globali per il modal (chiamate da HTML)
    window.openReviewModal = function (serviceId) {
        const serviceData = getServiceData(serviceId);

        if (elements.modalServiceName) {
            elements.modalServiceName.textContent = serviceData.name;
        }
        if (elements.modalProviderName) {
            elements.modalProviderName.textContent = `con ${serviceData.provider}`;
        }

        // Reset form
        resetModalForm();

        reviewsState.currentReview = serviceId;

        if (elements.reviewModal) {
            elements.reviewModal.style.display = 'flex';
            elements.reviewModal.style.opacity = '0';

            setTimeout(() => {
                elements.reviewModal.style.opacity = '1';
            }, 10);
        }

        console.log(`📝 Modal aperto per: ${serviceData.name}`);
    };

    window.closeReviewModal = function () {
        if (elements.reviewModal) {
            elements.reviewModal.style.opacity = '0';

            setTimeout(() => {
                elements.reviewModal.style.display = 'none';
                resetModalForm();
            }, 300);
        }

        reviewsState.currentReview = null;
        reviewsState.rating = 0;
        console.log('❌ Modal chiuso');
    };

    window.submitReview = function () {
        if (!validateReview()) {
            return;
        }

        const reviewData = {
            serviceId: reviewsState.currentReview,
            rating: reviewsState.rating,
            comment: elements.reviewComment ? elements.reviewComment.value.trim() : '',
            date: new Date().toLocaleDateString('it-IT')
        };

        console.log('📤 Invio recensione:', reviewData);

        // Simula invio al server
        setTimeout(() => {
            showNotification('Recensione pubblicata con successo!', 'success');
            closeReviewModal();
            updatePendingReviews(reviewsState.currentReview);
            updateStats();
        }, 1000);

        // Disabilita pulsante durante invio
        if (elements.btnSubmit) {
            elements.btnSubmit.disabled = true;
            elements.btnSubmit.textContent = 'Pubblicando...';
        }
    };

    function resetModalForm() {
        if (elements.modalStars) {
            setRating(elements.modalStars, 0);
        }

        if (elements.reviewComment) {
            elements.reviewComment.value = '';
            updateCharCounter();
        }

        reviewsState.rating = 0;
        updateSubmitButton();
    }

    function validateReview() {
        if (reviewsState.rating === 0) {
            showNotification('Seleziona una valutazione', 'error');
            return false;
        }

        return true;
    }

    function updateSubmitButton() {
        if (!elements.btnSubmit) return;

        const isValid = reviewsState.rating > 0;
        elements.btnSubmit.disabled = !isValid;
        elements.btnSubmit.textContent = isValid ? 'Pubblica Recensione' : 'Seleziona Rating';
    }

    // ===============================================
    // CHARACTER COUNTER
    // ===============================================
    function setupCharCounter() {
        updateCharCounter();
    }

    function updateCharCounter() {
        if (!elements.reviewComment || !elements.charCount) return;

        const current = elements.reviewComment.value.length;
        const max = elements.reviewComment.getAttribute('maxlength') || 500;

        elements.charCount.textContent = `${current}/${max}`;

        if (current > max * 0.9) {
            elements.charCount.style.color = '#ef4444';
        } else if (current > max * 0.8) {
            elements.charCount.style.color = '#f59e0b';
        } else {
            elements.charCount.style.color = '#64748b';
        }
    }

    // ===============================================
    // LOAD MORE FUNCTIONALITY
    // ===============================================
    function setupLoadMore() {
        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.addEventListener('click', function () {
                this.disabled = true;
                this.textContent = 'Caricamento...';

                // Simula caricamento
                setTimeout(() => {
                    loadMoreReviews();
                    this.disabled = false;
                    this.textContent = 'Carica altre recensioni';
                }, 1500);
            });
        }
    }

    function loadMoreReviews() {
        console.log('📥 Caricamento recensioni aggiuntive...');
        showNotification('Recensioni caricate', 'success');

        // In un'app reale, qui ci sarebbe una chiamata API
        // Per ora mostriamo solo una notifica
    }

    // ===============================================
    // GESTIONE DATI UTENTE
    // ===============================================
    function setupUserData() {
        // Imposta nome utente se presente
        if (elements.userName) {
            elements.userName.textContent = 'Recensioni';
        }

        // Setup avatar upload
        if (elements.avatarInput && elements.userAvatarMain) {
            elements.avatarInput.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        elements.userAvatarMain.src = e.target.result;
                        showNotification('Avatar aggiornato!', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Click avatar to change
            elements.userAvatarMain.addEventListener('click', function () {
                elements.avatarInput.click();
            });
        }
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    function getServiceData(serviceId) {
        const serviceMap = {
            'massaggio-marco': {
                name: 'Massaggio Decontratturante',
                provider: 'Marco Rossi'
            },
            'trattamento-elena': {
                name: 'Trattamento Viso Rilassante',
                provider: 'Elena Bianchi'
            }
        };

        return serviceMap[serviceId] || {
            name: 'Servizio',
            provider: 'Professionista'
        };
    }

    function updatePendingReviews(serviceId) {
        // Rimuove elemento dalla lista pending
        const pendingItems = document.querySelectorAll('.pending-review-item');
        pendingItems.forEach(item => {
            const btn = item.querySelector('.btn-action.primary');
            if (btn && btn.getAttribute('onclick').includes(serviceId)) {
                item.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    item.remove();
                    updatePendingCount();
                }, 300);
            }
        });
    }

    function updatePendingCount() {
        const pendingCount = document.querySelector('.pending-count');
        const remaining = document.querySelectorAll('.pending-review-item').length;

        if (pendingCount) {
            if (remaining === 0) {
                pendingCount.textContent = 'Tutto aggiornato';
                pendingCount.style.background = '#10b981';
            } else {
                pendingCount.textContent = `${remaining} in sospeso`;
            }
        }
    }

    function updateStats() {
        // Aggiorna le statistiche nella dashboard
        console.log('📊 Aggiornamento statistiche...');
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        const icon = getNotificationIcon(type);
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">${icon}</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    function getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // ===============================================
    // ANIMAZIONI CSS
    // ===============================================
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(-100%); }
            }
            
            .review-item {
                animation: fadeIn 0.3s ease-in;
            }
        `;
        document.head.appendChild(style);
    }

    // ===============================================
    // GESTIONE ERRORI
    // ===============================================
    function setupErrorHandling() {
        window.addEventListener('error', function (e) {
            console.error('Errore Recensioni:', e.error);
            showNotification('Si è verificato un errore. Riprova.', 'error');
        });
    }

    // ===============================================
    // INIZIALIZZAZIONE COMPLETA
    // ===============================================
    init();
    addAnimationStyles();
    setupErrorHandling();

    console.log('🚀 RelaxPoint Recensioni pronte!');

    // Debug mode per sviluppo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.ReviewsDebug = {
            state: reviewsState,
            elements: elements,
            openReviewModal: window.openReviewModal,
            closeReviewModal: window.closeReviewModal,
            applyFilter: applyFilter,
            showNotification: showNotification
        };
        console.log('🔧 Debug mode attivo - usa window.ReviewsDebug');
    }
});