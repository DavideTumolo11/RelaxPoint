/* ==============================
   VANTAGGI PAGE - JAVASCRIPT
   Live Statistics Update System
   ============================== */

class VantaggiStats {
    constructor() {
        this.initializeStats();
        this.startLiveUpdates();
        this.setupAnimations();
    }

    initializeStats() {
        // Valori base delle statistiche
        this.baseStats = {
            professionistiAttivi: 1247,
            clientiSoddisfatti: 12893,
            serviziCompletati: 34567,
            ratingMedio: 4.8
        };

        // Riferimenti agli elementi DOM
        this.elements = {
            professionistiAttivi: document.getElementById('professionistiAttivi'),
            clientiSoddisfatti: document.getElementById('clientiSoddisfatti'),
            serviziCompletati: document.getElementById('serviziCompletati'),
            ratingMedio: document.getElementById('ratingMedio')
        };

        console.log('Sistema statistiche inizializzato');
    }

    startLiveUpdates() {
        // Aggiorna le statistiche ogni 60 secondi
        setInterval(() => {
            this.updateStatistics();
        }, 60000); // 60 secondi

        console.log('Aggiornamenti live attivati (ogni 60 secondi)');
    }

    updateStatistics() {
        // Simula cambiamenti realistici nelle statistiche
        const updates = this.generateRealisticUpdates();

        Object.keys(updates).forEach(key => {
            if (this.elements[key]) {
                this.animateNumberUpdate(this.elements[key], updates[key]);
            }
        });

        console.log('Statistiche aggiornate:', updates);
    }

    generateRealisticUpdates() {
        const now = new Date();
        const hour = now.getHours();

        // Fattore di attività basato sull'ora del giorno
        let activityFactor = 1;
        if (hour >= 8 && hour <= 12) activityFactor = 1.3; // Mattina attiva
        else if (hour >= 14 && hour <= 18) activityFactor = 1.5; // Pomeriggio picco
        else if (hour >= 19 && hour <= 22) activityFactor = 1.2; // Sera attiva
        else activityFactor = 0.7; // Notte più calma

        return {
            professionistiAttivi: this.baseStats.professionistiAttivi +
                Math.floor(Math.random() * 20 * activityFactor - 5),

            clientiSoddisfatti: this.baseStats.clientiSoddisfatti +
                Math.floor(Math.random() * 50 * activityFactor),

            serviziCompletati: this.baseStats.serviziCompletati +
                Math.floor(Math.random() * 100 * activityFactor),

            ratingMedio: Math.min(5.0, Math.max(4.5,
                this.baseStats.ratingMedio + (Math.random() * 0.4 - 0.2)))
        };
    }

    animateNumberUpdate(element, newValue) {
        const currentValue = element.textContent.replace(/[,\.]/g, '');
        const isRating = element.id === 'ratingMedio';

        // Aggiungi classe di animazione
        element.classList.add('updating');

        // Rimuovi la classe dopo l'animazione
        setTimeout(() => {
            element.classList.remove('updating');
        }, 500);

        // Anima il cambio del numero
        this.animateValueChange(element, currentValue, newValue, isRating);

        // Aggiorna il valore base per la prossima volta
        this.baseStats[element.id] = newValue;
    }

    animateValueChange(element, fromValue, toValue, isRating = false) {
        const from = parseFloat(fromValue) || 0;
        const to = parseFloat(toValue);
        const duration = 800; // ms
        const steps = 30;
        const increment = (to - from) / steps;
        let current = from;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;

            if (step >= steps) {
                current = to;
                clearInterval(timer);
            }

            // Formatta il valore
            if (isRating) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.round(current).toLocaleString('it-IT');
            }
        }, duration / steps);
    }

    setupAnimations() {
        // Intersection Observer per animazioni on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, {
            threshold: 0.2
        });

        // Osserva le card dei vantaggi
        document.querySelectorAll('.vantaggio-card, .trust-card').forEach(card => {
            observer.observe(card);
        });

        // Animazione per le statistiche al caricamento
        setTimeout(() => {
            document.querySelectorAll('.stat-card').forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.8s ease forwards';
                }, index * 150);
            });
        }, 500);
    }

    // Metodo per test manuale (console)
    forceUpdate() {
        console.log('Aggiornamento forzato delle statistiche...');
        this.updateStatistics();
    }
}

// Aggiungi CSS per le animazioni
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .vantaggio-card,
    .trust-card,
    .stat-card {
        opacity: 0;
    }
`;
document.head.appendChild(style);

// Inizializza il sistema quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    window.vantaggiStats = new VantaggiStats();

    // Aggiungi metodo globale per test
    window.testStatsUpdate = () => {
        window.vantaggiStats.forceUpdate();
    };
});

// Funzioni di utilità per il debug
console.log('Vantaggi.js caricato. Usa testStatsUpdate() nella console per testare gli aggiornamenti.');