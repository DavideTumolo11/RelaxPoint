// ===== CHEF & CUCINA - JS COMPLETO =====

document.addEventListener('DOMContentLoaded', function () {
    console.log('👨‍🍳 Chef & Cucina - JavaScript caricato');

    // INIZIALIZZAZIONE
    initializeFilters();
    initializeProfessionalCards();
    initializeSorting();
    initializeLoadMore();

    // GESTIONE FILTRI
    function initializeFilters() {
        const resetBtn = document.querySelector('.chef-reset-filters');

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetAllFilters();
                applyFilters();
                console.log('Filtri Chef & Cucina resettati');
            });
        }

        // Auto-apply sui cambi per checkbox/radio
        const autoFilters = document.querySelectorAll('.chef-filters input[type="checkbox"], .chef-filters input[type="radio"]');
        autoFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });

        // Apply manuale per input numerici e select (prezzo, distanza)
        const manualFilters = document.querySelectorAll('.chef-price-input, .chef-distance-select');
        manualFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.chef-professional-card');
        const filters = getActiveFilters();
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('chef-load-more')) return;

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
            cucina: getCheckedValues('input[name="cucina"]:checked'),
            occasione: getCheckedValues('input[name="occasione"]:checked'),
            rating: getCheckedValue('input[name="rating"]:checked'),
            minPrice: parseInt(document.querySelector('.chef-price-input[placeholder="Min €"]')?.value) || 0,
            maxPrice: parseInt(document.querySelector('.chef-price-input[placeholder="Max €"]')?.value) || 999,
            maxDistance: parseInt(document.querySelector('.chef-distance-select')?.value) || 50
        };
    }

    function matchesFilters(card, filters) {
        // Logica semplificata di matching
        const cardText = card.textContent.toLowerCase();

        // Modalità Servizio
        if (filters.modalita.length > 0) {
            const hasModalita = filters.modalita.some(m => {
                if (m === 'domicilio') return cardText.includes('domicilio');
                if (m === 'studio') return cardText.includes('studio');
                if (m === 'catering') return cardText.includes('catering') || cardText.includes('eventi');
                return false;
            });
            if (!hasModalita) return false;
        }

        // Tipo Servizio
        if (filters.tipo.length > 0) {
            const hasTipo = filters.tipo.some(t => {
                switch (t) {
                    case 'cena-privata':
                        return cardText.includes('cena') || cardText.includes('privata') || cardText.includes('dinner');
                    case 'corsi':
                        return cardText.includes('corso') || cardText.includes('lezioni') || cardText.includes('insegnamento');
                    case 'meal-prep':
                        return cardText.includes('meal prep') || cardText.includes('preparazione') || cardText.includes('healthy');
                    case 'catering':
                        return cardText.includes('catering') || cardText.includes('eventi') || cardText.includes('matrimoni');
                    default:
                        return false;
                }
            });
            if (!hasTipo) return false;
        }

        // Cucina
        if (filters.cucina.length > 0) {
            const hasCucina = filters.cucina.some(c => {
                switch (c) {
                    case 'italiana':
                        return cardText.includes('italiana') || cardText.includes('pasta') || cardText.includes('risotto');
                    case 'mediterranea':
                        return cardText.includes('mediterranea') || cardText.includes('pesce') || cardText.includes('stellato');
                    case 'orientale':
                        return cardText.includes('orientale') || cardText.includes('sushi') || cardText.includes('giapponese') || cardText.includes('ramen');
                    case 'fusion':
                        return cardText.includes('fusion') || cardText.includes('creativo') || cardText.includes('innovativo');
                    case 'vegana':
                        return cardText.includes('vegana') || cardText.includes('plant-based') || cardText.includes('vegetariana');
                    default:
                        return false;
                }
            });
            if (!hasCucina) return false;
        }

        // Occasione
        if (filters.occasione.length > 0) {
            const hasOccasione = filters.occasione.some(o => {
                switch (o) {
                    case 'romantica':
                        return cardText.includes('romantica') || cardText.includes('coppia') || cardText.includes('intima');
                    case 'famiglia':
                        return cardText.includes('famiglia') || cardText.includes('bambini') || cardText.includes('tradizionale');
                    case 'business':
                        return cardText.includes('business') || cardText.includes('corporate') || cardText.includes('professionale');
                    case 'eventi':
                        return cardText.includes('eventi') || cardText.includes('speciali') || cardText.includes('celebrazioni');
                    default:
                        return false;
                }
            });
            if (!hasOccasione) return false;
        }

        // Rating
        if (filters.rating) {
            const ratingValue = parseFloat(card.querySelector('.chef-rating-value')?.textContent) || 0;
            switch (filters.rating) {
                case '4plus':
                    if (ratingValue < 4.0) return false;
                    break;
                case '45plus':
                    if (ratingValue < 4.5) return false;
                    break;
                case 'premium':
                    if (!card.classList.contains('chef-premium')) return false;
                    break;
            }
        }

        return true;
    }

    function resetAllFilters() {
        document.querySelectorAll('.chef-filters input[type="checkbox"], .chef-filters input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        document.querySelectorAll('.chef-price-input').forEach(input => {
            input.value = '';
        });

        const distanceSelect = document.querySelector('.chef-distance-select');
        if (distanceSelect) distanceSelect.value = '10';

        // Reset default
        const domicilioCheckbox = document.querySelector('input[name="modalita"][value="domicilio"]');
        if (domicilioCheckbox) domicilioCheckbox.checked = true;
    }

    function updateResultsCount(count) {
        const resultsTitle = document.querySelector('.chef-results-info h2');
        if (resultsTitle) {
            resultsTitle.textContent = `${count} Chef trovati`;
        }
    }

    // GESTIONE CARDS PROFESSIONISTI
    function initializeProfessionalCards() {
        // Pulsanti preferiti
        document.querySelectorAll('.chef-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('active');

                // Animazione
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                console.log('Preferito Chef & Cucina toggled');
            });
        });

        // Pulsanti profilo
        document.querySelectorAll('.chef-profile-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.chef-professional-card');
                const name = card.querySelector('h3').textContent;
                const slug = name.toLowerCase().replace(/\s+/g, '-').replace('chef', '').replace('dott.ssa', '').replace('dott.', '');

                console.log(`Vai al profilo Chef: ${name}`);
                // window.location.href = `/pages/professionista/${slug}.html`;
            });
        });

        // Pulsanti prenota
        document.querySelectorAll('.chef-book-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.chef-professional-card');
                const name = card.querySelector('h3').textContent;

                console.log(`Prenota Chef con: ${name}`);
                // window.location.href = `/pages/prenotazione/prenota.html?prof=${name}&service=chef-cucina`;
            });
        });

        // Click su card
        document.querySelectorAll('.chef-professional-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.closest('button')) return;

                const name = this.querySelector('h3').textContent;
                console.log(`Card Chef clicked: ${name}`);
                // Vai al profilo
            });
        });
    }

    // ORDINAMENTO
    function initializeSorting() {
        const sortSelect = document.querySelector('.chef-sort-select');

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const sortBy = this.value;
                sortProfessionals(sortBy);
                console.log(`Ordinamento Chef: ${sortBy}`);
            });
        }
    }

    function sortProfessionals(sortBy) {
        const container = document.querySelector('.chef-professionals-grid');
        const cards = Array.from(container.querySelectorAll('.chef-professional-card')).filter(card =>
            !card.classList.contains('chef-load-more')
        );

        cards.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.chef-rating-value')?.textContent) || 0;
                    const ratingB = parseFloat(b.querySelector('.chef-rating-value')?.textContent) || 0;
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

                default: // rilevanza
                    const premiumA = a.classList.contains('chef-premium') ? 1 : 0;
                    const premiumB = b.classList.contains('chef-premium') ? 1 : 0;
                    if (premiumA !== premiumB) return premiumB - premiumA;

                    const ratingA2 = parseFloat(a.querySelector('.chef-rating-value')?.textContent) || 0;
                    const ratingB2 = parseFloat(b.querySelector('.chef-rating-value')?.textContent) || 0;
                    return ratingB2 - ratingA2;
            }
        });

        // Riordina DOM
        cards.forEach(card => container.appendChild(card));

        // Mantieni load-more alla fine
        const loadMore = container.querySelector('.chef-load-more');
        if (loadMore) container.appendChild(loadMore);
    }

    function getMinPrice(card) {
        const pricingText = card.querySelector('.chef-pricing')?.textContent || '';
        const prices = pricingText.match(/€(\d+)/g);
        if (prices && prices.length > 0) {
            return Math.min(...prices.map(p => parseInt(p.replace('€', ''))));
        }
        return 999;
    }

    function getDistance(card) {
        const distanceText = card.querySelector('.chef-distance')?.textContent || '';
        const match = distanceText.match(/(\d+\.?\d*)\s*km/);
        return match ? parseFloat(match[1]) : 999;
    }

    // LOAD MORE
    function initializeLoadMore() {
        const loadMoreBtn = document.querySelector('.chef-load-more-btn');

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                this.textContent = 'Caricamento...';
                this.disabled = true;

                setTimeout(() => {
                    console.log('Caricamento altri chef...');

                    this.textContent = 'Carica altri chef';
                    this.disabled = false;

                    // Aggiorna contatore
                    const info = document.querySelector('.chef-load-more p');
                    if (info) {
                        info.textContent = 'Mostrando 12 di 24 risultati';
                    }

                    // Simula fine risultati dopo qualche caricamento
                    // In produzione: gestire con API

                }, 1000);
            });
        }
    }

    // RICERCA SPECIALIZZATA CHEF & CUCINA
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
            document.querySelectorAll('.chef-professional-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        const cards = document.querySelectorAll('.chef-professional-card');
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('chef-load-more')) return;

            const cardText = card.textContent.toLowerCase();

            // Ricerca specifica per Chef & Cucina
            const isMatch = cardText.includes(query) ||
                query.includes('chef') && cardText.includes('chef') ||
                query.includes('cucina') && cardText.includes('cucina') ||
                query.includes('cena') && cardText.includes('cena') ||
                query.includes('corso') && cardText.includes('corso') ||
                query.includes('sushi') && cardText.includes('sushi') ||
                query.includes('italiana') && cardText.includes('italiana') ||
                query.includes('vegana') && cardText.includes('vegana') ||
                query.includes('catering') && cardText.includes('catering');

            if (isMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        updateResultsCount(visibleCount);
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
    console.log('✅ Chef & Cucina - Tutto inizializzato');

    // Conteggio iniziale
    updateResultsCount(document.querySelectorAll('.chef-professional-card:not(.chef-load-more)').length);
});

