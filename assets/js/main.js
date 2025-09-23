// ===============================================
// RELAXPOINT - JAVASCRIPT PRINCIPALE
// Gestisce tutte le interazioni della homepage
// ===============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🌿 RelaxPoint JavaScript caricato correttamente!');

    // ===============================================
    // GESTIONE LAST MINUTE - Lampeggia quando disponibile
    // ===============================================
    const lastMinuteLink = document.getElementById('lastMinuteLink');

    function controllaDisponibilitaLastMinute() {
        if (!lastMinuteLink) {
            console.warn('⚠️ Elemento lastMinuteLink non trovato nel DOM');
            return;
        }

        const ciSonoProfessionistiLastMinute = true;

        if (ciSonoProfessionistiLastMinute) {
            lastMinuteLink.style.display = 'inline';
            lastMinuteLink.classList.add('last-minute');
            console.log('✅ Last Minute attivo - professionisti disponibili');
        } else {
            lastMinuteLink.classList.remove('last-minute');
            lastMinuteLink.style.opacity = '0.5';
            console.log('❌ Last Minute non disponibile');
        }
    }

    controllaDisponibilitaLastMinute();
    setInterval(controllaDisponibilitaLastMinute, 30000);

    // ===============================================
    // SMOOTH SCROLL - Scorrimento fluido per i link
    // ===============================================
    const linkInterni = document.querySelectorAll('a[href^="#"]');
    linkInterni.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const destinazione = document.querySelector(this.getAttribute('href'));
            if (destinazione) {
                destinazione.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===============================================
    // EFFETTI HOVER CARDS SERVIZI
    // ===============================================
    const cardServizi = document.querySelectorAll('.service-card');

    cardServizi.forEach(card => {
        // Effetto al passaggio del mouse
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.05)';
            this.style.transition = 'all 0.3s ease';
        });

        // Ritorno normale quando mouse esce
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // RIMOSSO CLICK EVENT CHE CAUSAVA L'ALERT
        // I link <a> nell'index.html gestiscono già la navigazione
    });

    // ===============================================
    // JAVASCRIPT ISPIRAZIONI HOMEPAGE - DA AGGIUNGERE AL MAIN.JS
    // Gestisce click cards, modale lightbox, navigazione media
    // ===============================================

    // DATI ISPIRAZIONI CON CONTENUTI MULTIPLI
    const inspirationsData = {
        1: {
            title: "Massaggio Rilassante Premium",
            author: "Giulia Rossi",
            service: "Massaggi e Trattamenti",
            rating: 4.9,
            description: "Un trattamento rilassante completo che combina tecniche svedesi e aromaterapia per un'esperienza di benessere totale.",
            profileLink: "/pages/professionista/giulia-rossi.html",
            media: [
                { type: 'image', src: '/assets/images/ispirazioni/massaggio-rilassante-1.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/massaggio-rilassante-2.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/massaggio-rilassante-3.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/massaggio-rilassante-4.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/massaggio-rilassante-5.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/massaggio-rilassante-6.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/massaggio-rilassante-7.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/massaggio-rilassante-8.jpg' }
            ]
        },
        2: {
            title: "Allenamento HIIT a Domicilio",
            author: "Marco Bianchi",
            service: "Fitness e Allenamento",
            rating: 4.8,
            description: "Sessione di allenamento ad alta intensità personalizzata per massimizzare i risultati in tempi ridotti.",
            profileLink: "/pages/professionista/marco-bianchi.html",
            media: [
                { type: 'video', src: '/assets/videos/fitness-hiit-workout.mp4', poster: '/assets/images/ispirazioni/fitness-video-thumb.jpg' }
            ]
        },
        3: {
            title: "Trattamento Viso Anti-Age",
            author: "Sofia Moretti",
            service: "Beauty & Wellness",
            rating: 4.9,
            description: "Trattamento viso professionale anti-età con prodotti naturali per una pelle luminosa e ringiovanita.",
            profileLink: "/pages/professionista/sofia-moretti.html",
            media: [
                { type: 'image', src: '/assets/images/ispirazioni/beauty-treatment.jpg' }
            ]
        },
        4: {
            title: "Sessione Yoga Mattutina",
            author: "Laura Verdi",
            service: "Yoga e Meditazione",
            rating: 5.0,
            description: "Pratica yoga dolce per iniziare la giornata con energia positiva e consapevolezza del corpo.",
            profileLink: "/pages/professionista/laura-verdi.html",
            media: [
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-1.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-2.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-3.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-4.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-5.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-6.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-7.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-8.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-9.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-10.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-11.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/yoga-session-12.jpg' }
            ]
        },
        5: {
            title: "Riabilitazione Post-Infortunio",
            author: "Giuseppe Conti",
            service: "Fisioterapia e Osteopatia",
            rating: 4.7,
            description: "Programma di riabilitazione mirato per il recupero completo da infortuni sportivi e traumi.",
            profileLink: "/pages/professionista/giuseppe-conti.html",
            media: [
                { type: 'video', src: '/assets/videos/fisio-rehabilitation.mp4', poster: '/assets/images/ispirazioni/fisio-video-thumb.jpg' }
            ]
        },
        6: {
            title: "Look Sposa Naturale",
            author: "Anna Carta",
            service: "Hair e Make-up",
            rating: 4.8,
            description: "Make-up e acconciatura per il giorno più bello, con un look naturale e raffinato che esalta la bellezza naturale.",
            profileLink: "/pages/professionista/anna-carta.html",
            media: [
                { type: 'image', src: '/assets/images/ispirazioni/makeup-result.jpg' }
            ]
        },
        7: {
            title: "Menu Degustazione Premium",
            author: "Luca Melis",
            service: "Chef & Cucina",
            rating: 4.9,
            description: "Esperienza culinaria esclusiva con menu degustazione di 7 portate preparato direttamente a casa vostra.",
            profileLink: "/pages/professionista/luca-melis.html",
            media: [
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-1.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-2.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-3.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-4.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-5.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-6.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-7.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-8.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-9.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-10.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-11.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-12.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-13.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-14.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/chef-dishes-15.jpg' }
            ]
        },
        8: {
            title: "Trekking Mindfulness",
            author: "Elena Bianchi",
            service: "Escursioni & Natura",
            rating: 4.6,
            description: "Esperienza di trekking consapevole nella natura per ritrovare equilibrio mentale e connessione con l'ambiente.",
            profileLink: "/pages/professionista/elena-bianchi.html",
            media: [
                { type: 'video', src: '/assets/videos/nature-mindfulness-trek.mp4', poster: '/assets/images/ispirazioni/nature-hike-thumb.jpg' }
            ]
        },
        9: {
            title: "Massaggio Rilassante di Coppia",
            author: "Giulia Rossi",
            service: "Massaggi e Trattamenti",
            rating: 4.8,
            description: "Esperienza di benessere condivisa con massaggio rilassante simultaneo per coppie nella privacy di casa vostra.",
            profileLink: "/pages/professionista/giulia-rossi.html",
            media: [
                { type: 'image', src: '/assets/images/ispirazioni/couple-massage.jpg' }
            ]
        },
        10: {
            title: "Allenamento Personalizzato",
            author: "Marco Bianchi",
            service: "Fitness e Allenamento",
            rating: 4.7,
            description: "Programma di allenamento su misura per raggiungere i vostri obiettivi di fitness con esercizi mirati.",
            profileLink: "/pages/professionista/marco-bianchi.html",
            media: [
                { type: 'image', src: '/assets/images/ispirazioni/personal-training-1.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/personal-training-2.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/personal-training-3.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/personal-training-4.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/personal-training-5.jpg' },
                { type: 'image', src: '/assets/images/ispirazioni/personal-training-6.jpg' }
            ]
        }
    };

    // VARIABILI GLOBALI MODALE
    let currentInspirationId = null;
    let currentMediaIndex = 0;

    // ===============================================
    // INIZIALIZZAZIONE ISPIRAZIONI
    // ===============================================
    function initializeInspirationsSection() {
        const inspirationCards = document.querySelectorAll('.inspiration-card');

        inspirationCards.forEach(card => {
            card.addEventListener('click', function (e) {
                e.preventDefault();
                const inspirationId = parseInt(this.dataset.id);
                openInspirationModal(inspirationId);
            });
        });
    }

    // ===============================================
    // GESTIONE MODALE
    // ===============================================
    function openInspirationModal(inspirationId) {
        const data = inspirationsData[inspirationId];
        if (!data) {
            console.warn(`Dati non trovati per ispirazione ID: ${inspirationId}`);
            return;
        }

        currentInspirationId = inspirationId;
        currentMediaIndex = 0;

        const modal = document.getElementById('inspirationModal');

        // Popola header
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalAuthor').textContent = `di ${data.author}`;
        document.getElementById('modalService').textContent = data.service;
        document.getElementById('modalStars').textContent = '★'.repeat(Math.floor(data.rating));
        document.getElementById('modalRating').textContent = data.rating;

        // Popola descrizione
        document.getElementById('modalDesc').textContent = data.description;

        // Link footer
        document.getElementById('modalProfileLink').href = data.profileLink;
        document.getElementById('modalBookLink').href = `/pages/prenotazione/prenota.html?professional=${data.author.toLowerCase().replace(' ', '-')}`;

        // Carica media
        loadModalMedia(data.media);

        // Mostra modale
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeInspirationModal() {
        const modal = document.getElementById('inspirationModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Pausa video se attivo
        const video = document.getElementById('modalVideo');
        if (video && !video.paused) {
            video.pause();
        }

        currentInspirationId = null;
        currentMediaIndex = 0;
    }

    // ===============================================
    // GESTIONE MEDIA
    // ===============================================
    function loadModalMedia(mediaArray) {
        if (!mediaArray || mediaArray.length === 0) return;

        // Crea thumbnails
        const thumbnailsContainer = document.getElementById('modalThumbnails');
        thumbnailsContainer.innerHTML = '';

        if (mediaArray.length > 1) {
            mediaArray.forEach((media, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                thumbnail.style.backgroundImage = `url("${media.poster || media.src}")`;
                thumbnail.onclick = () => switchMedia(index);
                thumbnailsContainer.appendChild(thumbnail);
            });
        } else {
            thumbnailsContainer.style.display = 'none';
        }

        // Mostra/nascondi controlli navigazione
        const prevBtn = document.querySelector('.gallery-nav.prev');
        const nextBtn = document.querySelector('.gallery-nav.next');

        if (mediaArray.length > 1) {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }

        // Carica primo media
        displayMedia(mediaArray[0]);
    }

    function displayMedia(media) {
        const img = document.getElementById('modalImage');
        const video = document.getElementById('modalVideo');

        // Nascondi entrambi
        img.style.display = 'none';
        video.style.display = 'none';

        if (media.type === 'image') {
            img.src = media.src;
            img.style.display = 'block';
        } else if (media.type === 'video') {
            video.src = media.src;
            if (media.poster) {
                video.poster = media.poster;
            }
            video.style.display = 'block';
        }
    }

    function switchMedia(index) {
        const data = inspirationsData[currentInspirationId];
        if (!data || !data.media || index < 0 || index >= data.media.length) return;

        currentMediaIndex = index;
        displayMedia(data.media[index]);

        // Aggiorna thumbnails attivi
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    function nextMedia() {
        const data = inspirationsData[currentInspirationId];
        if (!data || !data.media) return;

        const nextIndex = (currentMediaIndex + 1) % data.media.length;
        switchMedia(nextIndex);
    }

    function prevMedia() {
        const data = inspirationsData[currentInspirationId];
        if (!data || !data.media) return;

        const prevIndex = currentMediaIndex === 0 ? data.media.length - 1 : currentMediaIndex - 1;
        switchMedia(prevIndex);
    }

    // ===============================================
    // CONTROLLI TASTIERA
    // ===============================================
    function handleModalKeyboard(e) {
        if (!currentInspirationId) return;

        switch (e.key) {
            case 'Escape':
                closeInspirationModal();
                break;
            case 'ArrowLeft':
                prevMedia();
                break;
            case 'ArrowRight':
                nextMedia();
                break;
        }
    }

    // ===============================================
    // INIZIALIZZAZIONE AL CARICAMENTO PAGINA
    // ===============================================
    document.addEventListener('DOMContentLoaded', function () {
        // Inizializza sezione ispirazioni se presente
        if (document.querySelector('.inspirations-grid')) {
            initializeInspirationsSection();

            // Aggiungi listener per tastiera
            document.addEventListener('keydown', handleModalKeyboard);

            console.log('✨ Sezione Ispirazioni inizializzata correttamente');
        }
    });

    // ===============================================
    // GESTIONE CLICK PROFESSIONISTI
    // ===============================================
    const cardProfessionisti = document.querySelectorAll('.professional-card');

    cardProfessionisti.forEach(card => {
        card.addEventListener('click', function (e) {
            // Solo se non è già un link
            if (e.target.closest('a')) return;

            const nomeElement = this.querySelector('.professional-name');
            const linkElement = this.querySelector('.professional-link');

            if (nomeElement && linkElement) {
                const href = linkElement.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            }
        });
    });

    // ===============================================
    // GESTIONE PULSANTI HEADER
    // ===============================================

    // Pulsante Last Minute
    if (lastMinuteLink) {
        lastMinuteLink.addEventListener('click', function (e) {
            // Non prevenire default - lascia che il link funzioni
            console.log('🚨 Last Minute cliccato!');
        });
    }

    // ===============================================
    // GESTIONE RICERCA
    // ===============================================
    const inputRicerca = document.querySelector('.search-input');
    const btnRicerca = document.querySelector('.search-btn');

    // Ricerca con tasto Enter
    if (inputRicerca) {
        inputRicerca.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                eseguiRicerca();
            }
        });
    }

    // Ricerca con click pulsante
    if (btnRicerca) {
        btnRicerca.addEventListener('click', function () {
            eseguiRicerca();
        });
    }

    function eseguiRicerca() {
        if (!inputRicerca) {
            console.warn('⚠️ Input ricerca non trovato');
            return;
        }

        const termineRicerca = inputRicerca.value.trim();

        if (termineRicerca) {
            console.log(`🔍 Ricerca eseguita: "${termineRicerca}"`);
            // Reindirizza alla pagina servizi con query
            window.location.href = `/pages/servizi/servizi.html?q=${encodeURIComponent(termineRicerca)}`;
        } else {
            // Focus sull'input invece di alert
            inputRicerca.focus();
            inputRicerca.placeholder = "Inserisci un termine di ricerca...";
        }
    }

    // ===============================================
    // EFFETTI VISIVI AGGIUNTIVI
    // ===============================================
    function osservaElementi() {
        const osservatore = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        document.querySelectorAll('section').forEach(sezione => {
            osservatore.observe(sezione);
        });
    }

    osservaElementi();

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    function formattaTelefono(numero) {
        const soloNumeri = numero.replace(/\D/g, '');
        if (soloNumeri.length === 10) {
            return `${soloNumeri.slice(0, 3)} ${soloNumeri.slice(3, 6)} ${soloNumeri.slice(6)}`;
        }
        return numero;
    }

    // ===============================================
    // CONSOLE MESSAGES PER DEBUG
    // ===============================================
    console.log('📱 Dispositivo:', window.innerWidth <= 768 ? 'Mobile' : 'Desktop');
    console.log('🌐 User Agent:', navigator.userAgent);
    console.log('🚀 RelaxPoint ready!');

    console.log(`
    🌿 ===============================================
       RELAXPOINT - Marketplace Benessere
       Versione: 1.0.0 | Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);
});