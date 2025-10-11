/* ===============================================
   RELAXPOINT - JAVASCRIPT CONSULENZE
   Gestione consulenze 1-to-1 in I Miei Servizi
   =============================================== */

// ===============================================
// GESTIONE CATEGORIA SERVIZIO NEL MODAL
// ===============================================
function handleCategoriaChange() {
    const categoria = document.getElementById('categoriaServizio').value;
    const btnConfigura = document.getElementById('btnConfiguraConsulenza');

    if (categoria === 'consulenza') {
        btnConfigura.style.display = 'block';
    } else {
        btnConfigura.style.display = 'none';
    }
}

function apriModalConsulenza() {
    const modal = document.getElementById('modalNuovaConsulenza');
    if (modal) {
        modal.classList.add('show');
    }
}

function chiudiModalConsulenza() {
    const modal = document.getElementById('modalNuovaConsulenza');
    if (modal) {
        modal.classList.remove('show');
    }
    // Reset form
    document.getElementById('formNuovaConsulenza').reset();
    document.getElementById('videocallLinkGroup').style.display = 'none';
    document.getElementById('studioAddressGroup').style.display = 'none';
}

// ===============================================
// GESTIONE TAB NAVIGATION (deprecato - tab rimosso)
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    loadConsulenze();
    setupModalConsulenzeListeners();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
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
// GESTIONE CONSULENZE - CRUD
// ===============================================
const demoConsulenzeData = [
    {
        id: 1,
        nome: 'Prima Valutazione Nutrizionale',
        descrizione: 'Analisi completa dello stato nutrizionale con piano personalizzato',
        durata: 45,
        prezzo: 60,
        categoria: 'nutrizione',
        modalita: ['videocall', 'studio'],
        linkVideocall: 'https://zoom.us/j/example1',
        indirizzoStudio: 'Via Roma 123, Milano',
        documenti: ['referti', 'analisi'],
        note: 'Portare referti medici recenti',
        immagine: '/assets/images/servizi/nutrizione.jpg'
    },
    {
        id: 2,
        nome: 'Consulenza Approfondita',
        descrizione: 'Sessione estesa per casi complessi con follow-up personalizzato',
        durata: 105,
        prezzo: 120,
        categoria: 'nutrizione',
        modalita: ['videocall', 'studio', 'domicilio'],
        linkVideocall: 'https://zoom.us/j/example2',
        indirizzoStudio: 'Via Roma 123, Milano',
        documenti: [],
        note: '',
        immagine: null
    }
];

function loadConsulenze() {
    const container = document.getElementById('consulenzeContainer');
    if (!container) return;

    if (demoConsulenzeData.length === 0) {
        container.innerHTML = `
            <div class="empty-consulenze">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p style="font-weight: 600;">Nessuna consulenza creata</p>
                <p style="font-size: 14px;">Clicca su "Aggiungi Consulenza" per iniziare</p>
            </div>
        `;
        return;
    }

    container.innerHTML = demoConsulenzeData.map(c => createConsulenzaCard(c)).join('');

    // Aggiorna stats
    document.getElementById('totalConsulenze').textContent = demoConsulenzeData.length;
}

function createConsulenzaCard(consulenza) {
    const modalitaIcons = {
        videocall: '📹',
        studio: '🏢',
        domicilio: '🏠'
    };

    const modalitaBadges = consulenza.modalita.map(m =>
        `<span class="modalita-badge">${modalitaIcons[m]} ${m === 'videocall' ? 'Videocall' : m === 'studio' ? 'Studio' : 'Domicilio'}</span>`
    ).join('');

    return `
        <div class="consulenza-card" data-consulenza-id="${consulenza.id}">
            <div class="consulenza-header">
                <div class="consulenza-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <div class="consulenza-info">
                    <h3 class="consulenza-title">${consulenza.nome}</h3>
                    <p class="consulenza-categoria">${consulenza.categoria}</p>
                </div>
            </div>

            <p style="font-size: 14px; color: var(--color-secondary); margin: 0;">${consulenza.descrizione}</p>

            <div class="consulenza-details">
                <div class="consulenza-detail-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <span>${consulenza.durata} min</span>
                </div>
                <div class="consulenza-price">€${consulenza.prezzo}</div>
            </div>

            <div class="consulenza-modalita">
                ${modalitaBadges}
            </div>

            <div class="consulenza-actions">
                <button class="btn btn-edit" onclick="modificaConsulenza(${consulenza.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Modifica
                </button>
                <button class="btn btn-delete" onclick="eliminaConsulenza(${consulenza.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    Elimina
                </button>
            </div>
        </div>
    `;
}

// ===============================================
// MODAL GESTIONE CONSULENZA
// ===============================================
function aggiungiNuovaConsulenza() {
    const modal = document.getElementById('modalNuovaConsulenza');
    if (!modal) return;

    // Reset form
    document.getElementById('formNuovaConsulenza').reset();
    document.getElementById('videocallLinkGroup').style.display = 'none';
    document.getElementById('studioAddressGroup').style.display = 'none';

    modal.classList.add('show');
}

function chiudiModalConsulenza() {
    const modal = document.getElementById('modalNuovaConsulenza');
    if (modal) {
        modal.classList.remove('show');
    }
}

