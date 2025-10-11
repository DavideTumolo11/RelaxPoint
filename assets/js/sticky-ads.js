/**
 * STICKY ADS CON STOP AL FOOTER
 * Gestisce le pubblicità laterali che seguono lo scroll ma si fermano prima del footer
 */

document.addEventListener('DOMContentLoaded', function() {
    // Trova tutte le ads laterali
    const leftAds = document.querySelectorAll('[class*="-ad-left"]');
    const rightAds = document.querySelectorAll('[class*="-ad-right"]');
    const footer = document.querySelector('.site-footer') || document.querySelector('footer');

    if (!footer) return; // Nessun footer, esci

    const allAds = [...leftAds, ...rightAds];
    if (allAds.length === 0) return; // Nessuna ad, esci

    // Salva le posizioni originali per ogni ad
    const originalPositions = new Map();
    allAds.forEach(ad => {
        const computedStyle = window.getComputedStyle(ad);
        originalPositions.set(ad, {
            top: computedStyle.top,
            left: computedStyle.left,
            right: computedStyle.right,
            transform: computedStyle.transform
        });
    });

    // Configurazione - margine base dal footer
    const baseStopOffset = 200; // Pixel di margine base dal footer

    function updateAdsPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const footerRect = footer.getBoundingClientRect();
        const footerTopInViewport = footerRect.top;

        // Raggruppa ads per lato (left/right) per gestire sovrapposizioni
        const leftSideAds = Array.from(leftAds);
        const rightSideAds = Array.from(rightAds);

        // Funzione per gestire un gruppo di ads sullo stesso lato
        const processAdGroup = (adsGroup) => {
            // Ordina per posizione top originale
            const sortedAds = adsGroup.sort((a, b) => {
                const topA = parseFloat(originalPositions.get(a).top);
                const topB = parseFloat(originalPositions.get(b).top);
                return topA - topB;
            });

            let previousAdBottom = 0;

            sortedAds.forEach(ad => {
                const adHeight = ad.offsetHeight;
                const original = originalPositions.get(ad);
                const adRect = ad.getBoundingClientRect();
                const adBottomInViewport = adRect.bottom;
                const adTopInViewport = adRect.top;

                // Calcola stopOffset dinamico: più grande è la card, più margine serve
                // Card piccole (300px): 200px offset
                // Card grandi (500px): 600px offset
                const dynamicStopOffset = baseStopOffset + (adHeight > 400 ? 400 : 0);

                // Calcola la posizione massima considerando il footer
                // Il footer top è relativo al viewport, quindi devo sottrarre altezza card + offset
                let maxTopPosition = footerTopInViewport - adHeight - dynamicStopOffset;

                // Se maxTopPosition è negativo o il footer è vicino, usa un valore sicuro
                if (maxTopPosition < 0) {
                    maxTopPosition = 0;
                }

                // Se c'è una card sopra, assicurati di non sovrapporla
                if (previousAdBottom > 0) {
                    const minTopPosition = previousAdBottom + 20; // 20px di gap
                    maxTopPosition = Math.max(minTopPosition, maxTopPosition);
                }

                // Se il bottom dell'ad sta per toccare il footer o la card sopra, fermala
                const shouldStop = footerTopInViewport <= windowHeight &&
                                   (adBottomInViewport >= footerTopInViewport - dynamicStopOffset);

                if (shouldStop) {
                    // Forza la posizione massima per fermare prima del footer
                    ad.style.position = 'fixed';
                    ad.style.top = `${maxTopPosition}px`;
                    ad.style.transform = 'none';
                    ad.style.left = original.left;
                    ad.style.right = original.right;

                    previousAdBottom = maxTopPosition + adHeight;
                } else {
                    // Ad continua a seguire con position fixed normale
                    ad.style.position = 'fixed';
                    ad.style.top = original.top;
                    ad.style.transform = original.transform;
                    ad.style.left = original.left;
                    ad.style.right = original.right;

                    previousAdBottom = adRect.bottom;
                }
            });
        };

        // Processa separatamente ads a sinistra e destra
        if (leftSideAds.length > 0) processAdGroup(leftSideAds);
        if (rightSideAds.length > 0) processAdGroup(rightSideAds);
    }

    // Esegui al caricamento
    updateAdsPosition();

    // Esegui durante lo scroll (con throttle per performance)
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateAdsPosition();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Esegui al resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            updateAdsPosition();
        }, 250);
    });
});
