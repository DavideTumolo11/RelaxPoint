/* ===============================================
   RELAXPOINT - JAVASCRIPT CHAT PROFESSIONISTA
   Sistema messaggistica completo post-pagamento
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('Chat JS - Inizializzazione...');

    const chatManager = new ChatManager();
    chatManager.init();

    window.chatManager = chatManager;

    console.log('Chat JS - Caricato con successo');
    console.log('Debug disponibile: window.chatManager');
});

/* ===============================================
   CLASSE PRINCIPALE - GESTIONE CHAT
   =============================================== */
class ChatManager {
    constructor() {
        // Configurazione sistema
        this.activeChat = null;
        this.messageHistory = new Map();
        this.typingTimers = new Map();
        this.onlineUsers = new Set();

        // Configurazione auto-refresh
        this.pollInterval = 3000; // 3 secondi
        this.pollTimer = null;

        // Configurazione UI
        this.maxMessageLength = 500;
        this.autoScrollThreshold = 100;

        // Template messaggi predefiniti
        this.messageTemplates = {
            'arrivo': 'Sto arrivando, sarò da lei tra circa 10 minuti.',
            'ritardo': 'Mi scuso per il ritardo, sarò da lei tra 10 minuti circa.',
            'conferma': 'Perfetto, tutto confermato per il nostro appuntamento.',
            'completato': 'Servizio completato con successo. La ringrazio e spero di rivederla presto!'
        };

        // Binding metodi
        this.handleChatSelect = this.handleChatSelect.bind(this);
        this.handleMessageSend = this.handleMessageSend.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.pollMessages = this.pollMessages.bind(this);

        // Dati mock per sviluppo
        this.initializeMockData();
    }

    /* ===============================================
       INIZIALIZZAZIONE
       =============================================== */
    init() {
        this.setupEventListeners();
        this.initializeChat();
        this.startMessagePolling();
        this.setupTypingIndicator();
        this.loadActiveChat();

        console.log('ChatManager inizializzato');
    }

