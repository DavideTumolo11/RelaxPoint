/* ===============================================
   RELAXPOINT - JS LE MIE CONSULENZE (CLIENTE)
   Dashboard cliente per visualizzare consulenze prenotate
   =============================================== */

// Dati demo consulenze prenotate dal cliente
const demoConsulenzeClienteData = [
    {
        id: 1,
        tipoConsulenza: 'Consulenza Nutrizionale Personalizzata',
        professionista: {
            nome: 'Dr. Marco Bianchi',
            titolo: 'Nutrizionista Certificato',
            specializzazione: 'Nutrizione Sportiva',
            avatar: '/assets/images/professionals/prof1.jpg'
        },
        dataOra: new Date(Date.now() + 2 * 60 * 60 * 1000), // Tra 2 ore
        durata: 60,
        modalita: 'videocall',
        linkVideocall: 'https://zoom.us/j/consulenza-123',
        indirizzo: null,
        prezzo: 80,
        status: 'confermata',
        note: 'Porta risultati analisi del sangue recenti',
        rating: null
    },
    {
        id: 2,
        tipoConsulenza: 'Sessione di Yoga Privata',
        professionista: {
            nome: 'Elena Rossi',
            titolo: 'Istruttrice Yoga Certificata',
            specializzazione: 'Hatha Yoga',
            avatar: '/assets/images/professionals/prof2.jpg'
        },
        dataOra: new Date(Date.now() + 24 * 60 * 60 * 1000), // Domani
        durata: 90,
        modalita: 'domicilio',
        linkVideocall: null,
        indirizzo: 'Il tuo indirizzo di casa',
        prezzo: 100,
        status: 'confermata',
        note: 'Prepara tappetino e spazio tranquillo',
        rating: null
    },
    {
        id: 3,
        tipoConsulenza: 'Consulenza Fisioterapica',
        professionista: {
            nome: 'Dr.ssa Sofia Marino',
            titolo: 'Fisioterapista',
            specializzazione: 'Riabilitazione Sportiva',
            avatar: '/assets/images/professionals/prof3.jpg'
        },
        dataOra: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Tra 3 giorni
        durata: 45,
        modalita: 'studio',
        linkVideocall: null,
        indirizzo: 'Via Roma 123, Milano - Studio MediRelax',
        prezzo: 70,
        status: 'confermata',
        note: 'Arriva 10 minuti prima per la documentazione',
        rating: null
    }
];

// Storico consulenze completate
const storicoConsulenzeClienteData = [
    {
        id: 101,
        tipoConsulenza: 'Prima Consulenza Nutrizionale',
        professionista: {
            nome: 'Dr. Marco Bianchi',
            titolo: 'Nutrizionista Certificato',
            avatar: '/assets/images/professionals/prof1.jpg'
        },
        dataOra: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 giorni fa
        durata: 60,
        modalita: 'videocall',
        prezzo: 80,
        status: 'completata',
        rating: null,
        certificatoUrl: '/api/certificati/consulenza-101.pdf'
    },
    {
        id: 102,
        tipoConsulenza: 'Massaggio Rilassante',
        professionista: {
            nome: 'Luca Ferrari',
            titolo: 'Massaggiatore Professionista',
            avatar: '/assets/images/professionals/prof4.jpg'
        },
        dataOra: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 giorni fa
        durata: 60,
        modalita: 'studio',
        prezzo: 65,
        status: 'completata',
        rating: 5,
        certificatoUrl: '/api/certificati/consulenza-102.pdf'
    },
    {
        id: 103,
        tipoConsulenza: 'Lezione Yoga Individuale',
        professionista: {
            nome: 'Elena Rossi',
            titolo: 'Istruttrice Yoga Certificata',
            avatar: '/assets/images/professionals/prof2.jpg'
        },
        dataOra: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 giorni fa
        durata: 90,
        modalita: 'domicilio',
        prezzo: 100,
        status: 'completata',
        rating: 5,
        certificatoUrl: '/api/certificati/consulenza-103.pdf'
    }
];

let countdownIntervals = [];

document.addEventListener('DOMContentLoaded', function () {
    console.log('Le Mie Consulenze (Cliente) - Dashboard caricata');

    initializeTabs();
    loadConsulenzeData();
    loadStoricoData();
    setupModalEventListeners();
});

