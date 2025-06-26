/**
 * INTEGRAZIONE SISTEMA ACCESSO PER SERVIZI E LAST MINUTE
 * Da aggiungere alle pagine di booking servizi esistenti
 */

/**
 * Gestisce completamento pagamento per servizi normali
 */
async function handleServicePaymentComplete(serviceBookingData) {
    try {
        const paymentData = {
            userId: serviceBookingData.userId,
            professionalId: serviceBookingData.professionalId,
            type: 'service',
            serviceId: serviceBookingData.serviceId,
            serviceName: serviceBookingData.serviceName,
            price: serviceBookingData.price,
            paymentId: serviceBookingData.paymentId,
            scheduledDateTime: serviceBookingData.scheduledDateTime
        };

        // Genera codice accesso
        const accessCode = await window.RelaxPointAccess.generateAccessCode(paymentData);

        console.log('✅ Codice accesso servizio generato:', accessCode.code);

        return {
            success: true,
            accessCode: accessCode.code,
            message: 'Prenotazione completata! Riceverai il codice di accesso via chat.'
        };

    } catch (error) {
        console.error('Error generating service access code:', error);
        return {
            success: false,
            error: 'Errore nella generazione del codice accesso'
        };
    }
}

/**
 * Gestisce completamento pagamento per Last Minute
 */
async function handleLastMinutePaymentComplete(lastMinuteData) {
    try {
        const paymentData = {
            userId: lastMinuteData.userId,
            professionalId: lastMinuteData.professionalId,
            type: 'last_minute',
            serviceId: lastMinuteData.serviceId,
            serviceName: lastMinuteData.serviceName,
            price: lastMinuteData.discountedPrice,
            paymentId: lastMinuteData.paymentId,
            scheduledDateTime: lastMinuteData.availableSlot
        };

        // Genera codice accesso con scadenza breve
        const accessCode = await window.RelaxPointAccess.generateAccessCode(paymentData);

        console.log('⚡ Codice accesso Last Minute generato:', accessCode.code);

        return {
            success: true,
            accessCode: accessCode.code,
            expiryTime: accessCode.expiryDate,
            message: 'Last Minute prenotato! Codice accesso disponibile per 2 ore.'
        };

    } catch (error) {
        console.error('Error generating last minute access code:', error);
        return {
            success: false,
            error: 'Errore nella generazione del codice accesso'
        };
    }
}

/**
 * Esempio integrazione in pagina booking servizi esistente
 */
function integrateAccessSystemInServiceBooking() {
    // Trova il button di conferma prenotazione esistente
    const existingBookingBtn = document.querySelector('.booking-confirm, .prenota-btn, .confirm-booking');

    if (existingBookingBtn) {
        // Sostituisci handler esistente
        existingBookingBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            // Raccogli dati prenotazione dalla pagina
            const bookingData = collectBookingData();

            if (!validateBookingData(bookingData)) {
                showToast('Compila tutti i campi richiesti', 'error');
                return;
            }

            // Mostra loading
            existingBookingBtn.disabled = true;
            existingBookingBtn.textContent = 'Elaborazione pagamento...';

            try {
                // Simula processo pagamento
                const paymentResult = await processPayment(bookingData);

                if (paymentResult.success) {
                    // Genera codice accesso
                    const accessResult = await handleServicePaymentComplete({
                        ...bookingData,
                        paymentId: paymentResult.paymentId
                    });

                    if (accessResult.success) {
                        showToast('Prenotazione completata!', 'success');

                        // Mostra dettagli prenotazione
                        showBookingConfirmation(bookingData, accessResult);
                    } else {
                        showToast(accessResult.error, 'error');
                    }
                } else {
                    showToast('Errore nel pagamento', 'error');
                }

            } catch (error) {
                console.error('Booking error:', error);
                showToast('Errore nella prenotazione', 'error');
            } finally {
                existingBookingBtn.disabled = false;
                existingBookingBtn.textContent = 'Prenota Ora';
            }
        });
    }
}

/**
 * Raccogli dati prenotazione dalla pagina
 */
