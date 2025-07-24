// ===== BEAUTY & WELLNESS - JS COMPLETO =====

document.addEventListener('DOMContentLoaded', function () {
    console.log('💜 Beauty & Wellness - JavaScript caricato');

    // INIZIALIZZAZIONE
    initializeFilters();
    initializeProfessionalCards();
    initializeSorting();
    initializeLoadMore();

    // GESTIONE FILTRI
    function initializeFilters() {
        const resetBtn = document.querySelector('.beauty-reset-filters');

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetAllFilters();
                applyFilters();
                console.log('Filtri Beauty & Wellness resettati');
            });
        }

        // Auto-apply sui cambi per checkbox/radio
        const autoFilters = document.querySelectorAll('.beauty-filters input[type="checkbox"], .beauty-filters input[type="radio"]');
        autoFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });

        // Apply manuale per input numerici e select (prezzo, distanza)
        const manualFilters = document.querySelectorAll('.beauty-price-input, .beauty-distance-select');
        manualFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.beauty-professional-card');
        const filters = getActiveFilters();
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('beauty-load-more')) return;

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
            zona: getCheckedValues('input[name="zona"]:checked'),
            problema: getCheckedValues('input[name="problema"]:checked'),
            tecnologie: getCheckedValues('input[name="tecnologie"]:checked'),
            rating: getCheckedValue('input[name="rating"]:checked'),
            minPrice: parseInt(document.querySelector('.beauty-price-input[placeholder="Min €"]')?.value) || 0,
            maxPrice: parseInt(document.querySelector('.beauty-price-input[placeholder="Max €"]')?.value) || 999,
            maxDistance: parseInt(document.querySelector('.beauty-distance-select')?.value) || 50
        };
    }

    function matchesFilters(card, filters) {
        // Logica semplificata di matching
        const cardText = card.textContent.toLowerCase();

        // Modalità Servizio
        if (filters.modalita.length > 0) {
            const hasModalita = filters.modalita.some(m => {
                if (m === 'domicilio') return cardText.includes('domicilio');
                if (m === 'centro') return cardText.includes('centro') || cardText.includes('studio');
                if (m === 'mobile') return cardText.includes('mobile') || cardText.includes('van');
                if (m === 'online') return cardText.includes('online') || cardText.includes('consulenza');
                return false;
            });
            if (!hasModalita) return false;
        }

        // Tipo Trattamento
        if (filters.tipo.length > 0) {
            const hasTipo = filters.tipo.some(t => {
                switch (t) {
                    case 'viso':
                        return cardText.includes('viso') || cardText.includes('anti-age') || cardText.includes('pulizia');
                    case 'corpo':
                        return cardText.includes('corpo') || cardText.includes('cellulite') || cardText.includes('rassodamento');
                    case 'nails':
                        return cardText.includes('manicure') || cardText.includes('pedicure') || cardText.includes('unghie') || cardText.includes('nail');
                    case 'extension':
                        return cardText.includes('extension') || cardText.includes('ciglia') || cardText.includes('laminazione');
                    case 'epilazione':
                        return cardText.includes('epilazione') || cardText.includes('laser');
                    case 'skincare':
                        return cardText.includes('skincare') || cardText.includes('consulenza');
                    default:
                        return false;
                }
            });
            if (!hasTipo) return false;
        }

        // Zona Trattamento
        if (filters.zona.length > 0) {
            const hasZona = filters.zona.some(z => {
                switch (z) {
                    case 'solo-viso':
                        return cardText.includes('viso') && !cardText.includes('corpo');
                    case 'solo-corpo':
                        return cardText.includes('corpo') && !cardText.includes('viso');
                    case 'mani-piedi':
                        return cardText.includes('mani') || cardText.includes('piedi') || cardText.includes('nail');
                    case 'viso-corpo':
                        return cardText.includes('viso') && cardText.includes('corpo');
                    case 'completo':
                        return cardText.includes('completo') || cardText.includes('multidisciplinare');
                    default:
                        return false;
                }
            });
            if (!hasZona) return false;
        }

        // Problema Specifico
        if (filters.problema.length > 0) {
            const hasProblema = filters.problema.some(p => {
                switch (p) {
                    case 'anti-age':
                        return cardText.includes('anti-age') || cardText.includes('rughe') || cardText.includes('lifting');
                    case 'acne':
                        return cardText.includes('acne') || cardText.includes('imperfezioni');
                    case 'cellulite':
                        return cardText.includes('cellulite') || cardText.includes('rassodamento');
                    case 'idratazione':
                        return cardText.includes('idratazione') || cardText.includes('secchezza');
                    case 'macchie':
                        return cardText.includes('macchie') || cardText.includes('discromie');
                    case 'rilassamento':
                        return cardText.includes('rilassamento') || cardText.includes('tessuti');
                    default:
                        return false;
                }
            });
            if (!hasProblema) return false;
        }

        // Tecnologie
        if (filters.tecnologie.length > 0) {
            const hasTecnologie = filters.tecnologie.some(t => {
                switch (t) {
                    case 'manuale':
                        return cardText.includes('manuale') || !cardText.includes('radiofrequenza');
                    case 'radiofrequenza':
                        return cardText.includes('radiofrequenza') || cardText.includes('rf');
                    case 'cavitazione':
                        return cardText.includes('cavitazione');
                    case 'pressoterapia':
                        return cardText.includes('pressoterapia');
                    case 'laser':
                        return cardText.includes('laser') || cardText.includes('ipl');
                    case 'microneedling':
                        return cardText.includes('microneedling');
                    default:
                        return false;
                }
            });
            if (!hasTecnologie) return false;
        }

        // Rating
        if (filters.rating) {
            const ratingValue = parseFloat(card.querySelector('.beauty-rating-value')?.textContent) || 0;
            switch (filters.rating) {
                case '4plus':
                    if (ratingValue < 4.0) return false;
                    break;
                case '45plus':
                    if (ratingValue < 4.5) return false;
                    break;
                case 'premium':
                    if (!card.classList.contains('beauty-premium')) return false;
                    break;
            }
        }

        return true;
    }

    function resetAllFilters() {
        document.querySelectorAll('.beauty-filters input[type="checkbox"], .beauty-filters input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        document.querySelectorAll('.beauty-price-input').forEach(input => {
            input.value = '';
        });

        const distanceSelect = document.querySelector('.beauty-distance-select');
        if (distanceSelect) distanceSelect.value = '10';

        // Reset default
        const domicilioCheckbox = document.querySelector('input[name="modalita"][value="domicilio"]');
        if (domicilioCheckbox) domicilioCheckbox.checked = true;
    }

    function updateResultsCount(count) {
        const resultsTitle = document.querySelector('.beauty-results-info h2');
        if (resultsTitle) {
            resultsTitle.textContent = `${count} Specialisti trovati`;
        }
    }

    // GESTIONE CARDS PROFESSIONISTI
    function initializeProfessionalCards() {
        // Pulsanti preferiti
        document.querySelectorAll('.beauty-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('active');

                // Animazione
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                console.log('Preferito Beauty & Wellness toggled');
            });
        });

        // Pulsanti profilo
        document.querySelectorAll('.beauty-profile-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.beauty-professional-card');
                const name = card.querySelector('h3').textContent;
                const slug = name.toLowerCase().replace(/\s+/g, '-').replace('dott.ssa', '').replace('dott.', '');

                console.log(`Vai al profilo Beauty: ${name}`);
                // window.location.href = `/pages/professionista/${slug}.html`;
            });
        });

        // Pulsanti prenota
        document.querySelectorAll('.beauty-book-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.beauty-professional-card');
                const name = card.querySelector('h3').textContent;

                console.log(`Prenota Beauty con: ${name}`);
                // window.location.href = `/pages/prenotazione/prenota.html?prof=${name}&service=beauty`;
            });
        });

        // Click su card
        document.querySelectorAll('.beauty-professional-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.closest('button')) return;

                const name = this.querySelector('h3').textContent;
                console.log(`Card Beauty clicked: ${name}`);
                // Vai al profilo
            });
        });
    }

    // ORDINAMENTO
    function initializeSorting() {
        const sortSelect = document.querySelector('.beauty-sort-select');

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const sortBy = this.value;
                sortProfessionals(sortBy);
                console.log(`Ordinamento Beauty: ${sortBy}`);
            });
        }
    }

    function sortProfessionals(sortBy) {
        const container = document.querySelector('.beauty-professionals-grid');
        const cards = Array.from(container.querySelectorAll('.beauty-professional-card')).filter(card =>
            !card.classList.contains('beauty-load-more')
        );

        cards.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.beauty-rating-value')?.textContent) || 0;
                    const ratingB = parseFloat(b.querySelector('.beauty-rating-value')?.textContent) || 0;
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
                    const premiumA = a.classList.contains('beauty-premium') ? 1 : 0;
                    const premiumB = b.classList.contains('beauty-premium') ? 1 : 0;
                    if (premiumA !== premiumB) return premiumB - premiumA;

                    const ratingA2 = parseFloat(a.querySelector('.beauty-rating-value')?.textContent) || 0;
                    const ratingB2 = parseFloat(b.querySelector('.beauty-rating-value')?.textContent) || 0;
                    return ratingB2 - ratingA2;
            }
        });

        // Riordina DOM
        cards.forEach(card => container.appendChild(card));

        // Mantieni load-more alla fine
        const loadMore = container.querySelector('.beauty-load-more');
        if (loadMore) container.appendChild(loadMore);
    }

    function getMinPrice(card) {
        const pricingText = card.querySelector('.beauty-pricing')?.textContent || '';
        const prices = pricingText.match(/€(\d+)/g);
        if (prices && prices.length > 0) {
            return Math.min(...prices.map(p => parseInt(p.replace('€', ''))));
        }
        return 999;
    }

    function getDistance(card) {
        const distanceText = card.querySelector('.beauty-distance')?.textContent || '';
        const match = distanceText.match(/(\d+\.?\d*)\s*km/);
        return match ? parseFloat(match[1]) : 999;
    }

    function getExperience(card) {
        const packagesText = card.querySelector('.beauty-packages')?.textContent || '';
        const match = packagesText.match(/(\d+)\s*anni/);
        return match ? parseInt(match[1]) : 0;
    }

    // LOAD MORE
    function initializeLoadMore() {
        const loadMoreBtn = document.querySelector('.beauty-load-more-btn');

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                this.textContent = 'Caricamento...';
                this.disabled = true;

                setTimeout(() => {
                    console.log('Caricamento altri specialisti Beauty...');

                    this.textContent = 'Carica altri specialisti';
                    this.disabled = false;

                    // Aggiorna contatore
                    const info = document.querySelector('.beauty-load-more p');
                    if (info) {
                        info.textContent = 'Mostrando 12 di 43 risultati';
                    }

                    // Simula fine risultati dopo qualche caricamento
                    // In produzione: gestire con API

                }, 1000);
            });
        }
    }

    // RICERCA SPECIALIZZATA BEAUTY
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
            document.querySelectorAll('.beauty-professional-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        const cards = document.querySelectorAll('.beauty-professional-card');
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('beauty-load-more')) return;

            const cardText = card.textContent.toLowerCase();

            // Ricerca specifica per Beauty & Wellness
            const isMatch = cardText.includes(query) ||
                query.includes('estetica') && cardText.includes('estetica') ||
                query.includes('beauty') && cardText.includes('beauty') ||
                query.includes('viso') && cardText.includes('viso') ||
                query.includes('corpo') && cardText.includes('corpo') ||
                query.includes('manicure') && cardText.includes('manicure') ||
                query.includes('extension') && cardText.includes('extension') ||
                query.includes('anti-age') && cardText.includes('anti-age') ||
                query.includes('medico') && cardText.includes('medico');

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
        // Quando selezioni "Anti-age", suggerisci automaticamente "Viso" + "Radiofrequenza"
        const antiAgeCheckbox = document.querySelector('input[name="problema"][value="anti-age"]');
        const visoCheckbox = document.querySelector('input[name="tipo"][value="viso"]');
        const radioCheckbox = document.querySelector('input[name="tecnologie"][value="radiofrequenza"]');

        if (antiAgeCheckbox && visoCheckbox && radioCheckbox) {
            antiAgeCheckbox.addEventListener('change', function () {
                if (this.checked) {
                    visoCheckbox.checked = true;
                    radioCheckbox.checked = true;
                    console.log('Smart filter: Anti-age → Viso + Radiofrequenza suggeriti');
                    setTimeout(() => applyFilters(), 100);
                }
            });
        }

        // Quando selezioni "Cellulite", suggerisci automaticamente "Corpo" + "Cavitazione"
        const celluliteCheckbox = document.querySelector('input[name="problema"][value="cellulite"]');
        const corpoCheckbox = document.querySelector('input[name="tipo"][value="corpo"]');
        const cavitazioneCheckbox = document.querySelector('input[name="tecnologie"][value="cavitazione"]');

        if (celluliteCheckbox && corpoCheckbox && cavitazioneCheckbox) {
            celluliteCheckbox.addEventListener('change', function () {
                if (this.checked) {
                    corpoCheckbox.checked = true;
                    cavitazioneCheckbox.checked = true;
                    console.log('Smart filter: Cellulite → Corpo + Cavitazione suggeriti');
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
    console.log('✅ Beauty & Wellness - Tutto inizializzato');

    // Conteggio iniziale
    updateResultsCount(document.querySelectorAll('.beauty-professional-card:not(.beauty-load-more)').length);
});

// GESTIONE ERRORI IMMAGINI - BEAUTY
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.beauty-professional-card img, .beauty-hero-image img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/assets/images/placeholder-beauty.jpg';
            this.alt = 'Beauty - Immagine non disponibile';
            console.log('⚠️ Immagine Beauty sostituita con placeholder');
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
    💜 ===============================================
       BEAUTY & WELLNESS - Statistiche Debug
       Specialisti: ${document.querySelectorAll('.beauty-professional-card:not(.beauty-load-more)').length}
       Filtri: ${document.querySelectorAll('.beauty-filter-group').length}
       Trattamenti: Viso, Corpo, Nails, Extension, Epilazione
       Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);

    // Statistiche filtri
    const tipoOptions = document.querySelectorAll('input[name="tipo"]').length;
    const problemaOptions = document.querySelectorAll('input[name="problema"]').length;
    const tecnologieOptions = document.querySelectorAll('input[name="tecnologie"]').length;

    console.log(`📊 Filtri disponibili: ${tipoOptions} tipi, ${problemaOptions} problemi, ${tecnologieOptions} tecnologie`);
});