// ===============================================
// SETUP EVENT LISTENERS MODAL
// ===============================================
function setupModalEventListeners() {
    const modal = document.getElementById('modalDettagliConsulenza');
    
    // Click su overlay chiude modal
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                window.chiudiModalConsulenza();
            }
        });
    }
    
    // Previeni chiusura quando si clicca sul contenuto
    const modalContent = modal?.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

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
    const sortedConsulenze = demoConsulenzeClienteData.sort((a, b) => a.dataOra - b.dataOra);

    if (sortedConsulenze.length === 0) {
        consulenzeList.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p style="font-weight: 600;">Nessuna consulenza in programma</p>
                <p style="font-size: 14px;">Prenota la tua prossima consulenza con un professionista</p>
                <a href="/pages/prenotazione/prenota.html" class="btn btn-primary" style="margin-top: 16px;">
                    Prenota Ora
                </a>
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
        studio: '🏢 Studio',
        domicilio: '🏠 A domicilio'
    };

    const modalitaInfo = modalitaIcons[consulenza.modalita] || consulenza.modalita;

    let statusBadge = '';
    if (isNow) {
        statusBadge = '<span class="live-badge badge-live">IN CORSO</span>';
    } else if (isPast) {
        statusBadge = '<span class="live-badge badge-ended">TERMINATA</span>';
    } else {
        statusBadge = '<span class="live-badge badge-scheduled">CONFERMATA</span>';
    }

    return `
        <div class="live-card ${isNow ? 'live-now' : ''}" data-consulenza-id="${consulenza.id}">
            <div class="live-icon ${isNow ? 'live-now' : ''}" style="background: linear-gradient(135deg, #696DD8 0%, #5a5eba 100%);">
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
                        <span><strong>${consulenza.professionista.nome}</strong></span>
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

                    <div class="live-detail-item" style="color: var(--color-primary); font-weight: 600;">
                        <span>€${consulenza.prezzo}</span>
                    </div>
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
        countdownElement.textContent = 'Inizia ora';
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

    if (storicoConsulenzeClienteData.length === 0) {
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

    const sortedStorico = storicoConsulenzeClienteData.sort((a, b) => b.dataOra - a.dataOra);

    storicoList.innerHTML = sortedStorico.map(consulenza => createStoricoCard(consulenza)).join('');
}

function createStoricoCard(consulenza) {
    const dateStr = consulenza.dataOra.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const modalitaIcons = {
        videocall: '📹 Videocall',
        studio: '🏢 Studio',
        domicilio: '🏠 Domicilio'
    };

    const stars = '⭐'.repeat(consulenza.rating || 0);

    return `
        <div class="live-card" style="opacity: 0.90; border-color: #e5e7eb;">
            <div class="live-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
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
                        <span>${consulenza.professionista.nome}</span>
                    </div>

                    <div class="live-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                        </svg>
                        <span>${dateStr}</span>
                    </div>

                    <div class="live-detail-item">
                        <span>${modalitaIcons[consulenza.modalita]}</span>
                    </div>

                    ${consulenza.rating ? `
                        <div class="live-detail-item" style="color: #f59e0b;">
                            <span>${stars}</span>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div style="text-align: right; min-width: 180px; display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                <div style="font-size: 20px; font-weight: 600; color: #10b981;">€${consulenza.prezzo}</div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;">
                    ${!consulenza.rating ? `
                        <button class="btn btn-primary" onclick="window.lasciaRecensione(${consulenza.id})" style="font-size: 13px; padding: 8px 16px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            Recensione
                        </button>
                    ` : ''}
                    ${consulenza.certificatoUrl ? `
                        <button class="btn btn-secondary" onclick="window.scaricaCertificato(${consulenza.id})" style="font-size: 13px; padding: 8px 16px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                            Certificato
                        </button>
                    ` : ''}
                    <button class="btn-manage" onclick="window.viewConsulenzaDetails(${consulenza.id})" style="font-size: 13px; padding: 8px 16px;">
                        Dettagli
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===============================================
// AZIONI - TUTTE LE FUNZIONI SONO GLOBALI
// ===============================================
let consulenzaCorrente = null;

window.viewConsulenzaDetails = function(id) {
    console.log('viewConsulenzaDetails chiamata con id:', id);

    let consulenza = demoConsulenzeClienteData.find(c => c.id === id);
    let isCompletata = false;

    if (!consulenza) {
        consulenza = storicoConsulenzeClienteData.find(c => c.id === id);
        isCompletata = true;
    }

    if (!consulenza) {
        alert('Consulenza non trovata');
        return;
    }

    consulenzaCorrente = consulenza;

    document.getElementById('modalConsulenzaTitolo').textContent = consulenza.tipoConsulenza;

    document.getElementById('dettaglioProfessionista').textContent =
        consulenza.professionista.nome + (consulenza.professionista.titolo ? ' - ' + consulenza.professionista.titolo : '');

    const dataOraStr = consulenza.dataOra.toLocaleString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('dettaglioDataOra').textContent = dataOraStr;

    document.getElementById('dettaglioDurata').textContent = consulenza.durata + ' minuti';

    const modalitaIcons = { videocall: '📹 Videocall', studio: '🏢 In studio', domicilio: '🏠 A domicilio' };
    document.getElementById('dettaglioModalita').textContent = modalitaIcons[consulenza.modalita] || consulenza.modalita;

    document.getElementById('dettaglioPrezzo').textContent = '€' + consulenza.prezzo;

    const statusBadges = { confermata: '✅ Confermata', completata: '✅ Completata', annullata: '❌ Annullata' };
    document.getElementById('dettaglioStatus').textContent = statusBadges[consulenza.status] || consulenza.status;

    const indirizzoContainer = document.getElementById('dettaglioIndirizzoContainer');
    const videocallContainer = document.getElementById('dettaglioVideocallContainer');

    if (consulenza.modalita === 'videocall' && consulenza.linkVideocall) {
        videocallContainer.style.display = 'block';
        indirizzoContainer.style.display = 'none';
        document.getElementById('dettaglioLinkVideocall').value = consulenza.linkVideocall;

        const now = new Date();
        const diffMinutes = (consulenza.dataOra - now) / 60000;
        const btnEntraVideocall = document.getElementById('btnEntraVideocall');

        if (diffMinutes >= -30 && diffMinutes <= 15 && !isCompletata) {
            btnEntraVideocall.style.display = 'inline-flex';
        } else {
            btnEntraVideocall.style.display = 'none';
        }
    } else if (consulenza.indirizzo) {
        videocallContainer.style.display = 'none';
        indirizzoContainer.style.display = 'block';
        document.getElementById('dettaglioIndirizzo').textContent = consulenza.indirizzo;
    } else {
        videocallContainer.style.display = 'none';
        indirizzoContainer.style.display = 'none';
    }

    const noteContainer = document.getElementById('dettaglioNoteContainer');
    if (consulenza.note) {
        noteContainer.style.display = 'block';
        document.getElementById('dettaglioNote').textContent = consulenza.note;
    } else {
        noteContainer.style.display = 'none';
    }

    const btnRecensione = document.getElementById('btnRecensione');
    if (isCompletata && !consulenza.rating) {
        btnRecensione.style.display = 'inline-flex';
        btnRecensione.onclick = function() { window.lasciaRecensione(consulenza.id); };
    } else {
        btnRecensione.style.display = 'none';
    }

    document.getElementById('modalDettagliConsulenza').classList.add('show');
};

window.lasciaRecensione = function(id) {
    console.log('lasciaRecensione chiamata con id:', id);

    const consulenza = storicoConsulenzeClienteData.find(c => c.id === id);
    if (!consulenza) {
        alert('Consulenza non trovata');
        return;
    }

    sessionStorage.setItem('pendingReview', JSON.stringify({
        id: consulenza.id,
        service: consulenza.tipoConsulenza,
        professional: consulenza.professionista.nome,
        date: consulenza.dataOra.toISOString().split('T')[0],
        category: 'consulenze'
    }));

    window.location.href = '/pages/dashboard/recensioni.html';
};

window.chiudiModalConsulenza = function() {
    document.getElementById('modalDettagliConsulenza').classList.remove('show');
    consulenzaCorrente = null;
};

window.copiaLinkVideocall = function() {
    const linkInput = document.getElementById('dettaglioLinkVideocall');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        const btn = event.target.closest('button');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg> Copiato!';
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 2000);
        }
    } catch (err) {
        alert('Link copiato: ' + linkInput.value);
    }
};

window.entraInVideocall = function() {
    if (consulenzaCorrente && consulenzaCorrente.linkVideocall) {
        window.open(consulenzaCorrente.linkVideocall, '_blank');
    } else {
        alert('Link videocall non disponibile');
    }
};

window.scaricaCertificato = function(id) {
    console.log('scaricaCertificato chiamata con id:', id);
    const consulenza = storicoConsulenzeClienteData.find(c => c.id === id);
    if (!consulenza) {
        alert('Consulenza non trovata');
        return;
    }
    if (!consulenza.certificatoUrl) {
        alert('Certificato non disponibile per questa consulenza');
        return;
    }
    const link = document.createElement('a');
    link.href = consulenza.certificatoUrl;
    link.download = 'certificato-' + consulenza.tipoConsulenza.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + consulenza.id + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Certificato scaricato per: ' + consulenza.tipoConsulenza);
};

window.apriChatProfessionista = function() {
    alert('Apertura chat con professionista... (Da implementare con sistema chat)');
};
