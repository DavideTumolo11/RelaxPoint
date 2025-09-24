/* ===============================================
   LAST MINUTE JAVASCRIPT - RelaxPoint
   Gestione completa pagina Last Minute con filtri funzionanti
   =============================================== */

class LastMinuteManager {
    constructor() {
        this.userLocation = null;
        this.professionals = [];
        this.filteredProfessionals = [];
        this.currentBooking = null;
        this.refreshInterval = null;
        this.confirmationTimer = null;

        this.init();
    }

    init() {
        this.initGeolocation();
        this.initEventListeners();
        this.initAutoRefresh();
        this.loadProfessionals();
    }

    /* ===============================================
       GEOLOCALIZZAZIONE
       =============================================== */

    initGeolocation() {
        const locationStatus = document.getElementById('locationStatus');

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    locationStatus.innerHTML = `
                        <span class="location-icon">📍</span>
                        <span class="location-text">Posizione rilevata</span>
                    `;

                    this.updateDistances();
                },
                (error) => {
                    console.warn('Errore geolocalizzazione:', error);
                    locationStatus.innerHTML = `
                        <span class="location-icon">⚠️</span>
                        <span class="location-text">Inserisci manualmente la zona</span>
                    `;
                }
            );
        } else {
            locationStatus.innerHTML = `
                <span class="location-icon">⚠️</span>
                <span class="location-text">Geolocalizzazione non supportata</span>
            `;
        }
    }

    updateDistances() {
        const cards = document.querySelectorAll('.professional-lastminute-card');
        cards.forEach((card, index) => {
            const distanceElement = card.querySelector('.distance');
            const etaElement = card.querySelector('.eta');

            const distance = (Math.random() * 10 + 1).toFixed(1);
            const eta = Math.ceil(distance * 4 + Math.random() * 5);

            distanceElement.textContent = `${distance} km`;
            etaElement.textContent = `Arrivo in ~${eta} min`;
        });
    }

    /* ===============================================
       EVENT LISTENERS - AGGIORNATI PER FILTRI FUNZIONANTI
       =============================================== */

    initEventListeners() {
        // Slider distanza con filtro real-time
        const distanceSlider = document.getElementById('distanceFilter');
        const distanceValue = document.getElementById('distanceValue');

        if (distanceSlider && distanceValue) {
            distanceSlider.addEventListener('input', (e) => {
                distanceValue.textContent = `${e.target.value} km`;
                this.applyFiltersToCards();
            });
        }

        // Filtri select con applicazione automatica
        const filters = ['serviceFilter', 'timeFilter', 'priceFilter'];
        filters.forEach(filterId => {
            const filterElement = document.getElementById(filterId);
            if (filterElement) {
                filterElement.addEventListener('change', () => {
                    this.applyFiltersToCards();
                });
            }
        });

        // Click su card professionisti
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.professional-lastminute-card');
            if (card && !e.target.closest('button')) {
                const professionalId = card.dataset.professionalId;
                this.viewProfessional(professionalId);
            }
        });
    }

    /* ===============================================
       AUTO-REFRESH DATI
       =============================================== */

    initAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    refreshData() {
        const updateTime = document.querySelector('.update-time strong');
        if (updateTime) {
            updateTime.textContent = 'ora';
        }

        const refreshDot = document.querySelector('.refresh-dot');
        if (refreshDot) {
            refreshDot.style.animation = 'none';
            refreshDot.offsetHeight;
            refreshDot.style.animation = 'pulse 2s infinite';
        }

        console.log('Dati Last Minute aggiornati');
    }

    /* ===============================================
       GESTIONE FILTRI - COMPLETAMENTE FUNZIONANTI
       =============================================== */

    applyFiltersToCards() {
        const serviceFilter = document.getElementById('serviceFilter')?.value.toLowerCase();
        const timeFilter = document.getElementById('timeFilter')?.value;
        const distanceFilter = parseInt(document.getElementById('distanceFilter')?.value) || 50;
        const priceFilter = parseInt(document.getElementById('priceFilter')?.value) || 999;

        const cards = document.querySelectorAll('.professional-lastminute-card');
        let visibleCount = 0;

        cards.forEach(card => {
            let isVisible = true;

            // FILTRO SERVIZIO - Controlla specializzazioni
            if (serviceFilter && serviceFilter !== '') {
                const specializations = card.querySelectorAll('.spec-tag');
                let hasMatchingService = false;

                specializations.forEach(tag => {
                    const tagText = tag.textContent.toLowerCase();
                    if (this.matchesService(tagText, serviceFilter)) {
                        hasMatchingService = true;
                    }
                });

                if (!hasMatchingService) {
                    isVisible = false;
                }
            }

            // FILTRO ORARIO - Controlla disponibilità
            if (timeFilter && timeFilter !== '') {
                const availabilityElement = card.querySelector('.status-text');
                const availability = availabilityElement?.textContent.toLowerCase() || '';

                if (timeFilter === 'now' && !availability.includes('ora')) {
                    isVisible = false;
                }
                if (timeFilter === '2h') {
                    // Logica per prossime 2 ore
                    if (!availability.includes('ora') && !availability.includes('15:') && !availability.includes('16:')) {
                        isVisible = false;
                    }
                }
                if (timeFilter === 'today') {
                    // Tutti i servizi di oggi passano
                }
            }

            // FILTRO DISTANZA - Controlla km
            const distanceElement = card.querySelector('.distance');
            if (distanceElement) {
                const cardDistance = parseFloat(distanceElement.textContent.replace(' km', ''));
                if (cardDistance > distanceFilter) {
                    isVisible = false;
                }
            }

            // FILTRO PREZZO - Controlla budget
            if (priceFilter < 999) {
                const priceElement = card.querySelector('.price');
                if (priceElement) {
                    const cardPrice = parseInt(priceElement.textContent.replace('€', ''));
                    if (cardPrice > priceFilter) {
                        isVisible = false;
                    }
                }
            }

            // APPLICA VISIBILITÀ CON ANIMAZIONE
            if (isVisible) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Aggiorna contatore risultati
        this.updateResultsCounter(visibleCount);

        // Gestisci messaggio nessun risultato
        this.handleNoResults(visibleCount);
    }

    matchesService(tagText, serviceFilter) {
        const serviceMap = {
            'massaggi': ['massaggio', 'svedese', 'rilassante', 'decontratturante', 'sportivo', 'thai'],
            'fitness': ['personal training', 'hiit', 'allenamento', 'gym', 'fitness', 'workout'],
            'beauty': ['trattamento viso', 'anti-age', 'beauty', 'estetica', 'bellezza', 'skincare'],
            'yoga': ['yoga', 'hatha', 'mindfulness', 'meditazione', 'pilates'],
            'fisioterapia': ['fisioterapia', 'riabilitazione', 'terapia', 'osteopatia'],
            'hair-makeup': ['hair', 'make-up', 'makeup', 'capelli', 'trucco', 'parrucchiere'],
            'chef': ['chef', 'cucina', 'cena', 'cucinare', 'italiana', 'degustazione'],
            'escursioni': ['escursioni', 'natura', 'trekking', 'outdoor', 'hiking']
        };

        const keywords = serviceMap[serviceFilter] || [serviceFilter];
        return keywords.some(keyword => tagText.includes(keyword));
    }

    updateResultsCounter(count) {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = count;
        }

        const loadMoreInfo = document.querySelector('.load-more-info');
        if (loadMoreInfo) {
            loadMoreInfo.textContent = `Mostrando ${count} professionisti disponibili`;
        }
    }

    handleNoResults(count) {
        const grid = document.querySelector('.professionals-grid');
        let noResultsMessage = document.getElementById('noResultsMessage');

        if (count === 0) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.id = 'noResultsMessage';
                noResultsMessage.className = 'no-results-message';
                noResultsMessage.innerHTML = `
                    <div class="no-results-content">
                        <div class="no-results-icon">🔍</div>
                        <h3>Nessun professionista trovato</h3>
                        <p>Prova a modificare i filtri o ampliare la ricerca</p>
                        <button onclick="clearFilters()" class="btn-clear-filters">Reset Filtri</button>
                    </div>
                `;
                grid.appendChild(noResultsMessage);
            }
            noResultsMessage.style.display = 'block';
        } else {
            if (noResultsMessage) {
                noResultsMessage.style.display = 'none';
            }
        }
    }

    clearFilters() {
        // Reset tutti i filtri
        const serviceFilter = document.getElementById('serviceFilter');
        const timeFilter = document.getElementById('timeFilter');
        const distanceFilter = document.getElementById('distanceFilter');
        const distanceValue = document.getElementById('distanceValue');
        const priceFilter = document.getElementById('priceFilter');

        if (serviceFilter) serviceFilter.value = '';
        if (timeFilter) timeFilter.value = 'now';
        if (distanceFilter) distanceFilter.value = 25;
        if (distanceValue) distanceValue.textContent = '25 km';
        if (priceFilter) priceFilter.value = '';

        // Mostra tutte le card con animazione
        const cards = document.querySelectorAll('.professional-lastminute-card');
        cards.forEach((card, index) => {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });

        // Aggiorna contatori
        this.updateResultsCounter(cards.length);

        // Nascondi messaggio no results
        const noResultsMessage = document.getElementById('noResultsMessage');
        if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    }

    applyFilters() {
        // Applica filtri (già fatto automaticamente)
        this.applyFiltersToCards();

        // Scroll ai risultati
        document.querySelector('.lastminute-results').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Feedback visivo sul pulsante
        const applyButton = document.querySelector('.btn-apply');
        if (applyButton) {
            const originalText = applyButton.innerHTML;
            applyButton.innerHTML = '<span>✓ Filtri applicati</span>';
            setTimeout(() => {
                applyButton.innerHTML = originalText;
            }, 2000);
        }
    }

    /* ===============================================
       GESTIONE PROFESSIONISTI
       =============================================== */

    loadProfessionals() {
        this.professionals = [
            {
                id: 1,
                name: 'Giulia Rossi',
                service: 'Massaggio Svedese',
                rating: 4.9,
                reviews: 127,
                price: 85,
                image: '/assets/images/Professionisti/pr1.png',
                available: 'now',
                specializations: ['Massaggio Svedese', 'Rilassante']
            },
            {
                id: 2,
                name: 'Marco Bianchi',
                service: 'Personal Training',
                rating: 4.8,
                reviews: 89,
                price: 120,
                image: '/assets/images/Professionisti/pr2.png',
                available: '15:30',
                specializations: ['Personal Training', 'HIIT']
            }
        ];

        this.applyFiltersToCards();
    }

    viewProfessional(professionalId) {
        window.open(`/pages/professionista/professional-${professionalId}.html`, '_blank');
    }

    /* ===============================================
       GESTIONE PRENOTAZIONI
       =============================================== */

    bookNow(professionalId) {
        const professional = this.getMockProfessional(professionalId);

        if (!professional) {
            console.error('Professionista non trovato');
            return;
        }

        this.currentBooking = {
            professional: professional,
            step: 1,
            details: {},
            payment: {}
        };

        this.openBookingModal();
    }

    getMockProfessional(id) {
        const mockProfessionals = {
            1: {
                id: 1,
                name: 'Giulia Rossi',
                service: 'Massaggio Svedese',
                rating: 4.9,
                reviews: 127,
                price: 85,
                image: '/assets/images/Professionisti/pr1.png',
                duration: 60,
                specializations: ['Massaggio Svedese', 'Rilassante']
            },
            2: {
                id: 2,
                name: 'Marco Bianchi',
                service: 'Personal Training',
                rating: 4.8,
                reviews: 89,
                price: 120,
                image: '/assets/images/Professionisti/pr2.png',
                duration: 90,
                specializations: ['Personal Training', 'HIIT']
            },
            3: {
                id: 3,
                name: 'Sofia Moretti',
                service: 'Trattamento Viso',
                rating: 4.9,
                reviews: 156,
                price: 95,
                image: '/assets/images/Professionisti/pr3.png',
                duration: 75,
                specializations: ['Trattamento Viso', 'Anti-Age']
            },
            4: {
                id: 4,
                name: 'Laura Verdi',
                service: 'Hatha Yoga',
                rating: 5.0,
                reviews: 73,
                price: 70,
                image: '/assets/images/Professionisti/pr4.png',
                duration: 60,
                specializations: ['Hatha Yoga', 'Mindfulness']
            },
            5: {
                id: 5,
                name: 'Luca Melis',
                service: 'Cena a Domicilio',
                rating: 4.7,
                reviews: 94,
                price: 180,
                image: '/assets/images/Professionisti/pr5.png',
                duration: 180,
                specializations: ['Cucina Italiana', 'Cena a Domicilio']
            },
            6: {
                id: 6,
                name: 'Giuseppe Conti',
                service: 'Fisioterapia',
                rating: 4.8,
                reviews: 112,
                price: 75,
                image: '/assets/images/Professionisti/pr1.png',
                duration: 50,
                specializations: ['Fisioterapia', 'Riabilitazione']
            }
        };

        return mockProfessionals[id];
    }

    /* ===============================================
       MODALE PRENOTAZIONE
       =============================================== */

    openBookingModal() {
        const modal = document.getElementById('bookingModal');
        const professional = this.currentBooking.professional;

        // Popola dati professionista
        document.getElementById('modalProfessionalImage').style.backgroundImage = `url('${professional.image}')`;
        document.getElementById('modalProfessionalName').textContent = professional.name;
        document.getElementById('modalStars').textContent = '★'.repeat(5);
        document.getElementById('modalRating').textContent = professional.rating;
        document.getElementById('modalService').textContent = professional.service;
        document.getElementById('modalPrice').textContent = `€${professional.price}`;

        this.populateTimeSlots();

        if (this.userLocation) {
            document.getElementById('addressInput').placeholder = 'Indirizzo rilevato automaticamente';
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.showBookingStep(1);
    }

    populateTimeSlots() {
        const timeSlotSelect = document.getElementById('timeSlotSelect');
        const professional = this.currentBooking.professional;

        timeSlotSelect.innerHTML = '';

        if (professional.available === 'now') {
            timeSlotSelect.innerHTML += '<option value="now">Il prima possibile</option>';
        }

        const now = new Date();
        for (let i = 1; i <= 8; i++) {
            const futureTime = new Date(now.getTime() + i * 30 * 60000);
            const timeString = futureTime.toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit'
            });
            timeSlotSelect.innerHTML += `<option value="${timeString}">Alle ${timeString}</option>`;
        }
    }

    closeBookingModal() {
        const modal = document.getElementById('bookingModal');
        modal.style.display = 'none';
        document.body.style.overflow = '';

        this.currentBooking = null;

        if (this.confirmationTimer) {
            clearInterval(this.confirmationTimer);
            this.confirmationTimer = null;
        }
    }

    showBookingStep(step) {
        document.querySelectorAll('.booking-step').forEach(stepEl => {
            stepEl.style.display = 'none';
        });

        document.querySelectorAll('.step-buttons').forEach(buttonsEl => {
            buttonsEl.style.display = 'none';
        });

        document.getElementById(`step${step}`).style.display = 'block';
        document.getElementById(`step${step}Buttons`).style.display = 'flex';

        this.currentBooking.step = step;
    }

    goToPayment() {
        const timeSlot = document.getElementById('timeSlotSelect').value;
        const address = document.getElementById('addressInput').value;

        if (!timeSlot) {
            alert('Seleziona un orario');
            return;
        }

        if (!address && !this.userLocation) {
            alert('Inserisci un indirizzo');
            return;
        }

        this.currentBooking.details = {
            timeSlot: timeSlot,
            address: address || 'Posizione corrente',
            notes: document.getElementById('notesInput').value
        };

        const professional = this.currentBooking.professional;
        document.getElementById('paymentService').textContent = professional.service;
        document.getElementById('paymentProfessional').textContent = professional.name;
        document.getElementById('paymentTime').textContent =
            timeSlot === 'now' ? 'Il prima possibile' : `Alle ${timeSlot}`;
        document.getElementById('paymentDuration').textContent =
            `${professional.duration || 60} minuti`;
        document.getElementById('paymentTotal').textContent = `€${professional.price}`;

        this.showBookingStep(2);
    }

    goBackToDetails() {
        this.showBookingStep(1);
    }

    confirmPayment() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        this.currentBooking.payment = {
            method: paymentMethod,
            amount: this.currentBooking.professional.price,
            timestamp: new Date()
        };

        document.getElementById('confirmedProfessional').textContent =
            this.currentBooking.professional.name;

        this.startConfirmationTimer();
        this.showBookingStep(3);
    }

    startConfirmationTimer() {
        let timeLeft = 10 * 60;
        const timerDisplay = document.getElementById('confirmationTimer');

        this.confirmationTimer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            timerDisplay.textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(this.confirmationTimer);
                this.handleBookingTimeout();
            }

            timeLeft--;
        }, 1000);
    }

    handleBookingTimeout() {
        alert('Il professionista non ha risposto entro 10 minuti. La prenotazione è stata cancellata e l\'importo verrà rimborsato.');
        this.closeBookingModal();
    }

    loadMore() {
        const loadMoreInfo = document.querySelector('.load-more-info');
        const currentCount = parseInt(loadMoreInfo.textContent.match(/\d+/)[0]);
        const totalCount = parseInt(loadMoreInfo.textContent.match(/\d+ di (\d+)/)?.[1]) || 23;

        if (currentCount >= totalCount) {
            loadMoreInfo.textContent = 'Tutti i professionisti sono stati caricati';
            document.querySelector('.btn-load-more').style.display = 'none';
            return;
        }

        const newCount = Math.min(currentCount + 6, totalCount);
        loadMoreInfo.textContent = `Mostrando ${newCount} di ${totalCount} professionisti disponibili`;

        console.log(`Caricati ${newCount - currentCount} nuovi professionisti`);
    }

    useCurrentLocation() {
        if (this.userLocation) {
            document.getElementById('addressInput').value = 'Posizione corrente rilevata';
        } else {
            this.initGeolocation();
        }
    }
}

