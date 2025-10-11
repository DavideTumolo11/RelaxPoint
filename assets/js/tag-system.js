// Sistema di gestione tag predefiniti per servizi
class TagSystem {
    constructor() {
        // Tag predefiniti per ogni categoria di servizio
        this.tagsByCategory = {
            'massaggi-e-trattamenti': [
                'Rilassante',
                'Terapeutico',
                'Deep Tissue',
                'Hot Stone',
                'Sportivo',
                'Decontratturante',
                'Drenante',
                'Ayurvedico'
            ],
            'yoga-meditazione': [
                'Hatha Yoga',
                'Vinyasa',
                'Ashtanga',
                'Yin Yoga',
                'Kundalini',
                'Meditazione',
                'Breathwork',
                'Mindfulness'
            ],
            'beauty-wellness': [
                'Viso',
                'Corpo',
                'Anti-age',
                'Idratante',
                'Purificante',
                'Esfoliante',
                'Rassodante',
                'Rigenerante'
            ],
            'fitness-allenamento': [
                'Cardio',
                'Forza',
                'HIIT',
                'Functional',
                'Pilates',
                'CrossFit',
                'Stretching',
                'Core Training'
            ],
            'fisioterapia-osteopatia': [
                'Riabilitazione',
                'Posturale',
                'Osteopatia',
                'Manipolazione',
                'Terapia Manuale',
                'Sport',
                'Pediatrica',
                'Geriatrica'
            ],
            'chef-cucina': [
                'A Domicilio',
                'Gourmet',
                'Vegetariana',
                'Vegana',
                'Senza Glutine',
                'Tradizionale',
                'Fusion',
                'Macrobiotica'
            ],
            'hair-makeup': [
                'Taglio',
                'Colore',
                'Acconciature',
                'Extension',
                'Makeup',
                'Trucco Sposa',
                'Nail Art',
                'Estetica'
            ],
            'escursioni-natura': [
                'Trekking',
                'Mountain Bike',
                'Kayak',
                'Arrampicata',
                'Nordic Walking',
                'Birdwatching',
                'Fotografia',
                'Educazione Ambientale'
            ],
            'gravidanza-neo-mamme': [
                'Pre-parto',
                'Post-parto',
                'Yoga Gravidanza',
                'Massaggio Gravidanza',
                'Consulenza',
                'Supporto Allattamento',
                'Fitness Post-parto',
                'Benessere Mamma'
            ]
        };
    }

    /**
     * Ottiene i tag disponibili per una categoria di servizio
     * @param {string} category - La categoria del servizio
     * @returns {Array} Array di tag disponibili
     */
    getTagsForCategory(category) {
        return this.tagsByCategory[category] || [];
    }

    /**
     * Valida che i tag selezionati appartengano alla categoria corretta
     * @param {Array} selectedTags - Tag selezionati dall'utente
     * @param {string} category - Categoria del servizio
     * @returns {boolean} true se tutti i tag sono validi
     */
    validateTags(selectedTags, category) {
        const validTags = this.getTagsForCategory(category);
        return selectedTags.every(tag => validTags.includes(tag));
    }

    /**
     * Crea l'HTML per la selezione dei tag
     * @param {string} category - Categoria del servizio
     * @param {Array} selectedTags - Tag già selezionati (per edit)
     * @returns {string} HTML della sezione tag
     */
    renderTagSelection(category, selectedTags = []) {
        const availableTags = this.getTagsForCategory(category);

        if (availableTags.length === 0) {
            return '<p class="no-tags-message">Nessun tag disponibile per questa categoria</p>';
        }

        let html = '<div class="tag-selection-grid">';

        availableTags.forEach(tag => {
            const isSelected = selectedTags.includes(tag);
            const checkedAttr = isSelected ? 'checked' : '';

            html += `
                <label class="tag-checkbox-item">
                    <input type="checkbox"
                           name="serviceTags"
                           value="${tag}"
                           ${checkedAttr}>
                    <span class="tag-label">${tag}</span>
                </label>
            `;
        });

        html += '</div>';
        return html;
    }

    /**
     * Ottiene i tag selezionati dal form
     * @returns {Array} Array di tag selezionati
     */
    getSelectedTags() {
        const checkboxes = document.querySelectorAll('input[name="serviceTags"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    /**
     * Crea l'HTML per visualizzare i tag (per card servizio)
     * @param {Array} tags - Array di tag da visualizzare
     * @param {string} category - Categoria per lo stile
     * @returns {string} HTML dei tag
     */
    renderServiceTags(tags, category) {
        if (!tags || tags.length === 0) return '';

        // Mostra max 3 tag + contatore se ce ne sono altri
        const displayTags = tags.slice(0, 3);
        const remainingCount = tags.length - 3;

        let html = '<div class="service-tags">';

        displayTags.forEach(tag => {
            html += `<span class="service-tag ${category}-tag">${tag}</span>`;
        });

        if (remainingCount > 0) {
            html += `<span class="service-tag ${category}-tag">+${remainingCount}</span>`;
        }

        html += '</div>';
        return html;
    }
}

// Istanza globale
window.tagSystem = new TagSystem();