// GESTIONE ERRORI IMMAGINI - CHEF & CUCINA
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.chef-professional-card img, .chef-hero-image img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/assets/images/placeholder-chef-cucina.jpg';
            this.alt = 'Chef & Cucina - Immagine non disponibile';
            console.log('⚠️ Immagine Chef & Cucina sostituita con placeholder');
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
    👨‍🍳 ===============================================
       CHEF & CUCINA - Statistiche Debug
       Chef: ${document.querySelectorAll('.chef-professional-card:not(.chef-load-more)').length}
       Filtri: ${document.querySelectorAll('.chef-filter-group').length}
       Specializzazioni: Italiana, Orientale, Vegana, Fusion, Catering
       Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);

    // Statistiche filtri
    const tipoOptions = document.querySelectorAll('input[name="tipo"]').length;
    const cucinaOptions = document.querySelectorAll('input[name="cucina"]').length;
    const occasioneOptions = document.querySelectorAll('input[name="occasione"]').length;

    console.log(`📊 Filtri disponibili: ${tipoOptions} tipi servizio, ${cucinaOptions} cucine, ${occasioneOptions} occasioni`);
});

// FUNZIONI SMART FILTERS
function initializeSmartFilters() {
    // Filtri intelligenti basati sui contenuti delle card
    const cards = document.querySelectorAll('.chef-professional-card:not(.chef-load-more)');

    // Conteggio automatico per ogni filtro
    const filterCounts = {
        modalita: {},
        tipo: {},
        cucina: {},
        occasione: {}
    };

    cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();

        // Conta modalità
        if (cardText.includes('domicilio')) filterCounts.modalita.domicilio = (filterCounts.modalita.domicilio || 0) + 1;
        if (cardText.includes('studio')) filterCounts.modalita.studio = (filterCounts.modalita.studio || 0) + 1;
        if (cardText.includes('catering')) filterCounts.modalita.catering = (filterCounts.modalita.catering || 0) + 1;

        // Conta cucine
        if (cardText.includes('italiana') || cardText.includes('pasta')) filterCounts.cucina.italiana = (filterCounts.cucina.italiana || 0) + 1;
        if (cardText.includes('orientale') || cardText.includes('sushi')) filterCounts.cucina.orientale = (filterCounts.cucina.orientale || 0) + 1;
        if (cardText.includes('vegana') || cardText.includes('plant-based')) filterCounts.cucina.vegana = (filterCounts.cucina.vegana || 0) + 1;
    });

    console.log('🔍 Conteggi smart filters:', filterCounts);
}