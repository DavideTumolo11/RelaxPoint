/* ================================================
   FAVORITES SYSTEM - Sistema Preferiti Unificato
   ================================================ */

class FavoritesManager {
    constructor() {
        this.favorites = this.loadFavorites();
        this.init();
    }

    init() {
        // Setup listeners per tutti i pulsanti cuore
        document.addEventListener('click', (e) => {
            const favoriteBtn = e.target.closest('.favorite-btn, .massaggi-favorite-btn, .yoga-favorite-btn, .fitness-favorite-btn, .beauty-favorite-btn, .chef-favorite-btn, .fisio-favorite-btn, .escursioni-favorite-btn, .gravidanza-favorite-btn, .hair-favorite-btn');

            if (favoriteBtn) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleFavorite(favoriteBtn);
            }
        });

        // Applica stato iniziale a tutti i cuori
        this.updateAllHearts();
    }

    toggleFavorite(button) {
        // Estrai ID dalla card padre
        const card = button.closest('[data-service-id], [data-professional-id], [data-treatment-id]');
        if (!card) return;

        const itemId = card.dataset.serviceId ||
                       card.dataset.professionalId ||
                       card.dataset.treatmentId;

        const itemType = card.dataset.serviceId ? 'service' :
                         card.dataset.professionalId ? 'professional' : 'treatment';

        const favoriteKey = `${itemType}_${itemId}`;

        // Toggle stato
        if (this.isFavorite(favoriteKey)) {
            this.removeFavorite(favoriteKey);
            button.classList.remove('active');
        } else {
            this.addFavorite(favoriteKey, {
                id: itemId,
                type: itemType,
                addedAt: new Date().toISOString()
            });
            button.classList.add('active');
        }

        // Trigger evento per altre parti dell'app
        this.triggerFavoriteEvent(favoriteKey, this.isFavorite(favoriteKey));
    }

    addFavorite(key, data) {
        this.favorites[key] = data;
        this.saveFavorites();
    }

    removeFavorite(key) {
        delete this.favorites[key];
        this.saveFavorites();
    }

    isFavorite(key) {
        return !!this.favorites[key];
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem('relaxpoint_favorites');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Errore caricamento preferiti:', e);
            return {};
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('relaxpoint_favorites', JSON.stringify(this.favorites));
        } catch (e) {
            console.error('Errore salvataggio preferiti:', e);
        }
    }

    updateAllHearts() {
        // Trova tutti i pulsanti cuore e aggiorna il loro stato
        document.querySelectorAll('.favorite-btn, .massaggi-favorite-btn, .yoga-favorite-btn, .fitness-favorite-btn, .beauty-favorite-btn, .chef-favorite-btn, .fisio-favorite-btn, .escursioni-favorite-btn, .gravidanza-favorite-btn, .hair-favorite-btn').forEach(button => {
            const card = button.closest('[data-service-id], [data-professional-id], [data-treatment-id]');
            if (!card) return;

            const itemId = card.dataset.serviceId ||
                           card.dataset.professionalId ||
                           card.dataset.treatmentId;

            const itemType = card.dataset.serviceId ? 'service' :
                             card.dataset.professionalId ? 'professional' : 'treatment';

            const favoriteKey = `${itemType}_${itemId}`;

            if (this.isFavorite(favoriteKey)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    getFavoritesByType(type) {
        return Object.values(this.favorites).filter(fav => fav.type === type);
    }

    getAllFavorites() {
        return this.favorites;
    }

    getFavoriteCount() {
        return Object.keys(this.favorites).length;
    }

    clearAllFavorites() {
        this.favorites = {};
        this.saveFavorites();
        this.updateAllHearts();
    }

    triggerFavoriteEvent(key, isActive) {
        // Trigger custom event
        const event = new CustomEvent('favoriteToggled', {
            detail: {
                key: key,
                isActive: isActive,
                totalCount: this.getFavoriteCount()
            }
        });
        document.dispatchEvent(event);
    }
}

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.favoritesManager = new FavoritesManager();
    });
} else {
    window.favoritesManager = new FavoritesManager();
}

// Esponi funzioni globali per compatibilità
window.toggleFavorite = function(element) {
    if (window.favoritesManager) {
        window.favoritesManager.toggleFavorite(element);
    }
};

console.log('Favorites System - Inizializzato');
