/* ===============================================
   RELAXPOINT - JAVASCRIPT CALENDARIO PROFESSIONISTA
   Gestisce calendario ibrido con prenotazioni e disponibilità
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('Calendario professionista caricato');
    checkUserAuthentication();
    initCalendar();

    // Gestisce parametri URL per aprire evento specifico
    handleURLParameters();
});

// Controlla se utente/professionista è loggato
function checkUserAuthentication() {
    // Simulazione: controlla localStorage per vedere se utente è loggato
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType'); // 'user' o 'professional'
    const userName = localStorage.getItem('userName') || 'Utente';
    const userAvatar = localStorage.getItem('userAvatar') || '/assets/images/default-avatar.png';

    const avatarElement = document.getElementById('userAvatar');
    const loginButton = document.querySelector('.btn-secondary[href="/login.html"]');
    const prenotaButton = document.querySelector('.btn-primary[href*="prenota"]');

    if (isLoggedIn && avatarElement && loginButton) {
        // Nascondi il pulsante Accedi
        loginButton.style.display = 'none';

        // Mostra l'avatar con l'immagine
        avatarElement.style.display = 'flex';
        const avatarImg = avatarElement.querySelector('img');
        if (avatarImg) {
            avatarImg.src = userAvatar;
            avatarImg.alt = userName;
        }

        // Se è un professionista, nascondi anche "Prenota"
        if (userType === 'professional' && prenotaButton) {
            prenotaButton.style.display = 'none';
        }

        console.log(`Utente loggato: ${userName} (${userType})`);
    } else {
        // Utente non loggato: nascondi avatar
        if (avatarElement) {
            avatarElement.style.display = 'none';
        }
    }
}

// Oggetto principale per gestire il calendario
window.CalendarioProfessionista = {
    currentDate: new Date(),
    currentView: 'week',
    selectedSlot: null,

    init() {
        console.log('Inizializzazione calendario professionista');
        this.setupEventListeners();
        this.updateCalendarDisplay();
        this.renderCalendar();
        this.loadBookings();
    },

    // ===============================================
    // SETUP EVENT LISTENERS
    // ===============================================
    setupEventListeners() {
        // View switcher
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Chiusura modal con overlay
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal').id);
            });
        });

        console.log('Event listeners configurati');
    },

    // ===============================================
    // CAMBIO VISTA CALENDARIO
    // ===============================================
    switchView(view) {
        this.currentView = view;

        // Aggiorna bottoni attivi
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Aggiorna classe calendario
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.className = `calendar-grid ${view}-view`;

        this.updateCalendarDisplay();
        this.renderCalendar();
        this.showNotification(`Vista cambiata: ${view}`, 'info');
    },

    updateCalendarDisplay() {
        const periodElement = document.getElementById('currentPeriod');
        if (periodElement) {
            const monthNames = [
                'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
            ];

            const month = monthNames[this.currentDate.getMonth()];
            const year = this.currentDate.getFullYear();

            switch (this.currentView) {
                case 'month':
                    periodElement.textContent = `${month} ${year}`;
                    break;
                case 'week':
                    periodElement.textContent = `Settimana ${this.getWeekNumber()} - ${month} ${year}`;
                    break;
                case 'day':
                    const day = this.currentDate.getDate();
                    periodElement.textContent = `${day} ${month} ${year}`;
                    break;
            }
        }
    },

    getWeekNumber() {
        const date = new Date(this.currentDate);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        const week1 = new Date(date.getFullYear(), 0, 4);
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    },

    // ===============================================
    // RENDERING CALENDARIO
    // ===============================================
    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        switch (this.currentView) {
            case 'week':
                this.renderWeekView(calendarGrid);
                break;
            case 'month':
                this.renderMonthView(calendarGrid);
                break;
            case 'day':
                this.renderDayView(calendarGrid);
                break;
        }
    },

    renderWeekView(container) {
        const startOfWeek = this.getStartOfWeek(this.currentDate);
        const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

        container.innerHTML = `
            <!-- HEADER GIORNI SETTIMANA -->
            <div class="calendar-header">
                <div class="time-slot-header">Ora</div>
                ${dayNames.map((day, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            const isToday = this.isToday(date);
            return `<div class="day-header ${isToday ? 'today' : ''}">${day} ${date.getDate()}</div>`;
        }).join('')}
            </div>

            <!-- GRIGLIA ORARI -->
            <div class="calendar-body">
                ${this.generateTimeSlots().map(time => {
            return `
                    <div class="time-slot" data-time="${time}">
                        <span class="time-label">${time}</span>
                    </div>
                    ${dayNames.map((_, dayIndex) => {
                const cellClass = this.getCellClass(dayIndex, time);
                const cellContent = this.getCellContent(dayIndex, time);
                return `<div class="calendar-cell ${cellClass}"
                                     data-day="${dayIndex}"
                                     data-time="${time}"
                                     onclick="editSlot(this)">${cellContent}</div>`;
            }).join('')}
                `;
        }).join('')}
            </div>
        `;
    },

    renderMonthView(container) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = this.getStartOfWeek(firstDay);

        const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

        container.innerHTML = `
            <!-- HEADER GIORNI -->
            <div class="month-header">
                ${dayNames.map(day => `<div class="day-header">${day}</div>`).join('')}
            </div>
            
            <!-- GRIGLIA MESE -->
            <div class="month-body">
                ${this.generateMonthCells(startDate, lastDay).join('')}
            </div>
        `;
    },

    renderDayView(container) {
        const date = this.currentDate;
        const dayName = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'][date.getDay()];

        container.innerHTML = `
            <!-- HEADER GIORNO -->
            <div class="calendar-header">
                <div class="time-slot-header">Ora</div>
                <div class="day-header today">${dayName} ${date.getDate()}</div>
            </div>

            <!-- GRIGLIA GIORNO -->
            <div class="calendar-body">
                ${this.generateTimeSlots().map(time => {
            return `
                    <div class="time-slot" data-time="${time}">
                        <span class="time-label">${time}</span>
                    </div>
                    <div class="calendar-cell ${this.getCellClass(0, time)}"
                         data-day="0"
                         data-time="${time}"
                         onclick="editSlot(this)">${this.getCellContent(0, time)}</div>
                `;
        }).join('')}
            </div>
        `;
    },

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    getStartOfWeek(date) {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(start.setDate(diff));
    },

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },

    generateTimeSlots() {
        const slots = [];
        // Parte dalle 7 del mattino e va fino alle 6 del mattino del giorno dopo
        for (let hour = 7; hour < 24; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        for (let hour = 0; hour <= 6; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    },

    generateMonthCells(startDate, lastDay) {
        const cells = [];
        const currentDate = new Date(startDate);

        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const isCurrentMonth = currentDate.getMonth() === this.currentDate.getMonth();
                const isToday = this.isToday(currentDate);

                cells.push(`
                    <div class="month-cell ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}"
                         data-date="${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}"
                         onclick="selectDate(this)">
                        <div class="cell-date">${currentDate.getDate()}</div>
                        <div class="cell-events">${this.getMonthCellEvents(currentDate)}</div>
                    </div>
                `);

                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        return cells;
    },

    getCellClass(dayIndex, time) {
        // Simula stati basati su ora e giorno (esempio)
        // Yoga Hatha: 09:15-10:15 (occupa slot 09:00 e 10:00 del giorno 0)
        if (time === '09:00' && dayIndex === 0) return 'booking';
        if (time === '10:00' && dayIndex === 0) return 'booking'; // Continuazione Yoga Hatha
        if (time === '10:00' && dayIndex === 2) return 'booking';
        if (time === '13:00' && dayIndex === 4) return 'booking';
        if (time === '10:00' && dayIndex === 1) return 'lastminute';

        // Tutti i giorni (inclusi sabato e domenica) sono disponibili di default
        return 'available';
    },

    getCellContent(dayIndex, time) {
        const cellClass = this.getCellClass(dayIndex, time);

        // Funzione helper per creare barra progress
        const createProgressBar = (occupied, total) => {
            const percentage = (occupied / total) * 100;
            let colorClass = 'green';
            if (percentage > 60 && percentage <= 90) colorClass = 'yellow';
            if (percentage > 90) colorClass = 'red';

            return `
                <div class="event-progress">
                    <div class="event-progress-bar ${colorClass}" style="width: ${percentage}%"></div>
                </div>
                <div class="event-info">
                    <span class="event-time">${time}</span>
                    <span class="event-capacity">${occupied}/${total} posti</span>
                </div>
            `;
        };

        // Funzione per determinare se questa cella fa parte di un evento multi-slot
        const getMultiSlotPosition = (dayIdx, timeSlot) => {
            // Esempio: Yoga Hatha va dalle 09:15 alle 10:15 (occupa slot 09:00 e 10:00)
            if (dayIdx === 0 && timeSlot === '09:00') return 'start';
            if (dayIdx === 0 && timeSlot === '10:00') return 'end';
            return null;
        };

        const multiSlotPos = getMultiSlotPosition(dayIndex, time);

        switch (cellClass) {
            case 'booking':
                if (time === '09:00' && dayIndex === 0) {
                    return `
                        <div class="event-content">
                            <div class="event-title">Yoga Hatha</div>
                            <div class="event-info">
                                <span class="event-time">09:15-10:15</span>
                            </div>
                            ${createProgressBar(6, 15)}
                        </div>
                    `;
                }
                if (time === '10:00' && dayIndex === 0) {
                    // Slot finale dello stesso evento - mostra solo continuazione
                    return `
                        <div class="event-content event-continuation">
                            <div class="event-info">
                                <span class="event-time">↑ Yoga Hatha</span>
                            </div>
                        </div>
                    `;
                }
                if (time === '10:00' && dayIndex === 2) {
                    return `
                        <div class="event-content">
                            <div class="event-title">Pilates Avanzato</div>
                            ${createProgressBar(13, 15)}
                        </div>
                    `;
                }
                if (time === '13:00' && dayIndex === 4) {
                    return `
                        <div class="event-content">
                            <div class="event-title">Meditazione</div>
                            ${createProgressBar(14, 15)}
                        </div>
                    `;
                }
                break;
            case 'lastminute':
                return '<div class="lastminute-badge">Last Minute</div>';
            default:
                return '';
        }
    },

    getMonthCellEvents(date) {
        // Simula eventi nel mese
        const day = date.getDate();
        if (day % 7 === 0) return '<div class="event-dot booking"></div>';
        return '';
    },

    // ===============================================
    // GESTIONE SLOT CALENDARIO
    // ===============================================
    editSlot(cell) {
        console.log('editSlot chiamato', cell);

        // Se è un evento esistente (booking o lastminute), apri dettagli
        if (cell.classList.contains('booking') || cell.classList.contains('lastminute')) {
            console.log('È un evento, apro viewBooking');
            this.viewBooking(cell);
            return;
        }

        // Se è una cella vuota/disponibile, apri modal creazione evento
        console.log('Cella vuota, apro modal creazione evento');
        this.selectedSlot = cell;
        const day = cell.dataset.day;
        const time = cell.dataset.time;

        // Pre-compila data e ora nel form
        const eventDate = document.getElementById('eventDate');
        const eventTime = document.getElementById('eventTime');

        if (eventDate) {
            // Calcola la data in base al giorno della settimana
            const today = new Date();
            const currentDay = today.getDay(); // 0 = Domenica, 1 = Lunedì, etc.
            const targetDay = parseInt(day); // 0 = Lunedì nel nostro calendario

            // Converti il nostro indice (0=Lunedì) al formato Date (1=Lunedì)
            const dayDiff = (targetDay + 1) - currentDay;
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + dayDiff);

            // Formatta per input type="date" (YYYY-MM-DD)
            const year = targetDate.getFullYear();
            const month = String(targetDate.getMonth() + 1).padStart(2, '0');
            const dayNum = String(targetDate.getDate()).padStart(2, '0');
            eventDate.value = `${year}-${month}-${dayNum}`;
        }

        if (eventTime) {
            eventTime.value = time;
        }

        // Apri il modal di creazione evento
        this.showModal('addEventModal');
    },

    getSlotStatus(cell) {
        if (cell.classList.contains('available')) return 'available';
        if (cell.classList.contains('booking')) return 'booking';
        if (cell.classList.contains('lastminute')) return 'lastminute';
        if (cell.classList.contains('unavailable')) return 'unavailable';
        return 'available';
    },

    setSlotStatus(status) {
        // Rimuovi selezioni precedenti
        document.querySelectorAll('.availability-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Seleziona nuovo stato
        const selectedBtn = document.querySelector(`.availability-btn.${status}`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    },

    saveSlotChanges() {
        if (!this.selectedSlot) return;

        const selectedBtn = document.querySelector('.availability-btn.selected');
        if (!selectedBtn) {
            this.showNotification('Seleziona uno stato per lo slot', 'warning');
            return;
        }

        const newStatus = selectedBtn.classList.contains('available') ? 'available' :
            selectedBtn.classList.contains('unavailable') ? 'unavailable' : 'available';

        // Aggiorna aspetto slot
        this.updateSlotAppearance(this.selectedSlot, newStatus);

        this.closeModal('editSlotModal');
        this.showNotification('Disponibilità aggiornata', 'success');
        this.selectedSlot = null;
    },

    updateSlotAppearance(slot, status) {
        // Rimuovi tutte le classi di stato
        slot.classList.remove('available', 'booking', 'lastminute', 'unavailable');

        // Aggiungi nuova classe
        slot.classList.add(status);

        // Pulisci contenuto precedente
        slot.innerHTML = '';
    },

    // ===============================================
    // GESTIONE PRENOTAZIONI
    // ===============================================
    viewBooking(cell) {
        console.log('viewBooking chiamato per:', cell);

        const eventTitle = cell.querySelector('.event-title');
        const eventTime = cell.querySelector('.event-time');
        const eventCapacity = cell.querySelector('.event-capacity');

        // Salva i dati dell'evento corrente per la modifica
        this.currentEvent = {
            cell: cell,
            title: eventTitle ? eventTitle.textContent : '',
            time: eventTime ? eventTime.textContent : cell.dataset.time,
            day: cell.dataset.day,
            capacity: eventCapacity ? eventCapacity.textContent : '0/15 posti',
            type: 'classe' // TODO: determinare il tipo reale
        };

        // Popola il modal con i dati dell'evento
        const titleElement = document.getElementById('eventDetailsTitle');
        const timeElement = document.getElementById('eventDetailsTime');
        const dateElement = document.getElementById('eventDetailsDate');
        const capacityElement = document.getElementById('eventDetailsCapacity');
        const priceElement = document.getElementById('eventDetailsPrice');
        const progressBar = document.getElementById('eventDetailsProgressBar');

        if (titleElement && eventTitle) {
            titleElement.textContent = eventTitle.textContent;
        }

        if (timeElement && eventTime) {
            timeElement.textContent = eventTime.textContent;
        }

        if (dateElement) {
            const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
            const day = parseInt(cell.dataset.day);
            dateElement.textContent = `${dayNames[day]}, 15 Ottobre 2025`;
        }

        if (capacityElement && eventCapacity) {
            capacityElement.textContent = eventCapacity.textContent;
        }

        // Aggiorna barra progresso
        if (progressBar && eventCapacity) {
            const match = eventCapacity.textContent.match(/(\d+)\/(\d+)/);
            if (match) {
                const occupied = parseInt(match[1]);
                const total = parseInt(match[2]);
                const percentage = (occupied / total) * 100;

                progressBar.style.width = percentage + '%';
                progressBar.className = 'event-progress-bar';

                if (percentage <= 60) {
                    progressBar.classList.add('green');
                } else if (percentage <= 90) {
                    progressBar.classList.add('yellow');
                } else {
                    progressBar.classList.add('red');
                }
            }
        }

        if (priceElement) {
            priceElement.textContent = '€25';
        }

        // Apri il modal
        this.showModal('eventDetailsModal');
    },

    loadBookings() {
        console.log('Caricamento prenotazioni dal server...');
        setTimeout(() => {
            console.log('Prenotazioni caricate');
            this.showNotification('Calendario sincronizzato', 'success');
        }, 1000);
    },

    // ===============================================
    // MODAL MANAGEMENT
    // ===============================================
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    },

    // ===============================================
    // GESTIONE EVENTI
    // ===============================================
    saveEvent() {
        const form = document.getElementById('addEventForm');
        if (!form) return;

        // Reset errori precedenti
        document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Verifica tipo evento selezionato
        const selectedType = document.querySelector('.event-type-btn.selected');
        if (!selectedType) {
            this.highlightError(document.querySelector('.event-type-selector'), 'Seleziona un tipo di evento');
            this.showNotification('Seleziona un tipo di evento', 'error');
            return;
        }

        const isRecurring = document.querySelector('input[name="recurrenceMode"]:checked').value === 'recurring';
        const requiredFields = [];

        // Campi comuni
        requiredFields.push({ id: 'eventTitle', label: 'Nome Evento' });
        requiredFields.push({ id: 'eventCapacity', label: 'Posti Disponibili' });
        requiredFields.push({ id: 'eventPrice', label: 'Prezzo' });

        // Campi specifici per modalità
        if (isRecurring) {
            requiredFields.push({ id: 'recurringStart', label: 'Data Inizio' });
            requiredFields.push({ id: 'recurringEnd', label: 'Data Fine' });
            requiredFields.push({ id: 'recurringTime', label: 'Ora Inizio' });
            requiredFields.push({ id: 'recurringDuration', label: 'Durata' });

            // Verifica almeno un giorno selezionato
            const weekdaysChecked = document.querySelectorAll('input[name="weekdays"]:checked');
            if (weekdaysChecked.length === 0) {
                this.highlightError(document.querySelector('.weekday-selector'), 'Seleziona almeno un giorno');
                this.showNotification('Seleziona almeno un giorno della settimana', 'error');
                return;
            }
        } else {
            requiredFields.push({ id: 'eventDate', label: 'Data' });
            requiredFields.push({ id: 'eventTime', label: 'Ora Inizio' });
            requiredFields.push({ id: 'eventDuration', label: 'Durata' });
        }

        // Validazione campi
        let hasErrors = false;
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && !input.value) {
                this.highlightError(input, `${field.label} è obbligatorio`);
                hasErrors = true;
            }
        });

        if (hasErrors) {
            this.showNotification('Compila tutti i campi evidenziati in rosso', 'error');
            return;
        }

        console.log('Salvando evento...');

        setTimeout(() => {
            this.showNotification('Evento aggiunto al calendario', 'success');
            this.closeModal('addEventModal');
            form.reset();
            document.querySelectorAll('.event-type-btn').forEach(btn => btn.classList.remove('selected'));
            this.renderCalendar();
        }, 500);
    },

    highlightError(element, message) {
        element.classList.add('field-error');

        // Aggiungi messaggio errore
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        errorMsg.style.color = '#dc2626';
        errorMsg.style.fontSize = '12px';
        errorMsg.style.marginTop = '4px';

        if (element.classList.contains('event-type-selector') || element.classList.contains('weekday-selector')) {
            element.parentElement.appendChild(errorMsg);
        } else {
            element.parentElement.appendChild(errorMsg);
        }
    },

    // ===============================================
    // SISTEMA NOTIFICHE
    // ===============================================
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${this.escapeHtml(message)}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: this.getNotificationColor(type),
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '9999',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    },

    getNotificationColor(type) {
        const colors = {
            success: '#16a34a',
            error: '#dc2626',
            warning: '#d97706',
            info: '#2563eb'
        };
        return colors[type] || colors.info;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ===============================================
// FUNZIONI GLOBALI ACCESSIBILI DA HTML
// ===============================================

function switchView(view) {
    window.CalendarioProfessionista.switchView(view);
}

function editSlot(cell) {
    window.CalendarioProfessionista.editSlot(cell);
}

function viewBooking(cell) {
    window.CalendarioProfessionista.viewBooking(cell);
}

function navigateCalendar(direction) {
    const currentDate = window.CalendarioProfessionista.currentDate;

    if (direction === 'prev') {
        if (window.CalendarioProfessionista.currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else if (window.CalendarioProfessionista.currentView === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
        } else if (window.CalendarioProfessionista.currentView === 'day') {
            currentDate.setDate(currentDate.getDate() - 1);
        }
    } else if (direction === 'next') {
        if (window.CalendarioProfessionista.currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (window.CalendarioProfessionista.currentView === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (window.CalendarioProfessionista.currentView === 'day') {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    window.CalendarioProfessionista.updateCalendarDisplay();
    window.CalendarioProfessionista.renderCalendar();
    window.CalendarioProfessionista.showNotification('Calendario aggiornato', 'info');
}

function goToToday() {
    window.CalendarioProfessionista.currentDate = new Date();
    window.CalendarioProfessionista.updateCalendarDisplay();
    window.CalendarioProfessionista.renderCalendar();
    window.CalendarioProfessionista.showNotification('Tornato a oggi', 'info');
}

function syncCalendar() {
    window.CalendarioProfessionista.showNotification('Sincronizzazione in corso...', 'info');
    setTimeout(() => {
        window.CalendarioProfessionista.loadBookings();
        window.CalendarioProfessionista.renderCalendar();
    }, 1000);
}

function showAddEventModal() {
    window.CalendarioProfessionista.showModal('addEventModal');
}

function closeModal(modalId) {
    window.CalendarioProfessionista.closeModal(modalId);
}

function setSlotStatus(status) {
    window.CalendarioProfessionista.setSlotStatus(status);
}

function saveSlotChanges() {
    window.CalendarioProfessionista.saveSlotChanges();
}

function saveEvent() {
    window.CalendarioProfessionista.saveEvent();
}

function contactClient(clientId) {
    console.log('Contattando cliente:', clientId);
    window.CalendarioProfessionista.showNotification('Apertura chat con cliente...', 'info');
}

function blockSlot(time) {
    console.log('Bloccando slot:', time);
    window.CalendarioProfessionista.showNotification(`Slot ${time} bloccato`, 'success');
}

function selectDate(cell) {
    const date = cell.dataset.date;
    console.log('Data selezionata:', date);
    window.CalendarioProfessionista.showNotification(`Data selezionata: ${date}`, 'info');
}

// ===============================================
// INIZIALIZZAZIONE
// ===============================================
function initCalendar() {
    window.CalendarioProfessionista.init();
}

// Aggiungi stili CSS per animazioni notifiche
if (!document.getElementById('calendar-notification-styles')) {
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'calendar-notification-styles';
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(notificationStyles);
}

// ===============================================
// NUOVE FUNZIONI PER EVENTI RICORRENTI
// ===============================================

function filterEvents(filterType) {
    // Aggiorna pulsanti filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filterType}"]`).classList.add('active');

    // Filtra eventi nel calendario
    const allEvents = document.querySelectorAll('.calendar-cell');
    allEvents.forEach(cell => {
        if (filterType === 'all') {
            cell.style.display = '';
        } else {
            const eventType = cell.dataset.eventType;
            if (eventType === filterType) {
                cell.style.display = '';
            } else if (eventType) {
                cell.style.display = 'none';
            }
        }
    });

    window.CalendarioProfessionista.showNotification(`Filtro applicato: ${filterType}`, 'info');
}

function selectEventType(type) {
    // Aggiorna pulsanti tipo evento
    document.querySelectorAll('.event-type-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('selected');
    });
    const selectedBtn = document.querySelector(`[data-type="${type}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
        selectedBtn.classList.add('selected');
    }

    // Mostra/nascondi sezioni in base al tipo
    const liveRecurrenceRow = document.getElementById('liveRecurrenceRow');
    const corsoConfigRow = document.getElementById('corsoConfigRow');
    const certificateSection = document.getElementById('certificateSection');

    if (type === 'live') {
        // LIVE: mostra Modalità (Singolo/Ricorrente)
        if (liveRecurrenceRow) liveRecurrenceRow.style.display = 'flex';
        if (corsoConfigRow) corsoConfigRow.style.display = 'none';
        if (certificateSection) certificateSection.style.display = 'none';
    } else if (type === 'corso') {
        // CORSO: mostra Tipo Corso + Modalità Live/Registrato
        if (liveRecurrenceRow) liveRecurrenceRow.style.display = 'none';
        if (corsoConfigRow) corsoConfigRow.style.display = 'flex';
        if (certificateSection) certificateSection.style.display = 'block';
    }

    console.log('Tipo evento selezionato:', type);
}

function toggleRecurrence() {
    const mode = document.querySelector('input[name="recurrenceMode"]:checked').value;
    const singleFields = document.getElementById('singleEventFields');
    const recurringFields = document.getElementById('recurringEventFields');

    if (mode === 'single') {
        singleFields.style.display = 'block';
        recurringFields.style.display = 'none';
    } else {
        singleFields.style.display = 'none';
        recurringFields.style.display = 'block';
    }
}

// ===============================================
// TOGGLE CAMPI LIVE & CORSO
// ===============================================
function toggleUnlimitedCapacity() {
    const unlimitedCheck = document.getElementById('unlimitedCapacity');
    const capacityInput = document.getElementById('eventCapacity');

    if (unlimitedCheck && capacityInput) {
        if (unlimitedCheck.checked) {
            capacityInput.disabled = true;
            capacityInput.value = '';
            capacityInput.placeholder = 'Illimitati';
        } else {
            capacityInput.disabled = false;
            capacityInput.value = '10';
            capacityInput.placeholder = '';
        }
    }
}

function toggleCorsoMulti() {
    const corsoType = document.querySelector('input[name="corsoType"]:checked');

    if (corsoType && corsoType.value === 'multi') {
        console.log('Corso Multi-Lezione selezionato - Funzionalità da implementare');
        // TODO: Mostrare interfaccia per programmare più date
    }
}

function toggleCertificate() {
    const certificateEnabled = document.getElementById('corsoCertificateEnabled');
    const certificateMinPresence = document.getElementById('certificateMinPresence');

    if (certificateEnabled && certificateMinPresence) {
        if (certificateEnabled.checked) {
            certificateMinPresence.style.display = 'block';
        } else {
            certificateMinPresence.style.display = 'none';
        }
    }
}

// ===============================================
// FUNZIONI BLOCCO PERIODO AVANZATO
// ===============================================

function showBlockPeriodModal() {
    window.CalendarioProfessionista.showModal('blockPeriodModal');
}

function toggleBlockType() {
    const blockType = document.querySelector('input[name="blockType"]:checked').value;

    // Nascondi tutte le sezioni
    document.getElementById('blockDateRange').style.display = 'none';
    document.getElementById('blockRecurringHours').style.display = 'none';
    document.getElementById('blockRecurringDays').style.display = 'none';

    // Mostra la sezione selezionata
    switch(blockType) {
        case 'date_range':
            document.getElementById('blockDateRange').style.display = 'block';
            break;
        case 'recurring_hours':
            document.getElementById('blockRecurringHours').style.display = 'block';
            break;
        case 'recurring_days':
            document.getElementById('blockRecurringDays').style.display = 'block';
            break;
    }
}

function toggleDateTimeFields() {
    const isFullDay = document.getElementById('blockDateFullDay').checked;
    document.getElementById('blockDateTimeFields').style.display = isFullDay ? 'none' : 'block';
}

function toggleDayTimeFields() {
    const isFullDay = document.getElementById('blockDayFullDay').checked;
    document.getElementById('blockDayTimeFields').style.display = isFullDay ? 'none' : 'block';
}

function confirmBlockPeriod() {
    const blockType = document.querySelector('input[name="blockType"]:checked').value;
    const reason = document.getElementById('blockReason').value;
    let blockData = { type: blockType, reason };

    switch(blockType) {
        case 'date_range':
            const startDate = document.getElementById('blockStartDate').value;
            const endDate = document.getElementById('blockEndDate').value;
            const isFullDay = document.getElementById('blockDateFullDay').checked;

            if (!startDate || !endDate) {
                window.CalendarioProfessionista.showNotification('Seleziona le date', 'warning');
                return;
            }

            blockData.startDate = startDate;
            blockData.endDate = endDate;
            blockData.fullDay = isFullDay;

            if (!isFullDay) {
                blockData.startTime = document.getElementById('blockDateStartTime').value;
                blockData.endTime = document.getElementById('blockDateEndTime').value;
            }

            window.CalendarioProfessionista.showNotification(
                `Periodo bloccato: ${startDate} - ${endDate}${!isFullDay ? ' (' + blockData.startTime + ' - ' + blockData.endTime + ')' : ''}`,
                'success'
            );
            break;

        case 'recurring_hours':
            const recurringStart = document.getElementById('recurringStartTime').value;
            const recurringEnd = document.getElementById('recurringEndTime').value;
            const selectedDays = Array.from(document.querySelectorAll('input[name="recurringDays"]:checked'))
                .map(cb => cb.value);

            if (selectedDays.length === 0) {
                window.CalendarioProfessionista.showNotification('Seleziona almeno un giorno', 'warning');
                return;
            }

            blockData.startTime = recurringStart;
            blockData.endTime = recurringEnd;
            blockData.days = selectedDays;
            blockData.validFrom = document.getElementById('recurringValidFrom').value;
            blockData.validTo = document.getElementById('recurringValidTo').value;

            const daysText = selectedDays.length === 7 ? 'Tutti i giorni' : `${selectedDays.length} giorni/settimana`;
            window.CalendarioProfessionista.showNotification(
                `Orari bloccati: ${daysText} dalle ${recurringStart} alle ${recurringEnd}`,
                'success'
            );
            break;

        case 'recurring_days':
            const blockWeekdays = Array.from(document.querySelectorAll('input[name="blockWeekdays"]:checked'))
                .map(cb => cb.value);
            const isDayFullDay = document.getElementById('blockDayFullDay').checked;

            if (blockWeekdays.length === 0) {
                window.CalendarioProfessionista.showNotification('Seleziona almeno un giorno', 'warning');
                return;
            }

            blockData.weekdays = blockWeekdays;
            blockData.fullDay = isDayFullDay;

            if (!isDayFullDay) {
                blockData.startTime = document.getElementById('blockDayStartTime').value;
                blockData.endTime = document.getElementById('blockDayEndTime').value;
            }

            blockData.validFrom = document.getElementById('blockDayValidFrom').value;
            blockData.validTo = document.getElementById('blockDayValidTo').value;

            const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
            const selectedDayNames = blockWeekdays.map(d => dayNames[parseInt(d)]).join(', ');
            window.CalendarioProfessionista.showNotification(
                `Giorni bloccati: ${selectedDayNames}${!isDayFullDay ? ' (' + blockData.startTime + ' - ' + blockData.endTime + ')' : ''}`,
                'success'
            );
            break;
    }

    console.log('Blocco configurato:', blockData);

    // TODO: Qui andrà la chiamata al backend per salvare il blocco

    closeModal('blockPeriodModal');
    resetBlockPeriodForm();
}

function resetBlockPeriodForm() {
    // Reset campi
    document.getElementById('blockStartDate').value = '';
    document.getElementById('blockEndDate').value = '';
    document.getElementById('blockReason').value = '';
    document.getElementById('blockDateFullDay').checked = true;
    document.getElementById('blockDayFullDay').checked = true;

    // Reset checkbox giorni
    document.querySelectorAll('input[name="recurringDays"]').forEach(cb => cb.checked = true);
    document.querySelectorAll('input[name="blockWeekdays"]').forEach(cb => cb.checked = false);

    // Reset radio
    document.querySelector('input[name="blockType"][value="date_range"]').checked = true;
    toggleBlockType();
}

// ===============================================
// FUNZIONI MODAL DETTAGLI EVENTO
// ===============================================

function cancelEvent() {
    if (confirm('Sei sicuro di voler cancellare questo evento? Tutti i partecipanti verranno notificati.')) {
        window.CalendarioProfessionista.showNotification('Evento cancellato. Notifiche inviate ai partecipanti.', 'success');
        window.CalendarioProfessionista.closeModal('eventDetailsModal');
        // TODO: Implementare cancellazione evento lato server
    }
}

function editEvent() {
    const currentEvent = window.CalendarioProfessionista.currentEvent;

    console.log('editEvent chiamato, currentEvent:', currentEvent);

    if (!currentEvent) {
        window.CalendarioProfessionista.showNotification('Errore: dati evento non disponibili', 'error');
        return;
    }

    // Chiudi modal dettagli
    window.CalendarioProfessionista.closeModal('eventDetailsModal');

    // Aspetta che il modal si chiuda prima di aprire il nuovo
    setTimeout(() => {
        // Pre-compila il form con i dati dell'evento
        const eventTitle = document.getElementById('eventTitle');
        const eventDate = document.getElementById('eventDate');
        const eventTime = document.getElementById('eventTime');
        const eventDuration = document.getElementById('eventDuration');
        const eventCapacity = document.getElementById('eventCapacity');
        const eventPrice = document.getElementById('eventPrice');

        console.log('Campi trovati:', {
            eventTitle,
            eventDate,
            eventTime,
            eventDuration,
            eventCapacity,
            eventPrice
        });

        // Titolo evento
        if (eventTitle) {
            eventTitle.value = currentEvent.title;
            console.log('Titolo impostato:', currentEvent.title);
        }

        // Data (calcola in base al giorno)
        if (eventDate) {
            const today = new Date();
            const currentDay = today.getDay();
            const targetDay = parseInt(currentEvent.day);
            const dayDiff = (targetDay + 1) - currentDay;
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + dayDiff);

            const year = targetDate.getFullYear();
            const month = String(targetDate.getMonth() + 1).padStart(2, '0');
            const dayNum = String(targetDate.getDate()).padStart(2, '0');
            eventDate.value = `${year}-${month}-${dayNum}`;
            console.log('Data impostata:', eventDate.value);
        }

        // Orario
        if (eventTime && currentEvent.time) {
            // Se il time è formato "09:15-10:15", prendi solo la parte iniziale
            const timeMatch = currentEvent.time.match(/(\d{2}:\d{2})/);
            if (timeMatch) {
                eventTime.value = timeMatch[1];
                console.log('Ora impostata:', timeMatch[1]);
            } else {
                eventTime.value = currentEvent.time;
                console.log('Ora impostata (fallback):', currentEvent.time);
            }
        }

        // Durata (calcola dalla differenza tra inizio e fine)
        if (eventDuration && currentEvent.time.includes('-')) {
            const [start, end] = currentEvent.time.split('-').map(t => t.trim());
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);
            const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
            eventDuration.value = durationMinutes;
            console.log('Durata impostata:', durationMinutes);
        } else if (eventDuration) {
            eventDuration.value = 60; // default
        }

        // Capacità
        if (eventCapacity && currentEvent.capacity) {
            const capacityMatch = currentEvent.capacity.match(/\/(\d+)/);
            if (capacityMatch) {
                eventCapacity.value = capacityMatch[1];
                console.log('Capacità impostata:', capacityMatch[1]);
            }
        }

        // Prezzo (fisso per ora)
        if (eventPrice) {
            eventPrice.value = 25;
            console.log('Prezzo impostato: 25');
        }

        // Seleziona tipo evento
        const eventTypeBtn = document.querySelector(`[data-type="${currentEvent.type}"]`);
        if (eventTypeBtn) {
            selectEventType(currentEvent.type);
            console.log('Tipo evento selezionato:', currentEvent.type);
        }

        // Apri modal
        window.CalendarioProfessionista.showModal('addEventModal');
    }, 300);
}

// ===============================================
// GESTIONE ECCEZIONI EVENTI RICORRENTI
// ===============================================

// Variabile globale per tracciare se l'evento corrente è ricorrente
let currentEventData = {
    isRecurring: false,
    eventDate: null,
    eventId: null
};

// Funzione per mostrare il modal delle opzioni di modifica
function showEditOptions() {
    // Aggiorna la data nell'opzione "Solo questo evento"
    const dateElement = document.getElementById('editSingleEventDate');
    if (dateElement && currentEventData.eventDate) {
        dateElement.textContent = currentEventData.eventDate;
    }

    window.CalendarioProfessionista.closeModal('eventDetailsModal');
    setTimeout(() => {
        window.CalendarioProfessionista.showModal('editOptionsModal');
    }, 200);
}

// Funzione per mostrare il modal delle opzioni di cancellazione
function showCancelOptions() {
    // Aggiorna la data nell'opzione "Solo questo evento"
    const dateElement = document.getElementById('cancelSingleEventDate');
    if (dateElement && currentEventData.eventDate) {
        dateElement.textContent = currentEventData.eventDate;
    }

    window.CalendarioProfessionista.closeModal('eventDetailsModal');
    setTimeout(() => {
        window.CalendarioProfessionista.showModal('cancelOptionsModal');
    }, 200);
}

// Modifica solo questa istanza dell'evento ricorrente
function editEventInstance() {
    console.log('Modifica solo questa istanza:', currentEventData.eventDate);
    window.CalendarioProfessionista.closeModal('editOptionsModal');

    // Apri il modal di modifica con i dati pre-compilati
    setTimeout(() => {
        editEvent();
    }, 200);
}

// Modifica l'intera serie ricorrente
function editEventSeries() {
    console.log('Modifica intera serie ricorrente');
    window.CalendarioProfessionista.closeModal('editOptionsModal');

    // Apri il modal di modifica in modalità "serie"
    setTimeout(() => {
        editEvent();
        window.CalendarioProfessionista.showNotification('Stai modificando l\'intera serie ricorrente', 'info');
    }, 200);
}

// Cancella solo questa istanza dell'evento ricorrente
function cancelEventInstance() {
    window.CalendarioProfessionista.closeModal('cancelOptionsModal');

    if (confirm(`Vuoi cancellare solo l'evento del ${currentEventData.eventDate}?`)) {
        console.log('Cancellazione singola istanza:', currentEventData.eventDate);

        // TODO: Implementare cancellazione singola istanza lato server
        // Esempio: aggiungere la data alle eccezioni dell'evento ricorrente

        window.CalendarioProfessionista.showNotification(
            `Evento del ${currentEventData.eventDate} cancellato. Partecipanti notificati.`,
            'success'
        );
    }
}

// Cancella l'intera serie ricorrente
function cancelEventSeries() {
    window.CalendarioProfessionista.closeModal('cancelOptionsModal');

    if (confirm('Vuoi cancellare TUTTI gli eventi di questa serie ricorrente?')) {
        console.log('Cancellazione intera serie ricorrente');

        // TODO: Implementare cancellazione serie completa lato server

        window.CalendarioProfessionista.showNotification(
            'Intera serie ricorrente cancellata. Tutti i partecipanti notificati.',
            'success'
        );
    }
}

// Estende la funzione viewBooking esistente per gestire eventi ricorrenti
(function() {
    const originalViewBooking = window.CalendarioProfessionista.viewBooking;

    window.CalendarioProfessionista.viewBooking = function(cell) {
        // Chiama la funzione originale
        originalViewBooking.call(this, cell);

        // Determina se l'evento è ricorrente
        // Per ora consideriamo ricorrente solo "Yoga Hatha" come esempio
        const eventTitle = cell.querySelector('.event-title');
        const isRecurring = eventTitle && (eventTitle.textContent === 'Yoga Hatha' || eventTitle.textContent === 'Pilates Avanzato');

        // Salva i dati dell'evento corrente
        const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        const day = parseInt(cell.dataset.day);

        currentEventData = {
            isRecurring: isRecurring,
            eventDate: `${dayNames[day]}, 15 Ottobre 2025`,
            eventId: null
        };

        // Mostra/nascondi i pulsanti appropriati
        const singleActions = document.getElementById('singleEventActions');
        const recurringActions = document.getElementById('recurringEventActions');
        const recurringBadge = document.getElementById('recurringBadge');

        if (singleActions && recurringActions) {
            if (isRecurring) {
                singleActions.style.display = 'none';
                recurringActions.style.display = 'block';
                if (recurringBadge) recurringBadge.style.display = 'inline-flex';
            } else {
                singleActions.style.display = 'block';
                recurringActions.style.display = 'none';
                if (recurringBadge) recurringBadge.style.display = 'none';
            }
        }
    };
})();

// ===============================================
// INTEGRAZIONE GOOGLE CALENDAR
// ===============================================

// Funzione per aprire il modal del Calendario
function openGoogleCalendarModal() {
    const isConnected = localStorage.getItem('calendarConnected') === 'true';

    if (isConnected) {
        // Mostra stato connesso
        document.getElementById('gcNotConnected').style.display = 'none';
        document.getElementById('gcConnected').style.display = 'block';
        document.getElementById('gcNotConnectedFooter').style.display = 'none';

        // Aggiorna email e info
        const email = localStorage.getItem('calendarEmail') || 'professionista@example.com';
        document.getElementById('gcConnectedEmail').textContent = email;

        const lastSync = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('gcLastSync').textContent = lastSync;

        // Mostra provider connesso
        const provider = localStorage.getItem('calendarProvider') || 'google';
        const providerName = provider === 'google' ? 'Google Calendar' : 'Apple Calendar';
        const titleElement = document.querySelector('#gcConnected h4');
        if (titleElement) {
            titleElement.textContent = `${providerName} Connesso`;
        }
    } else {
        // Mostra stato non connesso
        document.getElementById('gcNotConnected').style.display = 'block';
        document.getElementById('gcConnected').style.display = 'none';
        document.getElementById('gcNotConnectedFooter').style.display = 'flex';
    }

    window.CalendarioProfessionista.showModal('googleCalendarModal');
}

// Funzione per selezionare il provider del calendario
function selectCalendarProvider(provider) {
    const providerNames = {
        'google': 'Google Calendar',
        'apple': 'Apple Calendar'
    };

    const providerName = providerNames[provider] || 'Calendario';

    // Simula processo di autenticazione
    window.CalendarioProfessionista.showNotification(`Connessione a ${providerName} in corso...`, 'info');

    setTimeout(() => {
        // Salva stato connesso in localStorage
        localStorage.setItem('calendarConnected', 'true');
        localStorage.setItem('calendarProvider', provider);
        localStorage.setItem('calendarEmail', 'professionista@example.com');
        localStorage.setItem('calendarConnectedAt', new Date().toISOString());

        // Aggiorna badge
        updateGoogleCalendarBadge(true);

        // Chiudi modal e mostra successo
        window.CalendarioProfessionista.closeModal('googleCalendarModal');
        window.CalendarioProfessionista.showNotification(`${providerName} connesso con successo!`, 'success');
    }, 1500);
}

// Funzione per connettere (legacy - mantiene compatibilità)
function connectGoogleCalendar() {
    selectCalendarProvider('google');
}

// Funzione per disconnettere
function disconnectGoogleCalendar() {
    const provider = localStorage.getItem('calendarProvider') || 'Google';
    const providerName = provider === 'google' ? 'Google Calendar' : 'Apple Calendar';

    if (confirm(`Vuoi disconnettere ${providerName}? Gli eventi non saranno più sincronizzati.`)) {
        // Rimuovi dati da localStorage
        localStorage.removeItem('calendarConnected');
        localStorage.removeItem('calendarProvider');
        localStorage.removeItem('calendarEmail');
        localStorage.removeItem('calendarConnectedAt');

        // Aggiorna badge
        updateGoogleCalendarBadge(false);

        // Chiudi modal e mostra messaggio
        window.CalendarioProfessionista.closeModal('googleCalendarModal');
        window.CalendarioProfessionista.showNotification(`${providerName} disconnesso`, 'info');
    }
}

// Funzione per aggiornare il badge nella sidebar
function updateGoogleCalendarBadge(isConnected) {
    const badge = document.getElementById('googleCalendarBadge');
    if (badge) {
        if (isConnected) {
            badge.textContent = 'Connesso';
            badge.classList.remove('disconnected');
            badge.classList.add('connected');
        } else {
            badge.textContent = 'Non connesso';
            badge.classList.remove('connected');
            badge.classList.add('disconnected');
        }
    }
}

// Inizializza stato calendario al caricamento
(function() {
    const isConnected = localStorage.getItem('calendarConnected') === 'true';
    updateGoogleCalendarBadge(isConnected);
})();

// ===============================================
// GESTIONE PARAMETRI URL
// ===============================================
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    const action = urlParams.get('action');

    if (eventId && action === 'edit') {
        console.log(`Apertura automatica evento ${eventId} per modifica`);

        // Aspetta che il calendario sia completamente caricato
        setTimeout(() => {
            openEventFromURL(eventId);
        }, 500);
    }
}

function openEventFromURL(eventId) {
    // Cerca l'evento nei dati del calendario
    const event = findEventById(eventId);

    if (event) {
        // Apri il modal di modifica evento con i dati pre-compilati
        openEditEventModal(event);

        // Rimuovi parametri URL dalla barra (opzionale, per UX pulita)
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    } else {
        console.warn(`Evento ${eventId} non trovato nel calendario`);
        showNotification(`Evento non trovato. Potrebbe essere stato cancellato.`, 'warning');
    }
}

function findEventById(eventId) {
    // Cerca negli eventi del calendario
    // Questa funzione dipende da come sono strutturati i tuoi dati eventi

    // MOCK: cerca nei dati demo live
    const demoEvents = [
        {
            id: 1,
            title: 'Yoga per il Risveglio Mattutino',
            type: 'live',
            start: new Date(Date.now() + 2 * 60 * 60 * 1000),
            duration: 60,
            maxParticipants: 30,
            streamUrl: 'https://zoom.us/j/example1',
            description: 'Sessione live di yoga mattutino per iniziare la giornata con energia'
        },
        {
            id: 2,
            title: 'Meditazione Guidata Serale',
            type: 'live',
            start: new Date(Date.now() + 5 * 60 * 60 * 1000),
            duration: 45,
            maxParticipants: 25,
            streamUrl: 'https://zoom.us/j/example2',
            description: 'Meditazione serale per rilassarsi e prepararsi al riposo'
        },
        {
            id: 3,
            title: 'Pilates per la Schiena',
            type: 'live',
            start: new Date(Date.now() + 24 * 60 * 60 * 1000),
            duration: 90,
            maxParticipants: 20,
            streamUrl: 'https://zoom.us/j/example3',
            description: 'Sessione di Pilates focalizzata sul rafforzamento della schiena'
        }
    ];

    return demoEvents.find(e => e.id == eventId);
}

function openEditEventModal(event) {
    // Apri il modal esistente di modifica evento
    // Questa funzione dovrebbe chiamare il tuo modal già esistente

    console.log('Apertura modal per evento:', event);

    // Simula apertura modal (da collegare al tuo modal esistente)
    const modal = document.getElementById('eventModal') || document.getElementById('addEventModal');

    if (modal) {
        // Pre-compila i campi del modal con i dati dell'evento
        const titleInput = modal.querySelector('#eventTitle') || modal.querySelector('[name="title"]');
        const descInput = modal.querySelector('#eventDescription') || modal.querySelector('[name="description"]');
        const dateInput = modal.querySelector('#eventDate') || modal.querySelector('[name="date"]');

        if (titleInput) titleInput.value = event.title;
        if (descInput) descInput.value = event.description || '';
        if (dateInput && event.start) {
            dateInput.value = event.start.toISOString().split('T')[0];
        }

        // Mostra il modal
        modal.style.display = 'block';
        modal.classList.add('active');

        showNotification(`Modifica evento: ${event.title}`, 'info');
    } else {
        console.error('Modal evento non trovato');
        showNotification(`Evento: ${event.title} (ID: ${event.id}) - Modal in fase di sviluppo`, 'info');
    }
}

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Qui puoi aggiungere una notifica visuale (toast, alert, ecc)
    // Per ora uso alert semplice
    if (type === 'warning' || type === 'error') {
        alert(message);
    }
}

console.log('Calendario professionista script caricato completamente');