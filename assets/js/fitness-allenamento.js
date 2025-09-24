// ===== FITNESS & ALLENAMENTO - JS COMPLETO =====

document.addEventListener('DOMContentLoaded', function () {
    console.log('[INIT] Fitness & Allenamento - JavaScript caricato');

    // INIZIALIZZAZIONE
    initializeFilters();
    initializeProfessionalCards();
    initializeSorting();
    initializeLoadMore();

    // GESTIONE FILTRI
    function initializeFilters() {
        const resetBtn = document.querySelector('.fitness-reset-filters');

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetAllFilters();
                applyFilters();
                console.log('Filtri Fitness & Allenamento resettati');
            });
        }

        // Auto-apply sui cambi per checkbox/radio
        const autoFilters = document.querySelectorAll('.fitness-filters input[type="checkbox"], .fitness-filters input[type="radio"]');
        autoFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });

        // Apply manuale per input numerici e select (prezzo, distanza)
        const manualFilters = document.querySelectorAll('.fitness-price-input, .fitness-distance-select');
        manualFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.fitness-professional-card');
        const filters = getActiveFilters();
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('fitness-load-more')) return;

            const isVisible = matchesFilters(card, filters);

            if (isVisible) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        updateResultsCount(visibleCount);
    }

    function getActiveFilters() {
        return {
            modalita: getCheckedValues('input[name="modalita"]:checked'),
            tipo: getCheckedValues('input[name="tipo"]:checked'),
            livello: getCheckedValues('input[name="livello"]:checked'),
            obiettivo: getCheckedValues('input[name="obiettivo"]:checked'),
            attrezzature: getCheckedValues('input[name="attrezzature"]:checked'),
            eta: getCheckedValues('input[name="eta"]:checked'),
            rating: getCheckedValue('input[name="rating"]:checked'),
            minPrice: parseInt(document.querySelector('.fitness-price-input[placeholder="Min €"]')?.value) || 0,
            maxPrice: parseInt(document.querySelector('.fitness-price-input[placeholder="Max €"]')?.value) || 999,
            maxDistance: parseInt(document.querySelector('.fitness-distance-select')?.value) || 50
        };
    }

    function matchesFilters(card, filters) {
        // Logica semplificata di matching
        const cardText = card.textContent.toLowerCase();

        // Modalità Servizio
        if (filters.modalita.length > 0) {
            const hasModalita = filters.modalita.some(m => {
                if (m === 'domicilio') return cardText.includes('domicilio');
                if (m === 'studio') return cardText.includes('studio') || cardText.includes('palestra');
                if (m === 'outdoor') return cardText.includes('outdoor') || cardText.includes('parchi');
                if (m === 'online') return cardText.includes('online') || cardText.includes('coaching');
                return false;
            });
            if (!hasModalita) return false;
        }

        // Tipo Servizio
        if (filters.tipo.length > 0) {
            const hasTipo = filters.tipo.some(t => {
                switch (t) {
                    case 'personal':
                        return cardText.includes('personal') || cardText.includes('trainer');
                    case 'pilates':
                        return cardText.includes('pilates');
                    case 'functional':
                        return cardText.includes('functional') || cardText.includes('crossfit') || cardText.includes('hiit');
                    case 'calisthenics':
                        return cardText.includes('calisthenics') || cardText.includes('corpo libero');
                    case 'cardio':
                        return cardText.includes('cardio') || cardText.includes('hiit');
                    case 'nutrizionista':
                        return cardText.includes('nutrizionista') || cardText.includes('alimentari');
                    default:
                        return false;
                }
            });
            if (!hasTipo) return false;
        }

        // Livello
        if (filters.livello.length > 0) {
            const hasLivello = filters.livello.some(l => {
                switch (l) {
                    case 'principiante':
                        return cardText.includes('principiante') || cardText.includes('base') || cardText.includes('dolce');
                    case 'intermedio':
                        return cardText.includes('intermedio') || cardText.includes('medio');
                    case 'avanzato':
                        return cardText.includes('avanzato') || cardText.includes('intenso');
                    case 'agonistico':
                        return cardText.includes('agonistico') || cardText.includes('sport') || cardText.includes('preparazione');
                    default:
                        return false;
                }
            });
            if (!hasLivello) return false;
        }

        // Obiettivo
        if (filters.obiettivo.length > 0) {
            const hasObiettivo = filters.obiettivo.some(o => {
                switch (o) {
                    case 'dimagrimento':
                        return cardText.includes('dimagrimento') || cardText.includes('perdere peso');
                    case 'tonificazione':
                        return cardText.includes('tonificazione') || cardText.includes('tonificare');
                    case 'forza':
                        return cardText.includes('forza') || cardText.includes('massa');
                    case 'flessibilita':
                        return cardText.includes('flessibilità') || cardText.includes('mobilità');
                    case 'sport':
                        return cardText.includes('sport') || cardText.includes('preparazione');
                    case 'benessere':
                        return cardText.includes('benessere') || cardText.includes('salute');
                    default:
                        return false;
                }
            });
            if (!hasObiettivo) return false;
        }

        // Attrezzature
        if (filters.attrezzature.length > 0) {
            const hasAttrezzature = filters.attrezzature.some(a => {
                switch (a) {
                    case 'corpo-libero':
                        return cardText.includes('corpo libero') || cardText.includes('senza attrezzi');
                    case 'base':
                        return cardText.includes('attrezzi') || cardText.includes('manubri');
                    case 'avanzati':
                        return cardText.includes('trx') || cardText.includes('kettlebell');
                    case 'reformer':
                        return cardText.includes('reformer');
                    case 'non-necessarie':
                        return cardText.includes('non necessarie') || cardText.includes('corpo libero');
                    default:
                        return false;
                }
            });
            if (!hasAttrezzature) return false;
        }

        // Età Target
        if (filters.eta.length > 0) {
            const hasEta = filters.eta.some(e => {
                switch (e) {
                    case 'giovani':
                        return cardText.includes('18-30') || cardText.includes('giovani');
                    case 'adulti':
                        return cardText.includes('30-50') || cardText.includes('adulti');
                    case 'senior':
                        return cardText.includes('50+') || cardText.includes('senior') || cardText.includes('dolce');
                    case 'tutti':
                        return true; // Tutti i trainer accettano tutti
                    default:
                        return false;
                }
            });
            if (!hasEta) return false;
        }

        // Rating
        if (filters.rating) {
            const ratingValue = parseFloat(card.querySelector('.fitness-rating-value')?.textContent) || 0;
            switch (filters.rating) {
                case '4plus':
                    if (ratingValue < 4.0) return false;
                    break;
                case '45plus':
                    if (ratingValue < 4.5) return false;
                    break;
                case 'premium':
                    if (!card.classList.contains('fitness-premium')) return false;
                    break;
            }
        }

        return true;
    }

    function resetAllFilters() {
        document.querySelectorAll('.fitness-filters input[type="checkbox"], .fitness-filters input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        document.querySelectorAll('.fitness-price-input').forEach(input => {
            input.value = '';
        });

        const distanceSelect = document.querySelector('.fitness-distance-select');
        if (distanceSelect) distanceSelect.value = '10';

        // Reset default
        const domicilioCheckbox = document.querySelector('input[name="modalita"][value="domicilio"]');
        if (domicilioCheckbox) domicilioCheckbox.checked = true;
    }

    function updateResultsCount(count) {
        const resultsTitle = document.querySelector('.fitness-results-info h2');
        if (resultsTitle) {
            resultsTitle.textContent = `${count} Trainer trovati`;
        }
    }

    // GESTIONE CARDS PROFESSIONISTI
    function initializeProfessionalCards() {
        // Pulsanti preferiti
        document.querySelectorAll('.fitness-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('active');

                // Animazione
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                console.log('Preferito Fitness & Allenamento toggled');
            });
        });

        // Pulsanti profilo
        document.querySelectorAll('.fitness-profile-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.fitness-professional-card');
                const name = card.querySelector('h3').textContent;
                const slug = name.toLowerCase().replace(/\s+/g, '-').replace('dott.ssa', '').replace('dott.', '');

                console.log(`Vai al profilo Fitness: ${name}`);
                // window.location.href = `/pages/professionista/${slug}.html`;
            });
        });

        // Pulsanti prenota
        document.querySelectorAll('.fitness-book-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.fitness-professional-card');
                const name = card.querySelector('h3').textContent;

                console.log(`Prenota Fitness con: ${name}`);
                // window.location.href = `/pages/prenotazione/prenota.html?prof=${name}&service=fitness`;
            });
        });

        // Click su card
        document.querySelectorAll('.fitness-professional-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.closest('button')) return;

                const name = this.querySelector('h3').textContent;
                console.log(`Card Fitness clicked: ${name}`);
                // Vai al profilo
            });
        });
    }

    // ORDINAMENTO
    function initializeSorting() {
        const sortSelect = document.querySelector('.fitness-sort-select');

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const sortBy = this.value;
                sortProfessionals(sortBy);
                console.log(`Ordinamento Fitness: ${sortBy}`);
            });
        }
    }

    function sortProfessionals(sortBy) {
        const container = document.querySelector('.fitness-professionals-grid');
        const cards = Array.from(container.querySelectorAll('.fitness-professional-card')).filter(card =>
            !card.classList.contains('fitness-load-more')
        );

        cards.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.fitness-rating-value')?.textContent) || 0;
                    const ratingB = parseFloat(b.querySelector('.fitness-rating-value')?.textContent) || 0;
                    return ratingB - ratingA;

                case 'prezzo-asc':
                case 'prezzo-desc':
                    const priceA = getMinPrice(a);
                    const priceB = getMinPrice(b);
                    return sortBy === 'prezzo-asc' ? priceA - priceB : priceB - priceA;

                case 'distanza':
                    const distA = getDistance(a);
                    const distB = getDistance(b);
                    return distA - distB;

                case 'esperienza':
                    const expA = getExperience(a);
                    const expB = getExperience(b);
                    return expB - expA;

                default: // rilevanza
                    const premiumA = a.classList.contains('fitness-premium') ? 1 : 0;
                    const premiumB = b.classList.contains('fitness-premium') ? 1 : 0;
                    if (premiumA !== premiumB) return premiumB - premiumA;

                    const ratingA2 = parseFloat(a.querySelector('.fitness-rating-value')?.textContent) || 0;
                    const ratingB2 = parseFloat(b.querySelector('.fitness-rating-value')?.textContent) || 0;
                    return ratingB2 - ratingA2;
            }
        });

        // Riordina DOM
        cards.forEach(card => container.appendChild(card));

        // Mantieni load-more alla fine
        const loadMore = container.querySelector('.fitness-load-more');
        if (loadMore) container.appendChild(loadMore);
    }

    function getMinPrice(card) {
        const pricingText = card.querySelector('.fitness-pricing')?.textContent || '';
        const prices = pricingText.match(/€(\d+)/g);
        if (prices && prices.length > 0) {
            return Math.min(...prices.map(p => parseInt(p.replace('€', ''))));
        }
        return 999;
    }

    function getDistance(card) {
        const distanceText = card.querySelector('.fitness-distance')?.textContent || '';
        const match = distanceText.match(/(\d+\.?\d*)\s*km/);
        return match ? parseFloat(match[1]) : 999;
    }

    function getExperience(card) {
        const packagesText = card.querySelector('.fitness-packages')?.textContent || '';
        const match = packagesText.match(/(\d+)\s*anni/);
        return match ? parseInt(match[1]) : 0;
    }

    // LOAD MORE
    function initializeLoadMore() {
        const loadMoreBtn = document.querySelector('.fitness-load-more-btn');

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                this.textContent = 'Caricamento...';
                this.disabled = true;

                setTimeout(() => {
                    console.log('Caricamento altri trainer Fitness...');

                    this.textContent = 'Carica altri trainer';
                    this.disabled = false;

                    // Aggiorna contatore
                    const info = document.querySelector('.fitness-load-more p');
                    if (info) {
                        info.textContent = 'Mostrando 12 di 52 risultati';
                    }

                    // Simula fine risultati dopo qualche caricamento
                    // In produzione: gestire con API

                }, 1000);
            });
        }
    }

    // RICERCA SPECIALIZZATA FITNESS
    function initializeSearch() {
        const searchInput = document.querySelector('.search-input');

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                const query = this.value.toLowerCase().trim();
                searchProfessionals(query);
            });
        }
    }

    function searchProfessionals(query) {
        if (!query) {
            // Mostra tutti
            document.querySelectorAll('.fitness-professional-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        const cards = document.querySelectorAll('.fitness-professional-card');
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('fitness-load-more')) return;

            const cardText = card.textContent.toLowerCase();

            // Ricerca specifica per Fitness & Allenamento
            const isMatch = cardText.includes(query) ||
                query.includes('personal') && cardText.includes('personal') ||
                query.includes('trainer') && cardText.includes('trainer') ||
                query.includes('pilates') && cardText.includes('pilates') ||
                query.includes('crossfit') && cardText.includes('crossfit') ||
                query.includes('functional') && cardText.includes('functional') ||
                query.includes('nutrizionista') && cardText.includes('nutrizionista') ||
                query.includes('dimagrimento') && cardText.includes('dimagrimento') ||
                query.includes('tonificazione') && cardText.includes('tonificazione');

            if (isMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        updateResultsCount(visibleCount);
    }

    // FILTRI SMART - Suggerimenti automatici
    function initializeSmartFilters() {
        // Quando selezioni "Dimagrimento", suggerisci automaticamente "Personal Training" + "Cardio"
        const dimagrimentoCheckbox = document.querySelector('input[name="obiettivo"][value="dimagrimento"]');
        const personalCheckbox = document.querySelector('input[name="tipo"][value="personal"]');
        const cardioCheckbox = document.querySelector('input[name="tipo"][value="cardio"]');

        if (dimagrimentoCheckbox && personalCheckbox && cardioCheckbox) {
            dimagrimentoCheckbox.addEventListener('change', function () {
                if (this.checked) {
                    personalCheckbox.checked = true;
                    cardioCheckbox.checked = true;
                    console.log('Smart filter: Dimagrimento → Personal + Cardio suggeriti');
                    setTimeout(() => applyFilters(), 100);
                }
            });
        }

        // Quando selezioni "Senior 50+", suggerisci automaticamente "Ginnastica dolce"
        const seniorCheckbox = document.querySelector('input[name="eta"][value="senior"]');
        const principianteCheckbox = document.querySelector('input[name="livello"][value="principiante"]');

        if (seniorCheckbox && principianteCheckbox) {
            seniorCheckbox.addEventListener('change', function () {
                if (this.checked) {
                    principianteCheckbox.checked = true;
                    console.log('Smart filter: Senior → Principiante suggerito');
                    setTimeout(() => applyFilters(), 100);
                }
            });
        }
    }

    // UTILITY FUNCTIONS
    function getCheckedValues(selector) {
        return Array.from(document.querySelectorAll(selector))
            .map(input => input.value);
    }

    function getCheckedValue(selector) {
        const input = document.querySelector(selector);
        return input ? input.value : null;
    }

    // INIZIALIZZA RICERCA
    initializeSearch();

    // INIZIALIZZA FILTRI SMART
    initializeSmartFilters();

    // INIZIALIZZAZIONE FINALE
    console.log('✅ Fitness & Allenamento - Tutto inizializzato');

    // Conteggio iniziale
    updateResultsCount(document.querySelectorAll('.fitness-professional-card:not(.fitness-load-more)').length);
});

