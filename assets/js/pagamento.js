/* ===============================================
   PAGAMENTO FIXED - JavaScript Corretto
   Senza redirect automatico + sistemi pagamento aggiornati
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('Pagamento Fixed JS caricato');

    // STATO PAGAMENTO
    const paymentState = {
        bookingData: null,
        paymentMethod: 'card',
        isProcessing: false,
        demoMode: true // Modalità demo per test senza sessionStorage
    };

    // INIZIALIZZAZIONE
    init();

    function init() {
        loadBookingData();
        initializePaymentMethods();
        initializeCardFormatting();
        initializeFormValidation();
        initializeConfirmButton();

        console.log('Pagamento inizializzato');
    }

    // ===== CARICA DATI PRENOTAZIONE (VERSIONE FIXED) =====
    function loadBookingData() {
        try {
            // Prova a recuperare dati reali
            const directBooking = sessionStorage.getItem('directBooking');

            if (directBooking) {
                // Dati reali da sessionStorage
                paymentState.bookingData = JSON.parse(directBooking);
                paymentState.demoMode = false;
                console.log('Dati reali caricati:', paymentState.bookingData);
            } else {
                // DATI DEMO per permettere di testare la pagina
                paymentState.bookingData = {
                    professional: {
                        name: 'Giulia Rossi',
                        title: 'Massaggiatrice Specializzata',
                        rating: 4.9,
                        reviews: 127
                    },
                    service: {
                        name: 'Massaggio Svedese',
                        duration: 60,
                        mode: 'domicilio',
                        package: 'Premium',
                        price: 85,
                        extras: ['oils', 'candles'],
                        totalPrice: 120
                    }
                };
                console.log('Modalità DEMO attiva - dati di esempio caricati');
            }

            populateBookingSummary();

        } catch (error) {
            console.error('Errore caricamento dati:', error);
            // Carica dati demo di fallback
            loadDemoData();
        }
    }

    function loadDemoData() {
        paymentState.bookingData = {
            professional: {
                name: 'Professionista Demo',
                title: 'Specializzazione',
                rating: 4.8,
                reviews: 50
            },
            service: {
                name: 'Servizio Demo',
                duration: 60,
                mode: 'domicilio',
                package: 'Standard',
                price: 70,
                extras: [],
                totalPrice: 80
            }
        };
        populateBookingSummary();
        console.log('Dati demo di fallback caricati');
    }

    // ===== POPOLA RIEPILOGO PRENOTAZIONE =====
    function populateBookingSummary() {
        const data = paymentState.bookingData;
        if (!data) return;

        // Info professionista
        updateElement('summaryProfessionalName', data.professional?.name || 'Professionista');
        updateElement('summaryProfessionalTitle', data.professional?.title || 'Specializzazione');
        updateElement('summaryProfessionalRating', data.professional?.rating || '4.9');
        updateElement('summaryProfessionalReviews', data.professional?.reviews || '127');

        // Info servizio
        updateElement('summaryServiceName', data.service?.name || 'Servizio');
        updateElement('summaryServiceDuration', (data.service?.duration || 60) + ' minuti');
        updateElement('summaryServicePackage', data.service?.package || 'Standard');

        // Modalità
        const modeLabels = {
            'domicilio': 'A domicilio',
            'studio': 'Presso studio',
            'online': 'Online'
        };
        updateElement('summaryServiceMode', modeLabels[data.service?.mode] || 'A domicilio');

        // Extra servizi
        if (data.service?.extras && data.service.extras.length > 0) {
            populateExtras(data.service.extras);
        } else {
            // Nasconde sezione extra se vuota
            const extrasSection = document.getElementById('extrasSummary');
            if (extrasSection) extrasSection.style.display = 'none';
        }

        // Prezzi
        updatePriceSummary();
    }

    function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    // ===== POPOLA EXTRA =====
    function populateExtras(extras) {
        const extrasList = document.getElementById('extrasList');
        if (!extrasList || !extras.length) return;

        const extraPrices = {
            'music': 5,
            'candles': 10,
            'oils': 15,
            'aromatherapy': 15,
            'hot-stones': 25
        };

        const extraNames = {
            'music': 'Musica personalizzata',
            'candles': 'Candele aromatiche',
            'oils': 'Oli essenziali premium',
            'aromatherapy': 'Aromaterapia',
            'hot-stones': 'Pietre calde'
        };

        let extrasHTML = '';
        extras.forEach(extra => {
            const price = extraPrices[extra] || 0;
            const name = extraNames[extra] || extra;
            extrasHTML += `
                <div class="extra-item">
                    <span>${name}</span>
                    <span>+€${price}</span>
                </div>
            `;
        });

        extrasList.innerHTML = extrasHTML;
        document.getElementById('extrasSummary').style.display = 'block';
    }

    // ===== AGGIORNA RIEPILOGO PREZZI =====
    function updatePriceSummary() {
        const data = paymentState.bookingData;
        if (!data?.service) return;

        const finalTotal = data.service.totalPrice || data.service.price || 70;
        const basePrice = data.service.price || 70;

        // Prezzi
        updateElement('basePrice', `€${basePrice}`);
        updateElement('totalPrice', `€${finalTotal}`);
        updateElement('confirmPrice', `€${finalTotal}`);

        // Costo domicilio
        const modePrice = document.getElementById('modePrice');
        if (data.service.mode === 'domicilio' && modePrice) {
            modePrice.style.display = 'flex';
        }

        // Extra
        let extrasTotal = 0;
        if (data.service.extras && data.service.extras.length > 0) {
            const extraPrices = { 'music': 5, 'candles': 10, 'oils': 15, 'aromatherapy': 15, 'hot-stones': 25 };
            extrasTotal = data.service.extras.reduce((sum, extra) => sum + (extraPrices[extra] || 0), 0);
        }

        const extrasPrice = document.getElementById('extrasPrice');
        const extrasPriceAmount = document.getElementById('extrasPriceAmount');

        if (extrasTotal > 0) {
            if (extrasPrice) extrasPrice.style.display = 'flex';
            if (extrasPriceAmount) extrasPriceAmount.textContent = `+€${extrasTotal}`;
        }

        paymentState.bookingData.finalPrice = finalTotal;
        console.log('Prezzi aggiornati - Totale:', finalTotal);
    }

    // ===== GESTIONE METODI PAGAMENTO =====
    function initializePaymentMethods() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');

        paymentMethods.forEach(radio => {
            radio.addEventListener('change', function () {
                paymentState.paymentMethod = this.value;
                togglePaymentForm();
                console.log('Metodo pagamento selezionato:', this.value);
            });
        });

        togglePaymentForm();
    }

    function togglePaymentForm() {
        const cardForm = document.getElementById('cardForm');
        if (!cardForm) return;

        // Mostra form carta solo per pagamento con carta
        if (paymentState.paymentMethod === 'card') {
            cardForm.style.display = 'flex';
        } else {
            cardForm.style.display = 'none';
        }
    }

    // ===== FORMATTAZIONE CARTA =====
    function initializeCardFormatting() {
        // Numero carta con spazi
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;

                if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
                this.value = formattedValue;
                clearFieldError(this);
            });
        }

        // Scadenza MM/AA
        const cardExpiry = document.getElementById('cardExpiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                this.value = value;
                clearFieldError(this);
            });
        }

        // CVC solo numeri
        const cardCvc = document.getElementById('cardCvc');
        if (cardCvc) {
            cardCvc.addEventListener('input', function (e) {
                this.value = this.value.replace(/\D/g, '').substring(0, 4);
                clearFieldError(this);
            });
        }

        // Nome
        const cardName = document.getElementById('cardName');
        if (cardName) {
            cardName.addEventListener('input', function () {
                clearFieldError(this);
            });
        }
    }

    // ===== VALIDAZIONE FORM =====
    function initializeFormValidation() {
        const inputs = document.querySelectorAll('#cardForm input');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });
        });
    }

    function validateField(field) {
        const fieldId = field.id;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldId) {
            case 'cardNumber':
                const cleanNumber = value.replace(/\s/g, '');
                if (!cleanNumber || cleanNumber.length < 13) {
                    isValid = false;
                    errorMessage = 'Inserisci un numero di carta valido';
                }
                break;

            case 'cardExpiry':
                if (!value.match(/^\d{2}\/\d{2}$/)) {
                    isValid = false;
                    errorMessage = 'Inserisci una data valida (MM/AA)';
                } else {
                    const [month, year] = value.split('/');
                    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
                    if (expiry < new Date()) {
                        isValid = false;
                        errorMessage = 'La carta è scaduta';
                    }
                }
                break;

            case 'cardCvc':
                if (!value || value.length < 3) {
                    isValid = false;
                    errorMessage = 'Inserisci un CVC valido';
                }
                break;

            case 'cardName':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Inserisci il nome dell\'intestatario';
                }
                break;
        }

        if (isValid) {
            clearFieldError(field);
        } else {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        formGroup.classList.add('error');

        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) existingError.remove();

        // Add new error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px;';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        formGroup.classList.remove('error');
        const errorMsg = formGroup.querySelector('.field-error');
        if (errorMsg) errorMsg.remove();
    }

    function validateForm() {
        if (paymentState.paymentMethod !== 'card') {
            return true; // Altri metodi non richiedono validazione form carta
        }

        const fields = ['cardNumber', 'cardExpiry', 'cardCvc', 'cardName'];
        let isFormValid = true;

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !validateField(field)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    // ===== BOTTONE CONFERMA =====
    function initializeConfirmButton() {
        const confirmBtn = document.getElementById('confirmPayment');
        if (!confirmBtn) return;

        confirmBtn.addEventListener('click', function () {
            if (!paymentState.isProcessing) {
                processPayment();
            }
        });
    }

    // ===== ELABORA PAGAMENTO =====
    function processPayment() {
        // Validazione
        if (!validateForm()) {
            showError('Correggi gli errori nel form di pagamento');
            return;
        }

        if (!paymentState.bookingData) {
            showError('Errore: dati prenotazione mancanti');
            return;
        }

        console.log('Elaborazione pagamento iniziata:', {
            method: paymentState.paymentMethod,
            amount: paymentState.bookingData.finalPrice,
            demo: paymentState.demoMode
        });

        startPaymentProcessing();

        // Simula elaborazione pagamento
        setTimeout(() => {
            try {
                const bookingCode = generateBookingCode();
                finishPaymentProcessing();
                showBookingConfirmation(bookingCode);

                // Pulisci sessionStorage solo se non in demo
                if (!paymentState.demoMode) {
                    sessionStorage.removeItem('directBooking');
                }

                console.log('Pagamento completato:', {
                    bookingCode,
                    amount: paymentState.bookingData.finalPrice,
                    method: paymentState.paymentMethod
                });

            } catch (error) {
                finishPaymentProcessing();
                showError('Errore durante l\'elaborazione del pagamento');
                console.error('Errore pagamento:', error);
            }
        }, 2500);
    }

    function startPaymentProcessing() {
        paymentState.isProcessing = true;
        const confirmBtn = document.getElementById('confirmPayment');
        if (!confirmBtn) return;

        confirmBtn.disabled = true;
        confirmBtn.classList.add('loading');

        // Mostra spinner
        const btnText = confirmBtn.querySelector('.btn-text');
        const btnPrice = confirmBtn.querySelector('.btn-price');
        const btnLoading = confirmBtn.querySelector('.btn-loading');

        if (btnText) btnText.style.display = 'none';
        if (btnPrice) btnPrice.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'flex';
    }

    function finishPaymentProcessing() {
        paymentState.isProcessing = false;
        const confirmBtn = document.getElementById('confirmPayment');
        if (!confirmBtn) return;

        confirmBtn.disabled = false;
        confirmBtn.classList.remove('loading');

        // Ripristina pulsante
        const btnText = confirmBtn.querySelector('.btn-text');
        const btnPrice = confirmBtn.querySelector('.btn-price');
        const btnLoading = confirmBtn.querySelector('.btn-loading');

        if (btnText) btnText.style.display = 'inline';
        if (btnPrice) btnPrice.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
    }

    function generateBookingCode() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `RP-${year}-${random}`;
    }

    // ===== MODAL CONFERMA =====
    function showBookingConfirmation(bookingCode) {
        const modal = document.getElementById('confirmationModal');
        const codeElement = document.getElementById('bookingCode');

        if (codeElement) codeElement.textContent = bookingCode;
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        setupModalEvents();
    }

    function setupModalEvents() {
        const viewBookingsBtn = document.getElementById('viewBookings');
        const closeModalBtn = document.getElementById('closeModal');

        if (viewBookingsBtn) {
            viewBookingsBtn.onclick = function () {
                window.location.href = '/pages/dashboard/prenotazioni.html';
            };
        }

        if (closeModalBtn) {
            closeModalBtn.onclick = function () {
                closeModal();
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 500);
            };
        }

        // Click overlay per chiudere
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.onclick = function (e) {
                if (e.target === modal) {
                    closeModal();
                    setTimeout(() => {
                        window.location.href = '/index.html';
                    }, 500);
                }
            };
        }
    }

    function closeModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // ===== GESTIONE ERRORI =====
    function showError(message) {
        // Rimuovi errore esistente
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Crea nuovo errore
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #fef2f2;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 16px 0;
            border-left: 4px solid #ef4444;
            font-size: 14px;
        `;
        errorDiv.textContent = message;

        // Inserisci all'inizio della card pagamento
        const paymentCard = document.querySelector('.payment-card');
        if (paymentCard) {
            paymentCard.insertBefore(errorDiv, paymentCard.firstChild);
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Auto rimozione dopo 5 secondi
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // ===== EVENT LISTENERS GLOBALI =====
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('confirmationModal');
            if (modal && modal.classList.contains('show')) {
                closeModal();
            }
        }
    });

    // Previeni chiusura durante elaborazione
    window.addEventListener('beforeunload', function (e) {
        if (paymentState.isProcessing) {
            e.preventDefault();
            e.returnValue = 'Pagamento in corso. Sei sicuro di voler uscire?';
            return e.returnValue;
        }
    });

    // ===== DEBUG & TESTING =====
    window.paymentDebug = {
        state: paymentState,
        loadDemoData: loadDemoData,
        validateForm: validateForm,
        processPayment: processPayment,
        showError: showError,
        updatePriceSummary: updatePriceSummary
    };

    console.log('Pagamento Fixed JS inizializzato');
    console.log('Debug disponibile: window.paymentDebug');
    console.log('Modalità DEMO:', paymentState.demoMode);
});

/* ===============================================
   CSS INLINE PER PAYMENT ICONS (se necessario)
   =============================================== */

// Aggiunge stili per le icone dei metodi di pagamento se non presenti nel CSS
function addPaymentIconStyles() {
    if (document.getElementById('payment-icons-styles')) return;

    const style = document.createElement('style');
    style.id = 'payment-icons-styles';
    style.textContent = `
        .payment-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 80px;
            height: 32px;
        }
        .payment-icon img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: grayscale(20%);
            transition: filter 0.3s ease;
        }
        .payment-method input[type="radio"]:checked + .method-card .payment-icon img {
            filter: grayscale(0%);
        }
        .card-icons {
            display: flex;
            gap: 4px;
        }
        .card-icons img {
            width: 32px;
            height: 20px;
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', addPaymentIconStyles);