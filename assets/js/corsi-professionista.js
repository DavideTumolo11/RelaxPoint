/**
 * CORSI PROFESSIONISTA PAGE JAVASCRIPT
 * Gestisce filtri, interazioni e booking per la pagina corsi del professionista
 */

// Stato globale corsi
let allCorsi = [];
let filteredCorsi = [];
let isFollowing = false;
let currentPage = 1;
const CORSI_PER_PAGE = 6;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initCorsiProfessionista();
});

/**
 * Inizializzazione pagina corsi professionista
 */
function initCorsiProfessionista() {
    loadCorsiData();
    setupFilters();
    setupCorsiCards();
    setupFollowButton();
    setupPagination();
    console.log('✅ Corsi professionista page initialized');
}

/**
 * Carica dati corsi (simulati)
 */
function loadCorsiData() {
    allCorsi = [
        {
            id: 1,
            title: "Mindfulness Base - Percorso Completo",
            category: "mindfulness",
            type: "online",
            duration: 8,
            price: 199,
            rating: 5.0,
            reviews: 127,
            students: 240,
            lessons: 16,
            description: "Impara i fondamenti della mindfulness con un percorso strutturato di 8 settimane.",
            cover: "../../assets/images/corsi/mindfulness-base.jpg",
            popular: true
        },
        {
            id: 2,
            title: "Yoga per Principianti",
            category: "yoga",
            type: "presenza",
            duration: 4,
            price: 149,
            rating: 5.0,
            reviews: 89,
            students: 156,
            lessons: 8,
            description: "Corso introduttivo allo yoga con lezioni in presenza.",
            cover: "../../assets/images/corsi/yoga-principianti.jpg",
            popular: false
        },
        {
            id: 3,
            title: "Gestione Stress e Ansia",
            category: "coaching",
            type: "ibrido",
            duration: 6,
            price: 249,
            rating: 5.0,
            reviews: 203,
            students: 412,
            lessons: 12,
            description: "Tecniche avanzate per gestire stress e ansia nella vita quotidiana.",
            cover: "../../assets/images/corsi/gestione-stress.jpg",
            popular: true
        },
        {
            id: 4,
            title: "Alimentazione Consapevole",
            category: "nutrizione",
            type: "online",
            duration: 5,
            price: 179,
            rating: 4.8,
            reviews: 164,
            students: 298,
            lessons: 15,
            description: "Sviluppa una relazione sana con il cibo attraverso la mindful eating.",
            cover: "../../assets/images/corsi/alimentazione.jpg",
            popular: false
        },
        {
            id: 5,
            title: "Meditazione Avanzata",
            category: "mindfulness",
            type: "online",
            duration: 12,
            price: 299,
            rating: 5.0,
            reviews: 78,
            students: 145,
            lessons: 24,
            description: "Corso avanzato per approfondire la pratica meditativa.",
            cover: "../../assets/images/corsi/meditazione-avanzata.jpg",
            popular: false
        },
        {
            id: 6,
            title: "Fitness Funzionale",
            category: "fitness",
            type: "presenza",
            duration: 8,
            price: 219,
            rating: 5.0,
            reviews: 112,
            students: 187,
            lessons: 16,
            description: "Allenamento funzionale per migliorare forza, mobilità e coordinazione.",
            cover: "../../assets/images/corsi/fitness-funzionale.jpg",
            popular: true
        }
    ];

    filteredCorsi = [...allCorsi];
}

/**
 * Setup filtri corsi
 */
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const typeFilter = document.getElementById('typeFilter');
    const durationFilter = document.getElementById('durationFilter');
    const sortFilter = document.getElementById('sortFilter');

    // Event listeners per filtri
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }

    if (durationFilter) {
        durationFilter.addEventListener('change', applyFilters);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
}