function collectBookingData() {
    return {
        userId: getCurrentUserId(), // Da implementare
        professionalId: getProfessionalId(), // Da form/pagina
        serviceId: getSelectedServiceId(), // Da form
        serviceName: getSelectedServiceName(), // Da form
        price: getServicePrice(), // Da form
        scheduledDateTime: getSelectedDateTime() // Da form
    };
}

/**
 * Valida dati prenotazione
 */
function validateBookingData(data) {
    return data.serviceId &&
        data.serviceName &&
        data.price &&
        data.scheduledDateTime &&
        data.professionalId;
}

/**
 * Simula processo pagamento
 */
async function processPayment(bookingData) {
    // Simula chiamata API pagamento
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                paymentId: 'pay_' + Date.now(),
                transactionId: 'txn_' + Math.random().toString(36).substring(7)
            });
        }, 2000);
    });
}

/**
 * Mostra conferma prenotazione con codice accesso
 */
function showBookingConfirmation(bookingData, accessResult) {
    const modal = document.createElement('div');
    modal.className = 'booking-confirmation-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-check-circle" style="color: #10b981;"></i> Prenotazione Confermata!</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="booking-summary">
                    <h4>Dettagli Prenotazione</h4>
                    <div class="summary-item">
                        <span>Servizio:</span>
                        <strong>${bookingData.serviceName}</strong>
                    </div>
                    <div class="summary-item">
                        <span>Data e Ora:</span>
                        <strong>${formatDateTime(bookingData.scheduledDateTime)}</strong>
                    </div>
                    <div class="summary-item">
                        <span>Prezzo:</span>
                        <strong>€${bookingData.price}</strong>
                    </div>
                </div>
                
                <div class="access-code-info">
                    <h4><i class="fas fa-key"></i> Codice di Accesso</h4>
                    <p>Il tuo codice di accesso è stato generato e sarà inviato via chat interna prima della sessione.</p>
                    <div class="access-instructions">
                        <i class="fas fa-info-circle"></i>
                        <span>Usa il codice per accedere alla sessione live il giorno dell'appuntamento.</span>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h4>Prossimi Passi</h4>
                    <ol>
                        <li>Riceverai una conferma via email</li>
                        <li>Il codice di accesso arriverà via chat 30 min prima</li>
                        <li>Accedi alla sessione usando il codice</li>
                    </ol>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-primary" onclick="window.location.href='dashboard.html'">
                        <i class="fas fa-calendar"></i> Vai al Dashboard
                    </button>
                    <button class="btn-secondary" onclick="this.closest('.booking-confirmation-modal').remove()">
                        <i class="fas fa-home"></i> Torna alla Home
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Setup close events
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) modal.remove();
    });
}

/**
 * Utility functions (da implementare secondo le pagine esistenti)
 */
function getCurrentUserId() {
    // Implementa secondo il sistema auth esistente
    return 'user_123'; // Placeholder
}

function getProfessionalId() {
    // Estrai da URL, form o elemento pagina
    return document.querySelector('[data-professional-id]')?.dataset.professionalId || 'prof_sophia';
}

function getSelectedServiceId() {
    // Estrai da form o selezione
    return document.querySelector('input[name="service"]:checked')?.value || 'srv_1';
}

function getSelectedServiceName() {
    // Estrai da form o selezione
    return document.querySelector('input[name="service"]:checked')?.dataset.serviceName || 'Servizio Wellness';
}

function getServicePrice() {
    // Estrai da form o elemento
    return parseFloat(document.querySelector('.service-price')?.textContent.replace(/[€,]/g, '') || '150');
}

function getSelectedDateTime() {
    // Estrai da form datetime
    const date = document.querySelector('#booking-date')?.value;
    const time = document.querySelector('#booking-time')?.value;
    return date && time ? `${date}T${time}:00` : new Date().toISOString();
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showToast(message, type = 'info') {
    // Usa la funzione toast esistente o implementa
    console.log(`Toast (${type}): ${message}`);
}

// Auto-inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    // Integra sistema solo se RelaxPointAccess è disponibile
    if (window.RelaxPointAccess) {
        integrateAccessSystemInServiceBooking();
        console.log('✅ Access system integrated in service booking');
    }
});

// Export per uso in altre pagine
window.ServiceBookingIntegration = {
    handleServicePaymentComplete,
    handleLastMinutePaymentComplete,
    integrateAccessSystemInServiceBooking
};