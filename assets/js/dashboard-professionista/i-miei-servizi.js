/* ===============================================
   RELAXPOINT - JAVASCRIPT I MIEI SERVIZI
   Gestione CRUD servizi e trattamenti professionista
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('I Miei Servizi - Dashboard Professionista caricata');

    initializeServices();
    setupImageUploads();
    setupFormValidation();
    updateStats();
});

// ===============================================
// INIZIALIZZAZIONE
// ===============================================
function initializeServices() {
    setupFileInputs();
    updateStats();
    setupAutoSave();
}

// ===============================================
// GESTIONE SERVIZI - CRUD
// ===============================================
function aggiungiNuovoServizio() {
    const modal = document.getElementById('modalNuovoServizio');
    if (modal) {
        document.getElementById('formNuovoServizio').reset();
        document.getElementById('previewNuovoServizio').style.display = 'none';
        modal.classList.add('show');
    }
}

function modificaServizio(serviceId) {
    const serviceGroup = document.querySelector(`[data-service-id="${serviceId}"]`);
    if (!serviceGroup) return;

    const title = serviceGroup.querySelector('.service-title').textContent;
    const description = serviceGroup.querySelector('.service-description').textContent;
    const image = serviceGroup.querySelector('.service-image').src;

    document.getElementById('nomeServizio').value = title;
    document.getElementById('descrizioneServizio').value = description;

    if (image) {
        const preview = document.getElementById('previewServizio');
        const img = document.getElementById('imgPreviewServizio');
        img.src = image;
        preview.style.display = 'block';
    }

    document.getElementById('modalModificaServizio').dataset.editingId = serviceId;
    document.getElementById('modalModificaServizio').classList.add('show');
}

function eliminaServizio(serviceId) {
    if (confirm('Sei sicuro di voler eliminare questo servizio? Tutti i trattamenti associati verranno eliminati.')) {
        const serviceGroup = document.querySelector(`[data-service-id="${serviceId}"]`);
        if (serviceGroup) {
            serviceGroup.style.opacity = '0';
            serviceGroup.style.transform = 'scale(0.95)';
            serviceGroup.style.transition = 'all 0.3s ease';

            setTimeout(() => {
                serviceGroup.remove();
                updateStats();
                showNotification('Servizio eliminato correttamente', 'success');
            }, 300);
        }
    }
}

function salvaModificheServizio() {
    const modal = document.getElementById('modalModificaServizio');
    const serviceId = modal.dataset.editingId;
    const serviceGroup = document.querySelector(`[data-service-id="${serviceId}"]`);

    if (!serviceGroup) return;

    const nome = document.getElementById('nomeServizio').value;
    const descrizione = document.getElementById('descrizioneServizio').value;
    const fileInput = document.getElementById('fotoServizio');

    if (!nome.trim()) {
        showNotification('Nome servizio obbligatorio', 'error');
        return;
    }

    serviceGroup.querySelector('.service-title').textContent = nome;
    serviceGroup.querySelector('.service-description').textContent = descrizione;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            serviceGroup.querySelector('.service-image').src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }

    chiudiModal('modalModificaServizio');
    showNotification('Servizio aggiornato correttamente', 'success');
}

function creaNuovoServizio() {
    const nome = document.getElementById('nuovoNomeServizio').value;
    const descrizione = document.getElementById('nuovaDescrizioneServizio').value;
    const fileInput = document.getElementById('nuovaFotoServizio');

    if (!nome.trim()) {
        showNotification('Nome servizio obbligatorio', 'error');
        return;
    }

    const serviceId = nome.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const newServiceHTML = `
        <div class="service-group" data-service-id="${serviceId}">
            <div class="service-header">
                <div class="service-info">
                    <img src="/assets/images/servizi/default.jpg" alt="${nome}" class="service-image">
                    <div class="service-details">
                        <h3 class="service-title">${nome}</h3>
                        <p class="service-description">${descrizione}</p>
                        <div class="service-meta">
                            <span class="treatment-count">0 trattamenti</span>
                            <span class="service-status active">Attivo</span>
                        </div>
                    </div>
                </div>
                <div class="service-actions">
                    <button class="btn-edit" onclick="modificaServizio('${serviceId}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        Modifica
                    </button>
                    <button class="btn-delete" onclick="eliminaServizio('${serviceId}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                        Elimina
                    </button>
                </div>
            </div>
            <div class="treatments-list">
                <div class="add-treatment">
                    <button class="btn-add-treatment" onclick="aggiungiTrattamento('${serviceId}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        Aggiungi Trattamento
                    </button>
                </div>
            </div>
        </div>
    `;

    const container = document.getElementById('servicesContainer');
    container.insertAdjacentHTML('beforeend', newServiceHTML);

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const newService = container.lastElementChild;
            newService.querySelector('.service-image').src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }

    updateServicesSelect();
    chiudiModal('modalNuovoServizio');
    updateStats();
    showNotification('Nuovo servizio creato correttamente', 'success');
}

// ===============================================
// GESTIONE TRATTAMENTI - CRUD
// ===============================================
function aggiungiTrattamento(serviceId) {
    const select = document.getElementById('servizioAppartenenza');
    if (select) {
        select.value = serviceId;
    }

    document.getElementById('formModificaTrattamento').reset();
    document.getElementById('previewTrattamento').style.display = 'none';

    const modal = document.getElementById('modalModificaTrattamento');
    delete modal.dataset.editingId;
    modal.querySelector('.modal-header h3').textContent = 'Nuovo Trattamento';

    resetAllEditors();
    modal.classList.add('show');
}

function modificaTrattamento(treatmentId) {
    const treatmentItem = document.querySelector(`[data-treatment-id="${treatmentId}"]`);
    if (!treatmentItem) return;

    const title = treatmentItem.querySelector('.treatment-title').textContent;
    const price = treatmentItem.querySelector('.treatment-price').textContent.replace('da ', '').replace(' euro', '');
    const duration = treatmentItem.querySelector('.treatment-duration').textContent;
    const image = treatmentItem.querySelector('.treatment-image').src;

    document.getElementById('nomeTrattamento').value = title;
    document.getElementById('prezzoBase').value = price;

    const durationMatch = duration.match(/(\d+)/);
    if (durationMatch) {
        document.getElementById('durataMinima').value = durationMatch[1];
    }

    if (image) {
        const preview = document.getElementById('previewTrattamento');
        const img = document.getElementById('imgPreviewTrattamento');
        img.src = image;
        preview.style.display = 'block';
    }

    const serviceGroup = treatmentItem.closest('.service-group');
    const serviceId = serviceGroup.dataset.serviceId;
    document.getElementById('servizioAppartenenza').value = serviceId;

    setupExistingTreatmentData(treatmentId);

    const modal = document.getElementById('modalModificaTrattamento');
    modal.dataset.editingId = treatmentId;
    modal.querySelector('.modal-header h3').textContent = 'Modifica Trattamento';

    modal.classList.add('show');
}

function eliminaTrattamento(treatmentId) {
    if (confirm('Sei sicuro di voler eliminare questo trattamento?')) {
        const treatmentItem = document.querySelector(`[data-treatment-id="${treatmentId}"]`);
        if (treatmentItem) {
            treatmentItem.style.opacity = '0';
            treatmentItem.style.transform = 'translateX(-100%)';
            treatmentItem.style.transition = 'all 0.3s ease';

            setTimeout(() => {
                const serviceGroup = treatmentItem.closest('.service-group');
                treatmentItem.remove();
                updateServiceStats(serviceGroup);
                updateStats();
                showNotification('Trattamento eliminato', 'success');
            }, 300);
        }
    }
}

// ===============================================
// GESTIONE DURATE MULTIPLE
// ===============================================
function aggiungiDurata() {
    const editor = document.getElementById('durationEditor');
    const durationItems = editor.querySelectorAll('.duration-item');

    if (durationItems.length >= 6) {
        showNotification('Massimo 6 durate consentite', 'warning');
        return;
    }

    const newDurationHTML = `
        <div class="duration-item">
            <select class="duration-select">
                <option value="30">30 minuti</option>
                <option value="45">45 minuti</option>
                <option value="60">60 minuti</option>
                <option value="75">75 minuti</option>
                <option value="90">90 minuti</option>
                <option value="120">120 minuti</option>
                <option value="180">180 minuti</option>
                <option value="240">240 minuti</option>
            </select>
            <input type="number" class="price-input" placeholder="Prezzo €" min="20" max="500">
            <button type="button" class="btn-remove-duration" onclick="rimuoviDurata(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    `;

    editor.insertAdjacentHTML('beforeend', newDurationHTML);
}

function rimuoviDurata(button) {
    const durationItem = button.closest('.duration-item');
    durationItem.remove();
}

// ===============================================
// GESTIONE PACCHETTI
// ===============================================
function aggiungiPacchetto() {
    const editor = document.getElementById('packagesEditor');
    const packageItems = editor.querySelectorAll('.package-item');

    if (packageItems.length >= 5) {
        showNotification('Massimo 5 pacchetti consentiti', 'warning');
        return;
    }

    const newPackageHTML = `
        <div class="package-item">
            <input type="text" class="package-name" placeholder="Nome pacchetto" maxlength="50">
            <input type="text" class="package-description" placeholder="Descrizione" maxlength="100">
            <input type="number" class="package-price" placeholder="Prezzo €" min="20" max="500">
            <button type="button" class="btn-remove-package" onclick="rimuoviPacchetto(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    `;

    editor.insertAdjacentHTML('beforeend', newPackageHTML);
}

function rimuoviPacchetto(button) {
    const packageItem = button.closest('.package-item');
    packageItem.remove();
}

// ===============================================
// GESTIONE SERVIZI EXTRA
// ===============================================
function aggiungiExtra() {
    const editor = document.getElementById('extrasEditor');
    const extraItems = editor.querySelectorAll('.extra-item');

    if (extraItems.length >= 10) {
        showNotification('Massimo 10 servizi extra consentiti', 'warning');
        return;
    }

    const newExtraHTML = `
        <div class="extra-item">
            <input type="text" class="extra-name" placeholder="Nome servizio" maxlength="50">
            <input type="number" class="extra-price" placeholder="Prezzo +€" min="1" max="100">
            <button type="button" class="btn-remove-extra" onclick="rimuoviExtra(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    `;

    editor.insertAdjacentHTML('beforeend', newExtraHTML);
}

function rimuoviExtra(button) {
    const extraItem = button.closest('.extra-item');
    extraItem.remove();
}

// ===============================================
// GESTIONE BENEFICI
// ===============================================
function aggiungiBeneficio() {
    const editor = document.getElementById('benefitsEditor');
    const benefitItems = editor.querySelectorAll('.benefit-item');

    if (benefitItems.length >= 8) {
        showNotification('Massimo 8 benefici consentiti', 'warning');
        return;
    }

    const newBenefitHTML = `
        <div class="benefit-item">
            <input type="text" placeholder="Inserisci beneficio" maxlength="100">
            <button type="button" class="btn-remove-benefit" onclick="rimuoviBeneficio(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    `;

    editor.insertAdjacentHTML('beforeend', newBenefitHTML);
}

function rimuoviBeneficio(button) {
    const benefitItem = button.closest('.benefit-item');
    benefitItem.remove();
}

// ===============================================
// RESET EDITORS
// ===============================================
function resetAllEditors() {
    resetBenefitsEditor();
    resetDurationEditor();
    resetPackagesEditor();
    resetExtrasEditor();
}

function resetBenefitsEditor() {
    const editor = document.getElementById('benefitsEditor');
    editor.innerHTML = `
        <div class="benefit-item">
            <input type="text" placeholder="Inserisci beneficio" maxlength="100">
            <button type="button" class="btn-remove-benefit" onclick="rimuoviBeneficio(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    `;
}

function resetDurationEditor() {
    const editor = document.getElementById('durationEditor');
    editor.innerHTML = `
        <div class="duration-item">
            <select class="duration-select">
                <option value="30">30 minuti</option>
                <option value="45">45 minuti</option>
                <option value="60" selected>60 minuti</option>
                <option value="75">75 minuti</option>
                <option value="90">90 minuti</option>
                <option value="120">120 minuti</option>
                <option value="180">180 minuti</option>
                <option value="240">240 minuti</option>
            </select>
            <input type="number" class="price-input" placeholder="Prezzo €" min="20" max="500" value="70">
            <button type="button" class="btn-remove-duration" onclick="rimuoviDurata(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    `;
}

function resetPackagesEditor() {
    const editor = document.getElementById('packagesEditor');
    editor.innerHTML = `
        <div class="package-item">
            <input type="text" class="package-name" placeholder="Nome pacchetto" maxlength="50" value="Trattamento Singolo">
            <input type="text" class="package-description" placeholder="Descrizione" maxlength="100" value="Standard">
            <input type="number" class="package-price" placeholder="Prezzo €" min="20" max="500" value="70">
            <button type="button" class="btn-remove-package" onclick="rimuoviPacchetto(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    `;
}

function resetExtrasEditor() {
    const editor = document.getElementById('extrasEditor');
    editor.innerHTML = `
        <div class="extra-item">
            <input type="text" class="extra-name" placeholder="Nome servizio" maxlength="50" value="Musica personalizzata">
            <input type="number" class="extra-price" placeholder="Prezzo +€" min="1" max="100" value="5">
            <button type="button" class="btn-remove-extra" onclick="rimuoviExtra(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    `;
}

// ===============================================
// SETUP DATI ESISTENTI
// ===============================================
function setupExistingTreatmentData(treatmentId) {
    const durateMock = {
        'coaching-trasformativo': [
            { duration: '60', price: '80' },
            { duration: '90', price: '110' }
        ],
        'massaggio-svedese': [
            { duration: '30', price: '45' },
            { duration: '60', price: '70' },
            { duration: '90', price: '95' },
            { duration: '120', price: '120' }
        ]
    };

    const pacchettiMock = {
        'massaggio-svedese': [
            { name: 'Trattamento Singolo', description: 'Massaggio svedese standard', price: '70' },
            { name: 'Pacchetto Relax', description: 'Massaggio + Aromaterapia', price: '90' },
            { name: 'Pacchetto Completo', description: 'Massaggio + Aromaterapia + Hot Stone', price: '120' }
        ]
    };

    const extraMock = {
        'massaggio-svedese': [
            { name: 'Musica personalizzata', price: '5' },
            { name: 'Candele aromatiche', price: '10' },
            { name: 'Oli essenziali premium', price: '15' }
        ]
    };

    const beneficiMock = {
        'coaching-trasformativo': [
            'Migliora autostima e consapevolezza',
            'Riduce stress e ansia',
            'Aumenta motivazione personale'
        ],
        'massaggio-svedese': [
            'Rilassa tensioni muscolari',
            'Migliora circolazione sanguigna',
            'Riduce stress psico-fisico'
        ]
    };

    const durate = durateMock[treatmentId] || [{ duration: '60', price: '70' }];
    const pacchetti = pacchettiMock[treatmentId] || [{ name: 'Trattamento Singolo', description: 'Standard', price: '70' }];
    const extra = extraMock[treatmentId] || [{ name: 'Musica personalizzata', price: '5' }];
    const benefici = beneficiMock[treatmentId] || ['Beneficio esempio'];

    setupDurationEditor(durate);
    setupPackagesEditor(pacchetti);
    setupExtrasEditor(extra);
    setupExistingBenefits(benefici);
}

function setupDurationEditor(durate) {
    const editor = document.getElementById('durationEditor');
    editor.innerHTML = '';

    durate.forEach(durata => {
        const durationHTML = `
            <div class="duration-item">
                <select class="duration-select">
                    <option value="30" ${durata.duration === '30' ? 'selected' : ''}>30 minuti</option>
                    <option value="45" ${durata.duration === '45' ? 'selected' : ''}>45 minuti</option>
                    <option value="60" ${durata.duration === '60' ? 'selected' : ''}>60 minuti</option>
                    <option value="75" ${durata.duration === '75' ? 'selected' : ''}>75 minuti</option>
                    <option value="90" ${durata.duration === '90' ? 'selected' : ''}>90 minuti</option>
                    <option value="120" ${durata.duration === '120' ? 'selected' : ''}>120 minuti</option>
                    <option value="180" ${durata.duration === '180' ? 'selected' : ''}>180 minuti</option>
                    <option value="240" ${durata.duration === '240' ? 'selected' : ''}>240 minuti</option>
                </select>
                <input type="number" class="price-input" placeholder="Prezzo €" min="20" max="500" value="${durata.price}">
                <button type="button" class="btn-remove-duration" onclick="rimuoviDurata(this)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>
        `;
        editor.insertAdjacentHTML('beforeend', durationHTML);
    });
}

function setupPackagesEditor(pacchetti) {
    const editor = document.getElementById('packagesEditor');
    editor.innerHTML = '';

    pacchetti.forEach(pacchetto => {
        const packageHTML = `
            <div class="package-item">
                <input type="text" class="package-name" placeholder="Nome pacchetto" maxlength="50" value="${pacchetto.name}">
                <input type="text" class="package-description" placeholder="Descrizione" maxlength="100" value="${pacchetto.description}">
                <input type="number" class="package-price" placeholder="Prezzo €" min="20" max="500" value="${pacchetto.price}">
                <button type="button" class="btn-remove-package" onclick="rimuoviPacchetto(this)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>
        `;
        editor.insertAdjacentHTML('beforeend', packageHTML);
    });
}

function setupExtrasEditor(extra) {
    const editor = document.getElementById('extrasEditor');
    editor.innerHTML = '';

    extra.forEach(servizio => {
        const extraHTML = `
            <div class="extra-item">
                <input type="text" class="extra-name" placeholder="Nome servizio" maxlength="50" value="${servizio.name}">
                <input type="number" class="extra-price" placeholder="Prezzo +€" min="1" max="100" value="${servizio.price}">
                <button type="button" class="btn-remove-extra" onclick="rimuoviExtra(this)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>
        `;
        editor.insertAdjacentHTML('beforeend', extraHTML);
    });
}

function setupExistingBenefits(benefici) {
    const editor = document.getElementById('benefitsEditor');
    editor.innerHTML = '';

    benefici.forEach(beneficio => {
        const benefitHTML = `
            <div class="benefit-item">
                <input type="text" value="${beneficio}" maxlength="100">
                <button type="button" class="btn-remove-benefit" onclick="rimuoviBeneficio(this)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>
        `;
        editor.insertAdjacentHTML('beforeend', benefitHTML);
    });
}

// ===============================================
// SALVATAGGIO TRATTAMENTO COMPLETO
// ===============================================
function salvaModificheTrattamento() {
    const modal = document.getElementById('modalModificaTrattamento');
    const isEditing = modal.dataset.editingId;

    const nome = document.getElementById('nomeTrattamento').value;
    const prezzoBase = document.getElementById('prezzoBase').value;
    const durata = document.getElementById('durataMinima').value;
    const servizioId = document.getElementById('servizioAppartenenza').value;
    const fileInput = document.getElementById('fotoTrattamento');

    if (!nome.trim() || !prezzoBase || !durata || !servizioId) {
        showNotification('Compila tutti i campi obbligatori', 'error');
        return;
    }

    const durationData = collectDurationData();
    const packageData = collectPackageData();
    const extraData = collectExtraData();
    const benefitsData = collectBenefitsData();
    const modalityData = collectModalityData();

    if (!validateAdvancedData(durationData, packageData, extraData)) {
        return;
    }

    const treatmentConfig = {
        nome: nome,
        prezzoBase: prezzoBase,
        durata: durata,
        servizioId: servizioId,
        durate: durationData,
        pacchetti: packageData,
        extra: extraData,
        benefici: benefitsData,
        modalita: modalityData
    };

    if (isEditing) {
        updateExistingTreatment(isEditing, nome, prezzoBase, durata, servizioId, fileInput);
    } else {
        createNewTreatment(nome, prezzoBase, durata, servizioId, fileInput);
    }

    saveTreatmentConfiguration(treatmentConfig);
    chiudiModal('modalModificaTrattamento');
}

// ===============================================
// RACCOLTA DATI DAI FORM
// ===============================================
function collectDurationData() {
    const durationItems = document.querySelectorAll('#durationEditor .duration-item');
    const durations = [];

    durationItems.forEach(item => {
        const duration = item.querySelector('.duration-select').value;
        const price = item.querySelector('.price-input').value;

        if (duration && price) {
            durations.push({ duration: duration, price: price });
        }
    });

    return durations;
}

function collectPackageData() {
    const packageItems = document.querySelectorAll('#packagesEditor .package-item');
    const packages = [];

    packageItems.forEach(item => {
        const name = item.querySelector('.package-name').value;
        const description = item.querySelector('.package-description').value;
        const price = item.querySelector('.package-price').value;

        if (name && description && price) {
            packages.push({ name: name, description: description, price: price });
        }
    });

    return packages;
}

function collectExtraData() {
    const extraItems = document.querySelectorAll('#extrasEditor .extra-item');
    const extras = [];

    extraItems.forEach(item => {
        const name = item.querySelector('.extra-name').value;
        const price = item.querySelector('.extra-price').value;

        if (name && price) {
            extras.push({ name: name, price: price });
        }
    });

    return extras;
}

function collectBenefitsData() {
    const benefitItems = document.querySelectorAll('#benefitsEditor .benefit-item');
    const benefits = [];

    benefitItems.forEach(item => {
        const benefit = item.querySelector('input').value;
        if (benefit.trim()) {
            benefits.push(benefit.trim());
        }
    });

    return benefits;
}

function collectModalityData() {
    const domicilio = document.getElementById('modalitaDomicilio').checked;
    const studio = document.getElementById('modalitaStudio').checked;

    return {
        domicilio: domicilio,
        studio: studio
    };
}

function validateAdvancedData(durations, packages, extras) {
    if (durations.length === 0) {
        showNotification('Aggiungi almeno una durata con prezzo', 'error');
        return false;
    }

    if (packages.length === 0) {
        showNotification('Aggiungi almeno un pacchetto', 'error');
        return false;
    }

    const durationsSet = new Set(durations.map(d => d.duration));
    if (durationsSet.size !== durations.length) {
        showNotification('Non puoi avere durate duplicate', 'error');
        return false;
    }

    return true;
}

function saveTreatmentConfiguration(config) {
    const treatmentId = config.nome.toLowerCase().replace(/[^a-z0-9]/g, '-');
    console.log('Configurazione trattamento salvata:', config);
    showNotification('Configurazione servizio-template aggiornata', 'success');
}

// ===============================================
// UPDATE E CREATE TRATTAMENTI
// ===============================================
function updateExistingTreatment(treatmentId, nome, prezzo, durata, servizioId, fileInput) {
    const treatmentItem = document.querySelector(`[data-treatment-id="${treatmentId}"]`);
    const currentServiceGroup = treatmentItem.closest('.service-group');
    const targetServiceGroup = document.querySelector(`[data-service-id="${servizioId}"]`);

    treatmentItem.querySelector('.treatment-title').textContent = nome;
    treatmentItem.querySelector('.treatment-price').textContent = `da ${prezzo} euro`;
    treatmentItem.querySelector('.treatment-duration').textContent = `${durata} min`;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            treatmentItem.querySelector('.treatment-image').src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }

    if (currentServiceGroup !== targetServiceGroup) {
        const treatmentsList = targetServiceGroup.querySelector('.treatments-list');
        const addButton = treatmentsList.querySelector('.add-treatment');
        treatmentsList.insertBefore(treatmentItem, addButton);

        updateServiceStats(currentServiceGroup);
        updateServiceStats(targetServiceGroup);
    }

    updateStats();
    showNotification('Trattamento aggiornato', 'success');
}

function createNewTreatment(nome, prezzo, durata, servizioId, fileInput) {
    const treatmentId = nome.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const newTreatmentHTML = `
        <div class="treatment-item" data-treatment-id="${treatmentId}">
            <div class="treatment-info">
                <img src="/assets/images/servizi/default.jpg" alt="${nome}" class="treatment-image">
                <div class="treatment-details">
                    <h4 class="treatment-title">${nome}</h4>
                    <p class="treatment-price">da ${prezzo} euro</p>
                    <div class="treatment-meta">
                        <span class="treatment-duration">${durata} min</span>
                        <span class="treatment-bookings">0 prenotazioni</span>
                    </div>
                </div>
            </div>
            <div class="treatment-actions">
                <button class="btn-edit-small" onclick="modificaTrattamento('${treatmentId}')">
                    Modifica
                </button>
                <button class="btn-delete-small" onclick="eliminaTrattamento('${treatmentId}')">
                    Elimina
                </button>
            </div>
        </div>
    `;

    const serviceGroup = document.querySelector(`[data-service-id="${servizioId}"]`);
    const treatmentsList = serviceGroup.querySelector('.treatments-list');
    const addButton = treatmentsList.querySelector('.add-treatment');

    addButton.insertAdjacentHTML('beforebegin', newTreatmentHTML);

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const newTreatment = addButton.previousElementSibling;
            newTreatment.querySelector('.treatment-image').src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }

    updateServiceStats(serviceGroup);
    updateStats();
    showNotification('Nuovo trattamento creato', 'success');
}

// ===============================================
// GESTIONE MODAL
// ===============================================
function chiudiModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// ===============================================
// GESTIONE UPLOAD IMMAGINI
// ===============================================
function setupImageUploads() {
    setupFileInputs();
}

function setupFileInputs() {
    const fileInputs = ['fotoServizio', 'fotoTrattamento', 'nuovaFotoServizio'];

    fileInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', function () {
                handleFileUpload(this, inputId);
            });
        }
    });
}

function handleFileUpload(input, inputId) {
    const file = input.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('Seleziona un file immagine valido', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showNotification('Il file deve essere inferiore a 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        let previewId, imgId;

        if (inputId === 'fotoServizio') {
            previewId = 'previewServizio';
            imgId = 'imgPreviewServizio';
        } else if (inputId === 'fotoTrattamento') {
            previewId = 'previewTrattamento';
            imgId = 'imgPreviewTrattamento';
        } else if (inputId === 'nuovaFotoServizio') {
            previewId = 'previewNuovoServizio';
            imgId = 'imgPreviewNuovoServizio';
        }

        const preview = document.getElementById(previewId);
        const img = document.getElementById(imgId);

        if (preview && img) {
            img.src = e.target.result;
            preview.style.display = 'block';
        }
    };

    reader.readAsDataURL(file);
}

// ===============================================
// AGGIORNAMENTO STATISTICHE
// ===============================================
function updateStats() {
    const totalServices = document.querySelectorAll('.service-group').length;
    const totalTreatments = document.querySelectorAll('.treatment-item').length;

    const servicesStat = document.getElementById('totalServices');
    const treatmentsStat = document.getElementById('totalTreatments');

    if (servicesStat) servicesStat.textContent = totalServices;
    if (treatmentsStat) treatmentsStat.textContent = totalTreatments;
}

function updateServiceStats(serviceGroup) {
    const treatmentsCount = serviceGroup.querySelectorAll('.treatment-item').length;
    const countSpan = serviceGroup.querySelector('.treatment-count');

    if (countSpan) {
        countSpan.textContent = `${treatmentsCount} ${treatmentsCount === 1 ? 'trattamento' : 'trattamenti'}`;
    }
}

function updateServicesSelect() {
    const select = document.getElementById('servizioAppartenenza');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="">Seleziona servizio</option>';

    const serviceGroups = document.querySelectorAll('.service-group');
    serviceGroups.forEach(group => {
        const serviceId = group.dataset.serviceId;
        const serviceName = group.querySelector('.service-title').textContent;

        const option = document.createElement('option');
        option.value = serviceId;
        option.textContent = serviceName;
        select.appendChild(option);
    });

    if (currentValue && document.querySelector(`option[value="${currentValue}"]`)) {
        select.value = currentValue;
    }
}

// ===============================================
// VALIDAZIONE FORM
// ===============================================
function setupFormValidation() {
    const textInputs = document.querySelectorAll('input[maxlength], textarea[maxlength]');

    textInputs.forEach(input => {
        input.addEventListener('input', function () {
            const maxLength = this.getAttribute('maxlength');
            const currentLength = this.value.length;

            if (currentLength > maxLength * 0.9) {
                this.style.borderColor = '#f59e0b';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });

    const priceInput = document.getElementById('prezzoBase');
    if (priceInput) {
        priceInput.addEventListener('input', function () {
            const value = parseFloat(this.value);
            if (value < 20 || value > 500) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
    }
}

// ===============================================
// AUTO-SAVE SISTEMA
// ===============================================
function setupAutoSave() {
    let hasChanges = false;

    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('change', function () {
            hasChanges = true;
        });
    });

    setInterval(() => {
        if (hasChanges) {
            console.log('Auto-save: Salvando modifiche...');
            hasChanges = false;
        }
    }, 30000);

    window.addEventListener('beforeunload', function (e) {
        if (hasChanges) {
            e.preventDefault();
            e.returnValue = 'Hai modifiche non salvate. Sei sicuro di voler uscire?';
        }
    });
}

// ===============================================
// SISTEMA NOTIFICHE
// ===============================================
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2000;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        padding: 16px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

    if (type === 'success') notification.style.borderLeftColor = '#22c55e';
    if (type === 'error') notification.style.borderLeftColor = '#ef4444';
    if (type === 'warning') notification.style.borderLeftColor = '#f59e0b';

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===============================================
// ESPORTAZIONE FUNZIONI GLOBALI
// ===============================================
window.aggiungiNuovoServizio = aggiungiNuovoServizio;
window.modificaServizio = modificaServizio;
window.eliminaServizio = eliminaServizio;
window.salvaModificheServizio = salvaModificheServizio;
window.creaNuovoServizio = creaNuovoServizio;
window.aggiungiTrattamento = aggiungiTrattamento;
window.modificaTrattamento = modificaTrattamento;
window.eliminaTrattamento = eliminaTrattamento;
window.salvaModificheTrattamento = salvaModificheTrattamento;
window.chiudiModal = chiudiModal;
window.aggiungiBeneficio = aggiungiBeneficio;
window.rimuoviBeneficio = rimuoviBeneficio;
window.aggiungiDurata = aggiungiDurata;
window.rimuoviDurata = rimuoviDurata;
window.aggiungiPacchetto = aggiungiPacchetto;
window.rimuoviPacchetto = rimuoviPacchetto;
window.aggiungiExtra = aggiungiExtra;
window.rimuoviExtra = rimuoviExtra;

// CSS dinamico per animazioni
const dynamicStyles = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.notification {
    border-left: 4px solid #3b82f6;
}

.notification-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.notification-message {
    font-size: 14px;
    color: var(--color-text);
    font-weight: 500;
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-secondary);
    padding: 4px;
    transition: color 0.3s ease;
}

.notification-close:hover {
    color: var(--color-text);
}
`;

if (!document.querySelector('#services-dynamic-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'services-dynamic-styles';
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
}

console.log('I Miei Servizi JS - Inizializzazione completata');