/* ===============================================
   RELAXPOINT - JS I MIEI CORSI
   Dashboard cliente per visualizzazione corsi
   =============================================== */

// Dati demo corsi attivi
const corsiAttivi = [
    {
        id: 1,
        titolo: 'Yoga per Principianti',
        professionista: 'Maria Rossi',
        lezioniTotali: 10,
        lezioniFrequentate: 6,
        prossimaLezione: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Tra 2 giorni
        calendario: [
            { data: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), ora: '18:00', titolo: 'Lezione 7: Saluti al Sole' },
            { data: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), ora: '18:00', titolo: 'Lezione 8: Equilibrio' },
            { data: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), ora: '18:00', titolo: 'Lezione 9: Flessibilità' }
        ],
        materiali: [
            { nome: 'Guida Introduttiva.pdf', sbloccato: true },
            { nome: 'Video Posizioni Base.mp4', sbloccato: true },
            { nome: 'Sequenze Avanzate.pdf', sbloccato: false, richiede: 'Completa 8 lezioni' }
        ]
    },
    {
        id: 2,
        titolo: 'Meditazione Mindfulness',
        professionista: 'Luca Bianchi',
        lezioniTotali: 8,
        lezioniFrequentate: 3,
        prossimaLezione: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Domani
        calendario: [
            { data: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), ora: '19:30', titolo: 'Lezione 4: Respiro Consapevole' },
            { data: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), ora: '19:30', titolo: 'Lezione 5: Body Scan' }
        ],
        materiali: [
            { nome: 'Introduzione Mindfulness.pdf', sbloccato: true },
            { nome: 'Audio Meditazione Guidata.mp3', sbloccato: true },
            { nome: 'Esercizi Avanzati.pdf', sbloccato: false, richiede: 'Completa 5 lezioni' }
        ]
    }
];

// Dati demo corsi completati
const corsiCompletati = [
    {
        id: 101,
        titolo: 'Pilates Base',
        professionista: 'Anna Verdi',
        lezioniTotali: 12,
        lezioniFrequentate: 12,
        dataCompletamento: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        certificato: true
    }
];

let corsoCorrente = null;

