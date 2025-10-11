/* ===============================================
   RELAXPOINT - JS LIVE & CORSI
   Gestione dashboard live e corsi professionista
   =============================================== */

// Dati demo
const demoLiveData = [
    {
        id: 1,
        title: 'Yoga per il Risveglio Mattutino',
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Tra 2 ore
        duration: 60,
        enrolled: 24,
        maxParticipants: 30,
        streamUrl: 'https://zoom.us/j/example1',
        status: 'scheduled'
    },
    {
        id: 2,
        title: 'Meditazione Guidata Serale',
        dateTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // Tra 5 ore
        duration: 45,
        enrolled: 18,
        maxParticipants: 25,
        streamUrl: 'https://zoom.us/j/example2',
        status: 'scheduled'
    },
    {
        id: 3,
        title: 'Pilates per la Schiena',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Domani
        duration: 90,
        enrolled: 15,
        maxParticipants: 20,
        streamUrl: 'https://zoom.us/j/example3',
        status: 'scheduled'
    }
];

let countdownIntervals = [];

document.addEventListener('DOMContentLoaded', function () {
    console.log('Live & Corsi - Dashboard caricata');

    initializeTabs();
    loadLiveData();
    loadCorsiData();
});

// ===============================================
// GESTIONE TAB
// ===============================================
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // Rimuovi active da tutti
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Aggiungi active al selezionato
            this.classList.add('active');
            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }

            console.log('Tab attivo:', tabId);
        });
    });
}