/**
 * Applica filtri ai corsi
 */
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const durationFilter = document.getElementById('durationFilter')?.value || '';
    const sortFilter = document.getElementById('sortFilter')?.value || 'recent';

    // Filtra corsi
    filteredCorsi = allCorsi.filter(corso => {
        const matchCategory = !categoryFilter || corso.category === categoryFilter;
        const matchType = !typeFilter || corso.type === typeFilter;

        let matchDuration = true;
        if (durationFilter === 'brevi') {
            matchDuration = corso.duration <= 4;
        } else if (durationFilter === 'medi') {
            matchDuration = corso.duration >= 5 && corso.duration <= 8;
        } else if (durationFilter === 'lunghi') {
            matchDuration = corso.duration >= 9;
        }

        return matchCategory && matchType && matchDuration;
    });

    // Ordina corsi
    switch (sortFilter) {
        case 'popular':
            filteredCorsi.sort((a, b) => b.students - a.students);
            break;
        case 'rating':
            filteredCorsi.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            filteredCorsi.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredCorsi.sort((a, b) => b.price - a.price);
            break;
        default: // recent
            filteredCorsi.sort((a, b) => b.id - a.id);
    }

    // Reset paginazione e aggiorna display
    currentPage = 1;
    updateCorsiDisplay();

    // Analytics simulato
    console.log(`🔍 Filtri applicati: ${filteredCorsi.length} corsi trovati`);
}

/**
 * Aggiorna display corsi
 */
function updateCorsiDisplay() {
    const container = document.querySelector('.corsi-grid');
    if (!container) return;

    const startIndex = (currentPage - 1) * CORSI_PER_PAGE;
    const endIndex = startIndex + CORSI_PER_PAGE;
    const corsiToShow = filteredCorsi.slice(0, endIndex);

    container.innerHTML = corsiToShow.map(corso => createCorsoCard(corso)).join('');

    // Setup events per nuove card
    setupCorsiCards();

    // Aggiorna paginazione
    updatePaginationButton();
}

/**
 * Crea HTML per card corso
 */
