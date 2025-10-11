/* ===============================================
   RELAXPOINT - JS CONSULENZE
   Dashboard professionista per gestione consulenze
   =============================================== */

// Dati demo consulenze prenotate
const demoConsulenzeData = [
    {
        id: 1,
        tipoConsulenza: 'Prima Valutazione Nutrizionale',
        cliente: {
            nome: 'Maria Rossi',
            email: 'maria.rossi@email.com',
            telefono: '+39 345 678 9012',
            avatar: null
        },
        dataOra: new Date(Date.now() + 3 * 60 * 60 * 1000), // Tra 3 ore
        durata: 45,
        modalita: 'videocall',
        linkVideocall: 'https://zoom.us/j/example123',
        indirizzo: null,
        prezzo: 60,
        status: 'confermata',
        documentiCliente: ['analisi_sangue.pdf', 'diario_alimentare.pdf'],
        documentiProfessionista: [],
        note: 'Prima visita, portare referti medici recenti'
    },
    {
        id: 2,
        tipoConsulenza: 'Consulenza Approfondita',
        cliente: {
            nome: 'Luca Bianchi',
            email: 'luca.bianchi@email.com',
            telefono: '+39 342 123 4567',
            avatar: null
        },
        dataOra: new Date(Date.now() + 24 * 60 * 60 * 1000), // Domani
        durata: 105,
        modalita: 'studio',
        linkVideocall: null,
        indirizzo: 'Via Roma 123, Milano',
        prezzo: 120,
        status: 'confermata',
        documentiCliente: [],
        documentiProfessionista: [],
        note: ''
    },
    {
        id: 3,
        tipoConsulenza: 'Prima Valutazione Nutrizionale',
        cliente: {
            nome: 'Anna Verdi',
            email: 'anna.verdi@email.com',
            telefono: '+39 348 987 6543',
            avatar: null
        },
        dataOra: new Date(Date.now() + 48 * 60 * 60 * 1000), // Tra 2 giorni
        durata: 45,
        modalita: 'domicilio',
        linkVideocall: null,
        indirizzo: 'Via Garibaldi 45, Milano',
        prezzo: 80,
        status: 'confermata',
        documentiCliente: ['questionario_salute.pdf'],
        documentiProfessionista: [],
        note: 'Cliente preferisce consulenza a domicilio'
    }
];

// Storico consulenze
const storicoConsulenzeData = [
    {
        id: 101,
        tipoConsulenza: 'Prima Valutazione Nutrizionale',
        cliente: {
            nome: 'Giuseppe Neri',
            email: 'giuseppe.neri@email.com'
        },
        dataOra: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 giorni fa
        durata: 45,
        modalita: 'videocall',
        prezzo: 60,
        status: 'completata',
        rating: 5
    },
    {
        id: 102,
        tipoConsulenza: 'Consulenza Approfondita',
        cliente: {
            nome: 'Sofia Romano',
            email: 'sofia.romano@email.com'
        },
        dataOra: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 giorni fa
        durata: 105,
        modalita: 'studio',
        prezzo: 120,
        status: 'completata',
        rating: 5
    }
];

let countdownIntervals = [];