// ===============================================
// CARICAMENTO LIVE PROGRAMMATE
// ===============================================
function loadLiveData() {
    const liveList = document.getElementById('liveList');

    if (!liveList) return;

    // Ordina per data
    const sortedLives = demoLiveData.sort((a, b) => a.dateTime - b.dateTime);

    if (sortedLives.length === 0) {
        liveList.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
                <p style="font-weight: 600;">Nessuna live programmata</p>
                <p style="font-size: 14px;">Crea una nuova live dal calendario</p>
            </div>
        `;
        return;
    }

    liveList.innerHTML = sortedLives.map(live => createLiveCard(live)).join('');

    // Inizia countdown per ogni live
    sortedLives.forEach(live => {
        startCountdown(live.id, live.dateTime);
    });
}

function createLiveCard(live) {
    const now = new Date();
    const isLiveNow = Math.abs(live.dateTime - now) < 15 * 60 * 1000; // Entro 15 min
    const isPast = live.dateTime < now;

    const badgeClass = isLiveNow ? 'badge-live' : isPast ? 'badge-ended' : 'badge-scheduled';
    const badgeText = isLiveNow ? 'In Onda' : isPast ? 'Terminata' : 'Programmata';
    const cardClass = isLiveNow ? 'live-now' : '';
    const iconClass = isLiveNow ? 'live-now' : '';

    return `
        <div class="live-card ${cardClass}">
            <div class="live-icon ${iconClass}">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
            </div>

            <div class="live-info">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <h3 class="live-title">${live.title}</h3>
                    <span class="live-badge ${badgeClass}">${badgeText}</span>
                </div>

                <div class="live-details">
                    <div class="live-detail-item">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        <span>${formatDateTime(live.dateTime)}</span>
                    </div>
                    <div class="live-detail-item">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>${live.enrolled}/${live.maxParticipants} iscritti</span>
                    </div>
                    <div class="live-detail-item">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        <span>${live.duration} min</span>
                    </div>
                </div>
            </div>

            <div class="live-countdown" id="countdown-${live.id}">
                <div class="countdown-label">Inizia tra</div>
                <div class="countdown-time">--:--:--</div>
            </div>

            <div class="live-actions">
                <button class="btn-go-live" ${!isLiveNow ? 'disabled' : ''} onclick="goLive('${live.streamUrl}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    ${isLiveNow ? 'Vai Live' : 'Non Disponibile'}
                </button>
                <button class="btn-manage" onclick="manageLive(${live.id})">Gestisci</button>
            </div>
        </div>
    `;
}

function startCountdown(liveId, targetDate) {
    const countdownElement = document.getElementById(`countdown-${liveId}`);
    if (!countdownElement) return;

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(interval);
            countdownElement.querySelector('.countdown-time').textContent = 'In corso';
            countdownElement.querySelector('.countdown-label').textContent = 'Stato';
            return;
        }

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.querySelector('.countdown-time').textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);

    countdownIntervals.push(interval);
}

function formatDateTime(date) {
    const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('it-IT', options);
}

function goLive(url) {
    window.open(url, '_blank');
    showNotification('Apertura piattaforma streaming...', 'success');
}

function manageLive(liveId) {
    // Reindirizza al calendario con l'evento specifico
    window.location.href = `calendario.html?event=${liveId}&action=edit`;
}

// ===============================================
// CARICAMENTO CORSI
// ===============================================
const demoCorsiData = [
    {
        id: 1,
        title: 'Yoga Integrale - Livello Base',
        subtitle: '8 settimane • 16 lezioni',
        enrolled: 22,
        lessons: 16,
        completedLessons: 6,
        materials: 12,
        iscritti: [
            { id: 1, nome: 'Maria', cognome: 'Rossi', email: 'maria.rossi@email.com', presenze: 6, totale: 6 },
            { id: 2, nome: 'Luca', cognome: 'Bianchi', email: 'luca.b@email.com', presenze: 5, totale: 6 },
            { id: 3, nome: 'Sofia', cognome: 'Verdi', email: 'sofia.v@email.com', presenze: 6, totale: 6 },
            { id: 4, nome: 'Marco', cognome: 'Neri', email: 'marco.neri@email.com', presenze: 4, totale: 6 },
            { id: 5, nome: 'Giulia', cognome: 'Ferrari', email: 'giulia.f@email.com', presenze: 6, totale: 6 }
        ]
    },
    {
        id: 2,
        title: 'Meditazione Mindfulness',
        subtitle: '4 settimane • 8 lezioni',
        enrolled: 18,
        lessons: 8,
        completedLessons: 3,
        materials: 8,
        iscritti: [
            { id: 6, nome: 'Alessandro', cognome: 'Ricci', email: 'ale.ricci@email.com', presenze: 3, totale: 3 },
            { id: 7, nome: 'Francesca', cognome: 'Galli', email: 'fra.galli@email.com', presenze: 2, totale: 3 },
            { id: 8, nome: 'Davide', cognome: 'Conti', email: 'davide.c@email.com', presenze: 3, totale: 3 }
        ]
    },
    {
        id: 3,
        title: 'Pilates Avanzato',
        subtitle: '6 settimane • 12 lezioni',
        enrolled: 15,
        lessons: 12,
        completedLessons: 8,
        materials: 15,
        iscritti: [
            { id: 9, nome: 'Elena', cognome: 'Romano', email: 'elena.r@email.com', presenze: 8, totale: 8 },
            { id: 10, nome: 'Simone', cognome: 'Marino', email: 'simone.m@email.com', presenze: 7, totale: 8 }
        ]
    }
];

let currentCorso = null;

function loadCorsiData() {
    const corsiList = document.getElementById('corsiList');

    if (!corsiList) return;

    if (demoCorsiData.length === 0) {
        corsiList.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
                <p style="font-weight: 600;">Nessun corso attivo</p>
                <p style="font-size: 14px;">Crea un nuovo corso dal calendario</p>
            </div>
        `;
        return;
    }

    corsiList.innerHTML = demoCorsiData.map(corso => createCorsoCard(corso)).join('');
}

function createCorsoCard(corso) {
    const progress = Math.round((corso.completedLessons / corso.lessons) * 100);

    return `
        <div class="corso-card">
            <div class="corso-header">
                <div class="corso-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                    </svg>
                </div>
                <div style="flex: 1;">
                    <h3 class="corso-title">${corso.title}</h3>
                    <p class="corso-subtitle">${corso.subtitle}</p>
                </div>
            </div>

            <div class="corso-stats">
                <div class="corso-stat">
                    <div class="corso-stat-value">${corso.enrolled}</div>
                    <div class="corso-stat-label">Iscritti</div>
                </div>
                <div class="corso-stat">
                    <div class="corso-stat-value">${corso.completedLessons}/${corso.lessons}</div>
                    <div class="corso-stat-label">Lezioni</div>
                </div>
                <div class="corso-stat">
                    <div class="corso-stat-value">${progress}%</div>
                    <div class="corso-stat-label">Progresso</div>
                </div>
            </div>

            <div class="corso-actions">
                <button class="btn-corso-action" onclick="openModalIscritti(${corso.id})">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                    <span>Iscritti</span>
                </button>
                <button class="btn-corso-action" onclick="openModalMateriali(${corso.id})">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    <span>Materiali</span>
                </button>
                <button class="btn-corso-action" onclick="openModalBroadcast(${corso.id})">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                    <span>Messaggio</span>
                </button>
            </div>
        </div>
    `;
}

