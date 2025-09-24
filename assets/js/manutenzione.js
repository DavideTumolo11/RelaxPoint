/* ===============================================
   RELAXPOINT - JS MANUTENZIONE
   Gestione countdown, animazioni e interazioni
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('[SETUP] Pagina Manutenzione - JS caricato');

    // ===============================================
    // CONFIGURAZIONE GLOBALE
    // ===============================================
    const config = {
        endTime: new Date().getTime() + (2.5 * 60 * 60 * 1000), // 2.5 ore da ora
        progressTarget: 100, // Progresso finale
        progressIncrement: 0.1, // Incremento progresso
        bubbleInterval: 3000, // Intervallo bolle
        maxBubbles: 15 // Massimo numero bolle
    };

    let currentProgress = 67;
    let countdownInterval;
    let progressInterval;
    let bubbleInterval;

    // ===============================================
    // COUNTDOWN TIMER
    // ===============================================
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = config.endTime - now;

        if (distance < 0) {
            // Tempo scaduto - simula completamento
            handleMaintenanceComplete();
            return;
        }

        // Calcola tempo rimanente
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Aggiorna elementi DOM
        updateTimeElement('days', days);
        updateTimeElement('hours', hours);
        updateTimeElement('minutes', minutes);
        updateTimeElement('seconds', seconds);

        // Aggiorna progresso basato sul tempo rimanente
        updateProgressBasedOnTime(distance);
    }

    function updateTimeElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            const formattedValue = value.toString().padStart(2, '0');

            // Animazione cambio numero
            if (element.textContent !== formattedValue) {
                element.style.transform = 'scale(1.1)';
                element.style.transition = 'transform 0.2s ease';

                setTimeout(() => {
                    element.textContent = formattedValue;
                    element.style.transform = 'scale(1)';
                }, 100);
            }
        }
    }

    function updateProgressBasedOnTime(timeRemaining) {
        const totalTime = 2.5 * 60 * 60 * 1000; // 2.5 ore in ms
        const elapsed = totalTime - timeRemaining;
        const calculatedProgress = Math.min(95, (elapsed / totalTime) * 100);

        // Aggiorna progress bar se necessario
        if (calculatedProgress > currentProgress) {
            updateProgress(calculatedProgress);
        }
    }

    // ===============================================
    // PROGRESS BAR MANAGEMENT
    // ===============================================
    function updateProgress(newProgress) {
        currentProgress = Math.min(100, newProgress);

        const progressBar = document.getElementById('progressBar');
        const progressPercentage = document.getElementById('progressPercentage');

        if (progressBar) {
            progressBar.style.width = currentProgress + '%';
        }

        if (progressPercentage) {
            progressPercentage.textContent = Math.round(currentProgress) + '%';
        }

        // Effetti speciali per milestone
        if (currentProgress >= 75 && currentProgress < 76) {
            showMilestoneNotification('75% completato! 🎉');
        } else if (currentProgress >= 90 && currentProgress < 91) {
            showMilestoneNotification('90% completato! Quasi pronti! 🚀');
        } else if (currentProgress >= 100) {
            handleMaintenanceComplete();
        }
    }

    function showMilestoneNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(45, 90, 61, 0.3);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animazione entrata
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Rimozione automatica
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    // ===============================================
    // GESTIONE COMPLETAMENTO MANUTENZIONE
    // =============================================== 
    function handleMaintenanceComplete() {
        clearInterval(countdownInterval);
        clearInterval(progressInterval);
        clearInterval(bubbleInterval);

        // Aggiorna UI per completamento
        const countdownContainer = document.getElementById('countdownContainer');
        if (countdownContainer) {
            countdownContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                    <h3 style="color: var(--color-primary); margin: 0 0 8px 0;">Manutenzione Completata!</h3>
                    <p style="color: var(--color-secondary); margin: 0;">Reindirizzamento in corso...</p>
                </div>
            `;
        }

        updateProgress(100);

        // Redirect automatico dopo 3 secondi
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }

    // ===============================================
    // NEWSLETTER FORM MANAGEMENT
    // ===============================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    async function handleNewsletterSubmit(e) {
        e.preventDefault();

        const emailInput = document.getElementById('email');
        const submitButton = newsletterForm.querySelector('button[type="submit"]');
        const buttonLoader = document.getElementById('buttonLoader');
        const formMessage = document.getElementById('formMessage');
        const buttonText = submitButton.querySelector('span');

        if (!emailInput.value || !isValidEmail(emailInput.value)) {
            showFormMessage('Per favore inserisci un indirizzo email valido', 'error');
            return;
        }

        // UI loading state
        submitButton.disabled = true;
        buttonText.style.opacity = '0';
        buttonLoader.style.display = 'block';

        try {
            // Simula invio email (in produzione: API call)
            await simulateEmailSubmission(emailInput.value);

            // Success feedback
            showFormMessage('✅ Perfetto! Ti avviseremo appena saremo online', 'success');
            emailInput.value = '';

            // Analytics tracking
            trackNewsletterSignup(emailInput.value);

        } catch (error) {
            console.error('Errore invio newsletter:', error);
            showFormMessage('❌ Errore temporaneo. Riprova tra qualche minuto', 'error');
        } finally {
            // Reset UI
            setTimeout(() => {
                submitButton.disabled = false;
                buttonText.style.opacity = '1';
                buttonLoader.style.display = 'none';
            }, 1000);
        }
    }

    function simulateEmailSubmission(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simula 90% successo, 10% errore
                if (Math.random() > 0.1) {
                    resolve({ success: true, email });
                } else {
                    reject(new Error('Simulated server error'));
                }
            }, 2000);
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';

            // Auto-hide dopo 5 secondi
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    function trackNewsletterSignup(email) {
        const eventData = {
            event: 'newsletter_signup_maintenance',
            email_domain: email.split('@')[1],
            timestamp: new Date().toISOString(),
            page: 'maintenance'
        };

        console.log('📊 Newsletter Signup:', eventData);

        // In produzione: invio a Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_signup', {
                'event_category': 'maintenance',
                'event_label': email.split('@')[1]
            });
        }
    }

    // ===============================================
    // FLOATING BUBBLES ANIMATION
    // ===============================================
    function createFloatingBubble() {
        const bubblesContainer = document.getElementById('floatingBubbles');
        if (!bubblesContainer) return;

        // Controllo numero massimo bolle
        const existingBubbles = bubblesContainer.querySelectorAll('.bubble');
        if (existingBubbles.length >= config.maxBubbles) {
            return;
        }

        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        // Proprietà random
        const size = Math.random() * 40 + 20; // 20-60px
        const startPosition = Math.random() * window.innerWidth;
        const duration = Math.random() * 10 + 15; // 15-25s
        const delay = Math.random() * 2; // 0-2s delay

        bubble.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startPosition}px;
            animation: floatUp ${duration}s linear infinite;
            animation-delay: ${delay}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;

        bubblesContainer.appendChild(bubble);

        // Rimozione automatica dopo animazione
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, (duration + delay) * 1000);
    }

    // ===============================================
    // PRIVACY MODAL
    // ===============================================
    window.togglePrivacyInfo = function () {
        const modal = document.getElementById('privacyModal');
        if (modal) {
            const isVisible = modal.style.display === 'block';

            if (isVisible) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            } else {
                modal.style.display = 'block';
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
            }
        }
    };

    // ===============================================
    // UPDATE TIME MANAGEMENT
    // ===============================================
    function updateLastUpdateTime() {
        const updateTimeElement = document.getElementById('updateTime');
        if (updateTimeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit'
            });
            updateTimeElement.textContent = timeString;
        }
    }

    // ===============================================
    // SYSTEM STATUS SIMULATION
    // ===============================================
    function simulateSystemStatusUpdates() {
        const statusItems = document.querySelectorAll('.status-item');

        setInterval(() => {
            // Simula occasionali cambi di stato
            statusItems.forEach(item => {
                const indicator = item.querySelector('.status-indicator');

                if (Math.random() < 0.05) { // 5% probabilità di cambio
                    // Cambia stato temporaneamente
                    const originalClass = indicator.className;
                    indicator.className = 'status-indicator status-warning';

                    setTimeout(() => {
                        indicator.className = originalClass;
                    }, 2000);
                }
            });
        }, 30000); // Ogni 30 secondi
    }

    // ===============================================
    // KEYBOARD SHORTCUTS
    // ===============================================
    document.addEventListener('keydown', function (e) {
        // Alt + R: Refresh/Reload
        if (e.altKey && e.key === 'r') {
            e.preventDefault();
            window.location.reload();
        }

        // Alt + H: Home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            window.location.href = 'index.html';
        }

        // Escape: Chiudi modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('privacyModal');
            if (modal && modal.style.display === 'block') {
                togglePrivacyInfo();
            }
        }
    });

    // ===============================================
    // PROGRESSIVE ENHANCEMENT
    // ===============================================
    function addProgressiveEnhancements() {
        // Aggiunge effetti hover dinamici
        const interactiveElements = document.querySelectorAll('.sidebar-card, .feature-item, .contact-item');

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(45, 90, 61, 0.15)';
            });

            element.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });

        // Aggiunge pulse effect ai gear
        const gears = document.querySelectorAll('.gear');
        gears.forEach((gear, index) => {
            gear.addEventListener('click', function () {
                this.style.transform = `scale(1.2) rotate(${index * 120}deg)`;
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            });
        });
    }

    // ===============================================
    // PERFORMANCE MONITORING
    // ===============================================
    function initPerformanceMonitoring() {
        // Monitora performance della pagina
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'navigation') {
                    console.log('[SUCCESS] Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
                }
            });
        });

        if (typeof PerformanceObserver !== 'undefined') {
            observer.observe({ entryTypes: ['navigation'] });
        }

        // Monitora utilizzo memoria (se supportato)
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
                    console.warn('[WARNING] High memory usage detected');
                }
            }, 60000); // Ogni minuto
        }
    }

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        console.log('[SETUP] Inizializzazione Manutenzione...');

        // Avvia countdown
        updateCountdown(); // Prima esecuzione immediata
        countdownInterval = setInterval(updateCountdown, 1000);

        // Avvia aggiornamento progresso graduale
        progressInterval = setInterval(() => {
            if (currentProgress < 95) {
                updateProgress(currentProgress + config.progressIncrement);
            }
        }, 30000); // Ogni 30 secondi

        // Avvia bolle animate
        bubbleInterval = setInterval(createFloatingBubble, config.bubbleInterval);

        // Setup vari
        updateLastUpdateTime();
        setInterval(updateLastUpdateTime, 60000); // Aggiorna ogni minuto

        simulateSystemStatusUpdates();
        addProgressiveEnhancements();
        initPerformanceMonitoring();

        // Animazione entrata iniziale
        setTimeout(() => {
            document.querySelector('.maintenance-card').classList.add('glow-effect');
            setTimeout(() => {
                document.querySelector('.maintenance-card').classList.remove('glow-effect');
            }, 2000);
        }, 1000);

        console.log('✅ Manutenzione inizializzata con successo');
    }

    // ===============================================
    // CLEANUP ON PAGE UNLOAD
    // ===============================================
    window.addEventListener('beforeunload', function () {
        clearInterval(countdownInterval);
        clearInterval(progressInterval);
        clearInterval(bubbleInterval);
    });

    // ===============================================
    // HANDLE VISIBILITY CHANGE
    // ===============================================
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            // Pausa animazioni quando tab non è visibile
            clearInterval(bubbleInterval);
        } else {
            // Riprendi animazioni quando tab torna visibile
            bubbleInterval = setInterval(createFloatingBubble, config.bubbleInterval);
            updateLastUpdateTime(); // Aggiorna timestamp
        }
    });

    // Avvia tutto
    init();
});