document.addEventListener('DOMContentLoaded', function () {
    console.log('I Miei Corsi - Dashboard caricata');

    initializeTabs();
    loadCorsiAttivi();
    loadCorsiCompletati();
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

            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            this.classList.add('active');
            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// ===============================================
// CARICAMENTO CORSI ATTIVI
// ===============================================
function loadCorsiAttivi() {
    const container = document.getElementById('corsiAttiviList');
    if (!container) return;

    if (corsiAttivi.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
                <p style="font-weight: 600;">Nessun corso attivo</p>
                <p style="font-size: 14px;">Iscriviti a un corso per iniziare il tuo percorso</p>
            </div>
        `;
        return;
    }

    container.innerHTML = corsiAttivi.map(corso => createCorsoCard(corso)).join('');
}

// ===============================================
// CARICAMENTO CORSI COMPLETATI
// ===============================================
function loadCorsiCompletati() {
    const container = document.getElementById('corsiCompletatiList');
    if (!container) return;

    if (corsiCompletati.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
                <p style="font-weight: 600;">Nessun corso completato</p>
                <p style="font-size: 14px;">I corsi completati appariranno qui</p>
            </div>
        `;
        return;
    }

    container.innerHTML = corsiCompletati.map(corso => createCorsoCompletatoCard(corso)).join('');
}

// ===============================================
// CREA CARD CORSO ATTIVO
// ===============================================
function createCorsoCard(corso) {
    const progresso = Math.round((corso.lezioniFrequentate / corso.lezioniTotali) * 100);

    const prossimaLezioneStr = corso.prossimaLezione.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
        <div class="corso-card" onclick="window.viewCorsoDetails(${corso.id})">
            <div class="corso-header">
                <div class="corso-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                    </svg>
                </div>
                <div class="corso-info">
                    <h3 class="corso-title">${corso.titolo}</h3>
                    <p class="corso-professionista">${corso.professionista}</p>
                </div>
            </div>

            <div class="corso-progress">
                <div class="progress-label">
                    <span>Progresso</span>
                    <span>${progresso}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progresso}%"></div>
                </div>
            </div>

            <div class="corso-stats">
                <div class="corso-stat">
                    <div class="corso-stat-value">${corso.lezioniFrequentate}/${corso.lezioniTotali}</div>
                    <div class="corso-stat-label">Lezioni</div>
                </div>
                <div class="corso-stat">
                    <div class="corso-stat-value">${corso.materiali.filter(m => m.sbloccato).length}/${corso.materiali.length}</div>
                    <div class="corso-stat-label">Materiali</div>
                </div>
            </div>

            <div style="margin-bottom: 16px;">
                <div style="font-size: 13px; color: var(--color-secondary); margin-bottom: 4px;">Prossima lezione:</div>
                <div style="font-size: 14px; font-weight: 600; color: var(--color-text);">📅 ${prossimaLezioneStr}</div>
            </div>

            <div class="corso-footer">
                <button class="btn-corso btn-corso-primary" onclick="event.stopPropagation(); window.viewCorsoDetails(${corso.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    Vedi Dettagli
                </button>
            </div>
        </div>
    `;
}

// ===============================================
// CREA CARD CORSO COMPLETATO
// ===============================================
function createCorsoCompletatoCard(corso) {
    const dataStr = corso.dataCompletamento.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return `
        <div class="corso-card" style="opacity: 0.9;">
            <div class="corso-header">
                <div class="corso-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                    </svg>
                </div>
                <div class="corso-info">
                    <h3 class="corso-title">${corso.titolo}</h3>
                    <p class="corso-professionista">${corso.professionista}</p>
                </div>
            </div>

            <div style="padding: 16px 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); margin: 16px 0;">
                <div style="display: flex; gap: 20px;">
                    <div>
                        <div style="font-size: 18px; font-weight: 700; color: var(--color-text);">${corso.lezioniTotali}</div>
                        <div style="font-size: 12px; color: var(--color-secondary); text-transform: uppercase;">Lezioni</div>
                    </div>
                    <div>
                        <div style="font-size: 18px; font-weight: 700; color: #10b981;">Completato</div>
                        <div style="font-size: 12px; color: var(--color-secondary); text-transform: uppercase;">${dataStr}</div>
                    </div>
                </div>
            </div>

            ${corso.certificato ? `
                <div style="margin-bottom: 16px; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border: 1px solid #10b981;">
                    <div style="display: flex; align-items: center; gap: 8px; color: #10b981; font-weight: 600; font-size: 14px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm10 16H4V9h16v11z"/>
                        </svg>
                        Certificato Disponibile
                    </div>
                </div>
            ` : ''}

            <div class="corso-footer">
                <button class="btn-corso" onclick="window.scaricaCertificato(${corso.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    Scarica Certificato
                </button>
                <button class="btn-corso" onclick="window.lasciaRecensione()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    Recensione
                </button>
            </div>
        </div>
    `;
}

// ===============================================
// AZIONI - TUTTE GLOBALI
// ===============================================

window.viewCorsoDetails = function(id) {
    console.log('viewCorsoDetails chiamata con id:', id);

    const corso = corsiAttivi.find(c => c.id === id);
    if (!corso) {
        alert('Corso non trovato');
        return;
    }

    corsoCorrente = corso;

    // Popola modal
    document.getElementById('modalCorsoTitolo').textContent = corso.titolo;
    document.getElementById('dettaglioProfessionista').textContent = corso.professionista;
    document.getElementById('dettaglioLezioni').textContent = `${corso.lezioniTotali} lezioni`;
    document.getElementById('dettaglioPresenze').textContent = `${corso.lezioniFrequentate} presenze`;

    const progresso = Math.round((corso.lezioniFrequentate / corso.lezioniTotali) * 100);
    document.getElementById('dettaglioProgresso').textContent = `${progresso}%`;

    // Calendario
    const calendarioContainer = document.getElementById('dettaglioCalendario');
    if (corso.calendario && corso.calendario.length > 0) {
        calendarioContainer.innerHTML = corso.calendario.map(lezione => {
            const giorno = lezione.data.getDate();
            const mese = lezione.data.toLocaleDateString('it-IT', { month: 'short' });

            return `
                <div class="lezione-item">
                    <div class="lezione-data">
                        <div class="lezione-giorno">${giorno}</div>
                        <div class="lezione-mese">${mese}</div>
                    </div>
                    <div class="lezione-info">
                        <div class="lezione-ora">🕐 ${lezione.ora}</div>
                        <div class="lezione-titolo">${lezione.titolo}</div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        calendarioContainer.innerHTML = '<p style="color: var(--color-secondary); font-size: 14px;">Nessuna lezione programmata</p>';
    }

    // Materiali
    const materialiContainer = document.getElementById('dettaglioMateriali');
    if (corso.materiali && corso.materiali.length > 0) {
        materialiContainer.innerHTML = corso.materiali.map(materiale => {
            const locked = !materiale.sbloccato;

            return `
                <div class="materiale-item ${locked ? 'locked' : ''}" ${!locked ? `onclick="window.scaricaMateriale('${materiale.nome}')"` : ''}>
                    <div class="materiale-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                    </div>
                    <div class="materiale-info">
                        <div class="materiale-nome">${materiale.nome}</div>
                        <div class="materiale-status">${locked ? '🔒 ' + materiale.richiede : '✅ Disponibile'}</div>
                    </div>
                    ${!locked ? `
                        <button class="btn-download" onclick="event.stopPropagation(); window.scaricaMateriale('${materiale.nome}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                            Scarica
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
    } else {
        materialiContainer.innerHTML = '<p style="color: var(--color-secondary); font-size: 14px;">Nessun materiale disponibile</p>';
    }

    // Apri modal
    document.getElementById('modalDettagliCorso').classList.add('show');
}

window.chiudiModalCorso = function() {
    document.getElementById('modalDettagliCorso').classList.remove('show');
    corsoCorrente = null;
}

window.scaricaMateriale = function(nomeFile) {
    alert(`Download ${nomeFile}... (Da implementare)`);
    // TODO: Implementare download file
}

window.scaricaCertificato = function(corsoId) {
    alert(`Download certificato corso ID ${corsoId}... (Da implementare)`);
    // TODO: Implementare download certificato
}

window.apriChatProfessionista = function() {
    alert('Apertura chat con professionista... (Da implementare con sistema chat)');
    // TODO: Redirect a chat.html con ID professionista
}

window.lasciaRecensione = function() {
    alert('Lascia recensione... (Da implementare)');
    // TODO: Aprire modal recensione
}

// Chiudi modal cliccando fuori
document.addEventListener('click', function(event) {
    const modal = document.getElementById('modalDettagliCorso');
    if (event.target === modal) {
        window.chiudiModalCorso();
    }
});
