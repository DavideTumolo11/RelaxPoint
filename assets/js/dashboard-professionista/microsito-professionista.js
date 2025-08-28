/* ===============================================
   RELAXPOINT - JAVASCRIPT MICROSITO PROFESSIONISTA
   Gestisce editor completo per contenuti microsito
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    window.micrositoProfessionista = new MicrositoEditor();
});

class MicrositoEditor {
    constructor() {
        this.hasUnsavedChanges = false;
        this.autoSaveTimer = null;
        this.sections = {
            hero: {},
            chiSono: {},
            video: {},
            certificazioni: [],
            corsi: [],
            podcast: [],
            gallery: []
        };
        this.limits = {
            certificazioni: 10,
            corsi: 8,
            podcast: 6,
            gallery: 15
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAutoSave();
        this.setupDragAndDrop();
        this.loadData();
        this.updateCounters();
        this.addImageSuggestions();
        // Aggiungi stili CSS per i suggerimenti
        if (!document.querySelector('#image-suggestions-styles')) {
            const style = document.createElement('style');
            style.id = 'image-suggestions-styles';
            style.textContent = `
                .image-suggestion {
                    position: absolute;
                    bottom: 5px;
                    left: 5px;
                    right: 5px;
                    padding: 3px 6px;
                    background: rgba(45, 90, 61, 0.9);
                    color: white;
                    font-size: 10px;
                    text-align: center;
                    border-radius: 3px;
                    z-index: 10;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    font-weight: 500;
                }

                .corso-image:hover .image-suggestion,
                .podcast-cover:hover .image-suggestion,
                .gallery-image:hover .image-suggestion {
                    opacity: 1;
                }

                .corso-image,
                .podcast-cover,
                .gallery-image {
                    position: relative;
                }

                .image-suggestion-fixed {
                    display: block !important;
                    opacity: 1 !important;
                }

                .storia-image-container,
                .filosofia-image-container {
                    margin-bottom: 30px;
                }

                .corso-badges {
                    position: absolute;
                    bottom: 8px;
                    left: 8px;
                    display: flex;
                    gap: 4px;
                    z-index: 15;
                }

                .corso-type,
                .corso-duration {
                    padding: 3px 6px;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    font-size: 10px;
                    border-radius: 3px;
                    font-weight: 500;
                }

                .corso-type-online {
                    background: rgba(59, 130, 246, 0.9) !important;
                }

                .corso-type-presenza {
                    background: rgba(16, 185, 129, 0.9) !important;
                }

                .corso-type-ibrido {
                    background: rgba(245, 158, 11, 0.9) !important;
                }text small {
                    color: #64748b;
                    font-weight: 500;
                    line-height: 1.3;
                }
            `;
            document.head.appendChild(style);
        }

        console.log('Microsito Editor inizializzato');
    }

    addImageSuggestions() {
        // Hero Section - sempre visibile
        const heroUpload = document.querySelector('.hero-editor .upload-area');
        if (heroUpload && !heroUpload.querySelector('.image-suggestion-fixed')) {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'image-suggestion-fixed';
            suggestionDiv.innerHTML = `
                <small><strong>Dimensioni consigliate:</strong> 1200x600px minimo, formato 16:9 (landscape)<br>
                <em>Ideale per header: 1920x1080px</em></small>
            `;
            suggestionDiv.style.cssText = `
                margin-top: 8px;
                padding: 8px 12px;
                background: #f1f5f9;
                border-left: 3px solid var(--color-primary);
                border-radius: 4px;
                font-size: 12px;
                color: #475569;
                line-height: 1.4;
            `;
            heroUpload.appendChild(suggestionDiv);
        }

        // Storia Section
        const storiaContainer = document.querySelector('.storia-image-container');
        if (storiaContainer && !storiaContainer.querySelector('.image-suggestion-fixed')) {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'image-suggestion-fixed';
            suggestionDiv.innerHTML = `<small><strong>400x500px</strong> - Formato verticale (4:5)</small>`;
            suggestionDiv.style.cssText = `
                position: absolute;
                bottom: -25px;
                left: 0;
                right: 0;
                padding: 4px 8px;
                background: var(--color-primary);
                color: white;
                font-size: 11px;
                text-align: center;
                border-radius: 4px;
                font-weight: 500;
            `;
            storiaContainer.style.position = 'relative';
            storiaContainer.appendChild(suggestionDiv);
        }

        // Filosofia Section
        const filosofiaContainer = document.querySelector('.filosofia-image-container');
        if (filosofiaContainer && !filosofiaContainer.querySelector('.image-suggestion-fixed')) {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'image-suggestion-fixed';
            suggestionDiv.innerHTML = `<small><strong>400x500px</strong> - Formato verticale (4:5)</small>`;
            suggestionDiv.style.cssText = `
                position: absolute;
                bottom: -25px;
                left: 0;
                right: 0;
                padding: 4px 8px;
                background: var(--color-primary);
                color: white;
                font-size: 11px;
                text-align: center;
                border-radius: 4px;
                font-weight: 500;
            `;
            filosofiaContainer.style.position = 'relative';
            filosofiaContainer.appendChild(suggestionDiv);
        }
    }

    addSuggestionText(container, section) {
        const recommendations = this.getImageRecommendations(section);
        if (!recommendations) return;

        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'image-suggestion';
        suggestionDiv.innerHTML = `
            <div class="suggestion-text">
                <small>Consigliato: ${recommendations.minWidth}x${recommendations.minHeight}px - ${recommendations.description}</small>
            </div>
        `;

        // Stile inline per il suggerimento
        suggestionDiv.style.cssText = `
            margin-top: 8px;
            padding: 6px 10px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-size: 12px;
            color: #64748b;
            text-align: center;
        `;

        container.appendChild(suggestionDiv);
    }

    // Aggiunge suggerimenti dinamici per corsi, podcast e gallery
    addDynamicSuggestion(element, section) {
        const existing = element.querySelector('.image-suggestion');
        if (existing) return; // Non aggiungere se già presente

        const recommendations = this.getImageRecommendations(section);
        if (!recommendations) return;

        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'image-suggestion';
        suggestionDiv.innerHTML = `
            <small>Consigliato: ${recommendations.minWidth}x${recommendations.minHeight}px - ${recommendations.description}</small>
        `;

        suggestionDiv.style.cssText = `
            position: absolute;
            bottom: -25px;
            left: 0;
            right: 0;
            padding: 4px 8px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-size: 11px;
            text-align: center;
            border-radius: 0 0 4px 4px;
            z-index: 10;
        `;

        element.style.position = 'relative';
        element.appendChild(suggestionDiv);
    }

    setupDragAndDrop() {
        // Setup drag&drop per riordino servizi
        const serviziGrid = document.querySelector('.servizi-preview-grid');
        if (serviziGrid) {
            new Sortable(serviziGrid, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: (evt) => {
                    this.markAsChanged();
                    this.showNotification('Ordine servizi aggiornato', 'success');
                }
            });
        }
    }

    setupEventListeners() {
        // Auto-save su input changes
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.markAsChanged();

                // Aggiorna badge per corsi in tempo reale
                if (e.target.classList.contains('corso-type-select')) {
                    this.updateCorsoBadges(e.target);
                }
                if (e.target.classList.contains('corso-duration-input')) {
                    this.updateCorsoDurationBadge(e.target);
                }
            }
        });

        // Event delegation per elementi dinamici
        document.addEventListener('click', (e) => {
            // Gestione pennina edit corsi
            if (e.target.closest('.btn-change-corso-image')) {
                e.preventDefault();
                const corsoCard = e.target.closest('.corso-card');
                const corsoId = corsoCard?.getAttribute('data-id');
                if (corsoId) {
                    this.changeCorsoImage(corsoId);
                }
            }

            // Gestione pennina edit podcast
            if (e.target.closest('.btn-change-podcast-cover')) {
                e.preventDefault();
                const podcastCard = e.target.closest('.podcast-card');
                const podcastId = podcastCard?.getAttribute('data-id');
                if (podcastId) {
                    this.changePodcastCover(podcastId);
                }
            }

            // Gestione rimozione corsi
            if (e.target.closest('.btn-remove-corso')) {
                e.preventDefault();
                const corsoCard = e.target.closest('.corso-card');
                const corsoId = corsoCard?.getAttribute('data-id');
                if (corsoId) {
                    this.removeCorso(corsoId);
                }
            }

            // Gestione rimozione podcast
            if (e.target.closest('.btn-remove-podcast')) {
                e.preventDefault();
                const podcastCard = e.target.closest('.podcast-card');
                const podcastId = podcastCard?.getAttribute('data-id');
                if (podcastId) {
                    this.removePodcast(podcastId);
                }
            }
        });

        // Salvataggio esplicito per sezioni principali
        const saveChiSonoBtn = document.querySelector('.btn-edit[onclick="editSection(\'chi-sono\')"]');
        if (saveChiSonoBtn) {
            saveChiSonoBtn.onclick = (e) => {
                e.preventDefault();
                this.saveChiSonoSection();
            };
        }

        // Character count per textarea
        const storiaText = document.getElementById('storiaText');
        if (storiaText) {
            storiaText.addEventListener('input', () => this.updateCharCount('storia'));
        }

        const filosofiaText = document.getElementById('filosofiaText');
        if (filosofiaText) {
            filosofiaText.addEventListener('input', () => this.updateCharCount('filosofia'));
        }

        // Protezione page unload
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'Ci sono modifiche non salvate. Vuoi davvero uscire?';
            }
        });

        // Upload handlers
        this.setupFileUploadHandlers();
    }

    updateCorsoBadges(selectElement) {
        const corsoCard = selectElement.closest('.corso-card');
        const typeValue = selectElement.value;
        const badgeContainer = corsoCard.querySelector('.corso-badges');

        if (!badgeContainer) {
            // Crea i badge se non esistono
            const courseBadges = document.createElement('div');
            courseBadges.className = 'corso-badges';
            corsoCard.querySelector('.corso-image').appendChild(courseBadges);
        }

        const typeBadge = corsoCard.querySelector('.corso-type');
        if (typeBadge) {
            typeBadge.textContent = typeValue.charAt(0).toUpperCase() + typeValue.slice(1);

            // Colori diversi per tipo
            typeBadge.className = `corso-type corso-type-${typeValue}`;
        }
    }

    updateCorsoDurationBadge(inputElement) {
        const corsoCard = inputElement.closest('.corso-card');
        const durationBadge = corsoCard.querySelector('.corso-duration');

        if (durationBadge) {
            durationBadge.textContent = inputElement.value;
        }
    }

    saveChiSonoSection() {
        // Raccoglie tutti i dati della sezione Chi Sono
        const data = {
            titolo: document.getElementById('chiSonoTitolo')?.value || '',
            sottotitolo: document.getElementById('chiSonoSottotitolo')?.value || '',
            storiaText: document.getElementById('storiaText')?.value || '',
            filosofiaText: document.getElementById('filosofiaText')?.value || ''
        };

        // Cambia il pulsante durante il salvataggio
        const saveBtn = document.querySelector('.btn-edit[onclick*="chi-sono"]');
        const originalText = saveBtn ? saveBtn.innerHTML : '';

        if (saveBtn) {
            saveBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>Salvando...';
            saveBtn.disabled = true;
        }

        // Simula salvataggio
        this.updateSaveStatus('saving');

        setTimeout(() => {
            this.sections.chiSono = data;
            this.hasUnsavedChanges = false;
            this.updateSaveStatus('saved');
            this.showNotification('Sezione Chi Sono salvata con successo', 'success');

            // Ripristina il pulsante
            if (saveBtn) {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }
        }, 1500);
    }

    setupFileUploadHandlers() {
        // Hero image upload
        const heroImageInput = document.getElementById('heroImageInput');
        if (heroImageInput) {
            heroImageInput.addEventListener('change', (e) => {
                this.handleHeroImageUpload(e.target.files[0]);
            });
        }

        // Storia image upload
        const storiaImageInput = document.getElementById('storiaImageInput');
        if (storiaImageInput) {
            storiaImageInput.addEventListener('change', (e) => {
                this.handleStoriaImageUpload(e.target.files[0]);
            });
        }

        // Filosofia image upload
        const filosofiaImageInput = document.getElementById('filosofiaImageInput');
        if (filosofiaImageInput) {
            filosofiaImageInput.addEventListener('change', (e) => {
                this.handleFilosofiaImageUpload(e.target.files[0]);
            });
        }

        // Video upload
        const videoInput = document.getElementById('videoInput');
        if (videoInput) {
            videoInput.addEventListener('change', (e) => {
                this.handleVideoUpload(e.target.files[0]);
            });
        }
    }

    setupAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            if (this.hasUnsavedChanges) {
                this.autoSave();
            }
        }, 30000); // Auto-save ogni 30 secondi
    }

    markAsChanged() {
        this.hasUnsavedChanges = true;
        this.updateSaveStatus('modified');
    }

    updateSaveStatus(status) {
        const saveStatus = document.getElementById('saveStatus');
        if (!saveStatus) return;

        switch (status) {
            case 'modified':
                saveStatus.textContent = 'Modifiche non salvate';
                saveStatus.className = 'save-status modified';
                break;
            case 'saving':
                saveStatus.textContent = 'Salvataggio...';
                saveStatus.className = 'save-status saving';
                break;
            case 'saved':
                saveStatus.textContent = 'Salvato automaticamente';
                saveStatus.className = 'save-status saved';
                setTimeout(() => {
                    if (saveStatus.className === 'save-status saved') {
                        saveStatus.textContent = '';
                        saveStatus.className = 'save-status';
                    }
                }, 3000);
                break;
        }
    }

    // ===============================================
    // GESTIONE DATI E SALVATAGGIO
    // ===============================================

    loadData() {
        try {
            // Simula caricamento dati dal server
            this.sections.hero = {
                name: 'Sophia Rossi',
                role: 'Wellness Coach certificata'
            };

            this.sections.chiSono = {
                titolo: 'Chi Sono',
                sottotitolo: 'La mia storia, i miei valori e il percorso che mi ha portato a diventare Wellness Coach',
                storiaText: 'Sono Sophia Rossi, una Wellness Coach certificata con oltre 8 anni di esperienza...',
                filosofiaText: 'La mia filosofia si basa sulla convinzione che il benessere autentico...'
            };

            console.log('Dati microsito caricati');
        } catch (error) {
            console.error('Errore caricamento dati:', error);
            this.showNotification('Errore nel caricamento dei dati', 'error');
        }
    }

    autoSave() {
        this.updateSaveStatus('saving');

        // Simula salvataggio automatico
        setTimeout(() => {
            try {
                this.collectFormData();
                this.hasUnsavedChanges = false;
                this.updateSaveStatus('saved');
                console.log('Auto-save completato');
            } catch (error) {
                console.error('Errore auto-save:', error);
                this.updateSaveStatus('modified');
            }
        }, 1000);
    }

    collectFormData() {
        // Hero section
        this.sections.hero = {
            name: document.getElementById('heroName')?.value || '',
            role: document.getElementById('heroRole')?.value || ''
        };

        // Chi sono section
        this.sections.chiSono = {
            titolo: document.getElementById('chiSonoTitolo')?.value || '',
            sottotitolo: document.getElementById('chiSonoSottotitolo')?.value || '',
            storiaText: document.getElementById('storiaText')?.value || '',
            filosofiaText: document.getElementById('filosofiaText')?.value || ''
        };

        // Video section
        this.sections.video = {
            active: !document.getElementById('videoSection')?.classList.contains('hidden'),
            description: document.getElementById('videoDescription')?.value || ''
        };

        return this.sections;
    }

    // ===============================================
    // GESTIONE UPLOAD FILE
    // ===============================================

    handleHeroImageUpload(file) {
        if (!this.validateImageFile(file, 'hero')) return;

        const preview = document.getElementById('heroImagePreview');
        if (preview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                this.markAsChanged();
                this.showNotification('Immagine hero aggiornata', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    handleStoriaImageUpload(file) {
        if (!this.validateImageFile(file, 'storia')) return;

        const preview = document.getElementById('storiaImagePreview');
        if (preview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                this.markAsChanged();
                this.showNotification('Immagine storia aggiornata', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    handleFilosofiaImageUpload(file) {
        if (!this.validateImageFile(file, 'filosofia')) return;

        const preview = document.getElementById('filosofiaImagePreview');
        if (preview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                this.markAsChanged();
                this.showNotification('Immagine filosofia aggiornata', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    handleVideoUpload(file) {
        if (!this.validateVideoFile(file)) return;

        // Simula upload video con progress
        this.showNotification('Upload video in corso...', 'info');

        setTimeout(() => {
            this.markAsChanged();
            this.showNotification('Video caricato con successo', 'success');
        }, 2000);
    }

    validateImageFile(file, section = 'general') {
        if (!file) return false;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Formato file non supportato. Usa JPEG, PNG o WebP', 'error');
            return false;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            this.showNotification('File troppo grande. Massimo 5MB', 'error');
            return false;
        }

        // Controllo dimensioni raccomandate per sezione
        const img = new Image();
        img.onload = () => {
            const recommendations = this.getImageRecommendations(section);
            const { width, height } = img;
            const aspectRatio = width / height;

            if (recommendations) {
                const { minWidth, minHeight, maxWidth, maxHeight, aspectRange, description } = recommendations;

                let warnings = [];

                if (width < minWidth || height < minHeight) {
                    warnings.push(`Risoluzione minima: ${minWidth}x${minHeight}px`);
                }
                if (width > maxWidth || height > maxHeight) {
                    warnings.push(`Risoluzione massima: ${maxWidth}x${maxHeight}px`);
                }
                if (aspectRatio < aspectRange.min || aspectRatio > aspectRange.max) {
                    warnings.push(`Formato consigliato: ${description}`);
                }

                if (warnings.length > 0) {
                    this.showNotification(`Attenzione: ${warnings.join(', ')}`, 'warning');
                }
            }
        };

        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        return true;
    }

    getImageRecommendations(section) {
        const recommendations = {
            'hero': {
                minWidth: 1200,
                minHeight: 600,
                maxWidth: 1920,
                maxHeight: 1080,
                aspectRange: { min: 1.6, max: 2.1 },
                description: '16:9 o 21:9 (landscape)'
            },
            'storia': {
                minWidth: 400,
                minHeight: 500,
                maxWidth: 800,
                maxHeight: 1000,
                aspectRange: { min: 0.7, max: 0.9 },
                description: '4:5 (portrait)'
            },
            'filosofia': {
                minWidth: 400,
                minHeight: 500,
                maxWidth: 800,
                maxHeight: 1000,
                aspectRange: { min: 0.7, max: 0.9 },
                description: '4:5 (portrait)'
            },
            'corso': {
                minWidth: 300,
                minHeight: 200,
                maxWidth: 600,
                maxHeight: 400,
                aspectRange: { min: 1.4, max: 1.6 },
                description: '3:2 (landscape)'
            },
            'podcast': {
                minWidth: 300,
                minHeight: 300,
                maxWidth: 800,
                maxHeight: 800,
                aspectRange: { min: 0.9, max: 1.1 },
                description: '1:1 (quadrata)'
            },
            'gallery': {
                minWidth: 400,
                minHeight: 400,
                maxWidth: 800,
                maxHeight: 800,
                aspectRange: { min: 0.9, max: 1.1 },
                description: '1:1 (quadrata)'
            }
        };

        return recommendations[section] || null;
    }

    validateVideoFile(file) {
        if (!file) return false;

        const allowedTypes = ['video/mp4', 'video/webm', 'video/mov'];
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Formato video non supportato. Usa MP4, WebM o MOV', 'error');
            return false;
        }

        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            this.showNotification('Video troppo grande. Massimo 50MB', 'error');
            return false;
        }

        return true;
    }

    // ===============================================
    // GESTIONE CERTIFICAZIONI
    // ===============================================

    addCertificazione() {
        const modal = document.getElementById('modalCertificazione');
        if (modal) {
            modal.classList.add('show');
        }
    }

    saveCertificazione() {
        const nome = document.getElementById('newCertNome')?.value;
        const iconSelected = document.querySelector('.icon-option.selected');

        if (!nome || nome.trim() === '') {
            this.showNotification('Inserisci il nome della certificazione', 'error');
            return;
        }

        const currentCount = document.querySelectorAll('.certificazione-item').length;
        if (currentCount >= this.limits.certificazioni) {
            this.showNotification(`Massimo ${this.limits.certificazioni} certificazioni`, 'error');
            return;
        }

        const newId = 'cert' + (currentCount + 1);
        const iconType = iconSelected?.dataset.icon || 'certificate';

        const newCert = this.createCertificazioneHTML(newId, nome, iconType);

        const grid = document.getElementById('certificazioniGrid');
        if (grid) {
            grid.insertAdjacentHTML('beforeend', newCert);
            this.updateCounters();
            this.markAsChanged();
            this.showNotification('Certificazione aggiunta', 'success');
        }

        this.closeModal('modalCertificazione');
        document.getElementById('newCertNome').value = '';
    }

    createCertificazioneHTML(id, nome, iconType) {
        const iconPath = iconType === 'certificate'
            ? 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
            : 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z';

        return `
            <div class="certificazione-item" data-id="${id}">
                <div class="certificazione-content">
                    <div class="certificazione-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="${iconPath}"/>
                        </svg>
                    </div>
                    <span class="certificazione-nome">${nome}</span>
                </div>
                <button class="btn-remove-cert" onclick="window.micrositoProfessionista.removeCertificazione('${id}')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        `;
    }

    removeCertificazione(id) {
        const item = document.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.remove();
            this.updateCounters();
            this.markAsChanged();
            this.showNotification('Certificazione rimossa', 'success');
        }
    }

    // ===============================================
    // GESTIONE CORSI
    // ===============================================

    addCorso() {
        const currentCount = document.querySelectorAll('.corso-card').length;
        if (currentCount >= this.limits.corsi) {
            this.showNotification(`Massimo ${this.limits.corsi} corsi`, 'error');
            return;
        }

        // Upload immediato dell'immagine
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (this.validateImageFile(file, 'corso')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newId = 'corso' + (currentCount + 1);
                    const newCorso = this.createCorsoHTML(newId, event.target.result);

                    const grid = document.getElementById('corsiGrid');
                    if (grid) {
                        grid.insertAdjacentHTML('beforeend', newCorso);
                        this.updateCounters();
                        this.markAsChanged();
                        this.showNotification('Nuovo corso aggiunto', 'success');
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    createCorsoHTML(id, imageSrc = '/assets/images/corsi/default.jpg') {
        return `
            <div class="corso-card" data-id="${id}">
                <div class="corso-image" style="background-image: url('${imageSrc}');">
                    <button class="btn-change-corso-image">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <div class="corso-badges">
                        <span class="corso-type corso-type-online">Online</span>
                        <span class="corso-duration">4 settimane</span>
                    </div>
                    <div class="image-suggestion">
                        <small>Consigliato: 300x200px - 3:2 (landscape)</small>
                    </div>
                </div>
                <div class="corso-content">
                    <input type="text" class="corso-title" value="Nuovo Corso" maxlength="50">
                    <textarea class="corso-description" maxlength="150" rows="2" placeholder="Descrizione del corso..."></textarea>
                    <div class="corso-meta">
                        <select class="corso-type-select">
                            <option value="online" selected>Online</option>
                            <option value="presenza">In presenza</option>
                            <option value="ibrido">Ibrido</option>
                        </select>
                        <input type="text" class="corso-duration-input" value="4 settimane" maxlength="20">
                    </div>
                    <button class="btn-remove-corso">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                        Rimuovi
                    </button>
                </div>
            </div>
        `;
    }

    removeCorso(id) {
        const item = document.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.remove();
            this.updateCounters();
            this.markAsChanged();
            this.showNotification('Corso rimosso', 'success');
        }
    }

    changeCorsoImage(id) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (this.validateImageFile(file, 'corso')) {
                const corsoImage = document.querySelector(`[data-id="${id}"] .corso-image`);
                if (corsoImage) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        corsoImage.style.backgroundImage = `url(${event.target.result})`;
                        this.markAsChanged();
                        this.showNotification('Immagine corso aggiornata', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            }
        };
        input.click();
    }

    // ===============================================
    // GESTIONE PODCAST
    // ===============================================

    addPodcast() {
        const currentCount = document.querySelectorAll('.podcast-card').length;
        if (currentCount >= this.limits.podcast) {
            this.showNotification(`Massimo ${this.limits.podcast} podcast`, 'error');
            return;
        }

        // Upload immediato della cover
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (this.validateImageFile(file, 'podcast')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newId = 'podcast' + (currentCount + 1);
                    const newPodcast = this.createPodcastHTML(newId, event.target.result);

                    const grid = document.getElementById('podcastGrid');
                    if (grid) {
                        grid.insertAdjacentHTML('beforeend', newPodcast);
                        this.updateCounters();
                        this.markAsChanged();
                        this.showNotification('Nuovo podcast aggiunto', 'success');
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    createPodcastHTML(id, coverSrc = '/assets/images/podcast/default-cover.jpg') {
        return `
            <div class="podcast-card" data-id="${id}">
                <div class="podcast-cover" style="background-image: url('${coverSrc}');">
                    <button class="btn-change-podcast-cover">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <div class="podcast-play">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                    <div class="image-suggestion">
                        <small>Consigliato: 300x300px - 1:1 (quadrata)</small>
                    </div>
                </div>
                <div class="podcast-content">
                    <input type="text" class="podcast-title" value="Nuovo Podcast" maxlength="50">
                    <textarea class="podcast-description" maxlength="150" rows="2" placeholder="Descrizione del podcast..."></textarea>
                    <button class="btn-remove-podcast">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                        Rimuovi
                    </button>
                </div>
            </div>
        `;
    }

    removePodcast(id) {
        const item = document.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.remove();
            this.updateCounters();
            this.markAsChanged();
            this.showNotification('Podcast rimosso', 'success');
        }
    }

    changePodcastCover(id) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (this.validateImageFile(file, 'podcast')) {
                const podcastCover = document.querySelector(`[data-id="${id}"] .podcast-cover`);
                if (podcastCover) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        podcastCover.style.backgroundImage = `url(${event.target.result})`;
                        this.markAsChanged();
                        this.showNotification('Cover podcast aggiornata', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            }
        };
        input.click();
    }

    uploadPodcastAudio(id) {
        const fileInput = document.getElementById(`podcastFile${id}`);
        if (fileInput) {
            fileInput.click();
        }
    }

    // ===============================================
    // GESTIONE GALLERY
    // ===============================================

    addIspirazione() {
        const currentCount = document.querySelectorAll('.gallery-item').length;
        if (currentCount >= this.limits.gallery) {
            this.showNotification(`Massimo ${this.limits.gallery} immagini`, 'error');
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (this.validateImageFile(file, 'gallery')) {
                const newId = 'gallery' + (currentCount + 1);
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newGalleryItem = this.createGalleryHTML(newId, event.target.result);
                    const grid = document.getElementById('galleryGrid');
                    if (grid) {
                        grid.insertAdjacentHTML('beforeend', newGalleryItem);
                        this.updateCounters();
                        this.markAsChanged();
                        this.showNotification('Immagine aggiunta alla gallery', 'success');
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    createGalleryHTML(id, imageSrc) {
        return `
            <div class="gallery-item" data-id="${id}">
                <div class="gallery-image" style="background-image: url('${imageSrc}');">
                    <button class="btn-change-gallery-image" onclick="window.micrositoProfessionista.changeGalleryImage('${id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="btn-remove-gallery" onclick="window.micrositoProfessionista.removeGalleryItem('${id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                    <div class="image-suggestion">
                        <small>Consigliato: 400x400px - 1:1 (quadrata)</small>
                    </div>
                </div>
                <input type="text" class="gallery-title" value="Nuova immagine" maxlength="30">
            </div>
        `;
    }

    removeGalleryItem(id) {
        const item = document.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.remove();
            this.updateCounters();
            this.markAsChanged();
            this.showNotification('Immagine rimossa', 'success');
        }
    }

    changeGalleryImage(id) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (this.validateImageFile(file, 'gallery')) {
                const galleryImage = document.querySelector(`[data-id="${id}"] .gallery-image`);
                if (galleryImage) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        galleryImage.style.backgroundImage = `url(${event.target.result})`;
                        this.markAsChanged();
                        this.showNotification('Immagine aggiornata', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            }
        };
        input.click();
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================

    updateCounters() {
        // Aggiorna contatori per ogni sezione
        const certificazioni = document.querySelectorAll('.certificazioni-grid .certificazione-item').length;
        const corsi = document.querySelectorAll('.corsi-grid .corso-card').length;
        const podcast = document.querySelectorAll('.podcast-grid .podcast-card').length;
        const gallery = document.querySelectorAll('.gallery-grid .gallery-item').length;

        // Trova e aggiorna gli elementi counter (se esistenti)
        this.updateCounter('certificazioni', certificazioni, this.limits.certificazioni);
        this.updateCounter('corsi', corsi, this.limits.corsi);
        this.updateCounter('podcast', podcast, this.limits.podcast);
        this.updateCounter('gallery', gallery, this.limits.gallery);
    }

    updateCounter(type, current, max) {
        const counter = document.querySelector(`.count-limit[data-type="${type}"]`);
        if (counter) {
            counter.textContent = `${current}/${max}`;
            if (current >= max) {
                counter.style.color = '#ef4444';
            } else {
                counter.style.color = '#64748b';
            }
        }
    }

    updateCharCount(type) {
        let textarea, counter, maxLength;

        if (type === 'storia') {
            textarea = document.getElementById('storiaText');
            counter = document.getElementById('storiaCharCount');
            maxLength = 2000;
        } else if (type === 'filosofia') {
            textarea = document.getElementById('filosofiaText');
            counter = document.getElementById('filosofiaCharCount');
            maxLength = 1500;
        }

        if (textarea && counter) {
            const currentLength = textarea.value.length;
            counter.textContent = currentLength;

            // Cambia colore quando vicino al limite
            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#ef4444';
            } else if (currentLength > maxLength * 0.7) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#64748b';
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    showNotification(message, type = 'info') {
        // Crea toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
}

// ===============================================
// FUNZIONI GLOBALI ESPORTATE
// ===============================================

// Funzioni globali per gestire editing
function editSection(sectionId) {
    if (sectionId === 'chi-sono') {
        window.micrositoProfessionista.saveChiSonoSection();
    } else {
        console.log(`Editing section: ${sectionId}`);
    }
}

function toggleVideoSection() {
    const videoSection = document.getElementById('videoSection');
    const toggle = document.getElementById('videoToggle');

    if (videoSection && toggle) {
        const isHidden = videoSection.classList.contains('hidden');

        if (isHidden) {
            videoSection.classList.remove('hidden');
            toggle.innerHTML = '<span>Attivo</span>';
            toggle.classList.remove('inactive');
        } else {
            videoSection.classList.add('hidden');
            toggle.innerHTML = '<span>Disattivo</span>';
            toggle.classList.add('inactive');
        }

        window.micrositoProfessionista.markAsChanged();
    }
}

function uploadHeroImage() {
    document.getElementById('heroImageInput')?.click();
}

function changeStoriaImage() {
    document.getElementById('storiaImageInput')?.click();
}

function changeFilosofiaImage() {
    document.getElementById('filosofiaImageInput')?.click();
}

function uploadVideo() {
    document.getElementById('videoInput')?.click();
}

function removeVideo() {
    const videoThumbnail = document.querySelector('.video-thumbnail');
    if (videoThumbnail) {
        videoThumbnail.style.backgroundImage = 'url(/assets/images/default-video-thumb.jpg)';
        window.micrositoProfessionista.markAsChanged();
        window.micrositoProfessionista.showNotification('Video rimosso', 'success');
    }
}

function previewMicrosito() {
    // Simula apertura preview in nuova finestra
    window.micrositoProfessionista.showNotification('Apertura anteprima microsito...', 'info');
    setTimeout(() => {
        window.open('/pages/professionisti/microsito.html', '_blank');
    }, 1000);
}

function publishChanges() {
    if (window.micrositoProfessionista.hasUnsavedChanges) {
        window.micrositoProfessionista.updateSaveStatus('saving');

        setTimeout(() => {
            window.micrositoProfessionista.hasUnsavedChanges = false;
            window.micrositoProfessionista.updateSaveStatus('saved');
            window.micrositoProfessionista.showNotification('Modifiche pubblicate con successo!', 'success');
        }, 2000);
    } else {
        window.micrositoProfessionista.showNotification('Nessuna modifica da pubblicare', 'info');
    }
}

// Alias per funzioni chiamate da HTML
function addCertificazione() {
    window.micrositoProfessionista.addCertificazione();
}

function saveCertificazione() {
    window.micrositoProfessionista.saveCertificazione();
}

function addCorso() {
    window.micrositoProfessionista.addCorso();
}

function addPodcast() {
    window.micrositoProfessionista.addPodcast();
}

function addIspirazione() {
    window.micrositoProfessionista.addIspirazione();
}

function closeModal(modalId) {
    window.micrositoProfessionista.closeModal(modalId);
}

console.log('Microsito Professionista JS caricato completamente');