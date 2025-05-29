/* ===============================================
   RELAXPOINT - JAVASCRIPT PAGINA SERVIZI CORRETTO
   Dropdown funzionante + card identiche homepage
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const citySelector = document.getElementById('citySelector');
    const serviceCards = document.querySelectorAll('.service-card');

    // ===============================================
    // DROPDOWN CITTÀ FUNZIONANTE
    // ===============================================
    if (citySelector) {
        citySelector.addEventListener('change', function () {
            const selectedCity = this.value;
            console.log(`Città selezionata: ${selectedCity.toUpperCase()}`);

            // Feedback visivo temporaneo
            const cityContainer = this.closest('.city-selector');
            const originalBg = cityContainer.style.backgroundColor;

            cityContainer.style.backgroundColor = 'var(--color-primary)';
            cityContainer.style.color = 'white';

            setTimeout(() => {
                cityContainer.style.backgroundColor = originalBg;
                cityContainer.style.color = 'var(--color-text)';
            }, 500);

            // In implementazione reale: ricaricare servizi per nuova città
            // loadServicesForCity(selectedCity);
        });
    }

    // ===============================================
    // CLICK CARD SERVIZI - COME HOMEPAGE
    // ===============================================
    serviceCards.forEach(card => {
        card.addEventListener('click', function () {
            const serviceTitle = this.querySelector('.service-title')?.textContent;
            const serviceCategory = this.getAttribute('data-service');

            console.log(`Click su servizio: ${serviceTitle}`);

            // Simula navigazione (in implementazione reale)
            // window.location.href = `categoria-${serviceCategory}.html`;

            // Effetto click feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Accessibilità keyboard
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Vai ai servizi ${card.querySelector('.service-title')?.textContent}`);

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // ===============================================
    // RICERCA RAPIDA (dalla barra header)
    // ===============================================
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;

        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            const query = this.value.toLowerCase().trim();

            searchTimeout = setTimeout(() => {
                if (query.length > 0) {
                    filterServiceCards(query);
                } else {
                    showAllCards();
                }
            }, 300);
        });
    }

    function filterServiceCards(query) {
        serviceCards.forEach(card => {
            const title = card.querySelector('.service-title')?.textContent.toLowerCase() || '';
            const matches = title.includes(query);

            if (matches) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.3s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function showAllCards() {
        serviceCards.forEach(card => {
            card.style.display = 'flex';
            card.style.animation = 'fadeInUp 0.3s ease-out';
        });
    }

    // ===============================================
    // GEOLOCALIZZAZIONE AUTOMATICA SARDEGNA
    // ===============================================
    function detectSardinianCity() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    // Coordinate approssimative città Sardegna
                    let detectedCity = 'cagliari'; // default

                    // Sassari area (Nord Sardegna)
                    if (lat > 40.5 && lat < 41.0 && lng > 8.0 && lng < 9.0) {
                        detectedCity = 'sassari';
                    }
                    // Olbia area (Nord-Est)
                    else if (lat > 40.8 && lat < 41.2 && lng > 9.2 && lng < 9.8) {
                        detectedCity = 'olbia';
                    }
                    // Nuoro area (Centro)
                    else if (lat > 39.8 && lat < 40.5 && lng > 9.0 && lng < 9.5) {
                        detectedCity = 'nuoro';
                    }
                    // Oristano area (Ovest)
                    else if (lat > 39.5 && lat < 40.2 && lng > 8.3 && lng < 8.9) {
                        detectedCity = 'oristano';
                    }

                    if (citySelector && citySelector.value !== detectedCity) {
                        citySelector.value = detectedCity;
                        console.log(`Città rilevata: ${detectedCity.toUpperCase()}`);

                        // Trigger change event
                        citySelector.dispatchEvent(new Event('change'));
                    }
                },
                function (error) {
                    console.log('Geolocalizzazione non disponibile');
                },
                {
                    timeout: 5000,
                    maximumAge: 300000 // 5 minuti cache
                }
            );
        }
    }

    // Auto-rileva città (opzionale - decommentare se necessario)
    // detectSardinianCity();

    // ===============================================
    // ANIMAZIONI STAGGERED AL CARICAMENTO
    // ===============================================
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 150 * (index + 1));
    });

    // ===============================================
    // PERFORMANCE - LAZY LOADING IMMAGINI
    // ===============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const imageDiv = entry.target;
                    imageDiv.style.opacity = '1';
                    imageObserver.unobserve(imageDiv);
                }
            });
        }, {
            threshold: 0.1
        });

        const serviceImages = document.querySelectorAll('.service-image');
        serviceImages.forEach(img => {
            img.style.opacity = '0.8';
            img.style.transition = 'opacity 0.3s ease';
            imageObserver.observe(img);
        });
    }

    // ===============================================
    // INIZIALIZZAZIONE COMPLETA
    // ===============================================
    console.log('Pagina Servizi RelaxPoint inizializzata');
    console.log(`${serviceCards.length} servizi caricati`);
    console.log('Dropdown città funzionante');

});