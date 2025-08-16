// ===== PRENOTA - JS COMPLETO NUOVO FLUSSO =====
// Servizio -> Data/Ora -> Zona/Modalità -> Professionisti -> Pagamento

document.addEventListener('DOMContentLoaded', function () {
    console.log('Prenota - Nuovo flusso caricato');

    // STATO GLOBALE PRENOTAZIONE
    const bookingState = {
        currentStep: 1,
        selectedCategory: null,
        selectedService: null,
        selectedDate: null,
        selectedTime: null,
        location: '',
        radius: 10,
        serviceMode: 'domicilio',
        specificAddress: '',
        selectedProfessional: null,
        paymentMethod: 'card',
        totalPrice: 0
    };

    // DATI SERVIZI PER CATEGORIA
    const servicesByCategory = {
        massaggi: [
            { id: 'swedish', name: 'Massaggio Svedese', price: 65, duration: 60, description: 'Rilassante completo con tecniche nordiche' },
            { id: 'hot-stone', name: 'Hot Stone Massage', price: 80, duration: 75, description: 'Trattamento con pietre calde laviche' },
            { id: 'deep-tissue', name: 'Deep Tissue', price: 70, duration: 60, description: 'Massaggio profondo per tensioni muscolari' },
            { id: 'aromatherapy', name: 'Aromaterapia', price: 60, duration: 50, description: 'Con oli essenziali personalizzati' }
        ],
        fitness: [
            { id: 'personal-training', name: 'Personal Training', price: 50, duration: 60, description: 'Allenamento personalizzato one-to-one' },
            { id: 'pilates', name: 'Pilates Privato', price: 55, duration: 60, description: 'Sessioni individuali di pilates' },
            { id: 'yoga-private', name: 'Yoga Privato', price: 45, duration: 75, description: 'Lezioni di yoga personalizzate' }
        ],
        beauty: [
            { id: 'makeup-event', name: 'Make-up Eventi', price: 80, duration: 90, description: 'Trucco professionale per eventi' },
            { id: 'hair-styling', name: 'Hair Styling', price: 60, duration: 120, description: 'Acconciature per ogni occasione' },
            { id: 'manicure', name: 'Manicure a Domicilio', price: 35, duration: 45, description: 'Cura completa delle unghie' }
        ],
        fisioterapia: [
            { id: 'physiotherapy', name: 'Fisioterapia', price: 70, duration: 60, description: 'Trattamenti riabilitativi' },
            { id: 'osteopathy', name: 'Osteopatia', price: 75, duration: 60, description: 'Terapie manuali osteopatiche' },
            { id: 'tecar', name: 'Tecar Terapia', price: 85, duration: 45, description: 'Terapia con onde elettromagnetiche' }
        ],
        chef: [
            { id: 'private-dinner', name: 'Cena Privata', price: 120, duration: 240, description: 'Chef privato per cene speciali' },
            { id: 'cooking-class', name: 'Corso di Cucina', price: 90, duration: 180, description: 'Impara a cucinare con lo chef' },
            { id: 'meal-prep', name: 'Meal Prep', price: 80, duration: 120, description: 'Preparazione pasti settimanale' }
        ],
        yoga: [
            { id: 'hatha-yoga', name: 'Hatha Yoga', price: 40, duration: 75, description: 'Yoga tradizionale e rilassante' },
            { id: 'vinyasa', name: 'Vinyasa Flow', price: 45, duration: 60, description: 'Yoga dinamico e fluido' },
            { id: 'meditation', name: 'Meditazione', price: 35, duration: 45, description: 'Sessioni di meditazione guidata' }
        ]
    };

    // INIZIALIZZAZIONE
    initializePage();
    initializeStepNavigation();
    initializeStep1();
    initializeStep2();
    initializeStep3();
    initializeStep4();
    initializeStep5();

    // ===== INIZIALIZZAZIONE =====
    function initializePage() {
        const today = new Date();
        bookingState.minDate = today;
        bookingState.viewDate = new Date(today);

        // Controlla parametri URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('service')) {
            preSelectService(urlParams.get('service'));
        }
    }

    // ===== STEP NAVIGATION =====
    function initializeStepNavigation() {
        const continueStep2 = document.getElementById('continueStep2');
        const continueStep3 = document.getElementById('continueStep3');
        const continueStep4 = document.getElementById('continueStep4');

        const backStep1 = document.getElementById('backStep1');
        const backStep2 = document.getElementById('backStep2');
        const backStep3 = document.getElementById('backStep3');
        const backStep4 = document.getElementById('backStep4');

        if (continueStep2) continueStep2.addEventListener('click', function () { goToStep(2); });
        if (continueStep3) continueStep3.addEventListener('click', function () { goToStep(3); });
        if (continueStep4) continueStep4.addEventListener('click', function () { searchProfessionals(); });

        if (backStep1) backStep1.addEventListener('click', function () { goToStep(1); });
        if (backStep2) backStep2.addEventListener('click', function () { goToStep(2); });
        if (backStep3) backStep3.addEventListener('click', function () { goToStep(3); });
        if (backStep4) backStep4.addEventListener('click', function () { goToStep(4); });
    }

    function goToStep(stepNumber) {
        // Nascondi step corrente
        const currentStep = document.querySelector('.step-content.active');
        const currentStepIndicator = document.querySelector('.step.active');

        if (currentStep) currentStep.classList.remove('active');
        if (currentStepIndicator) currentStepIndicator.classList.remove('active');

        // Mostra nuovo step
        const newStep = document.getElementById('step' + stepNumber);
        const newStepIndicator = document.querySelector('[data-step="' + stepNumber + '"]');

        if (newStep) newStep.classList.add('active');
        if (newStepIndicator) newStepIndicator.classList.add('active');

        bookingState.currentStep = stepNumber;

        // Azioni specifiche per step
        if (stepNumber === 2) generateCalendar();
        if (stepNumber === 5) updateBookingSummary();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===== STEP 1: SELEZIONE SERVIZIO =====
    function initializeStep1() {
        // Click su categorie
        const categoryCards = document.querySelectorAll('.service-card');
        categoryCards.forEach(function (card) {
            card.addEventListener('click', function () {
                const category = this.getAttribute('data-category');
                if (category) selectCategory(category);
            });
        });
    }

    function selectCategory(categoryId) {
        // Rimuovi selezione precedente
        const categoryCards = document.querySelectorAll('.service-card');
        categoryCards.forEach(function (card) {
            card.classList.remove('selected');
        });

        // Seleziona categoria
        const categoryCard = document.querySelector('[data-category="' + categoryId + '"]');
        if (categoryCard) categoryCard.classList.add('selected');

        bookingState.selectedCategory = categoryId;

        // Mostra tipi di servizio
        showServiceTypes(categoryId);

        console.log('Categoria selezionata:', categoryId);
    }

    function showServiceTypes(categoryId) {
        const serviceTypes = document.getElementById('serviceTypes');
        const serviceCards = document.getElementById('serviceCards');
        const title = document.getElementById('serviceTypesTitle');

        if (!serviceTypes || !serviceCards || !title) return;

        // Aggiorna titolo
        const categoryNames = {
            massaggi: 'Scegli il tipo di massaggio',
            fitness: 'Scegli il tipo di allenamento',
            beauty: 'Scegli il servizio beauty',
            fisioterapia: 'Scegli il tipo di terapia',
            chef: 'Scegli il servizio culinario',
            yoga: 'Scegli il tipo di pratica'
        };
        title.textContent = categoryNames[categoryId] || 'Scegli il servizio';

        // Genera card servizi IDENTICHE al sito
        const services = servicesByCategory[categoryId] || [];
        let cardsHTML = '';

        for (let i = 0; i < services.length; i++) {
            const service = services[i];
            cardsHTML += '<div class="service-card" data-service-id="' + service.id + '">';
            cardsHTML += '<div class="service-image" style="background-image: url(\'/assets/images/Servizi/' + getServiceImage(service.id) + '\');"></div>';
            cardsHTML += '<p class="service-title">' + service.name + '</p>';
            cardsHTML += '<div class="service-price">€' + service.price + '</div>';
            cardsHTML += '<div class="service-duration">' + service.duration + ' min</div>';
            cardsHTML += '</div>';
        }

        serviceCards.innerHTML = cardsHTML;

        // Event listeners per servizi
        const serviceCardElements = document.querySelectorAll('#serviceCards .service-card');
        serviceCardElements.forEach(function (card) {
            card.addEventListener('click', function () {
                const serviceId = this.getAttribute('data-service-id');
                if (serviceId) selectService(serviceId);
            });
        });

        // Mostra sezione
        serviceTypes.style.display = 'block';

        // Reset selezione servizio
        bookingState.selectedService = null;
        const continueBtn = document.getElementById('continueStep2');
        if (continueBtn) continueBtn.disabled = true;
    }

    function getServiceImage(serviceId) {
        const images = {
            'swedish': 'massage2.jpg',
            'hot-stone': 'massage2.jpg',
            'deep-tissue': 'massage2.jpg',
            'aromatherapy': 'massage2.jpg',
            'personal-training': 'Gym.jpg',
            'pilates': 'Gym.jpg',
            'yoga-private': 'YogaEndMeditazione.jpeg',
            'makeup-event': 'Hair and make-up.png',
            'hair-styling': 'Hair and make-up.png',
            'manicure': 'Beauty.jpg',
            'physiotherapy': 'Fiosioterapia.Osteopatia.png',
            'osteopathy': 'Fiosioterapia.Osteopatia.png',
            'tecar': 'Fiosioterapia.Osteopatia.png',
            'private-dinner': 'chef-cucina.png',
            'cooking-class': 'chef-cucina.png',
            'meal-prep': 'chef-cucina.png',
            'hatha-yoga': 'YogaEndMeditazione.jpeg',
            'vinyasa': 'YogaEndMeditazione.jpeg',
            'meditation': 'YogaEndMeditazione.jpeg'
        };
        return images[serviceId] || 'default.jpg';
    }

    function selectService(serviceId) {
        // Rimuovi selezione precedente
        const serviceCards = document.querySelectorAll('#serviceCards .service-card');
        serviceCards.forEach(function (card) {
            card.classList.remove('selected');
        });

        // Seleziona servizio
        const serviceCard = document.querySelector('[data-service-id="' + serviceId + '"]');
        if (serviceCard) serviceCard.classList.add('selected');

        // Trova servizio nei dati
        const services = servicesByCategory[bookingState.selectedCategory];
        let service = null;

        if (services) {
            for (let i = 0; i < services.length; i++) {
                if (services[i].id === serviceId) {
                    service = services[i];
                    break;
                }
            }
        }

        if (service) {
            bookingState.selectedService = service;
            bookingState.totalPrice = service.price;

            // Abilita bottone continua
            const continueBtn = document.getElementById('continueStep2');
            if (continueBtn) continueBtn.disabled = false;

            console.log('Servizio selezionato:', service);
        }
    }

    // ===== STEP 2: DATA E ORA =====
    function initializeStep2() {
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');

        if (prevMonth) prevMonth.addEventListener('click', function () { navigateMonth(-1); });
        if (nextMonth) nextMonth.addEventListener('click', function () { navigateMonth(1); });
    }

    function generateCalendar() {
        const year = bookingState.viewDate.getFullYear();
        const month = bookingState.viewDate.getMonth();

        // Aggiorna header mese
        const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
        const currentMonthElement = document.getElementById('currentMonth');
        if (currentMonthElement) {
            currentMonthElement.textContent = monthNames[month] + ' ' + year;
        }

        // Genera griglia calendario
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay() + 1);

        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        let calendarHTML = '';

        // Headers giorni settimana
        const dayHeaders = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
        for (let i = 0; i < dayHeaders.length; i++) {
            calendarHTML += '<div class="calendar-day header">' + dayHeaders[i] + '</div>';
        }

        // Giorni del mese
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const isCurrentMonth = currentDate.getMonth() === month;
            const isPast = currentDate < new Date().setHours(0, 0, 0, 0);
            const isSelected = bookingState.selectedDate &&
                currentDate.toDateString() === bookingState.selectedDate.toDateString();

            let dayClass = 'calendar-day';
            if (!isCurrentMonth) {
                dayClass += ' disabled';
            } else if (isPast) {
                dayClass += ' disabled';
            } else {
                const availability = getDateAvailability(currentDate);
                if (availability === 'available') {
                    dayClass += ' available';
                } else if (availability === 'few-slots') {
                    dayClass += ' few-slots available';
                } else {
                    dayClass += ' disabled';
                }
            }

            if (isSelected) dayClass += ' selected';

            const dateString = currentDate.toISOString().split('T')[0];
            calendarHTML += '<div class="' + dayClass + '" data-date="' + dateString + '">' + currentDate.getDate() + '</div>';
        }

        calendarGrid.innerHTML = calendarHTML;

        // Event listeners per giorni disponibili
        const availableDays = document.querySelectorAll('.calendar-day.available');
        availableDays.forEach(function (day) {
            day.addEventListener('click', function () {
                const dateString = this.getAttribute('data-date');
                if (dateString) selectDate(dateString);
            });
        });
    }

    function getDateAvailability(date) {
        // Simula disponibilità basata su giorno settimana
        const dayOfWeek = date.getDay();
        const random = Math.random();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return random > 0.7 ? 'few-slots' : 'available';
        }

        if (random > 0.9) return 'busy';
        if (random > 0.7) return 'few-slots';
        return 'available';
    }

    function navigateMonth(direction) {
        bookingState.viewDate.setMonth(bookingState.viewDate.getMonth() + direction);
        generateCalendar();
    }

    function selectDate(dateString) {
        const selectedDate = new Date(dateString + 'T00:00:00');
        bookingState.selectedDate = selectedDate;

        // Aggiorna UI
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(function (day) {
            day.classList.remove('selected');
        });

        const selectedDay = document.querySelector('[data-date="' + dateString + '"]');
        if (selectedDay) selectedDay.classList.add('selected');

        // Aggiorna info data e carica orari
        const dateInfo = document.getElementById('selectedDateInfo');
        if (dateInfo) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateInfo.textContent = selectedDate.toLocaleDateString('it-IT', options);
        }

        loadTimeSlots(selectedDate);

        console.log('Data selezionata:', selectedDate);
    }

    function loadTimeSlots(date) {
        const timeGrid = document.getElementById('timeGrid');
        if (!timeGrid) return;

        // Mock time slots
        const allSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
            '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];

        const availableSlots = [];
        for (let i = 0; i < allSlots.length; i++) {
            if (Math.random() > 0.3) {
                availableSlots.push(allSlots[i]);
            }
        }

        let slotsHTML = '';
        for (let i = 0; i < allSlots.length; i++) {
            const slot = allSlots[i];
            const isAvailable = availableSlots.indexOf(slot) !== -1;
            const slotClass = isAvailable ? 'time-slot available' : 'time-slot busy';
            slotsHTML += '<div class="' + slotClass + '" data-time="' + slot + '">' + slot + '</div>';
        }

        timeGrid.innerHTML = slotsHTML;

        // Event listeners per slot disponibili
        const availableSlotElements = document.querySelectorAll('.time-slot.available');
        availableSlotElements.forEach(function (slot) {
            slot.addEventListener('click', function () {
                const time = this.getAttribute('data-time');
                if (time) selectTimeSlot(time);
            });
        });
    }

    function selectTimeSlot(time) {
        bookingState.selectedTime = time;

        // Aggiorna UI
        const timeSlots = document.querySelectorAll('.time-slot');
        timeSlots.forEach(function (slot) {
            slot.classList.remove('selected');
        });

        const selectedSlot = document.querySelector('[data-time="' + time + '"]');
        if (selectedSlot) selectedSlot.classList.add('selected');

        // Abilita continua
        const continueBtn = document.getElementById('continueStep3');
        if (continueBtn) continueBtn.disabled = false;

        console.log('Orario selezionato:', time);
    }

    // ===== STEP 3: ZONA E MODALITÀ =====
    function initializeStep3() {
        // Input località 
        const locationInput = document.getElementById('locationInput');
        if (locationInput) {
            locationInput.addEventListener('input', function () {
                bookingState.location = this.value;
            });
        }

        // Bottone rileva posizione
        const detectBtn = document.getElementById('detectLocation');
        if (detectBtn) {
            detectBtn.addEventListener('click', detectLocation);
        }

        // Slider raggio
        const radiusSlider = document.getElementById('radiusRange');
        const radiusValue = document.getElementById('radiusValue');

        if (radiusSlider && radiusValue) {
            radiusSlider.addEventListener('input', function () {
                bookingState.radius = parseInt(this.value);
                radiusValue.textContent = this.value;
            });
        }

        // Modalità servizio
        const serviceModeRadios = document.querySelectorAll('input[name="serviceMode"]');
        serviceModeRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                bookingState.serviceMode = this.value;
                toggleAddressSection();
            });
        });

        // Indirizzo specifico
        const specificAddressInput = document.getElementById('specificAddress');
        if (specificAddressInput) {
            specificAddressInput.addEventListener('input', function () {
                bookingState.specificAddress = this.value;
            });
        }

        // Inizializza sezione indirizzo
        toggleAddressSection();
    }

    function detectLocation() {
        if (!navigator.geolocation) {
            showToast('Geolocalizzazione non supportata', 'error');
            return;
        }

        const btn = document.getElementById('detectLocation');
        if (!btn) return;

        btn.textContent = 'Rilevamento...';
        btn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            function (position) {
                try {
                    // Mock reverse geocoding
                    const mockAddress = 'Cagliari, CA';
                    const locationInput = document.getElementById('locationInput');
                    if (locationInput) {
                        locationInput.value = mockAddress;
                        bookingState.location = mockAddress;
                    }

                    showToast('Posizione rilevata!', 'success');
                } catch (error) {
                    showToast('Errore nel rilevamento', 'error');
                }

                btn.textContent = 'Rileva posizione';
                btn.disabled = false;
            },
            function (error) {
                showToast('Impossibile rilevare la posizione', 'error');
                btn.textContent = 'Rileva posizione';
                btn.disabled = false;
            }
        );
    }

    function toggleAddressSection() {
        const addressSection = document.getElementById('addressSection');
        if (!addressSection) return;

        if (bookingState.serviceMode === 'domicilio') {
            addressSection.style.display = 'block';
        } else {
            addressSection.style.display = 'none';
        }
    }

    // ===== STEP 4: RICERCA PROFESSIONISTI =====
    function initializeStep4() {
        // Ordinamento
        const sortSelect = document.getElementById('sortProfessionals');
        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                sortProfessionals(this.value);
            });
        }

        // Checkbox solo disponibili
        const onlyAvailableCheck = document.getElementById('onlyAvailable');
        if (onlyAvailableCheck) {
            onlyAvailableCheck.addEventListener('change', function () {
                filterProfessionals();
            });
        }
    }

    function searchProfessionals() {
        if (!bookingState.location) {
            showToast('Inserisci la località', 'error');
            return;
        }

        // Vai allo step 4
        goToStep(4);

        // Mostra loading
        showLoadingProfessionals();

        // Simula ricerca con delay
        setTimeout(function () {
            const professionals = generateMockProfessionals();
            displayProfessionals(professionals);
            updateAvailabilityInfo(professionals);
        }, 1500);
    }

    function showLoadingProfessionals() {
        const grid = document.getElementById('professionalsGrid');
        if (grid) {
            grid.innerHTML = '<div class="loading-overlay"><div class="loading-spinner"></div></div>';
        }
    }

    function generateMockProfessionals() {
        const names = ['Giulia Rossi', 'Marco Bianchi', 'Laura Verdi', 'Andrea Costa', 'Sofia Moretti'];
        const specializations = {
            massaggi: ['Massaggiatrice Certificata', 'Terapista Olistico', 'Specialista Thai'],
            fitness: ['Personal Trainer', 'Istruttore Yoga', 'Coach Fitness'],
            beauty: ['Make-up Artist', 'Hair Stylist', 'Estetista'],
            fisioterapia: ['Fisioterapista', 'Osteopata', 'Terapista'],
            chef: ['Chef Privato', 'Cuoco Specializzato', 'Chef Stellato'],
            yoga: ['Istruttore Yoga', 'Maestro Meditazione', 'Yoga Teacher']
        };

        if (!bookingState.selectedService) {
            return [];
        }

        const professionals = [];
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const categorySpecs = specializations[bookingState.selectedCategory] || ['Professionista Certificato'];
            const specialization = categorySpecs[i % categorySpecs.length];

            professionals.push({
                id: 'prof_' + i,
                name: name,
                specialization: specialization,
                rating: (4.2 + Math.random() * 0.7).toFixed(1),
                reviews: Math.floor(50 + Math.random() * 200),
                avatar: '/assets/images/Professionisti/pr' + (i + 1) + '.png',
                price: bookingState.selectedService.price + Math.floor(-10 + Math.random() * 20),
                distance: (Math.random() * bookingState.radius).toFixed(1),
                available: Math.random() > 0.2,
                premium: Math.random() > 0.7,
                lastMinute: Math.random() > 0.8,
                specializations: generateRandomSpecializations(bookingState.selectedCategory)
            });
        }

        return professionals;
    }

    function generateRandomSpecializations(category) {
        const specs = {
            massaggi: ['Rilassante', 'Decontratturante', 'Hot Stone', 'Aromaterapia', 'Deep Tissue'],
            fitness: ['Tonificazione', 'Dimagrimento', 'Forza', 'Cardio', 'Stretching'],
            beauty: ['Make-up', 'Acconciature', 'Manicure', 'Extension', 'Colorimetria'],
            fisioterapia: ['Cervicale', 'Lombare', 'Riabilitazione', 'Posturale', 'Sportiva'],
            chef: ['Italiana', 'Mediterranea', 'Vegana', 'Gluten-free', 'Gourmet'],
            yoga: ['Hatha', 'Vinyasa', 'Ashtanga', 'Yin', 'Meditazione']
        };

        const categorySpecs = specs[category] || ['Generico'];
        const count = Math.floor(2 + Math.random() * 3);
        const selected = [];

        for (let i = 0; i < count && i < categorySpecs.length; i++) {
            const randomIndex = Math.floor(Math.random() * categorySpecs.length);
            const spec = categorySpecs[randomIndex];
            if (selected.indexOf(spec) === -1) {
                selected.push(spec);
            }
        }

        return selected;
    }

    function displayProfessionals(professionals) {
        const grid = document.getElementById('professionalsGrid');
        if (!grid) return;

        if (professionals.length === 0) {
            grid.innerHTML = '<div class="no-professionals"><h3>Nessun professionista trovato</h3><p>Prova ad ampliare il raggio di ricerca o cambiare i filtri</p><button class="btn-secondary" onclick="goToStep(3)">Modifica Ricerca</button></div>';
            return;
        }

        let professionalsHTML = '';

        for (let i = 0; i < professionals.length; i++) {
            const prof = professionals[i];
            const premiumBadge = prof.premium ? '<div class="premium-badge">PREMIUM</div>' : '';

            let specializationsHTML = '';
            for (let j = 0; j < prof.specializations.length; j++) {
                specializationsHTML += '<span class="specialization-tag">' + prof.specializations[j] + '</span>';
            }

            const availabilityHTML = prof.available ?
                '<span class="available">Disponibile</span>' :
                '<span class="busy">Occupato</span>';
            const lastMinuteHTML = prof.lastMinute ? '<span class="last-minute">Last Minute</span>' : '';
            const buttonText = prof.available ? 'Prenota' : 'Non Disponibile';
            const buttonDisabled = prof.available ? '' : 'disabled';
            const buttonClass = prof.available ? 'btn-select' : 'btn-select';

            professionalsHTML += '<div class="professional-card' + (prof.premium ? ' premium' : '') + '" data-prof-id="' + prof.id + '">';
            professionalsHTML += premiumBadge;
            professionalsHTML += '<button class="favorite-btn" data-prof-id="' + prof.id + '">♡</button>';

            professionalsHTML += '<div class="professional-header">';
            professionalsHTML += '<div class="professional-image">';
            professionalsHTML += '<img src="' + prof.avatar + '" alt="' + prof.name + '" onerror="this.style.display=\'none\'">';
            professionalsHTML += '</div>';
            professionalsHTML += '<div class="professional-header-info">';
            professionalsHTML += '<h3>' + prof.name + '</h3>';
            professionalsHTML += '<p>' + prof.specialization + '</p>';
            professionalsHTML += '<div class="professional-rating">';
            professionalsHTML += '<span class="rating-stars">★★★★★</span>';
            professionalsHTML += '<span class="rating-value">' + prof.rating + '</span>';
            professionalsHTML += '<span class="rating-count">(' + prof.reviews + ')</span>';
            professionalsHTML += '</div></div></div>';

            professionalsHTML += '<div class="professional-info">';
            professionalsHTML += '<div class="specializations">' + specializationsHTML + '</div>';
            professionalsHTML += '<div class="service-details">';
            professionalsHTML += '<span class="price-highlight">€' + prof.price + ' - ' + bookingState.selectedService.duration + ' min</span>';
            professionalsHTML += '<span>' + prof.distance + ' km da te</span>';
            professionalsHTML += '<span>' + (bookingState.serviceMode === 'domicilio' ? 'Servizio a domicilio' : 'Presso studio') + '</span>';
            professionalsHTML += '</div>';
            professionalsHTML += '<div class="availability">' + availabilityHTML + lastMinuteHTML + '</div>';
            professionalsHTML += '<div class="professional-actions">';
            professionalsHTML += '<button class="btn-profile" onclick="viewProfessionalProfile(\'' + prof.id + '\')">Vedi Profilo</button>';
            professionalsHTML += '<button class="' + buttonClass + '" onclick="selectProfessionalAndBook(\'' + prof.id + '\')" ' + buttonDisabled + '>' + buttonText + '</button>';
            professionalsHTML += '</div></div></div>';
        }

        grid.innerHTML = professionalsHTML;

        // Event listeners per preferiti
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const profId = this.getAttribute('data-prof-id');
                if (profId) toggleFavorite(profId, this);
            });
        });

        console.log(professionals.length + ' professionisti caricati');
    }

    function updateAvailabilityInfo(professionals) {
        let availableCount = 0;
        for (let i = 0; i < professionals.length; i++) {
            if (professionals[i].available) availableCount++;
        }

        const info = document.getElementById('availabilityInfo');
        if (!info) return;

        if (bookingState.selectedDate && bookingState.selectedTime) {
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            const dateStr = bookingState.selectedDate.toLocaleDateString('it-IT', options);
            info.textContent = availableCount + ' professionisti disponibili ' + dateStr + ' alle ' + bookingState.selectedTime;
        } else {
            info.textContent = availableCount + ' professionisti disponibili';
        }
    }

    function sortProfessionals(sortBy) {
        const cards = document.querySelectorAll('.professional-card');
        const grid = document.getElementById('professionalsGrid');
        if (!grid) return;

        const cardArray = Array.from(cards);

        cardArray.sort(function (a, b) {
            const profA = getProfessionalData(a.getAttribute('data-prof-id'));
            const profB = getProfessionalData(b.getAttribute('data-prof-id'));

            if (!profA || !profB) return 0;

            switch (sortBy) {
                case 'rating':
                    return profB.rating - profA.rating;
                case 'price-asc':
                    return profA.price - profB.price;
                case 'price-desc':
                    return profB.price - profA.price;
                case 'distance':
                default:
                    return profA.distance - profB.distance;
            }
        });

        // Re-append ordinati
        for (let i = 0; i < cardArray.length; i++) {
            grid.appendChild(cardArray[i]);
        }
    }

    function filterProfessionals() {
        const onlyAvailableCheck = document.getElementById('onlyAvailable');
        if (!onlyAvailableCheck) return;

        const onlyAvailable = onlyAvailableCheck.checked;
        const cards = document.querySelectorAll('.professional-card');

        cards.forEach(function (card) {
            const profId = card.getAttribute('data-prof-id');
            if (!profId) return;

            const prof = getProfessionalData(profId);
            if (!prof) return;

            if (onlyAvailable && !prof.available) {
                card.style.display = 'none';
            } else {
                card.style.display = 'flex';
            }
        });
    }

    function getProfessionalData(profId) {
        if (!profId) return null;

        const card = document.querySelector('[data-prof-id="' + profId + '"]');
        if (!card) return null;

        const ratingElement = card.querySelector('.rating-value');
        const priceElement = card.querySelector('.price-highlight');
        const distanceElement = card.querySelector('.service-details span:nth-child(2)');
        const selectButton = card.querySelector('.btn-select');

        const rating = ratingElement ? parseFloat(ratingElement.textContent) : 0;
        const priceMatch = priceElement ? priceElement.textContent.match(/\d+/) : null;
        const price = priceMatch ? parseInt(priceMatch[0]) : 0;
        const distanceMatch = distanceElement ? distanceElement.textContent.match(/[\d.]+/) : null;
        const distance = distanceMatch ? parseFloat(distanceMatch[0]) : 0;
        const available = selectButton ? !selectButton.disabled : false;

        return {
            id: profId,
            rating: rating,
            price: price,
            distance: distance,
            available: available
        };
    }

    // FUNZIONE MODIFICATA - CLICK PRENOTA VA DIRETTO AL PAGAMENTO
    window.selectProfessionalAndBook = function (profId) {
        try {
            if (!profId) return;

            // Seleziona automaticamente il professionista
            const card = document.querySelector('[data-prof-id="' + profId + '"]');
            if (!card) return;

            const nameElement = card.querySelector('h3');
            const priceElement = card.querySelector('.price-highlight');
            const specializationElement = card.querySelector('p');

            const profData = {
                id: profId,
                name: nameElement ? nameElement.textContent : 'Professionista',
                price: priceElement ? parseInt(priceElement.textContent.match(/\d+/)[0]) : 0,
                specialization: specializationElement ? specializationElement.textContent : ''
            };

            bookingState.selectedProfessional = profData;
            bookingState.totalPrice = profData.price;

            // SALTA DIRETTAMENTE AL PAGAMENTO (STEP 5)
            goToStep(5);
            updateBookingSummary();

            console.log('Professionista selezionato, vai al pagamento:', profData);
        } catch (error) {
            console.error('Errore selezione professionista:', error);
            showToast('Errore nella selezione', 'error');
        }
    };

    window.viewProfessionalProfile = function (profId) {
        if (profId) {
            window.open('/pages/professionista/' + profId + '.html', '_blank');
        }
    };

    function toggleFavorite(profId, btn) {
        if (!profId || !btn) return;

        try {
            btn.classList.toggle('active');
            btn.textContent = btn.classList.contains('active') ? '♥' : '♡';

            // Salva nei preferiti (localStorage)
            let favorites = [];
            try {
                const stored = localStorage.getItem('relaxpoint_favorites');
                favorites = stored ? JSON.parse(stored) : [];
            } catch (e) {
                favorites = [];
            }

            if (btn.classList.contains('active')) {
                if (favorites.indexOf(profId) === -1) {
                    favorites.push(profId);
                }
            } else {
                const index = favorites.indexOf(profId);
                if (index > -1) favorites.splice(index, 1);
            }

            localStorage.setItem('relaxpoint_favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Errore toggle preferiti:', error);
        }
    }

    // ===== STEP 5: PAGAMENTO =====
    function initializeStep5() {
        // Metodi pagamento
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(function (radio) {
            radio.addEventListener('change', function () {
                bookingState.paymentMethod = this.value;
                togglePaymentForm();
            });
        });

        // Formattazione carta
        initializeCardFormatting();

        // Conferma prenotazione
        const confirmBtn = document.getElementById('confirmBooking');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', confirmBooking);
        }
    }

    function updateBookingSummary() {
        const service = bookingState.selectedService;
        const prof = bookingState.selectedProfessional;
        const date = bookingState.selectedDate;
        const time = bookingState.selectedTime;

        const summaryService = document.getElementById('summaryService');
        const summaryProfessional = document.getElementById('summaryProfessional');
        const summaryDateTime = document.getElementById('summaryDateTime');
        const summaryMode = document.getElementById('summaryMode');
        const summaryDuration = document.getElementById('summaryDuration');
        const summaryTotal = document.getElementById('summaryTotal');

        if (summaryService) summaryService.textContent = service ? service.name : '-';
        if (summaryProfessional) summaryProfessional.textContent = prof ? prof.name : '-';

        if (summaryDateTime && date && time) {
            const dateStr = date.toLocaleDateString('it-IT');
            summaryDateTime.textContent = dateStr + ' alle ' + time;
        }

        if (summaryMode) {
            const modeLabels = {
                'domicilio': 'A domicilio',
                'studio': 'Presso studio',
                'online': 'Online'
            };
            summaryMode.textContent = modeLabels[bookingState.serviceMode] || '-';
        }

        if (summaryDuration) summaryDuration.textContent = service ? service.duration + ' minuti' : '-';
        if (summaryTotal) summaryTotal.textContent = '€' + bookingState.totalPrice + ',00';
    }

    function togglePaymentForm() {
        const cardForm = document.getElementById('cardForm');
        if (!cardForm) return;

        if (bookingState.paymentMethod === 'card') {
            cardForm.style.display = 'flex';
        } else {
            cardForm.style.display = 'none';
        }
    }

    function initializeCardFormatting() {
        // Numero carta
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = '';

                for (let i = 0; i < value.length; i += 4) {
                    if (i > 0) formattedValue += ' ';
                    formattedValue += value.substr(i, 4);
                }

                if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
                this.value = formattedValue;
            });
        }

        // Scadenza
        const cardExpiry = document.getElementById('cardExpiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                this.value = value;
            });
        }

        // CVC
        const cardCvc = document.getElementById('cardCvc');
        if (cardCvc) {
            cardCvc.addEventListener('input', function (e) {
                this.value = this.value.replace(/\D/g, '').substring(0, 4);
            });
        }
    }

    function confirmBooking() {
        if (!validateBookingForm()) return;

        const confirmBtn = document.getElementById('confirmBooking');
        if (!confirmBtn) return;

        const btnText = confirmBtn.querySelector('.btn-text');
        const btnLoading = confirmBtn.querySelector('.btn-loading');

        // Mostra loading
        confirmBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'flex';

        // Simula autorizzazione pagamento
        setTimeout(function () {
            try {
                // Genera codice prenotazione
                const bookingCode = generateBookingCode();

                // Mostra modal conferma
                showBookingConfirmation(bookingCode);

                console.log('Prenotazione confermata:', bookingState);

            } catch (error) {
                console.error('Errore prenotazione:', error);
                showToast('Errore nella prenotazione. Riprova.', 'error');
            }

            // Reset button
            confirmBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }, 2000);
    }

    function validateBookingForm() {
        if (!bookingState.selectedService) {
            showToast('Seleziona un servizio', 'error');
            goToStep(1);
            return false;
        }

        if (!bookingState.selectedDate || !bookingState.selectedTime) {
            showToast('Seleziona data e orario', 'error');
            goToStep(2);
            return false;
        }

        if (!bookingState.location) {
            showToast('Inserisci la località', 'error');
            goToStep(3);
            return false;
        }

        if (!bookingState.selectedProfessional) {
            showToast('Seleziona un professionista', 'error');
            goToStep(4);
            return false;
        }

        // Validazione form pagamento
        if (bookingState.paymentMethod === 'card') {
            const cardNumberEl = document.getElementById('cardNumber');
            const cardExpiryEl = document.getElementById('cardExpiry');
            const cardCvcEl = document.getElementById('cardCvc');
            const cardNameEl = document.getElementById('cardName');

            const cardNumber = cardNumberEl ? cardNumberEl.value : '';
            const cardExpiry = cardExpiryEl ? cardExpiryEl.value : '';
            const cardCvc = cardCvcEl ? cardCvcEl.value : '';
            const cardName = cardNameEl ? cardNameEl.value : '';

            if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
                showToast('Inserisci un numero di carta valido', 'error');
                return false;
            }

            if (!cardExpiry || !cardExpiry.match(/^\d{2}\/\d{2}$/)) {
                showToast('Inserisci una data di scadenza valida (MM/AA)', 'error');
                return false;
            }

            if (!cardCvc || cardCvc.length < 3) {
                showToast('Inserisci un CVC valido', 'error');
                return false;
            }

            if (!cardName.trim()) {
                showToast('Inserisci il nome dell\'intestatario', 'error');
                return false;
            }
        }

        return true;
    }

    function generateBookingCode() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return 'RP-' + year + '-' + random;
    }

    function showBookingConfirmation(bookingCode) {
        const modal = document.getElementById('confirmationModal');
        const codeElement = document.getElementById('bookingCode');

        if (codeElement) codeElement.textContent = bookingCode;
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        // Event listeners modal
        const viewBookingsBtn = document.getElementById('viewBookings');
        const closeModalBtn = document.getElementById('closeModal');

        if (viewBookingsBtn) {
            viewBookingsBtn.onclick = function () {
                window.location.href = '/pages/dashboard/prenotazioni.html';
            };
        }

        if (closeModalBtn) {
            closeModalBtn.onclick = closeConfirmationModal;
        }

        // Click fuori per chiudere
        if (modal) {
            modal.onclick = function (e) {
                if (e.target === modal) closeConfirmationModal();
            };
        }
    }

    function closeConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        setTimeout(function () {
            window.location.href = '/index.html';
        }, 1000);
    }

    // ===== UTILITY FUNCTIONS =====
    function showToast(message, type) {
        if (!message) return;

        const toast = document.createElement('div');
        toast.className = 'toast toast-' + (type || 'info');

        toast.innerHTML = '<div class="toast-content"><span class="toast-message">' + message + '</span></div>';

        document.body.appendChild(toast);

        setTimeout(function () {
            toast.classList.add('show');
        }, 100);

        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    function preSelectService(serviceParam) {
        // Pre-selezione da URL params (per future implementazioni)
        console.log('Pre-selezione servizio da URL:', serviceParam);
    }

    // Debug utilities
    window.bookingDebug = {
        state: bookingState,
        goToStep: goToStep,
        selectCategory: selectCategory,
        selectService: selectService,
        selectDate: selectDate,
        selectTimeSlot: selectTimeSlot,
        searchProfessionals: searchProfessionals
    };

    console.log('Prenota JS - Inizializzazione completata');
    console.log('Debug disponibile: window.bookingDebug');

});