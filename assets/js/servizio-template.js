// ===== TEMPLATE SERVIZIO - JS =====
// Gestione dinamica della pagina servizio/trattamento

document.addEventListener('DOMContentLoaded', function () {
    console.log('Template Servizio caricato');

    // STATO SERVIZIO
    const serviceState = {
        professionalId: null,
        serviceId: null,
        treatmentId: null,
        basePrice: 70,
        duration: 60,
        mode: 'studio',
        package: 'single',
        extras: [],
        totalPrice: 70
    };

    // Inizializzazione
    loadServiceData();
    initializePriceCalculator();
    initializeGallery();
    initializeFavorite();
    initializeBooking();

    // ===== CARICA DATI SERVIZIO =====
    function loadServiceData() {
        // Ottieni parametri URL
        const urlParams = new URLSearchParams(window.location.search);
        serviceState.professionalId = urlParams.get('prof');
        serviceState.serviceId = urlParams.get('service');
        serviceState.treatmentId = urlParams.get('treatment');

        // In produzione: carica dati dal backend
        // Per ora usiamo dati mock
        console.log('Caricamento servizio:', serviceState);
    }

    // ===== CALCOLATORE PREZZO =====
    function initializePriceCalculator() {
        // Durata
        const durationSelect = document.getElementById('duration');
        if (durationSelect) {
            durationSelect.addEventListener('change', function () {
                const option = this.options[this.selectedIndex];
                serviceState.duration = parseInt(this.value);
                serviceState.basePrice = parseInt(option.dataset.price);
                calculateTotalPrice();
            });
        }

        // Modalità
        const modeSelect = document.getElementById('serviceMode');
        if (modeSelect) {
            modeSelect.addEventListener('change', function () {
                serviceState.mode = this.value;
                calculateTotalPrice();
            });
        }

        // Pacchetti
        const packageRadios = document.querySelectorAll('input[name="package"]');
        packageRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                serviceState.package = this.value;
                calculateTotalPrice();
            });
        });

        // Extra
        const extraCheckboxes = document.querySelectorAll('input[name="extra"]');
        extraCheckboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    if (serviceState.extras.indexOf(this.value) === -1) {
                        serviceState.extras.push(this.value);
                    }
                } else {
                    const index = serviceState.extras.indexOf(this.value);
                    if (index > -1) {
                        serviceState.extras.splice(index, 1);
                    }
                }
                calculateTotalPrice();
            });
        });
    }

    function calculateTotalPrice() {
        let total = serviceState.basePrice;

        // Aggiungi costo modalità domicilio
        if (serviceState.mode === 'domicilio') {
            total += 10;
        }

        // Aggiungi costo pacchetto
        const packagePrices = {
            'single': 0,
            'relax': 20,
            'complete': 50
        };
        total += packagePrices[serviceState.package] || 0;

        // Aggiungi costo extra
        const extraPrices = {
            'music': 5,
            'candles': 10,
            'oils': 15
        };

        for (let i = 0; i < serviceState.extras.length; i++) {
            total += extraPrices[serviceState.extras[i]] || 0;
        }

        serviceState.totalPrice = total;

        // Aggiorna UI
        const priceElement = document.getElementById('totalPrice');
        if (priceElement) {
            priceElement.textContent = '€' + total;
        }

        console.log('Prezzo totale calcolato:', total);
    }

    // ===== GALLERIA IMMAGINI =====
    function initializeGallery() {
        window.openGallery = function () {
            // In produzione: apre modal con galleria
            console.log('Apertura galleria immagini');
            alert('Galleria immagini (da implementare)');
        };
    }

    // ===== PREFERITI =====
    function initializeFavorite() {
        const favoriteBtn = document.querySelector('.btn-favorite');
        if (!favoriteBtn) return;

        // Controlla se già nei preferiti
        let favorites = [];
        try {
            const stored = localStorage.getItem('relaxpoint_favorites');
            favorites = stored ? JSON.parse(stored) : [];
        } catch (e) {
            favorites = [];
        }

        const serviceKey = serviceState.professionalId + '_' + serviceState.treatmentId;
        let isFavorite = favorites.indexOf(serviceKey) !== -1;

        // Aggiorna UI
        updateFavoriteButton(favoriteBtn, isFavorite);

        // Click handler
        favoriteBtn.addEventListener('click', function () {
            isFavorite = !isFavorite;

            if (isFavorite) {
                if (favorites.indexOf(serviceKey) === -1) {
                    favorites.push(serviceKey);
                }
            } else {
                const index = favorites.indexOf(serviceKey);
                if (index > -1) {
                    favorites.splice(index, 1);
                }
            }

            // Salva
            try {
                localStorage.setItem('relaxpoint_favorites', JSON.stringify(favorites));
            } catch (e) {
                console.error('Errore salvataggio preferiti:', e);
            }

            // Aggiorna UI
            updateFavoriteButton(favoriteBtn, isFavorite);

            // Feedback
            showToast(isFavorite ? 'Aggiunto ai preferiti' : 'Rimosso dai preferiti', 'success');
        });
    }

    function updateFavoriteButton(btn, isFavorite) {
        const heart = btn.querySelector('.heart');
        if (heart) {
            heart.textContent = isFavorite ? '♥' : '♡';
        }

        if (isFavorite) {
            btn.style.background = '#fef2f2';
            btn.style.borderColor = '#ef4444';
            btn.style.color = '#ef4444';
        } else {
            btn.style.background = 'white';
            btn.style.borderColor = '#ddd';
            btn.style.color = 'inherit';
        }
    }

    // ===== PRENOTAZIONE =====
    function initializeBooking() {
        // Bottone prenota principale - VA DIRETTO AL PAGAMENTO
        window.bookService = function () {
            try {
                // Prepara dati per la prenotazione
                const bookingData = {
                    professional: {
                        name: document.getElementById('professionalName').textContent,
                        title: document.getElementById('professionalTitle').textContent,
                        location: document.getElementById('professionalLocation').textContent,
                        rating: 4.9,
                        reviews: 127
                    },
                    service: {
                        name: document.getElementById('treatmentName').textContent,
                        duration: serviceState.duration,
                        mode: serviceState.mode,
                        package: serviceState.package,
                        extras: serviceState.extras,
                        price: serviceState.totalPrice
                    }
                };

                // Salva in sessionStorage per prenota.html
                sessionStorage.setItem('directBooking', JSON.stringify(bookingData));

                // VA DIRETTO AL PAGAMENTO (step 5)
                window.location.href = '/pages/pagamento.html';

                console.log('Reindirizzamento a pagamento con dati:', bookingData);
            } catch (error) {
                console.error('Errore prenotazione:', error);
                alert('Errore durante la prenotazione');
            }
        };

        // ELIMINATO BOTTONE CONTATTA - Solo dopo pagamento
    }

    // ===== CONDIVISIONE =====
    const shareBtn = document.querySelector('.btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', function () {
            if (navigator.share) {
                // Web Share API (mobile)
                navigator.share({
                    title: document.title,
                    text: 'Guarda questo servizio su RelaxPoint',
                    url: window.location.href
                }).then(function () {
                    console.log('Condiviso con successo');
                }).catch(function (error) {
                    console.log('Errore condivisione:', error);
                });
            } else {
                // Fallback: copia link
                copyToClipboard(window.location.href);
                showToast('Link copiato negli appunti', 'success');
            }
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + (type || 'info');
        toast.textContent = message;

        // Stili inline per il toast
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 24px',
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '9999',
            animation: 'slideInUp 0.3s ease-out'
        });

        document.body.appendChild(toast);

        // Rimuovi dopo 3 secondi
        setTimeout(function () {
            toast.style.animation = 'slideOutDown 0.3s ease-out';
            setTimeout(function () {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // ===== ANIMAZIONI SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Osserva sezioni
    const sections = document.querySelectorAll('section');
    sections.forEach(function (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });

    // ===== RECENSIONI =====
    const reviewsBtn = document.querySelector('.reviews-section .btn-secondary');
    if (reviewsBtn) {
        reviewsBtn.addEventListener('click', function () {
            // In produzione: carica più recensioni
            console.log('Carica altre recensioni');
            showToast('Caricamento recensioni...', 'info');
        });
    }

    // ===== SLOTS DISPONIBILITÀ =====
    function updateAvailabilitySlots() {
        // In produzione: carica disponibilità reale dal backend
        const slots = [
            { date: 'Oggi', times: ['15:00', '17:00', '19:00'] },
            { date: 'Domani', times: ['10:00', '14:00', '16:00', '18:00'] },
            { date: 'Mercoledì', times: ['09:00', '11:00', '15:00', '17:00'] }
        ];

        const slotsList = document.querySelector('.slots-list');
        if (!slotsList) return;

        let slotsHTML = '';
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            slotsHTML += '<div class="slot-item">';
            slotsHTML += '<span class="slot-date">' + slot.date + '</span>';
            slotsHTML += '<span class="slot-times">' + slot.times.join(', ') + '</span>';
            slotsHTML += '</div>';
        }

        slotsList.innerHTML = slotsHTML;
    }

    // Aggiorna slots all'avvio
    updateAvailabilitySlots();

    // ===== DATI MODIFICABILI DAL PROFESSIONISTA =====
    // In produzione questi dati verranno dal backend/database
    // e saranno modificabili dal pannello professionista

    const editableData = {
        // Info professionista
        professionalName: 'Giulia Rossi',
        professionalTitle: 'Massaggiatrice Certificata - 10 anni di esperienza',
        professionalLocation: 'Cagliari, Sardegna',
        professionalAvatar: '/assets/images/Professionisti/pr1.png',

        // Info trattamento
        treatmentName: 'Massaggio Svedese',
        treatmentImage: '/assets/images/Servizi/massage2.jpg',
        treatmentShortDesc: 'Il massaggio svedese è una tecnica di massaggio occidentale che utilizza movimenti lunghi e fluidi per rilassare i muscoli superficiali e migliorare la circolazione sanguigna.',
        treatmentProcess: 'Il trattamento inizia con un breve colloquio per comprendere le tue esigenze. Utilizzo oli essenziali naturali e tecniche di massaggio tradizionali svedesi, alternando movimenti di effleurage, petrissage e tapotement per un rilassamento completo.',

        // Benefici (array)
        treatmentBenefits: [
            'Riduzione dello stress e dell\'ansia',
            'Miglioramento della circolazione',
            'Rilassamento muscolare profondo',
            'Aumento della flessibilità',
            'Miglioramento della qualità del sonno'
        ],

        // Prezzi per durata
        prices: {
            30: 45,
            60: 70,
            90: 95,
            120: 120
        },

        // Pacchetti
        packages: [
            { id: 'single', name: 'Trattamento singolo', desc: 'Massaggio svedese standard', price: 70 },
            { id: 'relax', name: 'Pacchetto Relax', desc: 'Massaggio + Aromaterapia', price: 90 },
            { id: 'complete', name: 'Pacchetto Completo', desc: 'Massaggio + Aromaterapia + Hot Stone', price: 120 }
        ],

        // Extra disponibili
        extras: [
            { id: 'music', name: 'Musica personalizzata', price: 5 },
            { id: 'candles', name: 'Candele aromatiche', price: 10 },
            { id: 'oils', name: 'Oli essenziali premium', price: 15 }
        ],

        // Istruzioni
        beforeInstructions: [
            'Fai una doccia calda per rilassare i muscoli',
            'Evita pasti pesanti 2 ore prima',
            'Comunica eventuali problemi di salute',
            'Rimuovi gioielli e accessori'
        ],

        professionalProvides: [
            'Lettino da massaggio professionale',
            'Oli e creme per massaggio',
            'Asciugamani puliti',
            'Musica rilassante'
        ],

        afterInstructions: [
            'Bevi molta acqua per idratare',
            'Evita sforzi fisici intensi',
            'Concediti del tempo per rilassarti',
            'Possibili lievi dolori muscolari sono normali'
        ]
    };

    // ===== FUNZIONE PER AGGIORNARE UI CON DATI =====
    function populateEditableContent() {
        // Questa funzione in produzione riceverà i dati dal backend
        // Per ora usa i dati mock sopra

        // Aggiorna elementi con ID corrispondenti
        for (const key in editableData) {
            const element = document.getElementById(key);
            if (element) {
                if (typeof editableData[key] === 'string') {
                    if (element.tagName === 'IMG') {
                        element.src = editableData[key];
                    } else {
                        element.textContent = editableData[key];
                    }
                } else if (Array.isArray(editableData[key])) {
                    // Per liste
                    let listHTML = '';
                    for (let i = 0; i < editableData[key].length; i++) {
                        listHTML += '<li>' + editableData[key][i] + '</li>';
                    }
                    element.innerHTML = listHTML;
                }
            }
        }
    }

    // Popola contenuti all'avvio
    populateEditableContent();

    // ===== CSS ANIMAZIONI =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOutDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ===== DEBUG =====
    window.serviceDebug = {
        state: serviceState,
        data: editableData,
        recalculatePrice: calculateTotalPrice,
        updateSlots: updateAvailabilitySlots
    };

    console.log('Template servizio inizializzato');
    console.log('Debug disponibile: window.serviceDebug');

});