// ===== PAGAMENTO - JS COMPLETO CORRETTO =====
// Gestisce la pagina di pagamento separata con calcolo prezzi corretto

document.addEventListener('DOMContentLoaded', function () {
    console.log('Pagamento JS caricato');

    // STATO PAGAMENTO
    const paymentState = {
        bookingData: null,
        paymentMethod: 'card',
        isProcessing: false
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

    // ===== CARICA DATI PRENOTAZIONE =====
    function loadBookingData() {
        try {
            // Recupera dati da sessionStorage
            const directBooking = sessionStorage.getItem('directBooking');

            if (!directBooking) {
                console.error('Nessun dato di prenotazione trovato');
                showError('Errore: nessun dato di prenotazione trovato');
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 3000);
                return;
            }

            paymentState.bookingData = JSON.parse(directBooking);
            populateBookingSummary();

            console.log('Dati prenotazione caricati:', paymentState.bookingData);
        } catch (error) {
            console.error('Errore caricamento dati:', error);
            showError('Errore nel caricamento dei dati');
        }
    }

    // ===== POPOLA RIEPILOGO PRENOTAZIONE =====
    function populateBookingSummary() {
        const data = paymentState.bookingData;
        if (!data) return;

        // Info professionista
        const professionalName = document.getElementById('summaryProfessionalName');
        const professionalTitle = document.getElementById('summaryProfessionalTitle');
        const professionalRating = document.getElementById('summaryProfessionalRating');
        const professionalReviews = document.getElementById('summaryProfessionalReviews');

        if (professionalName) professionalName.textContent = data.professional?.name || 'Professionista';
        if (professionalTitle) professionalTitle.textContent = data.professional?.title || 'Specializzazione';
        if (professionalRating) professionalRating.textContent = data.professional?.rating || '4.9';
        if (professionalReviews) professionalReviews.textContent = data.professional?.reviews || '127';

        // Info servizio
        const serviceName = document.getElementById('summaryServiceName');
        const serviceDuration = document.getElementById('summaryServiceDuration');
        const serviceMode = document.getElementById('summaryServiceMode');
        const servicePackage = document.getElementById('summaryServicePackage');

        if (serviceName) serviceName.textContent = data.service?.name || 'Servizio';
        if (serviceDuration) serviceDuration.textContent = (data.service?.duration || 60) + ' minuti';
        if (servicePackage) servicePackage.textContent = data.service?.package || 'Standard';

        // Modalità
        if (serviceMode) {
            const modeLabels = {
                'domicilio': 'A domicilio',
                'studio': 'Presso studio',
                'online': 'Online'
            };
            serviceMode.textContent = modeLabels[data.service?.mode] || 'A domicilio';
        }

        // Extra servizi
        if (data.service?.extras && data.service.extras.length > 0) {
            populateExtras(data.service.extras);
        }

        // Prezzi - CORRETTO
        updatePriceSummary();
    }

    // ===== POPOLA EXTRA =====
    function populateExtras(extras) {
        const extrasSummary = document.getElementById('extrasSummary');
        const extrasList = document.getElementById('extrasList');

        if (!extrasSummary || !extrasList || !extras.length) return;

        let extrasHTML = '';

        // Mappa prezzi extra
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

        for (let i = 0; i < extras.length; i++) {
            const extra = extras[i];
            const price = extraPrices[extra] || 0;
            const extraName = extraNames[extra] || extra;
            extrasHTML += `<div class="extra-item"><span>${extraName}</span><span>+€${price}</span></div>`;
        }

        extrasList.innerHTML = extrasHTML;
        extrasSummary.style.display = 'block';
    }

    // ===== AGGIORNA RIEPILOGO PREZZI - CORRETTO =====
    function updatePriceSummary() {
        const data = paymentState.bookingData;
        if (!data?.service) return;

        // USA IL PREZZO TOTALE GIÀ CALCOLATO DAL TEMPLATE SERVIZIO
        let finalTotal = data.service.totalPrice || data.service.price || 70;
        const basePrice = data.service.price || 70;

        console.log('Calcolo prezzi:', {
            basePrice: basePrice,
            totalPrice: data.service.totalPrice,
            finalTotal: finalTotal,
            mode: data.service.mode,
            extras: data.service.extras
        });

        // Prezzo base
        const basePriceEl = document.getElementById('basePrice');
        if (basePriceEl) basePriceEl.textContent = `€${basePrice}`;

        // Costo domicilio
        const modePrice = document.getElementById('modePrice');
        if (data.service.mode === 'domicilio') {
            if (modePrice) modePrice.style.display = 'flex';
        } else {
            if (modePrice) modePrice.style.display = 'none';
        }

        // Extra
        let extrasTotal = 0;
        if (data.service.extras && data.service.extras.length > 0) {
            const extraPrices = {
                'music': 5,
                'candles': 10,
                'oils': 15,
                'aromatherapy': 15,
                'hot-stones': 25
            };

            for (let i = 0; i < data.service.extras.length; i++) {
                extrasTotal += extraPrices[data.service.extras[i]] || 0;
            }
        }

        // Mostra/nascondi sezione extra
        const extrasPrice = document.getElementById('extrasPrice');
        const extrasPriceAmount = document.getElementById('extrasPriceAmount');

        if (extrasTotal > 0) {
            if (extrasPrice) extrasPrice.style.display = 'flex';
            if (extrasPriceAmount) extrasPriceAmount.textContent = `+€${extrasTotal}`;
        } else {
            if (extrasPrice) extrasPrice.style.display = 'none';
        }

        // Aggiorna totali con il prezzo finale corretto
        const totalPrice = document.getElementById('totalPrice');
        const confirmPrice = document.getElementById('confirmPrice');

        if (totalPrice) totalPrice.textContent = `€${finalTotal}`;
        if (confirmPrice) confirmPrice.textContent = `€${finalTotal}`;

        // Aggiorna stato
        paymentState.bookingData.finalPrice = finalTotal;

        console.log('Prezzo finale aggiornato:', finalTotal);
    }

    // ===== GESTIONE METODI PAGAMENTO =====
    function initializePaymentMethods() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');

        paymentMethods.forEach(radio => {
            radio.addEventListener('change', function () {
                paymentState.paymentMethod = this.value;
                togglePaymentForm();
            });
        });

        // Inizializza form card
        togglePaymentForm();
    }

    function togglePaymentForm() {
        const cardForm = document.getElementById('cardForm');
        if (!cardForm) return;

        if (paymentState.paymentMethod === 'card') {
            cardForm.style.display = 'flex';
        } else {
            cardForm.style.display = 'none';
        }
    }

    // ===== FORMATTAZIONE CARTA =====
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

                clearFieldError(this);
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
                clearFieldError(this);
            });
        }

        // CVC
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
                    const now = new Date();
                    if (expiry < now) {
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

        const existingError = formGroup.querySelector('.field-error');
        if (existingError) existingError.remove();

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
            return true;
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
        if (!validateForm()) {
            showError('Correggi gli errori nel form di pagamento');
            return;
        }

        if (!paymentState.bookingData) {
            showError('Errore: dati prenotazione mancanti');
            return;
        }

        startPaymentProcessing();

        setTimeout(() => {
            try {
                const bookingCode = generateBookingCode();
                finishPaymentProcessing();
                showBookingConfirmation(bookingCode);

                sessionStorage.removeItem('directBooking');

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
            document.body.style.overflow = 'hidden';
        }

        setupModalEvents();
    }

    function setupModalEvents() {
        const viewBookingsBtn = document.getElementById('viewBookings');
        const closeModalBtn = document.getElementById('closeModal');
        const modal = document.getElementById('confirmationModal');

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
            document.body.style.overflow = 'auto';
        }
    }

    // ===== GESTIONE ERRORI =====
    function showError(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        const paymentCard = document.querySelector('.payment-card');
        if (paymentCard) {
            paymentCard.insertBefore(errorDiv, paymentCard.firstChild);
        }

        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // ===== GESTIONE ESCAPE E BACK BUTTON =====
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('confirmationModal');
            if (modal && modal.classList.contains('show')) {
                closeModal();
            }
        }
    });

    window.addEventListener('beforeunload', function (e) {
        if (paymentState.isProcessing) {
            e.preventDefault();
            e.returnValue = 'Pagamento in corso. Sei sicuro di voler uscire?';
            return e.returnValue;
        }
    });

    window.addEventListener('load', function () {
        if (!paymentState.bookingData) {
            console.warn('Nessun dato di prenotazione trovato, reindirizzamento...');
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        }
    });

    // ===== DEBUG =====
    window.paymentDebug = {
        state: paymentState,
        validateForm: validateForm,
        processPayment: processPayment,
        showError: showError,
        updatePriceSummary: updatePriceSummary
    };

    console.log('Pagamento JS inizializzato - Debug: window.paymentDebug');
});