    setupEventListeners() {
        // Chat list selection
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            item.addEventListener('click', () => {
                const chatId = item.getAttribute('data-chat-id');
                this.handleChatSelect(chatId);
            });
        });

        // Message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('input', this.handleInputChange);
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleMessageSend();
                }
            });
        }

        // Send button
        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.addEventListener('click', this.handleMessageSend);
        }

        // Template buttons
        const templateBtns = document.querySelectorAll('.template-btn');
        templateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const template = btn.getAttribute('data-template');
                this.insertTemplate(template);
            });
        });

        // Search chat
        const chatSearch = document.getElementById('chatSearch');
        if (chatSearch) {
            chatSearch.addEventListener('input', (e) => {
                this.filterChats(e.target.value);
            });
        }

        console.log('Event listeners configurati');
    }

    /* ===============================================
       GESTIONE CONVERSAZIONI
       =============================================== */
    handleChatSelect(chatId) {
        console.log(`Selezionando chat: ${chatId}`);

        // Aggiorna UI chat attiva
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-chat-id') === chatId) {
                item.classList.add('active');
            }
        });

        // Carica conversazione
        this.loadChatMessages(chatId);

        // Aggiorna pannello info
        this.updateInfoPanel(chatId);

        // Marca messaggi come letti
        this.markMessagesAsRead(chatId);

        this.activeChat = chatId;
    }

    loadChatMessages(chatId) {
        console.log(`Caricando messaggi per: ${chatId}`);

        // In produzione caricherrebbe da API
        const messages = this.messageHistory.get(chatId) || [];
        this.renderMessages(messages);

        // Scroll to bottom
        setTimeout(() => {
            this.scrollToBottom();
        }, 100);
    }

    renderMessages(messages) {
        const container = document.querySelector('.messages-container');
        if (!container) return;

        // Mantieni messaggi di sistema esistenti
        const systemMessages = container.querySelectorAll('.system-message');
        container.innerHTML = '';

        // Re-inserisci messaggi sistema
        systemMessages.forEach(msg => container.appendChild(msg));

        // Aggiungi nuovi messaggi
        messages.forEach(message => {
            const messageEl = this.createMessageElement(message);
            container.appendChild(messageEl);
        });

        // Aggiungi typing indicator se necessario
        const typingEl = document.getElementById('typingIndicator');
        if (typingEl && typingEl.parentNode) {
            container.appendChild(typingEl);
        }
    }

    createMessageElement(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.type}-message`;

        const avatarHtml = message.type === 'client' ?
            `<div class="message-avatar">
                <img src="/assets/images/avatar-placeholder.jpg" alt="${message.senderName}">
            </div>` : '';

        messageEl.innerHTML = `
            ${avatarHtml}
            <div class="message-content">
                <p>${this.escapeHtml(message.text)}</p>
                <span class="message-time">${this.formatTime(message.timestamp)}</span>
                ${message.status ? `<span class="message-status">${message.status}</span>` : ''}
            </div>
        `;

        return messageEl;
    }

    /* ===============================================
       INVIO MESSAGGI
       =============================================== */
    handleMessageSend() {
        const input = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendButton');

        if (!input || !this.activeChat) return;

        const messageText = input.value.trim();
        if (!messageText) return;

        console.log(`Inviando messaggio: "${messageText}"`);

        // Disabilita input durante invio
        input.disabled = true;
        sendBtn.disabled = true;

        // Crea oggetto messaggio
        const message = {
            id: this.generateMessageId(),
            text: messageText,
            type: 'professional',
            senderName: 'Marco Bianchi',
            timestamp: new Date(),
            status: 'Inviando...'
        };

        // Aggiungi alla cronologia
        this.addMessageToHistory(this.activeChat, message);

        // Aggiorna UI
        this.renderMessages(this.messageHistory.get(this.activeChat));
        this.scrollToBottom();

        // Pulisci input
        input.value = '';
        this.updateCharCount(0);
        this.updateSendButton();

        // Simula invio
        setTimeout(() => {
            message.status = 'Consegnato';
            this.renderMessages(this.messageHistory.get(this.activeChat));

            // Riabilita input
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();

            // Simula risposta automatica cliente (per demo)
            if (Math.random() > 0.7) {
                setTimeout(() => {
                    this.simulateClientResponse();
                }, 2000 + Math.random() * 3000);
            }

        }, 1500);
    }

    handleInputChange() {
        const input = document.getElementById('messageInput');
        if (!input) return;

        const length = input.value.length;

        // Aggiorna contatore caratteri
        this.updateCharCount(length);

        // Auto-resize textarea
        this.autoResizeTextarea(input);

        // Aggiorna pulsante invio
        this.updateSendButton();

        // Simula typing indicator per cliente
        this.simulateTyping();
    }

    updateCharCount(count) {
        const counter = document.getElementById('charCount');
        if (counter) {
            counter.textContent = `${count}/${this.maxMessageLength}`;

            // Colore warning se vicino al limite
            if (count > this.maxMessageLength * 0.8) {
                counter.style.color = 'var(--color-red)';
            } else {
                counter.style.color = 'var(--color-secondary)';
            }
        }
    }

    updateSendButton() {
        const input = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendButton');

        if (!input || !sendBtn) return;

        const hasText = input.value.trim().length > 0;
        const isValid = hasText && input.value.length <= this.maxMessageLength;

        sendBtn.disabled = !isValid;
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = newHeight + 'px';
    }

    /* ===============================================
       TEMPLATE MESSAGGI
       =============================================== */
    insertTemplate(templateKey) {
        const input = document.getElementById('messageInput');
        if (!input || !this.messageTemplates[templateKey]) return;

        input.value = this.messageTemplates[templateKey];
        this.handleInputChange();
        input.focus();

        console.log(`Template inserito: ${templateKey}`);
    }

    /* ===============================================
       GESTIONE DATI E STATO
       =============================================== */
    addMessageToHistory(chatId, message) {
        if (!this.messageHistory.has(chatId)) {
            this.messageHistory.set(chatId, []);
        }

        this.messageHistory.get(chatId).push(message);

        // Aggiorna preview nella lista chat
        this.updateChatPreview(chatId, message);
    }

    updateChatPreview(chatId, lastMessage) {
        const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (!chatItem) return;

        const previewEl = chatItem.querySelector('.last-message');
        const timeEl = chatItem.querySelector('.chat-time');

        if (previewEl) {
            previewEl.textContent = lastMessage.text;
        }

        if (timeEl) {
            timeEl.textContent = this.formatTime(lastMessage.timestamp);
        }

        // Sposta chat in cima se non è già attiva
        if (!chatItem.classList.contains('active')) {
            const parent = chatItem.parentNode;
            parent.insertBefore(chatItem, parent.firstChild);
        }
    }

    markMessagesAsRead(chatId) {
        const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (!chatItem) return;

        const badge = chatItem.querySelector('.unread-badge');
        if (badge) {
            badge.style.display = 'none';
        }

        console.log(`Messaggi marcati come letti: ${chatId}`);
    }

    /* ===============================================
       AGGIORNAMENTI AUTOMATICI
       =============================================== */
    startMessagePolling() {
        this.pollTimer = setInterval(this.pollMessages, this.pollInterval);
        console.log(`Polling messaggi attivo ogni ${this.pollInterval / 1000}s`);
    }

    stopMessagePolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }

    pollMessages() {
        if (!this.activeChat) return;

        // Simula controllo nuovi messaggi
        // In produzione farebbe chiamata API

        console.log(`Controllo nuovi messaggi per: ${this.activeChat}`);

        // Simula messaggio casuale cliente
        if (Math.random() > 0.95) {
            this.simulateClientMessage();
        }
    }

    simulateClientMessage() {
        if (!this.activeChat) return;

        const responses = [
            "Perfetto, grazie!",
            "Va bene per me",
            "A che ora arrivi?",
            "Devo preparare qualcosa?",
            "Confermato, ci sentiamo domani",
            "Ok, ti aspetto"
        ];

        const message = {
            id: this.generateMessageId(),
            text: responses[Math.floor(Math.random() * responses.length)],
            type: 'client',
            senderName: 'Cliente',
            timestamp: new Date(),
            status: 'Consegnato'
        };

        this.addMessageToHistory(this.activeChat, message);
        this.renderMessages(this.messageHistory.get(this.activeChat));
        this.scrollToBottom();

        // Aggiorna badge non letti se chat non attiva
        this.updateUnreadBadge(this.activeChat);

        console.log('Messaggio cliente simulato');
    }

    simulateClientResponse() {
        // Simula risposta automatica del cliente per demo
        setTimeout(() => {
            this.simulateClientMessage();
        }, 1000);
    }

    /* ===============================================
       TYPING INDICATOR
   =============================================== */
    setupTypingIndicator() {
        // Configura indicatore digitazione
        console.log('Typing indicator configurato');
    }

    simulateTyping() {
        if (!this.activeChat) return;

        // Simula che il cliente stia scrivendo (raro)
        if (Math.random() > 0.98) {
            this.showTypingIndicator();

            setTimeout(() => {
                this.hideTypingIndicator();
            }, 2000 + Math.random() * 3000);
        }
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    /* ===============================================
       UI HELPERS
       =============================================== */
    scrollToBottom(smooth = true) {
        const messagesArea = document.querySelector('.chat-messages');
        if (messagesArea) {
            messagesArea.scrollTo({
                top: messagesArea.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    }

    updateUnreadBadge(chatId) {
        const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (!chatItem) return;

        let badge = chatItem.querySelector('.unread-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'unread-badge';
            chatItem.querySelector('.chat-preview').appendChild(badge);
        }

        const currentCount = parseInt(badge.textContent) || 0;
        badge.textContent = currentCount + 1;
        badge.style.display = 'inline-block';
    }

    filterChats(searchTerm) {
        const chatItems = document.querySelectorAll('.chat-item');
        const term = searchTerm.toLowerCase();

        chatItems.forEach(item => {
            const clientName = item.querySelector('.client-name').textContent.toLowerCase();
            const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();

            const matches = clientName.includes(term) || lastMessage.includes(term);
            item.style.display = matches ? 'flex' : 'none';
        });

        console.log(`Filtro chat applicato: "${searchTerm}"`);
    }

    updateInfoPanel(chatId) {
        console.log(`Aggiornando pannello info per: ${chatId}`);

        // In produzione caricherrebbe dati cliente da API
        const mockClientData = this.getMockClientData(chatId);

        // Aggiorna elementi pannello
        this.updateClientInfo(mockClientData);
        this.updateBookingInfo(mockClientData);
    }

    updateClientInfo(clientData) {
        const nameEl = document.getElementById('activeClientName');
        const typeEl = document.getElementById('activeClientType');
        const statusEl = document.getElementById('activeClientStatusText');
        const avatarEl = document.getElementById('activeClientAvatar');

        if (nameEl) nameEl.textContent = clientData.name;
        if (typeEl) typeEl.textContent = clientData.type;
        if (statusEl) statusEl.textContent = clientData.online ? 'Online ora' : 'Ultimo accesso 2h fa';
        if (avatarEl) avatarEl.src = clientData.avatar;
    }

    updateBookingInfo(clientData) {
        const serviceEl = document.getElementById('activeServiceInfo');
        if (serviceEl && clientData.currentBooking) {
            serviceEl.textContent = `${clientData.currentBooking.service} - ${clientData.currentBooking.date}`;
        }
    }

    /* ===============================================
       AZIONI CHAT
       =============================================== */
    initializeChat() {
        // Seleziona prima chat se disponibile
        const firstChat = document.querySelector('.chat-item');
        if (firstChat) {
            const chatId = firstChat.getAttribute('data-chat-id');
            this.handleChatSelect(chatId);
        }
    }

    loadActiveChat() {
        // Carica chat attiva dal URL o localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const chatId = urlParams.get('chat') || 'chat-001';

        if (chatId) {
            this.handleChatSelect(chatId);
        }
    }

    /* ===============================================
       UTILITY E HELPERS
       =============================================== */
    generateMessageId() {
        return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    formatTime(timestamp) {
        const now = new Date();
        const msgDate = new Date(timestamp);

        // Se è oggi, mostra solo ora
        if (msgDate.toDateString() === now.toDateString()) {
            return msgDate.toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Se è ieri
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (msgDate.toDateString() === yesterday.toDateString()) {
            return 'Ieri';
        }

        // Altrimenti data completa
        return msgDate.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /* ===============================================
       DATI MOCK PER SVILUPPO
       =============================================== */
    initializeMockData() {
        // Simula cronologia messaggi esistenti
        this.messageHistory.set('chat-001', [
            {
                id: 'msg-001',
                text: 'Ciao! Confermo la prenotazione per domani alle 15:30. Devo preparare qualcosa in particolare?',
                type: 'client',
                senderName: 'Maria Rossi',
                timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 min fa
                status: 'Consegnato'
            },
            {
                id: 'msg-002',
                text: 'Ciao Maria! Perfetto, tutto confermato per domani. Prepara solo un asciugamano e assicurati di avere uno spazio tranquillo di circa 2x2 metri.',
                type: 'professional',
                senderName: 'Marco Bianchi',
                timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 min fa
                status: 'Letto'
            },
            {
                id: 'msg-003',
                text: 'Perfetto, grazie! A che ora arrivi circa?',
                type: 'client',
                senderName: 'Maria Rossi',
                timestamp: new Date(Date.now() - 6 * 60 * 1000), // 6 min fa
                status: 'Consegnato'
            },
            {
                id: 'msg-004',
                text: 'Sarò da te verso le 15:25, ti avviso quando sono in arrivo!',
                type: 'professional',
                senderName: 'Marco Bianchi',
                timestamp: new Date(Date.now() - 4 * 60 * 1000), // 4 min fa
                status: 'Letto'
            }
        ]);

        this.messageHistory.set('chat-002', []);
        this.messageHistory.set('chat-003', []);
    }

    getMockClientData(chatId) {
        const mockData = {
            'chat-001': {
                name: 'Maria Rossi',
                type: 'Cliente Premium',
                online: true,
                avatar: '/assets/images/avatar-placeholder.jpg',
                currentBooking: {
                    service: 'Massaggio Svedese',
                    date: 'Domani 15:30',
                    duration: '90 minuti',
                    location: 'Via Roma 123, Cagliari',
                    amount: '€80.00'
                }
            },
            'chat-002': {
                name: 'Luca Bianchi',
                type: 'Nuovo cliente',
                online: false,
                avatar: '/assets/images/avatar-placeholder.jpg',
                currentBooking: {
                    service: 'Riflessologia Plantare',
                    date: 'Lunedì 18:00',
                    duration: '60 minuti',
                    location: 'Studio RelaxPoint',
                    amount: '€55.00'
                }
            },
            'chat-003': {
                name: 'Anna Verdi',
                type: 'Cliente Premium',
                online: true,
                avatar: '/assets/images/avatar-placeholder.jpg',
                currentBooking: {
                    service: 'Hot Stone Therapy',
                    date: 'Da programmare',
                    duration: '75 minuti',
                    location: 'A domicilio',
                    amount: '€95.00'
                }
            }
        };

        return mockData[chatId] || mockData['chat-001'];
    }

    /* ===============================================
       CLEANUP E DISTRUZIONE
       =============================================== */
    destroy() {
        this.stopMessagePolling();

        // Cleanup typing timers
        this.typingTimers.forEach(timer => clearTimeout(timer));
        this.typingTimers.clear();

        console.log('ChatManager cleanup completato');
    }
}

/* ===============================================
   FUNZIONI GLOBALI - COMPATIBILITÀ HTML
   =============================================== */

// Azioni pannello info
function openBookingDetails() {
    if (window.chatManager && window.chatManager.activeChat) {
        console.log('Aprendo dettagli prenotazione...');
        // In produzione aprirebbe modal dettagli
        alert('Dettagli prenotazione - In sviluppo');
    }
}

function openClientProfile() {
    if (window.chatManager && window.chatManager.activeChat) {
        console.log('Aprendo profilo cliente...');
        // In produzione aprirebbe profilo cliente
        alert('Profilo cliente - In sviluppo');
    }
}

function archiveChat() {
    if (window.chatManager && window.chatManager.activeChat) {
        console.log('Archiviando chat...');
        if (confirm('Sei sicuro di voler archiviare questa conversazione?')) {
            // In produzione archivierebbe la chat
            alert('Chat archiviata');
        }
    }
}

function confirmBooking() {
    console.log('Confermando prenotazione da chat...');
    if (confirm('Confermi questa prenotazione?')) {
        alert('Prenotazione confermata!');
    }
}

function rescheduleBooking() {
    console.log('Riprogrammando prenotazione...');
    alert('Riprogrammazione prenotazione - In sviluppo');
}

function openMaps() {
    console.log('Aprendo mappa...');
    // In produzione aprirebbe Google Maps
    window.open('https://maps.google.com', '_blank');
}

function attachFile() {
    console.log('Allegando file...');

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = function (e) {
        const file = e.target.files[0];
        if (file) {
            console.log('File selezionato:', file.name);
            alert(`File "${file.name}" selezionato - Upload in sviluppo`);
        }
    };
    input.click();
}

function toggleInfoPanel() {
    const panel = document.getElementById('chatInfoPanel');
    if (panel) {
        const isHidden = panel.style.display === 'none';
        panel.style.display = isHidden ? 'block' : 'none';

        // Aggiusta layout grid
        const container = document.querySelector('.chat-container');
        if (container) {
            container.style.gridTemplateColumns = isHidden ?
                '320px 1fr 300px' : '320px 1fr';
        }
    }
}

function sendMessage() {
    if (window.chatManager) {
        window.chatManager.handleMessageSend();
    }
}

/* ===============================================
   ESPORTAZIONE FUNZIONI GLOBALI
   =============================================== */
window.openBookingDetails = openBookingDetails;
window.openClientProfile = openClientProfile;
window.archiveChat = archiveChat;
window.confirmBooking = confirmBooking;
window.rescheduleBooking = rescheduleBooking;
window.openMaps = openMaps;
window.attachFile = attachFile;
window.toggleInfoPanel = toggleInfoPanel;
window.sendMessage = sendMessage;

console.log('Chat JS - Funzioni globali esportate');
console.log('Sistema chat professionista pronto!');