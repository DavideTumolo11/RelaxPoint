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

    /**
     * Controlla se ci sono professionisti disponibili per Last Minute
     * In futuro: sarà collegato al database tramite API
     */
    function controllaDisponibilitaLastMinute() {
        // Controllo se l'elemento esiste
        if (!lastMinuteLink) {
            console.warn('⚠️ Elemento lastMinuteLink non trovato nel DOM');
            return;
        }

        // DEMO: cambia questo valore per testare il lampeggio
        const ciSonoProfessionistiLastMinute = true; // true = lampeggia, false = non lampeggia

        if (ciSonoProfessionistiLastMinute) {
            // Se ci sono professionisti disponibili: attiva lampeggio
            lastMinuteLink.style.display = 'inline';
            lastMinuteLink.classList.add('last-minute');
            console.log('✅ Last Minute attivo - professionisti disponibili');
        } else {
            // Se non ci sono professionisti: disattiva lampeggio
            lastMinuteLink.classList.remove('last-minute');
            lastMinuteLink.style.opacity = '0.5';
            console.log('❌ Last Minute non disponibile');
        }
    }

    // Controlla all'avvio della pagina
    controllaDisponibilitaLastMinute();

    // Ricontrolla ogni 30 secondi (in futuro: chiamata API al server)
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

        // Click sulla card servizio
        card.addEventListener('click', function () {
            const titleElement = this.querySelector('.service-title');
            if (titleElement) {
                const nomeServizio = titleElement.textContent;
                const tipoServizio = this.getAttribute('data-service');

                console.log(`🎯 Servizio cliccato: ${nomeServizio} (${tipoServizio})`);

                // TODO: In futuro reindirizza alla pagina del servizio
                alert(`Servizio "${nomeServizio}" cliccato!\n\nQui andrà la pagina del servizio.`);
            }
        });
    });

    // ===============================================
    // GESTIONE CLICK PROFESSIONISTI
    // ===============================================
    const cardProfessionisti = document.querySelectorAll('.professional-card');

    cardProfessionisti.forEach(card => {
        card.addEventListener('click', function () {
            const nomeElement = this.querySelector('.professional-name');
            const ruoloElement = this.querySelector('.professional-role');

            if (nomeElement && ruoloElement) {
                const nomeProfessionista = nomeElement.textContent;
                const ruoloProfessionista = ruoloElement.textContent;

                console.log(`👤 Professionista cliccato: ${nomeProfessionista} - ${ruoloProfessionista}`);

                // TODO: In futuro reindirizza al micro-sito del professionista
                alert(`Professionista "${nomeProfessionista}" cliccato!\n\nQui andrà il micro-sito del professionista.`);
            }
        });
    });

    // ===============================================
    // GESTIONE PULSANTI HEADER
    // ===============================================

    // Pulsante Last Minute
    if (lastMinuteLink) {
        lastMinuteLink.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('🚨 Last Minute cliccato!');
            alert('Last Minute cliccato!\n\nQui andrà la pagina Last Minute con servizi immediati.');
        });
    }

    // Pulsante Accedi
    const btnAccedi = document.querySelector('.btn-login');
    if (btnAccedi) {
        btnAccedi.addEventListener('click', function () {
            console.log('🔐 Login cliccato');
            alert('Login cliccato!\n\nQui andrà la pagina di accesso.');
        });
    }

    // Pulsante Prenota
    const btnPrenota = document.querySelector('.btn-signup');
    if (btnPrenota) {
        btnPrenota.addEventListener('click', function () {
            console.log('📅 Prenota cliccato');
            alert('Prenota cliccato!\n\nQui andrà la pagina di prenotazione rapida.');
        });
    }

    // Pulsante Hero "Scopri i servizi"
    const btnHero = document.querySelector('.btn-hero');
    if (btnHero) {
        btnHero.addEventListener('click', function () {
            console.log('🎯 Scopri servizi cliccato');
            // Scrolla automaticamente alla sezione servizi
            const sezioneServizi = document.querySelector('.services-section');
            if (sezioneServizi) {
                sezioneServizi.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Pulsante CTA "Iscriviti ora"
    const btnCTA = document.querySelector('.btn-cta');
    if (btnCTA) {
        btnCTA.addEventListener('click', function () {
            console.log('📝 Iscriviti professionista cliccato');
            alert('Iscriviti come professionista!\n\nQui andrà la pagina di registrazione professionisti.');
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

    /**
     * Esegue la ricerca servizi
     */
    function eseguiRicerca() {
        if (!inputRicerca) {
            console.warn('⚠️ Input ricerca non trovato');
            return;
        }

        const termineRicerca = inputRicerca.value.trim();

        if (termineRicerca) {
            console.log(`🔍 Ricerca eseguita: "${termineRicerca}"`);
            alert(`Ricerca: "${termineRicerca}"\n\nQui andranno i risultati della ricerca.`);
        } else {
            alert('Inserisci un termine di ricerca!');
        }
    }

    // ===============================================
    // EFFETTI VISIVI AGGIUNTIVI
    // ===============================================

    /**
     * Aggiunge classe "visible" agli elementi quando entrano nel viewport
     * Utile per animazioni future
     */
    function osservaElementi() {
        const osservatore = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        // Osserva le sezioni principali
        document.querySelectorAll('section').forEach(sezione => {
            osservatore.observe(sezione);
        });
    }

    // Avvia osservatore per animazioni future
    osservaElementi();

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================

    /**
     * Mostra notifica temporanea (per debug)
     * @param {string} messaggio - Il messaggio da mostrare
     * @param {string} tipo - Tipo di notifica (success, error, info)
     */
    function mostraNotifica(messaggio, tipo = 'info') {
        console.log(`📢 [${tipo.toUpperCase()}] ${messaggio}`);

        // TODO: In futuro sostituire con toast notification più elegante
        // Per ora usa alert per semplicità
        alert(messaggio);
    }

    /**
     * Formatta numero telefono per visualizzazione
     * @param {string} numero - Numero da formattare
     * @returns {string} - Numero formattato
     */
    function formattaTelefono(numero) {
        // Rimuove tutti i caratteri non numerici
        const soloNumeri = numero.replace(/\D/g, '');

        // Formatta come numero italiano
        if (soloNumeri.length === 10) {
            return `${soloNumeri.slice(0, 3)} ${soloNumeri.slice(3, 6)} ${soloNumeri.slice(6)}`;
        }

        return numero; // Ritorna originale se non è formato standard
    }

    // ===============================================
    // CONSOLE MESSAGES PER DEBUG
    // ===============================================
    console.log('📱 Dispositivo:', window.innerWidth <= 768 ? 'Mobile' : 'Desktop');
    console.log('🌐 User Agent:', navigator.userAgent);
    console.log('🚀 RelaxPoint ready!');

    // Messaggio di benvenuto in console
    console.log(`
    🌿 ===============================================
       RELAXPOINT - Marketplace Benessere
       Versione: 1.0.0 | Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);
});