// ===============================================
// MODALI - GESTIONE
// ===============================================
function openModalIscritti(corsoId) {
    const corso = demoCorsiData.find(c => c.id === corsoId);
    if (!corso) return;

    currentCorso = corso;

    const modal = document.getElementById('modalIscritti');
    const content = document.getElementById('iscrittiContent');

    content.innerHTML = `
        <div style="margin-bottom: 16px;">
            <h4 style="margin: 0 0 8px 0;">Corso: ${corso.title}</h4>
            <p style="color: var(--color-secondary); margin: 0;">Totale iscritti: ${corso.iscritti.length}</p>
        </div>

        <table class="iscritti-table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Presenze</th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
                ${corso.iscritti.map(iscritto => {
        const percentage = Math.round((iscritto.presenze / iscritto.totale) * 100);
        const badgeClass = percentage >= 80 ? 'presenza-high' :
            percentage >= 50 ? 'presenza-medium' : 'presenza-low';

        return `
                        <tr>
                            <td><strong>${iscritto.nome} ${iscritto.cognome}</strong></td>
                            <td>${iscritto.email}</td>
                            <td>${iscritto.presenze}/${iscritto.totale}</td>
                            <td><span class="presenza-badge ${badgeClass}">${percentage}%</span></td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;

    modal.classList.add('active');
}

function openModalMateriali(corsoId) {
    const corso = demoCorsiData.find(c => c.id === corsoId);
    if (!corso) return;

    currentCorso = corso;

    const modal = document.getElementById('modalMateriali');
    const fileInput = document.getElementById('fileInput');

    // Reset
    fileInput.value = '';
    document.getElementById('filesList').innerHTML = '';

    // File change handler
    fileInput.onchange = function (e) {
        const files = Array.from(e.target.files);
        const filesList = document.getElementById('filesList');

        filesList.innerHTML = files.map((file, index) => `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; margin-bottom: 8px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="color: var(--color-primary);">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 14px;">${file.name}</div>
                    <div style="font-size: 12px; color: var(--color-secondary);">${formatFileSize(file.size)}</div>
                </div>
            </div>
        `).join('');
    };

    modal.classList.add('active');
}

function openModalBroadcast(corsoId) {
    const corso = demoCorsiData.find(c => c.id === corsoId);
    if (!corso) return;

    currentCorso = corso;

    const modal = document.getElementById('modalBroadcast');

    // Reset
    document.getElementById('messageSubject').value = '';
    document.getElementById('messageBody').value = '';
    document.getElementById('recipientsCount').textContent = corso.iscritti.length;

    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    currentCorso = null;
}

// Chiudi modal cliccando fuori
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ===============================================
// AZIONI MODALI
// ===============================================
function uploadMateriali() {
    const fileInput = document.getElementById('fileInput');
    const unlockCondition = document.getElementById('unlockCondition').value;

    if (fileInput.files.length === 0) {
        showNotification('Seleziona almeno un file', 'warning');
        return;
    }

    // Simula upload
    showNotification(`${fileInput.files.length} file caricati con successo! Condizione: ${unlockCondition}`, 'success');
    closeModal('modalMateriali');
}