function createCorsoCard(corso) {
    const stars = '★'.repeat(Math.floor(corso.rating)) + '☆'.repeat(5 - Math.floor(corso.rating));

    return `
        <div class="corso-card" data-corso-id="${corso.id}" data-category="${corso.category}" data-type="${corso.type}" data-duration="${corso.duration}">
            <div class="corso-cover" style="background-image: url('${corso.cover}');">
                <div class="corso-play-button">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="corso-type-badge ${corso.type}">${getTypeBadgeText(corso.type)}</div>
                <div class="corso-duration">${corso.duration} settimane</div>
            </div>
            <div class="corso-info">
                <h3 class="corso-title">${corso.title}</h3>
                <p class="corso-description">${corso.description}</p>
                <div class="corso-meta">
                    <div class="corso-price">€${corso.price}</div>
                    <div class="corso-rating">
                        <span class="rating-stars">${stars}</span>
                        <span class="rating-count">(${corso.reviews})</span>
                    </div>
                </div>
                <div class="corso-details">
                    <span class="corso-lessons"><i class="fas fa-video"></i> ${corso.lessons} lezioni</span>
                    <span class="corso-students"><i class="fas fa-users"></i> ${corso.students} studenti</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Ottieni testo badge tipo corso
 */
function getTypeBadgeText(type) {
    switch (type) {
        case 'online': return 'Online';
        case 'presenza': return 'In Presenza';
        case 'ibrido': return 'Ibrido';
        default: return 'Online';
    }
}

/**
 * Setup eventi per card corsi
 */
function setupCorsiCards() {
    const corsiCards = document.querySelectorAll('.corso-card');

    corsiCards.forEach(card => {
        const corsoId = parseInt(card.dataset.corsoId);
        const corso = allCorsi.find(c => c.id === corsoId);

        if (!corso) return;

        // Click su play button
        const playBtn = card.querySelector('.corso-play-button');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showCorsoBookingModal(corso);
            });
        }

        // Click su card per dettagli
        card.addEventListener('click', () => {
            showCorsoDetailsModal(corso);
        });

        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Setup follow button
 */
function setupFollowButton() {
    const followBtn = document.querySelector('.follow-professional-btn');

    if (followBtn) {
        followBtn.addEventListener('click', () => {
            isFollowing = !isFollowing;

            if (isFollowing) {
                followBtn.innerHTML = '<i class="fas fa-bell"></i> Segui Corsi';
                followBtn.classList.add('following');
                showToast('Ora segui i corsi di Sophia Rossi!', 'success');
            } else {
                followBtn.innerHTML = '<i class="fas fa-bell"></i> Segui Corsi';
                followBtn.classList.remove('following');
                showToast('Non segui più i corsi di Sophia Rossi', 'info');
            }
        });
    }
}

/**
 * Setup paginazione
 */
function setupPagination() {
    const loadMoreBtn = document.getElementById('loadMoreCorsi');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            updateCorsiDisplay();
        });
    }
}

/**
 * Aggiorna button paginazione
 */
function updatePaginationButton() {
    const loadMoreBtn = document.getElementById('loadMoreCorsi');
    if (!loadMoreBtn) return;

    const totalShown = currentPage * CORSI_PER_PAGE;
    const hasMore = totalShown < filteredCorsi.length;

    if (hasMore) {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.textContent = `Carica Altri Corsi (${filteredCorsi.length - totalShown} rimanenti)`;
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

/**
 * Mostra modal dettagli corso
 */
function showCorsoDetailsModal(corso) {
    const modal = document.createElement('div');
    modal.className = 'corso-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">${corso.title}</h2>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="corso-detail-cover">
                    <div class="detail-cover-image" style="background-image: url('${corso.cover}')">
                        <div class="detail-book-btn" data-corso-id="${corso.id}">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                    </div>
                                            <div class="corso-detail-info">
                            <h3 class="detail-title">${corso.title}</h3>
                            <p class="detail-author">di Sophia Rossi</p>
                            <div class="detail-meta">
                                <span class="detail-duration">
                                    <i class="far fa-clock"></i> ${corso.duration} settimane
                                </span>
                                <span class="detail-type">
                                    <i class="fas fa-laptop"></i> ${getTypeBadgeText(corso.type)}
                                </span>
                                <span class="detail-price">
                                    <i class="fas fa-euro-sign"></i> €${corso.price}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="corso-detail-description">
                        <h4>Descrizione del Corso</h4>
                        <p>${corso.description}</p>
                        <div class="corso-stats">
                            <div class="stat-box">
                                <i class="fas fa-video"></i>
                                <span>${corso.lessons} Lezioni</span>
                            </div>
                            <div class="stat-box">
                                <i class="fas fa-users"></i>
                                <span>${corso.students} Studenti</span>
                            </div>
                            <div class="stat-box">
                                <i class="fas fa-star"></i>
                                <span>${corso.rating}/5 (${corso.reviews} recensioni)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="corso-detail-actions">
                        <button class="detail-action-btn book-btn" data-corso-id="${corso.id}">
                            <i class="fas fa-credit-card"></i>
                            Iscriviti al Corso - €${corso.price}
                        </button>
                        <button class="detail-action-btn wishlist-btn">
                            <i class="fas fa-heart"></i>
                            Salva nei Preferiti
                        </button>
                        <button class="detail-action-btn share-btn">
                            <i class="fas fa-share"></i>
                            Condividi Corso
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Setup modal events
    setupCorsoModalEvents(modal, corso);

    // Animazione entrata
    requestAnimationFrame(() => {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    });
}

/**
 * Setup eventi modal corso
 */
function setupCorsoModalEvents(modal, corso) {
    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', () => closeCorsoModal(modal));
    overlay.addEventListener('click', () => closeCorsoModal(modal));

    // ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeCorsoModal(modal);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Book buttons
    const bookBtns = modal.querySelectorAll('.detail-book-btn, .book-btn');
    bookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeCorsoModal(modal);
            showCorsoBookingModal(corso);
        });
    });

    // Action buttons
    const wishlistBtn = modal.querySelector('.wishlist-btn');
    const shareBtn = modal.querySelector('.share-btn');

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            showToast(`${corso.title} aggiunto ai preferiti!`, 'success');
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: corso.title,
                    text: `Scopri il corso "${corso.title}" di Sophia Rossi su RelaxPoint`,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link corso copiato negli appunti!', 'success');
            }
        });
    }
}

/**
 * Chiude modal corso
 */
function closeCorsoModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
    }, 300);
}

/**
 * Mostra modal booking corso
 */
function showCorsoBookingModal(corso) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Iscriviti al Corso</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="booking-course-info">
                    <img src="${corso.cover}" alt="${corso.title}" class="booking-cover">
                    <div class="booking-details">
                        <h4>${corso.title}</h4>
                        <p>Durata: ${corso.duration} settimane</p>
                        <p>Modalità: ${getTypeBadgeText(corso.type)}</p>
                        <p>Lezioni: ${corso.lessons}</p>
                        <div class="booking-price">€${corso.price}</div>
                    </div>
                </div>
                
                <div class="booking-form">
                    <div class="form-group">
                        <label for="startDate">Data Inizio Preferita:</label>
                        <select id="startDate" class="booking-select">
                            <option value="">Seleziona data inizio</option>
                            <option value="2024-02-01">1 Febbraio 2024</option>
                            <option value="2024-02-15">15 Febbraio 2024</option>
                            <option value="2024-03-01">1 Marzo 2024</option>
                            <option value="2024-03-15">15 Marzo 2024</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="paymentMethod">Metodo di Pagamento:</label>
                        <select id="paymentMethod" class="booking-select">
                            <option value="">Seleziona metodo</option>
                            <option value="card">Carta di Credito</option>
                            <option value="paypal">PayPal</option>
                            <option value="apple">Apple Pay</option>
                            <option value="google">Google Pay</option>
                        </select>
                    </div>
                    
                    <div class="booking-summary">
                        <div class="summary-row">
                            <span>Prezzo corso:</span>
                            <span>€${corso.price}</span>
                        </div>
                        <div class="summary-row">
                            <span>Commissioni:</span>
                            <span>€0</span>
                        </div>
                        <div class="summary-row total">
                            <span>Totale:</span>
                            <span>€${corso.price}</span>
                        </div>
                    </div>
                    
                    <button class="booking-confirm" data-corso-id="${corso.id}">
                        Iscriviti Ora - €${corso.price}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Setup modal events
    setupBookingModalEvents(modal, corso);
}

/**
 * Setup eventi modal booking
 */
function setupBookingModalEvents(modal, corso) {
    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) modal.remove();
    });

    // Booking confirm
    const confirmBtn = modal.querySelector('.booking-confirm');
    confirmBtn.addEventListener('click', () => {
        const startDate = modal.querySelector('#startDate').value;
        const paymentMethod = modal.querySelector('#paymentMethod').value;

        if (!startDate || !paymentMethod) {
            showToast('Compila tutti i campi richiesti', 'error');
            return;
        }

        // Simula processo di pagamento
        confirmBtn.textContent = 'Elaborazione...';
        confirmBtn.disabled = true;

        setTimeout(async () => {
            // Simula pagamento completato
            const paymentData = {
                userId: 'user_123',
                professionalId: 'prof_sophia',
                type: 'course',
                serviceId: corso.id,
                serviceName: corso.title,
                price: corso.price,
                paymentId: 'pay_' + Date.now(),
                courseData: {
                    lessons: corso.lessons,
                    duration: corso.duration // settimane
                },
                scheduledDateTime: startDate
            };

            try {
                // Genera codice accesso tramite sistema unificato
                const accessCode = await window.RelaxPointAccess.generateAccessCode(paymentData);

                modal.remove();
                showToast(`Iscrizione al corso "${corso.title}" completata!`, 'success');

                // Il codice viene automaticamente inviato via chat dal sistema
                console.log('✅ Codice accesso generato:', accessCode.code);

            } catch (error) {
                console.error('Error generating access code:', error);
                showToast('Errore nella generazione del codice accesso', 'error');

                confirmBtn.textContent = `Iscriviti Ora - €${corso.price}`;
                confirmBtn.disabled = false;
            }
        }, 2000);
    });
}

/**
 * Toast notifications
 */
function showToast(message, type = 'info') {
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

/**
 * ===============================================
 * INIZIALIZZAZIONE AUTO
 * =============================================== */

// Auto-inizializzazione quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCorsiProfessionista);
} else {
    initCorsiProfessionista();
}