// Inizializza il manager
let lastMinuteManager;

document.addEventListener('DOMContentLoaded', function () {
    lastMinuteManager = new LastMinuteManager();
});

/* ===============================================
   FUNZIONI GLOBALI PER HTML
   =============================================== */

function clearFilters() {
    if (lastMinuteManager) {
        lastMinuteManager.clearFilters();
    }
}

function applyFilters() {
    if (lastMinuteManager) {
        lastMinuteManager.applyFilters();
    }
}

function viewProfile(professionalId) {
    if (lastMinuteManager) {
        lastMinuteManager.viewProfessional(professionalId);
    }
}

function bookNow(professionalId) {
    if (lastMinuteManager) {
        lastMinuteManager.bookNow(professionalId);
    }
}

function closeBookingModal() {
    if (lastMinuteManager) {
        lastMinuteManager.closeBookingModal();
    }
}

function goToPayment() {
    if (lastMinuteManager) {
        lastMinuteManager.goToPayment();
    }
}

function goBackToDetails() {
    if (lastMinuteManager) {
        lastMinuteManager.goBackToDetails();
    }
}

function confirmPayment() {
    if (lastMinuteManager) {
        lastMinuteManager.confirmPayment();
    }
}

function useCurrentLocation() {
    if (lastMinuteManager) {
        lastMinuteManager.useCurrentLocation();
    }
}

function loadMore() {
    if (lastMinuteManager) {
        lastMinuteManager.loadMore();
    }
}

console.log('Last Minute JavaScript con filtri funzionanti caricato correttamente');