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
        // Dynamic limits based on Premium status
        this.isPremium = this.checkUserPremiumStatus();
        this.limits = {
            certificazioni: 10,
            corsi: 8,
            podcast: 6,
            gallery: this.isPremium ? 999 : 10 // Unlimited for Premium, 10 for Basic
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAutoSave();
        this.setupDragAndDrop();
        this.setupVideoInput();
        this.loadData();
        this.updateCounters();
        this.addImageSuggestions();
        console.log('Microsito Editor inizializzato');
    }

    checkUserPremiumStatus() {
        // TODO: Connect to backend API to get real user premium status
        // For now, check localStorage or a global variable
        return localStorage.getItem('userPremium') === 'true' || window.userProfile?.premium === true;
    }

    setupVideoInput() {
        const videoInput = document.getElementById('videoInput');
        if (videoInput) {
            videoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleVideoUpload(file);
                }
                // Clear input so same file can be selected again
                e.target.value = '';
            });
        }
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
    }

    setupDragAndDrop() {
        const serviziGrid = document.querySelector('.servizi-preview-grid');
        if (serviziGrid) {
            // Implementa Sortable se disponibile
            if (typeof Sortable !== 'undefined') {
                new Sortable(serviziGrid, {
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    onEnd: () => {
                        this.markAsChanged();
                        this.showNotification('Ordine servizi aggiornato', 'success');
                    }
                });
            }
        }
    }

    setupEventListeners() {
        // Auto-save su input changes
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.markAsChanged();
            }
        });

        // Event delegation per elementi dinamici
        document.addEventListener('click', (e) => {
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

        // Protezione page unload
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'Ci sono modifiche non salvate. Vuoi davvero uscire?';
            }
        });

        this.setupFileUploadHandlers();
    }

    setupFileUploadHandlers() {
        const heroImageInput = document.getElementById('heroImageInput');
        if (heroImageInput) {
            heroImageInput.addEventListener('change', (e) => {
                this.handleHeroImageUpload(e.target.files[0]);
            });
        }
    }

    setupAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            if (this.hasUnsavedChanges) {
                this.autoSave();
            }
        }, 30000);
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

    loadData() {
        try {
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
        this.sections.hero = {
            name: document.getElementById('heroName')?.value || '',
            role: document.getElementById('heroRole')?.value || ''
        };

        this.sections.chiSono = {
            titolo: document.getElementById('chiSonoTitolo')?.value || '',
            sottotitolo: document.getElementById('chiSonoSottotitolo')?.value || '',
            storiaText: document.getElementById('storiaText')?.value || '',
            filosofiaText: document.getElementById('filosofiaText')?.value || ''
        };

        return this.sections;
    }

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
        if (!nome || nome.trim() === '') {
            this.showNotification('Inserisci il nome della certificazione', 'error');
            return;
        }

        const currentCount = document.querySelectorAll('.certificazione-item').length;
        if (currentCount >= this.limits.certificazioni) {
            this.showNotification(`Massimo ${this.limits.certificazioni} certificazioni`, 'error');
            return;
        }

        // Crea e aggiungi certificazione
        this.updateCounters();
        this.markAsChanged();
        this.showNotification('Certificazione aggiunta', 'success');
        this.closeModal('modalCertificazione');
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
    // GESTIONE CORSI - SISTEMA ALBUM
    // ===============================================

    addCorso() {
        if (this.sections.corsi.length >= this.limits.corsi) {
            this.showNotification('Limite massimo corsi raggiunto (8)', 'warning');
            return;
        }
        this.openCorsoSeriesModal();
    }

    openCorsoSeriesModal() {
        const modalHTML = `
            <div class="modal-overlay album-modal-overlay" id="corsoSeriesModal">
                <div class="modal-content album-modal large">
                    <div class="modal-header">
                        <h3>Nuovo Corso</h3>
                        <button class="btn-close" onclick="window.micrositoProfessionista.closeAlbumModal('corsoSeriesModal')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="series-info">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="corsoSeriesTitle">Titolo Corso</label>
                                    <input type="text" id="corsoSeriesTitle" maxlength="100" placeholder="Es. Yoga per Principianti">
                                </div>
                                <div class="form-group">
                                    <label for="corsoSeriesLevel">Livello</label>
                                    <select id="corsoSeriesLevel">
                                        <option value="principiante">Principiante</option>
                                        <option value="intermedio">Intermedio</option>
                                        <option value="avanzato">Avanzato</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Copertina Corso</label>
                                <div class="cover-upload-area" onclick="document.getElementById('corsoCoverInput').click()">
                                    <input type="file" id="corsoCoverInput" accept="image/*" style="display:none">
                                    <div class="cover-preview" id="corsoCoverPreview">
                                        <div class="upload-placeholder">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                            <span>Carica Copertina</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="lessons-section">
                                <div class="section-header">
                                    <h4>Lezioni</h4>
                                    <button class="btn-add-lesson" onclick="window.micrositoProfessionista.addCorsoLesson()">Aggiungi Lezione</button>
                                </div>
                                <div class="lessons-list" id="corsoLessonsList">
                                    <!-- Lezioni aggiunte dinamicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn-cancel" onclick="window.micrositoProfessionista.closeAlbumModal('corsoSeriesModal')">Annulla</button>
                        <button class="btn-save" onclick="window.micrositoProfessionista.saveCorsoSeries()">Salva Corso</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Setup event listener per cover upload
        document.getElementById('corsoCoverInput').addEventListener('change', (e) => {
            this.handleCorsoCoverUpload(e.target.files[0]);
        });
    }

    addCorsoLesson() {
        const lessonsList = document.getElementById('corsoLessonsList');
        const lessonNumber = lessonsList.children.length + 1;

        const lessonHTML = `
            <div class="lesson-item" data-lesson="${lessonNumber}">
                <div class="lesson-number">${lessonNumber}</div>
                <div class="lesson-content">
                    <div class="form-group">
                        <input type="text" class="lesson-title" placeholder="Titolo lezione ${lessonNumber}" maxlength="80">
                    </div>
                    <div class="form-group">
                        <textarea class="lesson-description" placeholder="Descrizione della lezione..." maxlength="300" rows="2"></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" class="lesson-duration" placeholder="45 min" maxlength="10">
                            <small>Durata</small>
                        </div>
                        <div class="form-group">
                            <select class="lesson-type">
                                <option value="pratica">Pratica</option>
                                <option value="teoria">Teoria</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="material-upload-btn" onclick="window.micrositoProfessionista.uploadLessonMaterial(${lessonNumber})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                            <span>Carica Materiale</span>
                        </div>
                        <input type="file" class="lesson-material-input" accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3" style="display:none" onchange="window.micrositoProfessionista.handleMaterialUpload(${lessonNumber}, this)">
                    </div>
                </div>
                <button class="btn-remove-lesson" onclick="window.micrositoProfessionista.removeCorsoLesson(${lessonNumber})">&times;</button>
            </div>
        `;

        lessonsList.insertAdjacentHTML('beforeend', lessonHTML);
    }

    uploadLessonMaterial(lessonNumber) {
        const materialInput = document.querySelector(`[data-lesson="${lessonNumber}"] .lesson-material-input`);
        materialInput.click();
    }

    handleMaterialUpload(lessonNumber, input) {
        const file = input.files[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'video/mp4',
            'audio/mp3'
        ];

        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Formato file non supportato. Usa PDF, DOC, PPT, MP4 o MP3', 'error');
            return;
        }

        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            this.showNotification('File troppo grande. Massimo 100MB', 'error');
            return;
        }

        // Simula upload
        const uploadBtn = input.previousElementSibling;
        uploadBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            <span>${file.name}</span>
        `;
        uploadBtn.style.background = '#10b981';

        this.showNotification(`Materiale lezione ${lessonNumber} caricato`, 'success');
    }

    removeCorsoLesson(lessonNumber) {
        const lessonItem = document.querySelector(`[data-lesson="${lessonNumber}"]`);
        if (lessonItem) {
            lessonItem.remove();
            this.renumberCorsoLessons();
        }
    }

    renumberCorsoLessons() {
        const lessons = document.querySelectorAll('.lesson-item');
        lessons.forEach((lesson, index) => {
            const newNumber = index + 1;
            lesson.dataset.lesson = newNumber;
            lesson.querySelector('.lesson-number').textContent = newNumber;
            lesson.querySelector('.lesson-title').placeholder = `Titolo lezione ${newNumber}`;
            lesson.querySelector('.btn-remove-lesson').setAttribute('onclick', `window.micrositoProfessionista.removeCorsoLesson(${newNumber})`);
        });
    }

    handleCorsoCoverUpload(file) {
        if (this.validateImageFile(file, 'corso')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('corsoCoverPreview');
                preview.innerHTML = `<img src="${e.target.result}" alt="Copertina corso">`;
            };
            reader.readAsDataURL(file);
        }
    }

    saveCorsoSeries() {
        const title = document.getElementById('corsoSeriesTitle').value.trim();
        const level = document.getElementById('corsoSeriesLevel').value;
        const cover = document.querySelector('#corsoCoverPreview img');
        const lessons = this.collectCorsoLessons();

        if (!title) {
            this.showNotification('Il titolo è obbligatorio', 'error');
            return;
        }

        if (!cover) {
            this.showNotification('La copertina è obbligatoria', 'error');
            return;
        }

        if (lessons.length === 0) {
            this.showNotification('Aggiungi almeno una lezione', 'error');
            return;
        }

        const seriesData = {
            id: 'corso_' + Date.now(),
            title,
            level,
            cover: cover.src,
            lessons,
            createdAt: new Date().toISOString()
        };

        this.sections.corsi.push(seriesData);
        this.markAsChanged();
        this.updateCounters();

        this.closeAlbumModal('corsoSeriesModal');
        this.showNotification('Corso salvato con successo', 'success');
    }

    collectCorsoLessons() {
        const lessons = [];
        document.querySelectorAll('.lesson-item').forEach((item, index) => {
            const title = item.querySelector('.lesson-title').value.trim();
            const duration = item.querySelector('.lesson-duration').value.trim();
            const type = item.querySelector('.lesson-type').value;

            if (title && duration) {
                lessons.push({
                    number: index + 1,
                    title,
                    duration,
                    type
                });
            }
        });

        return lessons;
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

    // ===============================================
    // GESTIONE PODCAST - SISTEMA ALBUM
    // ===============================================

    addPodcast() {
        if (this.sections.podcast.length >= this.limits.podcast) {
            this.showNotification('Limite massimo podcast raggiunto (6)', 'warning');
            return;
        }
        this.openPodcastSeriesModal();
    }

    openPodcastSeriesModal() {
        const modalHTML = `
            <div class="modal-overlay album-modal-overlay" id="podcastSeriesModal">
                <div class="modal-content album-modal large">
                    <div class="modal-header">
                        <h3>Nuova Serie Podcast</h3>
                        <button class="btn-close" onclick="window.micrositoProfessionista.closeAlbumModal('podcastSeriesModal')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="series-info">
                            <div class="form-group">
                                <label for="podcastSeriesTitle">Titolo Serie</label>
                                <input type="text" id="podcastSeriesTitle" maxlength="100" placeholder="Es. Mindfulness per Principianti">
                            </div>
                            
                            <div class="form-group">
                                <label>Copertina Serie</label>
                                <div class="cover-upload-area" onclick="document.getElementById('podcastCoverInput').click()">
                                    <input type="file" id="podcastCoverInput" accept="image/*" style="display:none">
                                    <div class="cover-preview" id="podcastCoverPreview">
                                        <div class="upload-placeholder">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                            <span>Carica Copertina</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="episodes-section">
                                <div class="section-header">
                                    <h4>Episodi</h4>
                                    <button class="btn-add-episode" onclick="window.micrositoProfessionista.addPodcastEpisode()">Aggiungi Episodio</button>
                                </div>
                                <div class="episodes-list" id="podcastEpisodesList">
                                    <!-- Episodi aggiunti dinamicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn-cancel" onclick="window.micrositoProfessionista.closeAlbumModal('podcastSeriesModal')">Annulla</button>
                        <button class="btn-save" onclick="window.micrositoProfessionista.savePodcastSeries()">Salva Serie</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('podcastCoverInput').addEventListener('change', (e) => {
            this.handlePodcastCoverUpload(e.target.files[0]);
        });
    }

    addPodcastEpisode() {
        const episodesList = document.getElementById('podcastEpisodesList');
        const episodeNumber = episodesList.children.length + 1;

        const episodeHTML = `
            <div class="episode-item" data-episode="${episodeNumber}">
                <div class="episode-number">${episodeNumber}</div>
                <div class="episode-content">
                    <div class="form-group">
                        <input type="text" class="episode-title" placeholder="Titolo episodio ${episodeNumber}" maxlength="80">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" class="episode-duration" placeholder="15:30" maxlength="10">
                            <small>Durata</small>
                        </div>
                        <div class="form-group">
                            <div class="audio-upload-btn" onclick="window.micrositoProfessionista.uploadEpisodeAudio(${episodeNumber})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                </svg>
                                <span>Carica Audio</span>
                            </div>
                            <input type="file" class="episode-audio-input" accept="audio/*" style="display:none" onchange="window.micrositoProfessionista.handleAudioUpload(${episodeNumber}, this)">
                        </div>
                    </div>
                </div>
                <button class="btn-remove-episode" onclick="window.micrositoProfessionista.removePodcastEpisode(${episodeNumber})">&times;</button>
            </div>
        `;

        episodesList.insertAdjacentHTML('beforeend', episodeHTML);
    }

    uploadEpisodeAudio(episodeNumber) {
        const audioInput = document.querySelector(`[data-episode="${episodeNumber}"] .episode-audio-input`);
        audioInput.click();
    }

    handleAudioUpload(episodeNumber, input) {
        const file = input.files[0];
        if (!file) return;

        const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg'];
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Formato audio non supportato. Usa MP3, WAV, M4A o OGG', 'error');
            return;
        }

        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            this.showNotification('File audio troppo grande. Massimo 50MB', 'error');
            return;
        }

        // Simula upload
        const uploadBtn = input.previousElementSibling;
        uploadBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            <span>Audio Caricato</span>
        `;
        uploadBtn.style.background = '#10b981';

        this.showNotification(`Audio episodio ${episodeNumber} caricato`, 'success');
    }

    removePodcastEpisode(episodeNumber) {
        const episodeItem = document.querySelector(`[data-episode="${episodeNumber}"]`);
        if (episodeItem) {
            episodeItem.remove();
            this.renumberPodcastEpisodes();
        }
    }

    renumberPodcastEpisodes() {
        const episodes = document.querySelectorAll('.episode-item');
        episodes.forEach((episode, index) => {
            const newNumber = index + 1;
            episode.dataset.episode = newNumber;
            episode.querySelector('.episode-number').textContent = newNumber;
            episode.querySelector('.episode-title').placeholder = `Titolo episodio ${newNumber}`;
            episode.querySelector('.btn-remove-episode').setAttribute('onclick', `window.micrositoProfessionista.removePodcastEpisode(${newNumber})`);
        });
    }

    handlePodcastCoverUpload(file) {
        if (this.validateImageFile(file, 'podcast')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('podcastCoverPreview');
                preview.innerHTML = `<img src="${e.target.result}" alt="Copertina podcast">`;
            };
            reader.readAsDataURL(file);
        }
    }

    savePodcastSeries() {
        const title = document.getElementById('podcastSeriesTitle').value.trim();
        const cover = document.querySelector('#podcastCoverPreview img');
        const episodes = this.collectPodcastEpisodes();

        if (!title) {
            this.showNotification('Il titolo è obbligatorio', 'error');
            return;
        }

        if (!cover) {
            this.showNotification('La copertina è obbligatoria', 'error');
            return;
        }

        if (episodes.length === 0) {
            this.showNotification('Aggiungi almeno un episodio', 'error');
            return;
        }

        const seriesData = {
            id: 'podcast_' + Date.now(),
            title,
            cover: cover.src,
            episodes,
            createdAt: new Date().toISOString()
        };

        this.sections.podcast.push(seriesData);
        this.markAsChanged();
        this.updateCounters();

        this.closeAlbumModal('podcastSeriesModal');
        this.showNotification('Serie podcast salvata con successo', 'success');
    }

    collectPodcastEpisodes() {
        const episodes = [];
        document.querySelectorAll('.episode-item').forEach((item, index) => {
            const title = item.querySelector('.episode-title').value.trim();
            const duration = item.querySelector('.episode-duration').value.trim();

            if (title && duration) {
                episodes.push({
                    number: index + 1,
                    title,
                    duration
                });
            }
        });

        return episodes;
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

    // ===============================================
    // GESTIONE GALLERY - SISTEMA ALBUM
    // ===============================================

    addIspirazione() {
        if (this.sections.gallery.length >= this.limits.gallery) {
            if (!this.isPremium) {
                this.showPremiumLimitModal('foto', this.sections.gallery.length, 10);
                return;
            }
            this.showNotification('Limite massimo ispirazioni raggiunto', 'warning');
            return;
        }
        this.openGalleryAlbumModal();
    }

    openGalleryAlbumModal() {
        const modalHTML = `
            <div class="modal-overlay album-modal-overlay" id="galleryAlbumModal">
                <div class="modal-content album-modal">
                    <div class="modal-header">
                        <h3>Nuova Ispirazione</h3>
                        <button class="btn-close" onclick="window.micrositoProfessionista.closeAlbumModal('galleryAlbumModal')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="galleryAlbumTitle">Titolo Ispirazione</label>
                            <input type="text" id="galleryAlbumTitle" maxlength="80" placeholder="Es. Sessione Mindfulness">
                        </div>
                        
                        <div class="form-group">
                            <label>Foto Album (max 10)</label>
                            <div class="album-upload-area">
                                <div class="album-grid" id="galleryAlbumGrid">
                                    <div class="add-photo-btn" onclick="window.micrositoProfessionista.addGalleryPhoto()">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                        </svg>
                                        <span>Aggiungi Foto</span>
                                    </div>
                                </div>
                                <input type="file" id="galleryPhotosInput" multiple accept="image/*" style="display:none">
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn-cancel" onclick="window.micrositoProfessionista.closeAlbumModal('galleryAlbumModal')">Annulla</button>
                        <button class="btn-save" onclick="window.micrositoProfessionista.saveGalleryAlbum()">Salva Ispirazione</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('galleryPhotosInput').addEventListener('change', (e) => {
            this.handleGalleryPhotosUpload(e.target.files);
        });
    }

    addGalleryPhoto() {
        document.getElementById('galleryPhotosInput').click();
    }

    handleGalleryPhotosUpload(files) {
        const grid = document.getElementById('galleryAlbumGrid');
        const currentPhotos = grid.querySelectorAll('.photo-item').length;
        const addBtn = grid.querySelector('.add-photo-btn');

        if (currentPhotos + files.length > 10) {
            this.showNotification('Massimo 10 foto per album', 'warning');
            return;
        }

        Array.from(files).forEach((file, index) => {
            if (this.validateImageFile(file, 'gallery')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const photoHTML = `
                        <div class="photo-item" data-index="${currentPhotos + index}">
                            <img src="${e.target.result}" alt="Foto album">
                            <div class="photo-overlay">
                                <button class="btn-remove-photo" onclick="window.micrositoProfessionista.removeGalleryPhoto(${currentPhotos + index})">&times;</button>
                            </div>
                        </div>
                    `;
                    addBtn.insertAdjacentHTML('beforebegin', photoHTML);
                };
                reader.readAsDataURL(file);
            }
        });

        // Nascondi bottone aggiungi se raggiunti 10 foto
        if (currentPhotos + files.length >= 10) {
            addBtn.style.display = 'none';
        }
    }

    removeGalleryPhoto(index) {
        const photoItem = document.querySelector(`[data-index="${index}"]`);
        if (photoItem) {
            photoItem.remove();

            // Rimostra bottone aggiungi se sotto il limite
            const grid = document.getElementById('galleryAlbumGrid');
            const addBtn = grid.querySelector('.add-photo-btn');
            const remainingPhotos = grid.querySelectorAll('.photo-item').length;

            if (remainingPhotos < 10) {
                addBtn.style.display = 'flex';
            }
        }
    }

    saveGalleryAlbum() {
        const title = document.getElementById('galleryAlbumTitle').value.trim();
        const photos = document.querySelectorAll('#galleryAlbumGrid .photo-item img');

        if (!title) {
            this.showNotification('Il titolo è obbligatorio', 'error');
            return;
        }

        if (photos.length === 0) {
            this.showNotification('Aggiungi almeno una foto', 'error');
            return;
        }

        const albumData = {
            id: 'gallery_' + Date.now(),
            title,
            photos: Array.from(photos).map(img => ({
                src: img.src,
                alt: img.alt
            })),
            createdAt: new Date().toISOString()
        };

        this.sections.gallery.push(albumData);
        this.markAsChanged();
        this.updateCounters();
        this.renderGalleryAlbum(albumData); // Aggiungi alla gallery principale

        this.closeAlbumModal('galleryAlbumModal');
        this.showNotification('Ispirazione salvata con successo', 'success');
    }

    // Renderizza album nella gallery principale
    renderGalleryAlbum(albumData) {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;

        const albumHTML = `
            <div class="gallery-item album-item" data-id="${albumData.id}">
                <div class="gallery-image" style="background-image: url('${albumData.photos[0].src}');">
                    <div class="album-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
                        </svg>
                        <span>${albumData.photos.length}</span>
                    </div>
                    <button class="btn-edit-album" onclick="window.micrositoProfessionista.editGalleryAlbum('${albumData.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="btn-remove-gallery" onclick="window.micrositoProfessionista.removeGalleryAlbum('${albumData.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <input type="text" class="gallery-title" value="${albumData.title}" maxlength="30" onchange="window.micrositoProfessionista.updateAlbumTitle('${albumData.id}', this.value)">
            </div>
        `;

        galleryGrid.insertAdjacentHTML('beforeend', albumHTML);
    }

    editGalleryAlbum(albumId) {
        const album = this.sections.gallery.find(item => item.id === albumId);
        if (!album) return;

        // Riapri modal con dati esistenti
        this.openGalleryAlbumModal();

        setTimeout(() => {
            document.getElementById('galleryAlbumTitle').value = album.title;

            const grid = document.getElementById('galleryAlbumGrid');
            const addBtn = grid.querySelector('.add-photo-btn');

            // Rimuovi foto esistenti dal modal
            grid.querySelectorAll('.photo-item').forEach(item => item.remove());

            // Aggiungi foto esistenti
            album.photos.forEach((photo, index) => {
                const photoHTML = `
                    <div class="photo-item" data-index="${index}">
                        <img src="${photo.src}" alt="${photo.alt}">
                        <div class="photo-overlay">
                            <button class="btn-remove-photo" onclick="window.micrositoProfessionista.removeGalleryPhoto(${index})">&times;</button>
                        </div>
                    </div>
                `;
                addBtn.insertAdjacentHTML('beforebegin', photoHTML);
            });

            // Nascondi bottone se 10 foto
            if (album.photos.length >= 10) {
                addBtn.style.display = 'none';
            }

            // Cambia azione salvataggio per update
            const saveBtn = document.querySelector('.btn-save');
            saveBtn.onclick = () => this.updateGalleryAlbum(albumId);
            saveBtn.textContent = 'Aggiorna Album';
        }, 100);
    }

    updateGalleryAlbum(albumId) {
        const title = document.getElementById('galleryAlbumTitle').value.trim();
        const photos = document.querySelectorAll('#galleryAlbumGrid .photo-item img');

        if (!title) {
            this.showNotification('Il titolo è obbligatorio', 'error');
            return;
        }

        if (photos.length === 0) {
            this.showNotification('Aggiungi almeno una foto', 'error');
            return;
        }

        // Trova e aggiorna album
        const albumIndex = this.sections.gallery.findIndex(item => item.id === albumId);
        if (albumIndex !== -1) {
            this.sections.gallery[albumIndex] = {
                ...this.sections.gallery[albumIndex],
                title,
                photos: Array.from(photos).map(img => ({
                    src: img.src,
                    alt: img.alt
                })),
                updatedAt: new Date().toISOString()
            };

            // Aggiorna nella UI
            const albumElement = document.querySelector(`[data-id="${albumId}"]`);
            if (albumElement) {
                const titleInput = albumElement.querySelector('.gallery-title');
                const imageDiv = albumElement.querySelector('.gallery-image');
                const badge = albumElement.querySelector('.album-badge span');

                titleInput.value = title;
                imageDiv.style.backgroundImage = `url('${photos[0].src}')`;
                badge.textContent = photos.length;
            }

            this.markAsChanged();
            this.closeAlbumModal('galleryAlbumModal');
            this.showNotification('Album aggiornato con successo', 'success');
        }
    }

    removeGalleryAlbum(albumId) {
        if (confirm('Sei sicuro di voler eliminare questo album? L\'operazione non può essere annullata.')) {
            // Rimuovi dal data
            this.sections.gallery = this.sections.gallery.filter(item => item.id !== albumId);

            // Rimuovi dalla UI
            const albumElement = document.querySelector(`[data-id="${albumId}"]`);
            if (albumElement) {
                albumElement.remove();
            }

            this.markAsChanged();
            this.updateCounters();
            this.showNotification('Album eliminato', 'success');
        }
    }

    updateAlbumTitle(albumId, newTitle) {
        const albumIndex = this.sections.gallery.findIndex(item => item.id === albumId);
        if (albumIndex !== -1) {
            this.sections.gallery[albumIndex].title = newTitle;
            this.markAsChanged();
        }
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================

    updateCounters() {
        const certificazioni = document.querySelectorAll('.certificazioni-grid .certificazione-item').length;
        const corsi = document.querySelectorAll('.corsi-grid .corso-card').length;
        const podcast = document.querySelectorAll('.podcast-grid .podcast-card').length;
        const gallery = document.querySelectorAll('.gallery-grid .gallery-item').length;

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

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    closeAlbumModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
    }

    showNotification(message, type = 'info') {
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

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);

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

    // ===============================================
    // PREMIUM LIMITS SYSTEM
    // ===============================================
    showPremiumLimitModal(type, current, limit) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay premium-limit-modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>⚡ Limite ${type} raggiunto</h3>
                    <button class="btn-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="premium-limit-content">
                        <div class="limit-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#f59e0b">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <p>Hai raggiunto il limite di <strong>${limit} ${type}</strong> per gli utenti Basic.</p>
                        <p>Attualmente hai <strong>${current} ${type}</strong> attive.</p>
                        <div class="premium-benefits">
                            <h4>🎯 Con RelaxPoint Premium ottieni:</h4>
                            <ul>
                                <li>✅ Foto illimitate</li>
                                <li>✅ Video fino a 60 secondi</li>
                                <li>✅ Servizi illimitati</li>
                                <li>✅ Priority nei risultati di ricerca</li>
                                <li>✅ Analytics avanzati</li>
                                <li>✅ CRM integrato</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" onclick="this.closest('.modal-overlay').remove()">
                        Chiudi
                    </button>
                    <button class="btn-premium" onclick="upgradeToPremium()">
                        ⚡ Passa a Premium
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // ===============================================
    // GESTIONE VIDEO PRESENTAZIONE
    // ===============================================
    uploadVideo() {
        document.getElementById('videoInput').click();
    }

    handleVideoUpload(file) {
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('video/')) {
            this.showNotification('Seleziona un file video valido', 'error');
            return;
        }

        // Check file size (max 100MB)
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showNotification('Il video deve essere inferiore a 100MB', 'error');
            return;
        }

        // Check video duration based on Premium status
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            const duration = video.duration;
            const maxDuration = this.isPremium ? 60 : 30; // Premium: 60s, Basic: 30s

            if (duration > maxDuration) {
                if (!this.isPremium) {
                    this.showPremiumLimitModal('video', `${Math.round(duration)}s`, '30s');
                } else {
                    this.showNotification('Video troppo lungo. Massimo 60 secondi per Premium', 'error');
                }
                return;
            }

            // Process video upload
            this.processVideoUpload(file, duration);
        };

        video.onerror = () => {
            this.showNotification('Errore nel caricamento del video', 'error');
        };

        video.src = URL.createObjectURL(file);
    }

    processVideoUpload(file, duration) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const videoPreview = document.querySelector('.video-preview .video-thumbnail');
            const durationSpan = document.querySelector('.video-duration');

            // Update preview
            videoPreview.style.backgroundImage = `url(${e.target.result})`;
            durationSpan.textContent = `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`;

            // Store video data
            this.sections.video = {
                file: file,
                duration: duration,
                description: document.getElementById('videoDescription')?.value || ''
            };

            this.markAsChanged();
            this.showNotification('Video caricato correttamente', 'success');
        };

        reader.readAsDataURL(file);
    }

    removeVideo() {
        const videoPreview = document.querySelector('.video-preview .video-thumbnail');
        const durationSpan = document.querySelector('.video-duration');

        // Reset preview
        videoPreview.style.backgroundImage = "url('/assets/images/Gemini_Generated_Image_1521g81521g81521.png')";
        durationSpan.textContent = "0:00";

        // Clear video data
        this.sections.video = {};

        this.markAsChanged();
        this.showNotification('Video rimosso', 'success');
    }
}

// ===============================================
// FUNZIONI GLOBALI ESPORTATE
// ===============================================

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

function previewMicrosito() {
    // Raccogli i dati attuali dalla dashboard
    const heroName = document.getElementById('heroName')?.value || 'Sophia Rossi';
    const heroRole = document.getElementById('heroRole')?.value || 'Wellness Coach certificata';
    const videoDescription = document.getElementById('videoDescription')?.value || '';

    // Mostra notifica
    window.micrositoProfessionista.showNotification('Apertura anteprima microsito...', 'info');

    // Per ora apre il microsito statico (in futuro ci sarà il backend)
    setTimeout(() => {
        // Percorso corretto al microsito
        const micrositeUrl = '/microsito.html';

        // Apri in nuova finestra con parametri (quando ci sarà il backend)
        const previewWindow = window.open(micrositeUrl + `?preview=true&name=${encodeURIComponent(heroName)}&role=${encodeURIComponent(heroRole)}`, '_blank');

        if (previewWindow) {
            window.micrositoProfessionista.showNotification('Anteprima aperta in nuova scheda', 'success');
        } else {
            window.micrositoProfessionista.showNotification('Blocco popup attivo. Consenti i popup per l\'anteprima', 'warning');
        }
    }, 500);
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

function uploadVideo() {
    window.micrositoProfessionista.uploadVideo();
}

function removeVideo() {
    window.micrositoProfessionista.removeVideo();
}

function upgradeToPremium() {
    // TODO: Connect to premium upgrade flow
    window.micrositoProfessionista.showNotification('Reindirizzamento a pagina Premium...', 'success');
    setTimeout(() => {
        window.location.href = '/pages/premium-upgrade.html';
    }, 1500);
}

console.log('Microsito Professionista JS caricato completamente');