document.addEventListener('DOMContentLoaded', function () {
    console.log('Consulenze - Dashboard caricata');

    initializeTabs();
    loadConsulenzeData();
    loadStoricoData();
    loadStatistiche();
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
// CARICAMENTO PROSSIME CONSULENZE
// ===============================================
function loadConsulenzeData() {
    const consulenzeList = document.getElementById('consulenzeList');

    if (!consulenzeList) return;

    // Ordina per data
    const sortedConsulenze = demoConsulenzeData.sort((a, b) => a.dataOra - b.dataOra);

    if (sortedConsulenze.length === 0) {
        consulenzeList.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p style="font-weight: 600;">Nessuna consulenza in programma</p>
                <p style="font-size: 14px;">Le consulenze prenotate dai clienti appariranno qui</p>
            </div>
        `;
        return;
    }

    // Stoppa countdown esistenti
    countdownIntervals.forEach(interval => clearInterval(interval));
    countdownIntervals = [];

    // Genera HTML
    consulenzeList.innerHTML = sortedConsulenze.map(consulenza => createConsulenzaCard(consulenza)).join('');

    // Inizializza countdown
    sortedConsulenze.forEach(consulenza => {
        const countdownElement = document.getElementById(`countdown-${consulenza.id}`);
        if (countdownElement) {
            const interval = setInterval(() => updateCountdown(consulenza.id, consulenza.dataOra), 1000);
            countdownIntervals.push(interval);
            updateCountdown(consulenza.id, consulenza.dataOra);
        }
    });
}

// ===============================================
// CREA CARD CONSULENZA
// ===============================================
function createConsulenzaCard(consulenza) {
    const now = new Date();
    const diffMs = consulenza.dataOra - now;
    const diffMinutes = Math.floor(diffMs / 60000);

    const isNow = diffMinutes >= 0 && diffMinutes <= 15;
    const isPast = diffMinutes < 0;

    const modalitaIcons = {
        videocall: '📹 Videocall',
        studio: '🏢 In studio',
        domicilio: '🏠 A domicilio'
    };

    const modalitaInfo = modalitaIcons[consulenza.modalita] || consulenza.modalita;

    let statusBadge = '';
    if (isNow) {
        statusBadge = '<span class="live-badge badge-live">IN CORSO</span>';
    } else if (isPast) {
        statusBadge = '<span class="live-badge badge-ended">CONCLUSA</span>';
    } else {
        statusBadge = '<span class="live-badge badge-scheduled">CONFERMATA</span>';
    }

    // Documenti cliente
    let documentiHTML = '';
    if (consulenza.documentiCliente && consulenza.documentiCliente.length > 0) {
        documentiHTML = `
            <div class="live-detail-item" style="color: #10b981;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <span>${consulenza.documentiCliente.length} documento/i</span>
            </div>
        `;
    }

    return `
        <div class="live-card ${isNow ? 'live-now' : ''}" data-consulenza-id="${consulenza.id}">
            <div class="live-icon ${isNow ? 'live-now' : ''}">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
            </div>

            <div class="live-info">
                <h3 class="live-title">${consulenza.tipoConsulenza}</h3>
                ${statusBadge}

                <div class="live-details">
                    <div class="live-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>${consulenza.cliente.nome}</span>
                    </div>

                    <div class="live-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        <span>${consulenza.durata} minuti</span>
                    </div>

                    <div class="live-detail-item">
                        <span>${modalitaInfo}</span>
                    </div>

                    ${documentiHTML}
                </div>
            </div>

            <div class="live-countdown">
                <div class="countdown-label">Tra</div>
                <div class="countdown-time" id="countdown-${consulenza.id}">--:--:--</div>
            </div>

            <div class="live-actions">
                ${isNow && consulenza.modalita === 'videocall' ? `
                    <button class="btn-go-live" onclick="window.open('${consulenza.linkVideocall}', '_blank')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                        </svg>
                        Entra in Videocall
                    </button>
                ` : ''}
                <button class="btn-manage" onclick="window.viewConsulenzaDetails(${consulenza.id})">
                    Vedi Dettagli
                </button>
            </div>
        </div>
    `;
}

// ===============================================
// COUNTDOWN
// ===============================================
function updateCountdown(consulenzaId, targetDate) {
    const countdownElement = document.getElementById(`countdown-${consulenzaId}`);
    if (!countdownElement) return;

    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        countdownElement.textContent = 'Iniziata';
        return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ===============================================
// STORICO CONSULENZE
// ===============================================
function loadStoricoData() {
    const storicoList = document.getElementById('storicoList');
    if (!storicoList) return;

    if (storicoConsulenzeData.length === 0) {
        storicoList.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p style="font-weight: 600;">Nessuna consulenza completata</p>
                <p style="font-size: 14px;">Le consulenze passate appariranno qui</p>
            </div>
        `;
        return;
    }

    const sortedStorico = storicoConsulenzeData.sort((a, b) => b.dataOra - a.dataOra);

    storicoList.innerHTML = sortedStorico.map(consulenza => createStoricoCard(consulenza)).join('');
}

function createStoricoCard(consulenza) {
    const dateStr = consulenza.dataOra.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const modalitaIcons = {
        videocall: '📹',
        studio: '🏢',
        domicilio: '🏠'
    };

    const stars = '⭐'.repeat(consulenza.rating || 0);

    return `
        <div class="live-card" style="opacity: 0.85;">
            <div class="live-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
            </div>

            <div class="live-info">
                <h3 class="live-title">${consulenza.tipoConsulenza}</h3>
                <span class="live-badge badge-ended">COMPLETATA</span>

                <div class="live-details">
                    <div class="live-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>${consulenza.cliente.nome}</span>
                    </div>

                    <div class="live-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                        </svg>
                        <span>${dateStr}</span>
                    </div>

                    <div class="live-detail-item">
                        <span>${modalitaIcons[consulenza.modalita]}</span>
                        <span>${consulenza.durata} min</span>
                    </div>

                    ${consulenza.rating ? `
                        <div class="live-detail-item" style="color: #f59e0b;">
                            <span>${stars}</span>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div style="text-align: right; min-width: 120px;">
                <div style="font-size: 24px; font-weight: 700; color: var(--color-primary);">€${consulenza.prezzo}</div>
                <button class="btn-manage" onclick="window.viewConsulenzaDetails(${consulenza.id})" style="margin-top: 12px;">
                    Vedi Dettagli
                </button>
            </div>
        </div>
    `;
}

// ===============================================
// FILTRI STORICO
// ===============================================
window.filterStorico = function() {
    const filter = document.getElementById('storicoFilter').value;
    console.log('Filtro storico:', filter);

    // TODO: Implementare filtro reale
    alert(`Filtro "${filter}" applicato`);
}

// ===============================================
// STATISTICHE
// ===============================================
function loadStatistiche() {
    const totalConsulenze = demoConsulenzeData.length + storicoConsulenzeData.length;
    const clientiUnici = new Set([
        ...demoConsulenzeData.map(c => c.cliente.email),
        ...storicoConsulenzeData.map(c => c.cliente.email)
    ]).size;

    const fatturato = [...demoConsulenzeData, ...storicoConsulenzeData]
        .reduce((sum, c) => sum + c.prezzo, 0);

    const ratings = storicoConsulenzeData
        .filter(c => c.rating)
        .map(c => c.rating);
    const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
        : '0.0';

    // Aggiorna UI
    const statTotal = document.getElementById('statConsulenzeTotal');
    const statClienti = document.getElementById('statClientiUnici');
    const statFatturato = document.getElementById('statFatturato');
    const statRating = document.getElementById('statRating');

    if (statTotal) statTotal.textContent = totalConsulenze;
    if (statClienti) statClienti.textContent = clientiUnici;
    if (statFatturato) statFatturato.textContent = `€${fatturato}`;
    if (statRating) statRating.textContent = avgRating;
}

// ===============================================
// AZIONI - TUTTE LE FUNZIONI SONO GLOBALI
// ===============================================
let consulenzaCorrente = null;

window.viewConsulenzaDetails = function(id) {
    console.log('viewConsulenzaDetails chiamata con id:', id);

    // Cerca consulenza in entrambi gli array
    let consulenza = demoConsulenzeData.find(c => c.id === id);
    if (!consulenza) {
        consulenza = storicoConsulenzeData.find(c => c.id === id);
    }

    if (!consulenza) {
        alert('Consulenza non trovata');
        return;
    }

    consulenzaCorrente = consulenza;

    // Popola modal
    document.getElementById('modalDettagliTitolo').textContent = consulenza.tipoConsulenza;

    // Info consulenza
    const dataOraStr = consulenza.dataOra.toLocaleString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('dettaglioDataOra').textContent = dataOraStr;
    document.getElementById('dettaglioDurata').textContent = `${consulenza.durata} minuti`;
    document.getElementById('dettaglioPrezzo').textContent = `€${consulenza.prezzo}`;

    const modalitaIcons = { videocall: '📹 Videocall', studio: '🏢 In studio', domicilio: '🏠 A domicilio' };
    document.getElementById('dettaglioModalita').textContent = modalitaIcons[consulenza.modalita] || consulenza.modalita;

    // Campi condizionali
    if (consulenza.modalita === 'videocall' && consulenza.linkVideocall) {
        document.getElementById('dettaglioVideocallLink').style.display = 'block';
        document.getElementById('dettaglioLinkValue').value = consulenza.linkVideocall;

        // Mostra bottone "Entra in Videocall" se è il momento giusto (tra -15min e +30min)
        const now = new Date();
        const diffMin = (consulenza.dataOra - now) / 60000;
        if (diffMin >= -30 && diffMin <= 15) {
            document.getElementById('btnEntraVideocall').style.display = 'inline-flex';
        } else {
            document.getElementById('btnEntraVideocall').style.display = 'none';
        }
    } else {
        document.getElementById('dettaglioVideocallLink').style.display = 'none';
        document.getElementById('btnEntraVideocall').style.display = 'none';
    }

    if ((consulenza.modalita === 'studio' || consulenza.modalita === 'domicilio') && consulenza.indirizzo) {
        document.getElementById('dettaglioIndirizzo').style.display = 'block';
        document.getElementById('dettaglioIndirizzoValue').textContent = consulenza.indirizzo;
    } else {
        document.getElementById('dettaglioIndirizzo').style.display = 'none';
    }

    // Info cliente
    document.getElementById('dettaglioCliente').textContent = consulenza.cliente.nome;
    document.getElementById('dettaglioStorico').textContent = 'Prima consulenza'; // TODO: calcolare da storico

    // Documenti cliente
    const docClientiContainer = document.getElementById('dettaglioDocumentiCliente');
    if (consulenza.documentiCliente && consulenza.documentiCliente.length > 0) {
        docClientiContainer.innerHTML = consulenza.documentiCliente.map(doc => `
            <div class="documento-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <span>${doc}</span>
                <button class="btn-icon" onclick="window.scaricaDocumento('${doc}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                </button>
            </div>
        `).join('');
    } else {
        docClientiContainer.innerHTML = '<p style="color: var(--color-secondary); font-size: 14px;">Nessun documento caricato</p>';
    }

    // Documenti professionista
    const docProfContainer = document.getElementById('dettaglioDocumentiProfessionista');
    if (consulenza.documentiProfessionista && consulenza.documentiProfessionista.length > 0) {
        docProfContainer.innerHTML = consulenza.documentiProfessionista.map(doc => `
            <div class="documento-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <span>${doc}</span>
                <button class="btn-icon" onclick="window.eliminaDocumento('${doc}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        `).join('');
    } else {
        docProfContainer.innerHTML = '<p style="color: var(--color-secondary); font-size: 14px;">Nessun documento caricato</p>';
    }

    // Note
    document.getElementById('dettaglioNote').value = consulenza.note || '';

    // Apri modal
    document.getElementById('modalDettagliConsulenza').classList.add('show');
}

window.chiudiModalDettagli = function() {
    document.getElementById('modalDettagliConsulenza').classList.remove('show');
    consulenzaCorrente = null;
}

window.copiaLinkVideocall = function() {
    const link = document.getElementById('dettaglioLinkValue').value;
    navigator.clipboard.writeText(link).then(() => {
        alert('Link copiato negli appunti!');
    });
}

window.apriChat = function() {
    alert('Apertura chat con cliente... (Da implementare con sistema chat)');
    // TODO: Redirect a chat.html con ID cliente
}

window.caricaDocumento = function() {
    alert('Upload documento... (Da implementare con file upload)');
    // TODO: Aprire file picker e caricare documento
}

window.scaricaDocumento = function(nomeFile) {
    alert(`Download ${nomeFile}... (Da implementare)`);
    // TODO: Download file
}

window.eliminaDocumento = function(nomeFile) {
    if (confirm(`Eliminare il documento "${nomeFile}"?`)) {
        alert(`Documento eliminato (Da implementare)`);
        // TODO: Eliminare file
    }
}

window.salvaNoteConsulenza = function() {
    const note = document.getElementById('dettaglioNote').value;
    if (consulenzaCorrente) {
        consulenzaCorrente.note = note;
        alert('Note salvate con successo!');
    }
}

window.entraInVideocall = function() {
    if (consulenzaCorrente && consulenzaCorrente.linkVideocall) {
        window.open(consulenzaCorrente.linkVideocall, '_blank');
    }
}

window.segnaCompletata = function() {
    if (confirm('Segnare questa consulenza come completata?')) {
        alert('Consulenza segnata come completata! (Da implementare)');
        chiudiModalDettagli();
        // TODO: Spostare consulenza in storico
    }
}

window.inviaPromemoria = function() {
    alert('Promemoria inviato al cliente! (Da implementare)');
    // TODO: Inviare email/notifica
}

window.annullaConsulenza = function() {
    if (confirm('Sei sicuro di voler annullare questa consulenza?\nIl cliente verrà rimborsato secondo i termini di servizio.')) {
        alert('Consulenza annullata (Da implementare)');
        chiudiModalDettagli();
        // TODO: Annullare e rimborsare
    }
}