function sendBroadcast() {
    const subject = document.getElementById('messageSubject').value;
    const body = document.getElementById('messageBody').value;

    if (!subject || !body) {
        showNotification('Compila tutti i campi', 'warning');
        return;
    }

    showNotification(`Messaggio inviato a ${currentCorso.iscritti.length} iscritti!`, 'success');
    closeModal('modalBroadcast');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ===============================================
// STORICO
// ===============================================
const demoStoricoData = [
    { id: 1, type: 'live', title: 'Yoga Mattutino', date: new Date(2025, 9, 5), partecipanti: 28, durata: 60, rating: 4.8 },
    { id: 2, type: 'corso', title: 'Pilates Base - Completato', date: new Date(2025, 8, 20), partecipanti: 15, durata: 720, rating: 4.9 },
    { id: 3, type: 'live', title: 'Meditazione Serale', date: new Date(2025, 9, 8), partecipanti: 22, durata: 45, rating: 4.7 },
    { id: 4, type: 'corso', title: 'Yoga Avanzato - Completato', date: new Date(2025, 7, 15), partecipanti: 12, durata: 960, rating: 5.0 },
    { id: 5, type: 'live', title: 'Stretching Dinamico', date: new Date(2025, 9, 9), partecipanti: 19, durata: 30, rating: 4.6 }
];

function loadStorico() {
    const storicoList = document.getElementById('storicoList');
    if (!storicoList) return;

    filterStorico();
}

function filterStorico() {
    const storicoList = document.getElementById('storicoList');
    const filter = document.getElementById('storicoFilter')?.value || 'all';

    const filtered = filter === 'all' ? demoStoricoData :
        demoStoricoData.filter(item => item.type === filter.replace('corsi', 'corso'));

    if (filtered.length === 0) {
        storicoList.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                </svg>
                <p style="font-weight: 600;">Nessun elemento nello storico</p>
            </div>
        `;
        return;
    }

    storicoList.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            ${filtered.map(item => createStoricoItem(item)).join('')}
        </div>
    `;
}

function createStoricoItem(item) {
    const typeLabel = item.type === 'live' ? 'Live' : 'Corso';
    const typeColor = item.type === 'live' ? '#ef4444' : '#10b981';
    const icon = item.type === 'live' ?
        '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>' :
        '<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />';

    return `
        <div style="background: white; border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; display: flex; gap: 16px; align-items: center; transition: all 0.3s ease;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
            <div style="width: 48px; height: 48px; border-radius: 10px; background: linear-gradient(135deg, ${typeColor}, ${typeColor}dd); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">${icon}</svg>
            </div>
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
                    <h4 style="margin: 0; font-size: 16px; font-weight: 700;">${item.title}</h4>
                    <span style="background: ${typeColor}15; color: ${typeColor}; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 8px; text-transform: uppercase;">${typeLabel}</span>
                </div>
                <div style="display: flex; gap: 20px; font-size: 13px; color: var(--color-secondary);">
                    <span>📅 ${item.date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>👥 ${item.partecipanti} partecipanti</span>
                    <span>⏱️ ${item.durata >= 60 ? Math.round(item.durata / 60) + 'h' : item.durata + 'min'}</span>
                </div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 700; color: #f59e0b;">${item.rating.toFixed(1)}</div>
                <div style="font-size: 11px; color: var(--color-secondary); text-transform: uppercase; margin-top: 4px;">Rating</div>
            </div>
        </div>
    `;
}

// ===============================================
// STATISTICHE
// ===============================================
function loadStatistiche() {
    // Calcola statistiche dai dati
    const totalLive = demoLiveData.length + demoStoricoData.filter(s => s.type === 'live').length;
    const totalCorsi = demoCorsiData.length + demoStoricoData.filter(s => s.type === 'corso').length;
    const totalPartecipanti = demoCorsiData.reduce((sum, c) => sum + c.enrolled, 0) +
                              demoStoricoData.reduce((sum, s) => sum + s.partecipanti, 0);
    const avgRating = (demoStoricoData.reduce((sum, s) => sum + s.rating, 0) / demoStoricoData.length).toFixed(1);
    const totalHours = Math.round(demoStoricoData.reduce((sum, s) => sum + s.durata, 0) / 60);
    const completionRate = Math.round((demoCorsiData.reduce((sum, c) => sum + (c.completedLessons / c.lessons), 0) / demoCorsiData.length) * 100);

    // Aggiorna DOM
    document.getElementById('statLiveTotal').textContent = totalLive;
    document.getElementById('statCorsiTotal').textContent = totalCorsi;
    document.getElementById('statPartecipanti').textContent = totalPartecipanti;
    document.getElementById('statRating').textContent = avgRating;
    document.getElementById('statCompletionRate').textContent = completionRate + '%';
    document.getElementById('statOreMedie').textContent = totalHours + 'h';
}

// Inizializza tutto al caricamento
document.addEventListener('DOMContentLoaded', function () {
    loadStorico();
    loadStatistiche();
});

// ===============================================
// UTILITY FUNCTIONS
// ===============================================
function showNotification(message, type = 'info') {
    // Placeholder per notifiche
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message);
}
