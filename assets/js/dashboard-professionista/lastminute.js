/* ===============================================
   RELAXPOINT - JAVASCRIPT LAST MINUTE PROFESSIONISTA
   Gestione completa funzionalità Last Minute
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    initializeLastMinute();
});

// ===============================================
// STATO GLOBALE LAST MINUTE
// ===============================================
const lastMinuteState = {
    isActive: false,
    isConfiguring: false,
    currentStep: 1,
    configuration: {
        startTime: 'now+30',
        endTime: '20:00',
        zone: 30,
        services: [],
        mode: 'domicilio'
    },
    liveStats: {
        views: 0,
        requests: 0,
        timeRemaining: '0:00',
        potentialEarnings: 0
    }
};

// ===============================================
// INIZIALIZZAZIONE LAST MINUTE
// ===============================================
function initializeLastMinute() {
    setupMainToggle();
    setupConfigurationSteps();
    setupLiveUpdates();
    loadSavedConfiguration();

    console.log('🔥 Last Minute sistema inizializzato');
}

// ===============================================
// SETUP TOGGLE PRINCIPALE
// ===============================================
function setupMainToggle() {
    const mainToggle = document.getElementById('mainLastMinuteToggle');
    if (mainToggle) {
        mainToggle.addEventListener('click', toggleLastMinuteMode);
    }
}

function toggleLastMinuteMode() {
    if (lastMinuteState.isActive) {
        showActiveLastMinuteDashboard();
    } else {
        startLastMinuteConfiguration();
    }
}

function startLastMinuteConfiguration() {
    // Nascondi il main card e mostra configurazione
    const mainCard = document.querySelector('.lastminute-main-card');
    const configCard = document.getElementById('lastMinuteConfigCard');

    if (mainCard) mainCard.style.display = 'none';
    if (configCard) {
        configCard.style.display = 'block';
        configCard.style.animation = 'slideInUp 0.5s ease-out';
    }

    lastMinuteState.isConfiguring = true;
    resetConfigurationSteps();

    showNotification('Configura il tuo Last Minute in 5 semplici step', 'info');
}

// ===============================================
// GESTIONE STEP CONFIGURAZIONE
// ===============================================
function setupConfigurationSteps() {
    setupTimeSelectors();
    setupZoneSelectors();
    setupServiceSelectors();
    setupModeSelectors();
    updateConfigurationPreview();
}

function nextStep(stepNumber) {
    if (validateCurrentStep()) {
        hideCurrentStep();
        showStep(stepNumber);
        updateStepIndicators(stepNumber);
        lastMinuteState.currentStep = stepNumber;
        updateConfigurationPreview();
    }
}

function prevStep(stepNumber) {
    hideCurrentStep();
    showStep(stepNumber);
    updateStepIndicators(stepNumber);
    lastMinuteState.currentStep = stepNumber;
}

function hideCurrentStep() {
    const currentStep = document.querySelector('.config-step.active');
    if (currentStep) {
        currentStep.classList.remove('active');
        currentStep.style.display = 'none';
    }
}

function showStep(stepNumber) {
    const targetStep = document.getElementById('step' + stepNumber);
    if (targetStep) {
        targetStep.style.display = 'block';
        setTimeout(() => {
            targetStep.classList.add('active');
        }, 50);
    }
}

function updateStepIndicators(activeStep) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum === activeStep) {
            step.classList.add('active');
        } else if (stepNum < activeStep) {
            step.classList.add('completed');
        }
    });
}

function resetConfigurationSteps() {
    hideCurrentStep();
    showStep(1);
    updateStepIndicators(1);
    lastMinuteState.currentStep = 1;
}

// ===============================================
// VALIDAZIONE STEP
// ===============================================
function validateCurrentStep() {
    switch (lastMinuteState.currentStep) {
        case 1:
            return validateTimeSelection();
        case 2:
            return validateZoneSelection();
        case 3:
            return validateServiceSelection();
        case 4:
            return validateModeSelection();
        case 5:
            return true;
        default:
            return false;
    }
}

function validateTimeSelection() {
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');

    if (!startTime || !endTime) {
        showNotification('Errore nel sistema di selezione orari', 'error');
        return false;
    }

    // Calcola durata minima (30 minuti)
    const duration = calculateTimeDuration(startTime.value, endTime.value);
    if (duration < 30) {
        showNotification('La durata minima è di 30 minuti', 'warning');
        return false;
    }

    lastMinuteState.configuration.startTime = startTime.value;
    lastMinuteState.configuration.endTime = endTime.value;
    return true;
}

function validateZoneSelection() {
    if (!lastMinuteState.configuration.zone || lastMinuteState.configuration.zone < 5) {
        showNotification('Seleziona una zona di servizio (minimo 5km)', 'warning');
        return false;
    }
    return true;
}

function validateServiceSelection() {
    const selectedServices = document.querySelectorAll('.service-checkbox input:checked');

    if (selectedServices.length === 0) {
        showNotification('Seleziona almeno un servizio', 'warning');
        return false;
    }

    // Aggiorna configurazione
    lastMinuteState.configuration.services = Array.from(selectedServices).map(input => ({
        name: input.closest('.service-checkbox').querySelector('strong').textContent,
        duration: input.closest('.service-checkbox').querySelector('span').textContent
    }));

    return true;
}

function validateModeSelection() {
    const selectedMode = document.querySelector('input[name="serviceMode"]:checked');

    if (!selectedMode) {
        showNotification('Seleziona la modalità di servizio', 'warning');
        return false;
    }

    lastMinuteState.configuration.mode = selectedMode.value;
    return true;
}

// ===============================================
// SETUP SELETTORI
// ===============================================
function setupTimeSelectors() {
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    const timePreview = document.getElementById('timePreview');

    if (startTime && endTime && timePreview) {
        [startTime, endTime].forEach(select => {
            select.addEventListener('change', () => {
                const duration = calculateTimeDuration(startTime.value, endTime.value);
                timePreview.textContent = formatDuration(duration);
            });
        });
    }
}

function calculateTimeDuration(start, end) {
    // Implementazione semplificata - in produzione più robusta
    const startHour = start === 'now+30' ? new Date().getHours() + 0.5 : parseFloat(start.replace(':', '.'));
    const endHour = parseFloat(end.replace(':', '.'));
    return Math.max(0, (endHour - startHour) * 60);
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (hours === 0) {
        return `${mins}min`;
    } else if (mins === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h ${mins}m`;
    }
}

function setupZoneSelectors() {
    const zoneButtons = document.querySelectorAll('.zone-btn');

    zoneButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            zoneButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const zone = parseInt(this.textContent);
            setZone(zone);
        });
    });
}

function setZone(kilometers) {
    lastMinuteState.configuration.zone = kilometers;

    // Aggiorna display zona
    const zoneText = document.querySelector('.zone-text strong');
    const zoneDesc = document.querySelector('.zone-text p');

    if (zoneText) {
        zoneText.textContent = `Cagliari centro, raggio ${kilometers}km`;
    }

    if (zoneDesc) {
        const areas = getAreasForRadius(kilometers);
        zoneDesc.textContent = `Include: ${areas.join(', ')}`;
    }

    // Anima mappa
    animateMapRadius(kilometers);
}

function getAreasForRadius(km) {
    const areas = {
        5: ['Centro Storico'],
        10: ['Quartucciu', 'Pirri'],
        20: ['Quartucciu', 'Assemini', 'Pirri'],
        30: ['Quartucciu', 'Assemini', 'Monserrato', 'Pirri', 'Selargius'],
        50: ['Quartucciu', 'Assemini', 'Monserrato', 'Pirri', 'Selargius', 'Quartu', 'Villa San Pietro']
    };
    return areas[km] || areas[30];
}

function animateMapRadius(km) {
    const mapRadius = document.querySelector('.map-radius');
    if (mapRadius) {
        const scale = Math.min(km / 30, 1.2);
        mapRadius.style.transform = `translate(-50%, -50%) scale(${scale})`;
        mapRadius.style.transition = 'transform 0.5s ease-out';
    }
}

function setupServiceSelectors() {
    const serviceCheckboxes = document.querySelectorAll('.service-checkbox input[type="checkbox"]');

    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateServicesPreview);
    });
}

function updateServicesPreview() {
    const selectedCount = document.querySelectorAll('.service-checkbox input:checked').length;
    const summaryServices = document.getElementById('summaryServices');

    if (summaryServices) {
        summaryServices.textContent = `${selectedCount} servizi selezionati`;
    }
}

function setupModeSelectors() {
    const modeRadios = document.querySelectorAll('input[name="serviceMode"]');

    modeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            updateModePreview(this.value);
        });
    });
}

function updateModePreview(mode) {
    const summaryMode = document.getElementById('summaryMode');
    const summaryPrice = document.getElementById('summaryPrice');

    if (summaryMode) {
        summaryMode.textContent = mode === 'domicilio' ? 'Solo a domicilio' : 'Solo presso studio';
    }

    if (summaryPrice) {
        summaryPrice.textContent = mode === 'domicilio' ? '€70 + trasferta' : '€70 fisso';
    }
}

// ===============================================
// PREVIEW E RIEPILOGO
// ===============================================
function updateConfigurationPreview() {
    updateSummaryTime();
    updateSummaryZone();
    updateServicesPreview();
    updateModePreview(lastMinuteState.configuration.mode);
}

function updateSummaryTime() {
    const summaryTime = document.getElementById('summaryTime');
    if (summaryTime) {
        const start = lastMinuteState.configuration.startTime === 'now+30' ?
            formatTime(new Date(Date.now() + 30 * 60000)) :
            lastMinuteState.configuration.startTime;

        const end = lastMinuteState.configuration.endTime;
        const duration = calculateTimeDuration(start, end);

        summaryTime.textContent = `Dalle ${start} alle ${end} (${formatDuration(duration)})`;
    }
}

function updateSummaryZone() {
    const summaryZone = document.getElementById('summaryZone');
    if (summaryZone) {
        summaryZone.textContent = `Cagliari centro, raggio ${lastMinuteState.configuration.zone}km`;
    }
}

function formatTime(date) {
    return date.toTimeString().slice(0, 5);
}

// ===============================================
// ATTIVAZIONE LAST MINUTE
// ===============================================
function activateLastMinute() {
    if (!validateCurrentStep()) {
        return;
    }

    // Simula attivazione
    lastMinuteState.isActive = true;
    lastMinuteState.isConfiguring = false;

    // Nascondi configurazione e mostra dashboard attiva
    const configCard = document.getElementById('lastMinuteConfigCard');
    const activeCard = document.getElementById('lastMinuteActiveCard');

    if (configCard) configCard.style.display = 'none';
    if (activeCard) {
        activeCard.style.display = 'block';
        activeCard.style.animation = 'slideInUp 0.5s ease-out';
    }

    // Aggiorna stato principale
    updateMainLastMinuteStatus(true);

    // Avvia simulazioni live
    startLiveSimulations();

    showNotification('🚀 Last Minute ATTIVATO! Ora sei visibile ai clienti', 'success');

    // In produzione: chiamata API
    // activateLastMinuteAPI(lastMinuteState.configuration);
}

// ===============================================
// DASHBOARD ATTIVA
// ===============================================
function showActiveLastMinuteDashboard() {
    const mainCard = document.querySelector('.lastminute-main-card');
    const activeCard = document.getElementById('lastMinuteActiveCard');

    if (mainCard) mainCard.style.display = 'none';
    if (activeCard) {
        activeCard.style.display = 'block';
        activeCard.style.animation = 'slideInUp 0.5s ease-out';
    }
}

function deactivateLastMinute() {
    if (confirm('Sei sicuro di voler disattivare il Last Minute?')) {
        lastMinuteState.isActive = false;

        // Mostra main card e nascondi dashboard attiva
        const mainCard = document.querySelector('.lastminute-main-card');
        const activeCard = document.getElementById('lastMinuteActiveCard');

        if (activeCard) activeCard.style.display = 'none';
        if (mainCard) {
            mainCard.style.display = 'block';
            mainCard.style.animation = 'slideInUp 0.5s ease-out';
        }

        // Ferma simulazioni
        stopLiveSimulations();

        updateMainLastMinuteStatus(false);
        showNotification('Last Minute disattivato', 'info');
    }
}

// ===============================================
// GESTIONE RICHIESTE LIVE
// ===============================================
function acceptRequest(requestId) {
    if (confirm('Accetti questa richiesta Last Minute?')) {
        // Rimuovi richiesta dalla lista
        const requestElement = document.querySelector(`[data-request-id="${requestId}"]`);
        if (requestElement) {
            requestElement.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                requestElement.remove();
            }, 500);
        }

        // Aggiorna statistiche
        updateLiveStat('requests', -1);
        updateLiveStat('potentialEarnings', +80);

        showNotification('✅ Richiesta accettata! Cliente contattato automaticamente', 'success');

        // In produzione: API call + notifica cliente
        // acceptRequestAPI(requestId);
    }
}

function declineRequest(requestId) {
    // Rimuovi richiesta dalla lista
    const requestElement = document.querySelector(`[data-request-id="${requestId}"]`);
    if (requestElement) {
        requestElement.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            requestElement.remove();
        }, 300);
    }

    updateLiveStat('requests', -1);
    showNotification('Richiesta rifiutata', 'info');
}

// ===============================================
// SIMULAZIONI LIVE (DEVELOPMENT)
// ===============================================
function startLiveSimulations() {
    // Simula incremento visualizzazioni
    lastMinuteState.viewsInterval = setInterval(() => {
        const increment = Math.floor(Math.random() * 3) + 1;
        updateLiveStat('views', increment);
    }, 15000); // Ogni 15 secondi

    // Simula nuove richieste
    lastMinuteState.requestsInterval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% probabilità
            generateNewRequest();
        }
    }, 45000); // Ogni 45 secondi

    // Countdown tempo rimanente
    startTimeCountdown();
}

function stopLiveSimulations() {
    if (lastMinuteState.viewsInterval) {
        clearInterval(lastMinuteState.viewsInterval);
    }
    if (lastMinuteState.requestsInterval) {
        clearInterval(lastMinuteState.requestsInterval);
    }
    if (lastMinuteState.countdownInterval) {
        clearInterval(lastMinuteState.countdownInterval);
    }
}

function updateLiveStat(statName, value) {
    const element = document.getElementById(`live${statName.charAt(0).toUpperCase() + statName.slice(1)}`);

    if (element) {
        const currentValue = parseInt(element.textContent) || 0;
        const newValue = Math.max(0, currentValue + value);

        element.textContent = newValue;
        element.style.animation = 'pulse 0.5s ease-out';

        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
}

function generateNewRequest() {
    const names = ['Maria R.', 'Luca M.', 'Anna T.', 'Paolo S.', 'Elena V.'];
    const services = ['Massaggio Svedese', 'Massaggio Decontratturante', 'Massaggio Hot Stone'];
    const prices = [80, 100, 120];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomService = services[Math.floor(Math.random() * services.length)];
    const randomPrice = prices[Math.floor(Math.random() * prices.length)];
    const requestId = 'req_' + Date.now();

    const requestsContainer = document.getElementById('requestsContainer');
    if (!requestsContainer) return;

    const requestElement = document.createElement('div');
    requestElement.className = 'request-item';
    requestElement.setAttribute('data-request-id', requestId);
    requestElement.innerHTML = `
        <div class="request-info">
            <div class="client-name">${randomName}</div>
            <div class="request-service">${randomService}</div>
            <div class="request-time">Richiesto ora</div>
            <div class="request-details">A domicilio • €${randomPrice} totale</div>
        </div>
        <div class="request-actions">
            <button class="btn-accept" onclick="acceptRequest('${requestId}')">
                ✅ ACCETTA
            </button>
            <button class="btn-decline" onclick="declineRequest('${requestId}')">
                ❌ RIFIUTA
            </button>
        </div>
    `;

    requestsContainer.insertBefore(requestElement, requestsContainer.firstChild);
    updateLiveStat('requests', 1);

    // Notifica sonora (in produzione)
    showNotification(`💡 Nuova richiesta da ${randomName}`, 'info');
}

function startTimeCountdown() {
    // Simula countdown da 4:15 (4 ore 15 minuti)
    let totalMinutes = 4 * 60 + 15;

    lastMinuteState.countdownInterval = setInterval(() => {
        totalMinutes--;

        if (totalMinutes <= 0) {
            // Tempo scaduto
            deactivateLastMinute();
            showNotification('⏰ Tempo Last Minute scaduto', 'warning');
            return;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const timeString = `${hours}:${minutes.toString().padStart(2, '0')}`;

        const timeElement = document.getElementById('timeRemaining');
        if (timeElement) {
            timeElement.textContent = timeString;

            // Cambia colore quando urgente
            if (totalMinutes <= 15) {
                timeElement.style.color = '#ef4444';
            } else if (totalMinutes <= 60) {
                timeElement.style.color = '#f59e0b';
            }
        }
    }, 60000); // Ogni minuto
}

// ===============================================
// SETUP AGGIORNAMENTI LIVE
// ===============================================
function setupLiveUpdates() {
    // Inizializza con valori predefiniti
    updateLiveStat('views', 24);
    updateLiveStat('requests', 3);
    updateLiveStat('potentialEarnings', 280);

    const timeElement = document.getElementById('timeRemaining');
    if (timeElement) {
        timeElement.textContent = '4:15';
    }
}

// ===============================================
// GESTIONE STATO PRINCIPALE
// ===============================================
function updateMainLastMinuteStatus(isActive) {
    const statusElement = document.getElementById('lastMinuteMainStatus');
    const toggleButton = document.getElementById('mainLastMinuteToggle');

    if (statusElement) {
        if (isActive) {
            statusElement.className = 'status-online-main';
            statusElement.textContent = 'ONLINE';
        } else {
            statusElement.className = 'status-offline-main';
            statusElement.textContent = 'OFFLINE';
        }
    }

    if (toggleButton) {
        const toggleText = toggleButton.querySelector('.toggle-text');
        const toggleSubtitle = toggleButton.querySelector('.toggle-subtitle');

        if (isActive) {
            if (toggleText) toggleText.textContent = 'GESTISCI LAST MINUTE';
            if (toggleSubtitle) toggleSubtitle.textContent = 'Dashboard attiva - Ricevi richieste';
            toggleButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        } else {
            if (toggleText) toggleText.textContent = 'ATTIVA LAST MINUTE';
            if (toggleSubtitle) toggleSubtitle.textContent = 'Configurazione rapida in 2 minuti';
            toggleButton.style.background = 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-dark) 100%)';
        }
    }
}

// ===============================================
// SALVATAGGIO CONFIGURAZIONE
// ===============================================
function saveConfiguration() {
    try {
        localStorage.setItem('relaxpoint_lastminute_config', JSON.stringify(lastMinuteState.configuration));
    } catch (error) {
        console.warn('Impossibile salvare configurazione Last Minute:', error);
    }
}

function loadSavedConfiguration() {
    try {
        const saved = localStorage.getItem('relaxpoint_lastminute_config');
        if (saved) {
            lastMinuteState.configuration = { ...lastMinuteState.configuration, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.warn('Impossibile caricare configurazione salvata:', error);
    }
}

// ===============================================
// NOTIFICHE SYSTEM
// ===============================================
function showNotification(message, type = 'info') {
    if (window.showBusinessNotification) {
        window.showBusinessNotification(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// ===============================================
// API PUBBLICHE GLOBALI
// ===============================================
window.toggleLastMinuteMode = toggleLastMinuteMode;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.setZone = setZone;
window.activateLastMinute = activateLastMinute;
window.deactivateLastMinute = deactivateLastMinute;
window.acceptRequest = acceptRequest;
window.declineRequest = declineRequest;

// ===============================================
// CSS ANIMATIONS DINAMICHE
// ===============================================
const lastMinuteStyles = `
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
`;

// Aggiungi stili se non esistono
if (!document.querySelector('#lastminute-js-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'lastminute-js-styles';
    styleSheet.textContent = lastMinuteStyles;
    document.head.appendChild(styleSheet);
}

console.log('[FAST] Last Minute JavaScript caricato completamente');
console.log('[EVENT] Funzioni Last Minute disponibili:', {
    toggleLastMinuteMode: typeof toggleLastMinuteMode,
    activateLastMinute: typeof activateLastMinute,
    acceptRequest: typeof acceptRequest,
    deactivateLastMinute: typeof deactivateLastMinute
});