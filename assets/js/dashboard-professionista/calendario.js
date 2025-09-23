/* ===============================================
   RELAXPOINT - JAVASCRIPT CALENDARIO PROFESSIONISTA
   Gestisce calendario ibrido con prenotazioni e disponibilità
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('Calendario professionista caricato');
    initCalendar();
});

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
            const isWeekend = index >= 5;
            return `<div class="day-header ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}">${day} ${date.getDate()}</div>`;
        }).join('')}
            </div>

            <!-- GRIGLIA ORARI -->
            <div class="calendar-body">
                ${this.generateTimeSlots().map(time => `
                    <div class="time-slot">${time}</div>
                    ${dayNames.map((_, dayIndex) => {
            const cellClass = this.getCellClass(dayIndex, time);
            const cellContent = this.getCellContent(dayIndex, time);
            return `<div class="calendar-cell ${cellClass}" 
                                     data-day="${dayIndex}" 
                                     data-time="${time}" 
                                     onclick="editSlot(this)">${cellContent}</div>`;
        }).join('')}
                `).join('')}
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
                ${this.generateTimeSlots().map(time => `
                    <div class="time-slot">${time}</div>
                    <div class="calendar-cell ${this.getCellClass(0, time)}" 
                         data-day="0" 
                         data-time="${time}" 
                         onclick="editSlot(this)">${this.getCellContent(0, time)}</div>
                `).join('')}
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
        for (let hour = 8; hour <= 18; hour++) {
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
        // Weekend sempre non disponibile
        if (dayIndex >= 5) return 'unavailable';

        // Simula stati basati su ora e giorno
        if (time === '09:00' && dayIndex === 0) return 'booking';
        if (time === '10:00' && dayIndex === 2) return 'booking';
        if (time === '13:00' && dayIndex === 4) return 'booking';
        if (time === '10:00' && dayIndex === 1) return 'lastminute';

        return 'available';
    },

    getCellContent(dayIndex, time) {
        const cellClass = this.getCellClass(dayIndex, time);

        switch (cellClass) {
            case 'booking':
                if (time === '09:00' && dayIndex === 0) {
                    return '<div class="event-content"><div class="event-title">Massaggio Svedese</div><div class="event-client">Maria R.</div></div>';
                }
                if (time === '10:00' && dayIndex === 2) {
                    return '<div class="event-content"><div class="event-title">Coaching</div><div class="event-client">Laura V.</div></div>';
                }
                if (time === '13:00' && dayIndex === 4) {
                    return '<div class="event-content"><div class="event-title">Aromaterapia</div><div class="event-client">Anna M.</div></div>';
                }
                break;
            case 'lastminute':
                return '<div class="lastminute-badge">LM</div>';
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
        if (cell.classList.contains('booking')) {
            this.viewBooking(cell);
            return;
        }

        this.selectedSlot = cell;
        const day = cell.dataset.day;
        const time = cell.dataset.time;

        // Aggiorna modal con informazioni slot
        const slotDateTime = document.getElementById('slotDateTime');
        if (slotDateTime) {
            const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
            slotDateTime.textContent = `${dayNames[day]} - ${time}`;
        }

        // Reset selezioni
        document.querySelectorAll('.availability-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Evidenzia stato attuale
        const currentStatus = this.getSlotStatus(cell);
        const currentBtn = document.querySelector(`.availability-btn.${currentStatus}`);
        if (currentBtn) {
            currentBtn.classList.add('selected');
        }

        this.showModal('editSlotModal');
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
        const eventTitle = cell.querySelector('.event-title');
        const eventClient = cell.querySelector('.event-client');

        if (eventTitle && eventClient) {
            const title = eventTitle.textContent;
            const client = eventClient.textContent;
            this.showNotification(`Prenotazione: ${title} con ${client}`, 'info');
        }
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

        const formData = new FormData(form);
        const eventData = {
            title: formData.get('eventTitle'),
            date: formData.get('eventDate'),
            time: formData.get('eventTime'),
            type: formData.get('eventType'),
            notes: formData.get('eventNotes')
        };

        // Validazione
        if (!eventData.title || !eventData.date || !eventData.time || !eventData.type) {
            this.showNotification('Compila tutti i campi obbligatori', 'error');
            return;
        }

        console.log('Salvando evento:', eventData);

        setTimeout(() => {
            this.showNotification('Evento aggiunto al calendario', 'success');
            this.closeModal('addEventModal');
            form.reset();
            this.renderCalendar();
        }, 500);
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

console.log('Calendario professionista script caricato completamente');