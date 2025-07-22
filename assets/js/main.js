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