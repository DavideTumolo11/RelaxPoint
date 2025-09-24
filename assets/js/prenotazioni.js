/* ===============================================
   RELAXPOINT - JS PRENOTAZIONI CLIENTE
   Gestione filtri, ricerca, countdown e azioni
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('[BOOKING] Prenotazioni Cliente - JS caricato');

    // ===============================================
    // STATO GLOBALE APPLICAZIONE
    // ===============================================
    let appState = {
        filters: {
            status: 'all',
            service: 'all',
            period: 'all'
        },
        searchTerm: '',
        bookings: [],
        currentPage: 1,
        isLoading: false
    };

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const elements = {
        filters: {
            status: document.getElementById('statusFilter'),
            service: document.getElementById('serviceFilter'),
            period: document.getElementById('periodFilter')
        },
        search: document.getElementById('searchBookings'),
        bookingsList: document.querySelector('.bookings-list'),
        historyTable: document.querySelector('.history-table tbody'),
        countBadges: {
            future: document.querySelector('.content-card:first-of-type .count-badge'),
            history: document.querySelector('.content-card:nth-of-type(2) .count-badge')
        },
        countdown: document.getElementById('nextBookingCountdown'),
        pagination: {
            prev: document.querySelector('.pagination-btn.prev'),
            next: document.querySelector('.pagination-btn.next'),
            info: document.querySelector('.pagination-info')
        }
    };

    // ===============================================
    // DATI MOCK PRENOTAZIONI
    // ===============================================
    const mockBookings = {
        future: [
            {
                id: 1,
                service: 'Massaggio Decontratturante',
                description: 'Trattamento mirato per tensioni muscolari',
                duration: '60 minuti',
                price: '€70',
                image: '../../assets/images/Servizi/massage2.jpg',
                date: '2024-07-24',
                time: '16:00-17:00',
                professional: {
                    name: 'Marco Rossi',
                    role: 'Massoterapista certificato',
                    avatar: '../../assets/images/Professionisti/pr2.png',
                    rating: 4.8
                },
                status: 'confirmed',
                category: 'massaggi'
            },
            {
                id: 2,
                service: 'Trattamento Viso Idratante',
                description: 'Pulizia profonda e idratazione intensiva',
                duration: '90 minuti',
                price: '€85',
                image: '../../assets/images/Servizi/Beauty.jpg',
                date: '2024-07-29',
                time: '14:30-16:00',
                professional: {
                    name: 'Elena Bianchi',
                    role: 'Estetista qualificata',
                    avatar: '../../assets/images/Professionisti/pr3.png',
                    rating: 4.6
                },
                status: 'pending',
                category: 'beauty'
            }
        ],
        history: [
            {
                id: 3,
                service: 'Personal Training',
                description: 'Allenamento funzionale',
                price: '€55',
                date: '2024-07-15',
                time: '18:00',
                professional: {
                    name: 'Giulia Rossi',
                    rating: 4.9
                },
                status: 'completed',
                category: 'fitness',
                hasReview: false
            },
            {
                id: 4,
                service: 'Massaggio Rilassante',
                description: 'Massaggio svedese',
                price: '€65',
                date: '2024-07-08',
                time: '16:30',
                professional: {
                    name: 'Marco Rossi',
                    rating: 4.8
                },
                status: 'completed',
                category: 'massaggi',
                hasReview: true
            },
            {
                id: 5,
                service: 'Lezione di Yoga',
                description: 'Hatha yoga rilassante',
                price: '€40',
                date: '2024-06-28',
                time: '19:00',
                professional: {
                    name: 'Laura Verdi',
                    rating: 4.7
                },
                status: 'cancelled',
                category: 'yoga',
                refunded: true
            },
            {
                id: 6,
                service: 'Pulizia Viso',
                description: 'Trattamento purificante',
                price: '€75',
                date: '2024-06-20',
                time: '15:00',
                professional: {
                    name: 'Sofia Moretti',
                    rating: 4.5
                },
                status: 'completed',
                category: 'beauty',
                hasReview: true
            }
        ]
    };

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        setupEventListeners();
        startCountdown();
        loadBookings();
        updateCountBadges();
        console.log('✅ Prenotazioni - Tutto inizializzato');
    }

    // ===============================================
    // EVENT LISTENERS
    // ===============================================
    function setupEventListeners() {
        // Filtri
        Object.values(elements.filters).forEach(filter => {
            if (filter) {
                filter.addEventListener('change', handleFilterChange);
            }
        });

        // Ricerca
        if (elements.search) {
            elements.search.addEventListener('input', debounce(handleSearch, 300));
        }

        // Azioni prenotazioni
        document.addEventListener('click', handleBookingActions);

        // Paginazione
        if (elements.pagination.prev) {
            elements.pagination.prev.addEventListener('click', () => changePage(-1));
        }
        if (elements.pagination.next) {
            elements.pagination.next.addEventListener('click', () => changePage(1));
        }
    }

    // ===============================================
    // GESTIONE FILTRI
    // ===============================================
    function handleFilterChange(e) {
        const filterType = e.target.id.replace('Filter', '');
        const filterValue = e.target.value;

        appState.filters[filterType] = filterValue;
        appState.currentPage = 1;

        console.log(`[SEARCH] Filtro ${filterType}: ${filterValue}`);
        applyFilters();
    }

    function handleSearch(e) {
        appState.searchTerm = e.target.value.toLowerCase().trim();
        appState.currentPage = 1;

        console.log(`[SEARCH] Ricerca: "${appState.searchTerm}"`);
        applyFilters();
    }

    function applyFilters() {
        if (appState.isLoading) return;

        appState.isLoading = true;
        showLoadingState();

        // Simula delay API
        setTimeout(() => {
            filterAndDisplayBookings();
            appState.isLoading = false;
            hideLoadingState();
        }, 500);
    }

    function filterAndDisplayBookings() {
        const filteredFuture = filterBookings(mockBookings.future, true);
        const filteredHistory = filterBookings(mockBookings.history, false);

        renderFutureBookings(filteredFuture);
        renderHistoryBookings(filteredHistory);
        updateCountBadges(filteredFuture.length, filteredHistory.length);
    }

    function filterBookings(bookings, isFuture) {
        return bookings.filter(booking => {
            // Filtro stato
            if (appState.filters.status !== 'all' && booking.status !== appState.filters.status) {
                return false;
            }

            // Filtro servizio
            if (appState.filters.service !== 'all' && booking.category !== appState.filters.service) {
                return false;
            }

            // Filtro periodo
            if (appState.filters.period !== 'all') {
                const bookingDate = new Date(booking.date);
                const now = new Date();

                switch (appState.filters.period) {
                    case 'future':
                        if (bookingDate <= now) return false;
                        break;
                    case 'this-month':
                        if (bookingDate.getMonth() !== now.getMonth() || bookingDate.getFullYear() !== now.getFullYear()) return false;
                        break;
                    case 'last-month':
                        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
                        if (bookingDate.getMonth() !== lastMonth.getMonth() || bookingDate.getFullYear() !== lastMonth.getFullYear()) return false;
                        break;
                    case 'last-3-months':
                        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3);
                        if (bookingDate < threeMonthsAgo) return false;
                        break;
                }
            }

            // Filtro ricerca
            if (appState.searchTerm) {
                const searchFields = [
                    booking.service,
                    booking.description,
                    booking.professional.name,
                    booking.professional.role || ''
                ].join(' ').toLowerCase();

                if (!searchFields.includes(appState.searchTerm)) {
                    return false;
                }
            }

            return true;
        });
    }

    // ===============================================
    // RENDERING PRENOTAZIONI
    // ===============================================
    function renderFutureBookings(bookings) {
        if (!elements.bookingsList) return;

        if (bookings.length === 0) {
            elements.bookingsList.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="color: var(--color-secondary); opacity: 0.5;">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    <h3 style="color: var(--color-text); margin: 16px 0 8px 0;">Nessuna prenotazione trovata</h3>
                    <p style="color: var(--color-secondary); margin: 0;">Modifica i filtri o cerca qualcos'altro</p>
                </div>
            `;
            return;
        }

        const html = bookings.map(booking => `
            <div class="booking-item ${booking.status}" data-booking-id="${booking.id}">
                <div class="booking-main">
                    <div class="booking-service-info">
                        <div class="service-image">
                            <img src="${booking.image}" alt="${booking.service}">
                        </div>
                        <div class="service-details">
                            <h4>${booking.service}</h4>
                            <p class="service-description">${booking.description}</p>
                            <div class="service-meta">
                                <span class="service-duration">${booking.duration}</span>
                                <span class="service-price">${booking.price}</span>
                            </div>
                        </div>
                    </div>

                    <div class="booking-when">
                        <div class="booking-date">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                            </svg>
                            <span>${formatDate(booking.date)}</span>
                        </div>
                        <div class="booking-time">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                            </svg>
                            <span>${booking.time}</span>
                        </div>
                        ${booking.status === 'confirmed' ? `
                            <div class="countdown-mini">
                                <span class="countdown-label">Tra:</span>
                                <span class="countdown-value" data-target-date="${booking.date}T${booking.time.split('-')[0]}">--</span>
                            </div>
                        ` : `
                            <div class="pending-note">
                                <span class="pending-label">In attesa conferma professionista</span>
                            </div>
                        `}
                    </div>

                    <div class="booking-professional">
                        <div class="professional-avatar">
                            <img src="${booking.professional.avatar}" alt="${booking.professional.name}">
                        </div>
                        <div class="professional-info">
                            <h5>${booking.professional.name}</h5>
                            <p>${booking.professional.role}</p>
                            <div class="professional-rating">
                                <div class="stars">
                                    ${generateStars(booking.professional.rating)}
                                </div>
                                <span class="rating-value">${booking.professional.rating}</span>
                            </div>
                        </div>
                    </div>

                    <div class="booking-status">
                        <span class="status-badge ${booking.status}">${getStatusText(booking.status)}</span>
                        <p class="status-note">${getStatusNote(booking.status)}</p>
                    </div>
                </div>

                <div class="booking-actions">
                    ${generateBookingActions(booking)}
                </div>
            </div>
        `).join('');

        elements.bookingsList.innerHTML = html;

        // Aggiorna countdown dopo rendering
        updateCountdowns();
    }

    function renderHistoryBookings(bookings) {
        if (!elements.historyTable) return;

        if (bookings.length === 0) {
            elements.historyTable.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: var(--color-secondary);">
                        Nessuna prenotazione nello storico
                    </td>
                </tr>
            `;
            return;
        }

        const html = bookings.map(booking => `
            <tr class="history-item ${booking.status}" data-booking-id="${booking.id}">
                <td>
                    <div class="service-compact">
                        <img src="${getServiceImage(booking.category)}" alt="${booking.service}" class="service-thumb">
                        <div class="service-compact-details">
                            <h5>${booking.service}</h5>
                            <p>${booking.description}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="professional-compact">
                        <img src="${getProfessionalImage(booking.professional.name)}" alt="${booking.professional.name}" class="professional-thumb">
                        <div class="professional-compact-details">
                            <h6>${booking.professional.name}</h6>
                            <div class="rating-compact">
                                <span class="stars-compact">${generateStarsCompact(booking.professional.rating)}</span>
                                <span class="rating-number">${booking.professional.rating}</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="date-compact">
                        <span class="date-main">${formatDateShort(booking.date)}</span>
                        <span class="time-compact">${booking.time}</span>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${booking.status}">${getStatusText(booking.status)}</span>
                </td>
                <td>
                    <span class="price-amount ${booking.refunded ? 'refunded' : ''}">${booking.price}</span>
                    ${booking.refunded ? '<small class="refund-note">Rimborsato</small>' : ''}
                </td>
                <td>
                    <div class="table-actions">
                        ${generateHistoryActions(booking)}
                    </div>
                </td>
            </tr>
        `).join('');

        elements.historyTable.innerHTML = html;
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

    function generateStarsCompact(rating) {
        const fullStars = Math.floor(rating);
        return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Oggi';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Domani';
        } else {
            return date.toLocaleDateString('it-IT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }

    function formatDateShort(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    function getStatusText(status) {
        const statusTexts = {
            confirmed: 'Confermato',
            pending: 'In attesa',
            completed: 'Completato',
            cancelled: 'Cancellato'
        };
        return statusTexts[status] || status;
    }

    function getStatusNote(status) {
        const statusNotes = {
            confirmed: 'Pagamento completato',
            pending: 'Risposta entro 2 ore',
            completed: 'Servizio completato',
            cancelled: 'Prenotazione cancellata'
        };
        return statusNotes[status] || '';
    }

    function generateBookingActions(booking) {
        let actions = '';

        if (booking.status === 'confirmed') {
            actions += `
                <button class="btn-action primary" data-action="chat" data-booking-id="${booking.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z"/>
                    </svg>
                    Chat
                </button>
            `;
        }

        actions += `
            <button class="btn-action secondary" data-action="edit" data-booking-id="${booking.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M17.81,9.94"/>
                </svg>
                Modifica
            </button>
            <button class="btn-action tertiary" data-action="cancel" data-booking-id="${booking.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
                Cancella
            </button>
            <button class="btn-action info" data-action="details" data-booking-id="${booking.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                </svg>
                Dettagli
            </button>
        `;

        return actions;
    }

    function generateHistoryActions(booking) {
        let actions = '';

        // Pulsante recensione
        if (booking.status === 'completed') {
            if (booking.hasReview) {
                actions += `
                    <button class="btn-table-action review completed" title="Recensione lasciata" data-action="view-review" data-booking-id="${booking.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                        </svg>
                    </button>
                `;
            } else {
                actions += `
                    <button class="btn-table-action review" title="Lascia recensione" data-action="review" data-booking-id="${booking.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                    </button>
                `;
            }
        }

        // Pulsante ripeti (sempre disponibile)
        actions += `
            <button class="btn-table-action repeat" title="Ripeti prenotazione" data-action="repeat" data-booking-id="${booking.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12H4A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/>
                </svg>
            </button>
        `;

        // Pulsante dettagli
        actions += `
            <button class="btn-table-action details" title="Vedi dettagli" data-action="details" data-booking-id="${booking.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                </svg>
            </button>
        `;

        return actions;
    }

    function getServiceImage(category) {
        const images = {
            fitness: '../../assets/images/Servizi/Gym.jpg',
            massaggi: '../../assets/images/Servizi/massage2.jpg',
            yoga: '../../assets/images/Servizi/YogaEndMeditazione.jpeg',
            beauty: '../../assets/images/Servizi/Beauty.jpg'
        };
        return images[category] || '../../assets/images/Servizi/Beauty.jpg';
    }

    function getProfessionalImage(name) {
        const images = {
            'Giulia Rossi': '../../assets/images/Professionisti/pr1.png',
            'Marco Rossi': '../../assets/images/Professionisti/pr2.png',
            'Laura Verdi': '../../assets/images/Servizi/pr3.png',
            'Sofia Moretti': '../../assets/images/Professionisti/pr5.png'
        };
        return images[name] || '../../assets/images/Professionisti/pr1.png';
    }

    // ===============================================
    // GESTIONE AZIONI PRENOTAZIONI
    // ===============================================
    function handleBookingActions(e) {
        const actionButton = e.target.closest('[data-action]');
        if (!actionButton) return;

        const action = actionButton.getAttribute('data-action');
        const bookingId = actionButton.getAttribute('data-booking-id');

        console.log(`🎬 Azione: ${action} per prenotazione ${bookingId}`);

        switch (action) {
            case 'chat':
                openChat(bookingId);
                break;
            case 'edit':
                editBooking(bookingId);
                break;
            case 'cancel':
                cancelBooking(bookingId);
                break;
            case 'details':
                showBookingDetails(bookingId);
                break;
            case 'review':
                writeReview(bookingId);
                break;
            case 'view-review':
                viewReview(bookingId);
                break;
            case 'repeat':
                repeatBooking(bookingId);
                break;
        }
    }

    function openChat(bookingId) {
        showToast('Chat aperta con il professionista', 'success');
        // In implementazione reale: aprire chat
    }

    function editBooking(bookingId) {
        showToast('Apertura modifica prenotazione...', 'info');
        // In implementazione reale: aprire modal modifica
    }

    function cancelBooking(bookingId) {
        if (confirm('Sei sicuro di voler cancellare questa prenotazione?')) {
            showToast('Prenotazione cancellata con successo', 'success');
            // In implementazione reale: API call + aggiornamento stato
            setTimeout(() => {
                loadBookings();
            }, 1000);
        }
    }

    function showBookingDetails(bookingId) {
        showToast('Apertura dettagli prenotazione...', 'info');
        // In implementazione reale: aprire modal dettagli
    }

    function writeReview(bookingId) {
        showToast('Apertura form recensione...', 'info');
        // In implementazione reale: aprire modal recensione
    }

    function viewReview(bookingId) {
        showToast('Visualizzazione recensione esistente', 'info');
        // In implementazione reale: mostrare recensione
    }

    function repeatBooking(bookingId) {
        showToast('Ripetizione prenotazione in corso...', 'success');
        // In implementazione reale: copiare prenotazione + aprire booking flow
    }

    // ===============================================
    // COUNTDOWN LIVE
    // ===============================================
    function startCountdown() {
        updateCountdowns();
        setInterval(updateCountdowns, 60000); // Aggiorna ogni minuto
    }

    function updateCountdowns() {
        const countdownElements = document.querySelectorAll('.countdown-value[data-target-date]');

        countdownElements.forEach(element => {
            const targetDate = new Date(element.getAttribute('data-target-date'));
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                element.textContent = 'Iniziato';
                element.style.color = '#ef4444';
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 24) {
                const days = Math.floor(hours / 24);
                const remainingHours = hours % 24;
                element.textContent = `${days}g ${remainingHours}h`;
            } else if (hours > 0) {
                element.textContent = `${hours}h ${minutes}m`;
            } else {
                element.textContent = `${minutes}m`;
            }

            // Colora countdown in base al tempo rimanente
            if (hours < 2) {
                element.style.color = '#ef4444'; // Rosso per urgente
            } else if (hours < 12) {
                element.style.color = '#f59e0b'; // Arancione per attenzione
            } else {
                element.style.color = 'var(--color-primary)'; // Verde normale
            }
        });
    }

    // ===============================================
    // GESTIONE STATO CARICAMENTO
    // ===============================================
    function showLoadingState() {
        if (elements.bookingsList) {
            elements.bookingsList.classList.add('loading');
        }
        if (elements.historyTable && elements.historyTable.parentElement) {
            elements.historyTable.parentElement.classList.add('loading');
        }
    }

    function hideLoadingState() {
        if (elements.bookingsList) {
            elements.bookingsList.classList.remove('loading');
        }
        if (elements.historyTable && elements.historyTable.parentElement) {
            elements.historyTable.parentElement.classList.remove('loading');
        }
    }

    // ===============================================
    // AGGIORNAMENTO BADGE CONTATORI
    // ===============================================
    function updateCountBadges(futureCount = null, historyCount = null) {
        if (futureCount === null) {
            futureCount = mockBookings.future.length;
        }
        if (historyCount === null) {
            historyCount = mockBookings.history.length;
        }

        if (elements.countBadges.future) {
            elements.countBadges.future.textContent = futureCount;
        }
        if (elements.countBadges.history) {
            elements.countBadges.history.textContent = historyCount;
        }
    }

    // ===============================================
    // CARICAMENTO DATI
    // ===============================================
    function loadBookings() {
        console.log('📥 Caricamento prenotazioni...');

        // In implementazione reale: chiamata API
        // const response = await fetch('/api/bookings');
        // const data = await response.json();

        // Per ora usa dati mock
        appState.bookings = [...mockBookings.future, ...mockBookings.history];

        // Applica filtri correnti
        filterAndDisplayBookings();
    }

    // ===============================================
    // PAGINAZIONE
    // ===============================================
    function changePage(direction) {
        const newPage = appState.currentPage + direction;

        if (newPage < 1) return;

        appState.currentPage = newPage;
        applyFilters();

        // Aggiorna UI paginazione
        updatePaginationUI();
    }

    function updatePaginationUI() {
        const totalPages = Math.ceil(mockBookings.history.length / 10); // 10 per pagina

        if (elements.pagination.info) {
            elements.pagination.info.textContent = `Pagina ${appState.currentPage} di ${totalPages}`;
        }

        if (elements.pagination.prev) {
            elements.pagination.prev.disabled = appState.currentPage === 1;
        }

        if (elements.pagination.next) {
            elements.pagination.next.disabled = appState.currentPage === totalPages;
        }
    }

    // ===============================================
    // NOTIFICHE TOAST
    // ===============================================
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

    // ===============================================
    // UTILITY DEBOUNCE
    // ===============================================
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
    // GESTIONE ERRORI
    // ===============================================
    function handleError(error, context = 'Operazione') {
        console.error(`❌ Errore in ${context}:`, error);
        showToast(`${context} fallita. Riprova più tardi.`, 'error');
    }

    // ===============================================
    // KEYBOARD SHORTCUTS
    // ===============================================
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function (e) {
            // Ctrl/Cmd + F = Focus ricerca
            if ((e.ctrlKey || e.metaKey) && e.key === 'f' && elements.search) {
                e.preventDefault();
                elements.search.focus();
            }

            // Escape = Clear ricerca
            if (e.key === 'Escape' && elements.search) {
                elements.search.value = '';
                elements.search.dispatchEvent(new Event('input'));
            }
        });
    }

    // ===============================================
    // ANALYTICS E TRACKING
    // ===============================================
    function trackEvent(eventName, eventData = {}) {
        // In implementazione reale: invia a Google Analytics o servizio simile
        console.log(`📊 Analytics: ${eventName}`, eventData);

        // Esempio implementazione GA4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                page_title: 'Prenotazioni Dashboard',
                page_location: window.location.href,
                ...eventData
            });
        }
    }

    // ===============================================
    // GESTIONE VISIBILITÀ TAB
    // ===============================================
    function handleVisibilityChange() {
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                // Tab è tornata visibile, aggiorna countdown
                updateCountdowns();
                console.log('🔄 Tab visibile - Countdown aggiornato');
            }
        });
    }

    // ===============================================
    // AUTO-REFRESH INTELLIGENTE
    // ===============================================
    function setupAutoRefresh() {
        // Aggiorna dati ogni 5 minuti se la pagina è visibile
        setInterval(() => {
            if (!document.hidden && !appState.isLoading) {
                console.log('🔄 Auto-refresh prenotazioni');
                loadBookings();
                trackEvent('auto_refresh', { type: 'bookings' });
            }
        }, 5 * 60 * 1000); // 5 minuti
    }

    // ===============================================
    // RESPONSIVE UTILITIES
    // ===============================================
    function handleResize() {
        window.addEventListener('resize', debounce(() => {
            const isMobile = window.innerWidth < 768;

            // Adatta UI per mobile se necessario
            if (isMobile) {
                // Nascondi colonne meno importanti in tabella
                const table = document.querySelector('.history-table');
                if (table) {
                    table.classList.add('mobile-view');
                }
            }
        }, 250));
    }

    // ===============================================
    // GESTIONE OFFLINE
    // ===============================================
    function handleOfflineStatus() {
        window.addEventListener('online', () => {
            showToast('Connessione ripristinata', 'success');
            loadBookings(); // Ricarica dati quando torna online
        });

        window.addEventListener('offline', () => {
            showToast('Connessione persa - Modalità offline', 'warning');
        });
    }

    // ===============================================
    // INIZIALIZZAZIONE AVANZATA
    // ===============================================
    function initAdvancedFeatures() {
        setupKeyboardShortcuts();
        handleVisibilityChange();
        setupAutoRefresh();
        handleResize();
        handleOfflineStatus();

        // Track page view
        trackEvent('page_view', {
            page_title: 'Dashboard Prenotazioni',
            user_type: 'cliente'
        });
    }

    // ===============================================
    // CLEANUP
    // ===============================================
    function cleanup() {
        // Cleanup per evitare memory leaks
        window.addEventListener('beforeunload', () => {
            // Clear intervals, event listeners, etc.
            console.log('🧹 Cleanup prenotazioni dashboard');
        });
    }

    // ===============================================
    // AVVIO APPLICAZIONE
    // ===============================================
    try {
        init();
        initAdvancedFeatures();
        cleanup();

        console.log('[SUCCESS] Dashboard Prenotazioni completamente inizializzata');

        // Mostra messaggio di benvenuto
        setTimeout(() => {
            showToast('Dashboard prenotazioni caricata', 'success');
        }, 1000);

    } catch (error) {
        handleError(error, 'Inizializzazione dashboard');
    }

    // ===============================================
    // EXPORT PER DEBUG (solo development)
    // ===============================================
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.BookingsDebug = {
            state: appState,
            mockData: mockBookings,
            functions: {
                loadBookings,
                applyFilters,
                showToast,
                updateCountdowns
            }
        };
        console.log('🧪 Debug tools available: window.BookingsDebug');
    }

});