// GESTIONE ERRORI IMMAGINI - FITNESS
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.fitness-professional-card img, .fitness-hero-image img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/assets/images/placeholder-fitness.jpg';
            this.alt = 'Fitness - Immagine non disponibile';
            console.log('[WARNING] Immagine Fitness sostituita con placeholder');
        });
    });
});

// SMOOTH SCROLLING
document.addEventListener('DOMContentLoaded', function () {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// PERFORMANCE: LAZY LOADING
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Applica a immagini con data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ANALYTICS E DEBUG
document.addEventListener('DOMContentLoaded', function () {
    console.log(`
    🏋️ ===============================================
       FITNESS & ALLENAMENTO - Statistiche Debug
       Trainer: ${document.querySelectorAll('.fitness-professional-card:not(.fitness-load-more)').length}
       Filtri: ${document.querySelectorAll('.fitness-filter-group').length}
       Discipline: Personal, Pilates, Functional, Nutrizionista
       Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);

    // Statistiche filtri
    const tipoOptions = document.querySelectorAll('input[name="tipo"]').length;
    const livelloOptions = document.querySelectorAll('input[name="livello"]').length;
    const obiettivoOptions = document.querySelectorAll('input[name="obiettivo"]').length;

    console.log(`📊 Filtri disponibili: ${tipoOptions} tipi, ${livelloOptions} livelli, ${obiettivoOptions} obiettivi`);
});