function setupModalConsulenzeListeners() {
    // Mostra/nascondi campi condizionali
    const videocallCheckbox = document.getElementById('consulenzaModalitaVideocall');
    const studioCheckbox = document.getElementById('consulenzaModalitaStudio');

    if (videocallCheckbox) {
        videocallCheckbox.addEventListener('change', function() {
            const linkGroup = document.getElementById('videocallLinkGroup');
            if (linkGroup) {
                linkGroup.style.display = this.checked ? 'grid' : 'none';
            }
        });
    }

    if (studioCheckbox) {
        studioCheckbox.addEventListener('change', function() {
            const addressGroup = document.getElementById('studioAddressGroup');
            if (addressGroup) {
                addressGroup.style.display = this.checked ? 'grid' : 'none';
            }
        });
    }
}

function salvaConsulenza() {
    const form = document.getElementById('formNuovaConsulenza');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Raccogli dati
    const nome = document.getElementById('consulenzaNome').value;
    const descrizione = document.getElementById('consulenzaDescrizione').value;
    const durata = parseInt(document.getElementById('consulenzaDurata').value);
    const prezzo = parseFloat(document.getElementById('consulenzaPrezzo').value);
    const categoria = document.getElementById('consulenzaCategoria').value;

    // Modalità
    const modalita = [];
    if (document.getElementById('consulenzaModalitaVideocall').checked) modalita.push('videocall');
    if (document.getElementById('consulenzaModalitaStudio').checked) modalita.push('studio');
    if (document.getElementById('consulenzaModalitaDomicilio').checked) modalita.push('domicilio');

    if (modalita.length === 0) {
        alert('Seleziona almeno una modalità di erogazione');
        return;
    }

    const linkVideocall = document.getElementById('consulenzaLinkVideocall').value;
    const indirizzoStudio = document.getElementById('consulenzaIndirizzoStudio').value;
    const note = document.getElementById('consulenzaNote').value;

    // Documenti richiesti
    const documenti = [];
    document.querySelectorAll('#modalNuovaConsulenza .checkbox-group input[type="checkbox"]:checked').forEach(cb => {
        if (cb.value !== 'videocall' && cb.value !== 'studio' && cb.value !== 'domicilio') {
            documenti.push(cb.value);
        }
    });

    // Crea nuova consulenza
    const nuovaConsulenza = {
        id: demoConsulenzeData.length + 1,
        nome,
        descrizione,
        durata,
        prezzo,
        categoria,
        modalita,
        linkVideocall,
        indirizzoStudio,
        documenti,
        note,
        immagine: null
    };

    demoConsulenzeData.push(nuovaConsulenza);

    // Crea HTML card consulenza
    const consulenzaId = nome.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const modalitaIcons = {
        videocall: '📹',
        studio: '🏢',
        domicilio: '🏠'
    };
    const modalitaBadges = modalita.map(m => `${modalitaIcons[m]} ${m}`).join(', ');

    const consulenzaHTML = `
        <div class="treatment-item" data-treatment-id="${consulenzaId}">
            <div class="treatment-info">
                <img src="/assets/images/servizi/consulenza-default.jpg" alt="${nome}" class="treatment-image" onerror="this.src='/assets/images/servizi/default.jpg'">
                <div class="treatment-details">
                    <h4 class="treatment-title">${nome}</h4>
                    <p class="treatment-price">€${prezzo}</p>
                    <div class="treatment-meta">
                        <span class="treatment-duration">${durata} min</span>
                        <span class="treatment-bookings">${modalitaBadges}</span>
                    </div>
                </div>
            </div>
            <div class="treatment-actions">
                <button class="btn-edit-small" onclick="modificaConsulenza(${nuovaConsulenza.id})">
                    Modifica
                </button>
                <button class="btn-delete-small" onclick="eliminaConsulenza(${nuovaConsulenza.id})">
                    Elimina
                </button>
            </div>
        </div>
    `;

    // Trova il service-group con categoria consulenza
    const serviceGroup = document.querySelector('[data-service-category="consulenza"]');
    if (serviceGroup) {
        const treatmentsList = serviceGroup.querySelector('.treatments-list');
        const addButton = treatmentsList.querySelector('.add-treatment');

        // Inserisci la card prima del bottone "Aggiungi Consulenza"
        addButton.insertAdjacentHTML('beforebegin', consulenzaHTML);

        // Aggiorna il contatore
        const countSpan = serviceGroup.querySelector('.treatment-count');
        if (countSpan) {
            const currentCount = demoConsulenzeData.length;
            countSpan.textContent = `${currentCount} consulenz${currentCount === 1 ? 'a' : 'e'}`;
        }
    }

    // Chiudi modal
    chiudiModalConsulenza();

    // Notifica
    if (typeof showNotification === 'function') {
        showNotification(`Consulenza "${nome}" creata con successo!`, 'success');
    } else {
        alert(`Consulenza "${nome}" creata con successo!`);
    }
}

function modificaConsulenza(consulenzaId) {
    alert(`Modifica consulenza ${consulenzaId} - Funzionalità in sviluppo`);
    // TODO: Aprire modal pre-compilato con dati consulenza
}

function eliminaConsulenza(consulenzaId) {
    if (!confirm('Sei sicuro di voler eliminare questa consulenza?')) return;

    const index = demoConsulenzeData.findIndex(c => c.id === consulenzaId);
    if (index > -1) {
        demoConsulenzeData.splice(index, 1);
        loadConsulenze();
        alert('Consulenza eliminata');
    }
}

console.log('Consulenze JS - Caricato');
