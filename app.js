// Währungsrechner PWA - Hauptanwendung

class CurrencyConverter {
    constructor() {
        // Verwende exchangerate-api.com als primäre API (kostenlos, keine API-Key nötig)
        this.apiUrl = 'https://api.exchangerate-api.com/v4/latest';
        this.rates = {};
        this.lastUpdate = null;
        // Prüfe Online-Status - navigator.onLine ist nicht immer zuverlässig
        this.isOnline = navigator.onLine !== false;
        this.updateInterval = null;
        
        // Währungsliste
        this.currencies = {
            'EUR': 'Euro',
            'USD': 'US Dollar',
            'GBP': 'Britisches Pfund',
            'CHF': 'Schweizer Franken',
            'JPY': 'Japanischer Yen',
            'AUD': 'Australischer Dollar',
            'CAD': 'Kanadischer Dollar',
            'CNY': 'Chinesischer Yuan',
            'INR': 'Indische Rupie',
            'BRL': 'Brasilianischer Real',
            'MXN': 'Mexikanischer Peso',
            'RUB': 'Russischer Rubel',
            'KRW': 'Südkoreanischer Won',
            'SGD': 'Singapur-Dollar',
            'HKD': 'Hongkong-Dollar',
            'NZD': 'Neuseeland-Dollar',
            'NOK': 'Norwegische Krone',
            'SEK': 'Schwedische Krone',
            'DKK': 'Dänische Krone',
            'PLN': 'Polnischer Zloty',
            'TRY': 'Türkische Lira',
            'ZAR': 'Südafrikanischer Rand',
            'THB': 'Thailändischer Baht'
        };
        
        this.init();
    }

    async init() {
        // Lade Dark Mode sofort (vor anderen Einstellungen, um Flackern zu vermeiden)
        const darkMode = this.getSetting('darkMode', false);
        this.toggleDarkMode(darkMode);
        
        // Event Listeners
        this.setupEventListeners();
        
        // Lade Einstellungen
        await this.loadSettings();
        
        // Initialisiere UI (muss vor dem Laden der Kurse passieren)
        this.initializeUI();
        
        // Lade gespeicherte Kurse zuerst (für schnelle Anzeige)
        const hasStoredRates = await this.loadStoredRates();
        
        // Versuche Standort zu ermitteln (nicht blockierend)
        this.detectLocationCurrency().catch(err => {
            console.log('Standort konnte nicht ermittelt werden:', err);
        });
        
        // Lade aktuelle Kurse (versucht immer, auch wenn offline)
        await this.fetchRates();
        
        // Online/Offline Status überwachen
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Auto-Update einrichten
        this.setupAutoUpdate();
    }

    setupEventListeners() {
        // Hauptwährung Eingabe
        const mainAmountInput = document.getElementById('mainAmount');
        if (!mainAmountInput) {
            console.error('mainAmount Input nicht gefunden');
            return;
        }
        mainAmountInput.addEventListener('input', (e) => {
            console.log('Input Event ausgelöst, Wert:', e.target.value);
            this.calculateFromMain(e.target.value);
        });
        
        // Hauptwährung Auswahl
        document.getElementById('mainCurrency').addEventListener('change', (e) => {
            this.saveSettings();
            this.calculateFromMain(document.getElementById('mainAmount').value);
        });
        
        // Standort-Währung Eingabe
        document.getElementById('locationAmount').addEventListener('input', (e) => {
            this.calculateFromLocation(e.target.value);
        });
        
        // Standort-Währung Auswahl
        document.getElementById('locationCurrency').addEventListener('change', (e) => {
            this.calculateFromLocation(document.getElementById('locationAmount').value);
        });
        
        // Einstellungen
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettings();
        });
        
        document.getElementById('closeSettings').addEventListener('click', () => {
            this.closeSettings();
        });
        
        document.getElementById('refreshRates').addEventListener('click', () => {
            this.fetchRates(true);
        });
        
        document.getElementById('settingsMainCurrency').addEventListener('change', (e) => {
            document.getElementById('mainCurrency').value = e.target.value;
            this.saveSettings();
            this.calculateFromMain(document.getElementById('mainAmount').value);
        });
        
        document.getElementById('autoUpdate').addEventListener('change', (e) => {
            this.saveSettings();
            this.setupAutoUpdate();
        });
        
        document.getElementById('darkMode').addEventListener('change', (e) => {
            this.toggleDarkMode(e.target.checked);
            this.saveSettings();
        });
        
        // Modal schließen bei Klick außerhalb
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });
    }

    initializeUI() {
        // Fülle Währungsauswahl
        this.populateCurrencySelects();
        
        // Fülle zusätzliche Währungen
        this.renderAdditionalCurrencies();
        
        // Update Status
        this.updateStatus();
    }

    populateCurrencySelects() {
        const selects = ['mainCurrency', 'settingsMainCurrency', 'locationCurrency'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;
            
            select.innerHTML = '';
            Object.entries(this.currencies).forEach(([code, name]) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = `${code} - ${name}`;
                select.appendChild(option);
            });
        });
        
        // Setze gespeicherte Hauptwährung
        const savedMain = this.getSetting('mainCurrency', 'EUR');
        document.getElementById('mainCurrency').value = savedMain;
        document.getElementById('settingsMainCurrency').value = savedMain;
    }

    renderAdditionalCurrencies() {
        const container = document.getElementById('additionalCurrencies');
        container.innerHTML = '';
        
        const selectedCurrencies = this.getSetting('additionalCurrencies', []);
        
        selectedCurrencies.forEach(code => {
            if (code === this.getSetting('mainCurrency', 'EUR')) return;
            if (code === this.getSetting('locationCurrency')) return;
            
            const card = document.createElement('div');
            card.className = 'currency-card additional-currency';
            card.innerHTML = `
                <div class="currency-header">
                    <select class="currency-select additional-currency-select" data-currency="${code}">
                        <option value="${code}">${code} - ${this.currencies[code] || code}</option>
                    </select>
                    <span class="currency-label">Zusätzliche Währung</span>
                </div>
                <input type="number" class="amount-input additional-currency-amount" 
                       data-currency="${code}" 
                       placeholder="0.00" 
                       step="0.01" 
                       min="0">
            `;
            
            const input = card.querySelector('.additional-currency-amount');
            input.addEventListener('input', (e) => {
                this.calculateFromCurrency(code, e.target.value);
            });
            
            container.appendChild(card);
        });
        
        // Initiale Berechnung nur wenn Kurse vorhanden sind
        const mainAmount = document.getElementById('mainAmount')?.value;
        if (mainAmount && parseFloat(mainAmount) > 0 && Object.keys(this.rates).length > 0) {
            this.calculateFromMain(mainAmount);
        }
    }

    async detectLocationCurrency() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('API Fehler');
            
            const data = await response.json();
            
            if (data.currency) {
                const currency = data.currency;
                this.setSetting('locationCurrency', currency);
                
                const locationSelect = document.getElementById('locationCurrency');
                const locationCard = document.getElementById('locationCurrencyCard');
                
                if (locationSelect && Object.keys(this.currencies).includes(currency)) {
                    locationSelect.value = currency;
                    locationSelect.disabled = false;
                    if (locationCard) {
                        locationCard.style.display = 'block';
                    }
                } else if (locationSelect) {
                    // Währung nicht in Liste, aber trotzdem anzeigen
                    locationSelect.innerHTML = `<option value="${currency}">${currency}</option>`;
                    locationSelect.value = currency;
                    locationSelect.disabled = false;
                    if (locationCard) {
                        locationCard.style.display = 'block';
                    }
                }
            }
        } catch (error) {
            console.log('Standort-Währung konnte nicht ermittelt werden:', error);
            // Versuche gespeicherte Standort-Währung zu laden
            const savedLocation = this.getSetting('locationCurrency');
            if (savedLocation) {
                const locationSelect = document.getElementById('locationCurrency');
                const locationCard = document.getElementById('locationCurrencyCard');
                if (locationSelect && locationCard) {
                    locationSelect.value = savedLocation;
                    locationSelect.disabled = false;
                    locationCard.style.display = 'block';
                }
            }
        }
    }

    async fetchRates(force = false) {
        if (!this.isOnline && !force) {
            this.updateStatus();
            // Versuche gespeicherte Kurse zu laden, wenn online nicht verfügbar
            if (Object.keys(this.rates).length === 0) {
                await this.loadStoredRates();
            }
            return;
        }
        
        const base = this.getSetting('mainCurrency', 'EUR');
        
        try {
            this.updateStatus('loading');
            
            // exchangerate-api.com verwendet /v4/latest/{base} Format
            const response = await fetch(`${this.apiUrl}/${base}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            // exchangerate-api.com gibt direkt { rates: {...}, base: "EUR", date: "..." } zurück
            if (data.rates && Object.keys(data.rates).length > 0) {
                this.rates = data.rates;
                this.lastUpdate = new Date();
                this.isOnline = true;
                
                console.log('Kurse erfolgreich geladen. Anzahl:', Object.keys(this.rates).length);
                console.log('Basiswährung:', data.base || base);
                console.log('Beispiel-Kurse:', {
                    USD: this.rates.USD,
                    GBP: this.rates.GBP,
                    CHF: this.rates.CHF
                });
                
                // Speichere Kurse
                await this.storeRates();
                
                // Berechne neu, wenn ein Betrag eingegeben wurde
                const mainAmount = document.getElementById('mainAmount').value;
                if (mainAmount && parseFloat(mainAmount) > 0) {
                    console.log('Berechne nach Laden der Kurse mit Betrag:', mainAmount);
                    this.calculateFromMain(mainAmount);
                }
                
                this.updateStatus('online');
            } else {
                console.error('API Fehler - Antwort:', data);
                throw new Error('API Fehler: Ungültige Antwort');
            }
        } catch (error) {
            console.error('Fehler beim Laden der Kurse:', error);
            this.isOnline = false;
            this.updateStatus('offline');
            
            // Versuche gespeicherte Kurse zu laden
            await this.loadStoredRates();
            
            // Wenn immer noch keine Kurse vorhanden sind, zeige Warnung
            if (Object.keys(this.rates).length === 0) {
                console.warn('Keine Wechselkurse verfügbar (weder online noch offline)');
            }
        }
    }

    calculateFromMain(amount) {
        if (!amount || amount === '') {
            this.clearAllAmounts();
            return;
        }
        
        const mainCurrency = document.getElementById('mainCurrency').value;
        const mainAmount = parseFloat(amount);
        
        if (isNaN(mainAmount) || mainAmount <= 0) {
            console.log('Ungültiger Betrag:', amount);
            return;
        }
        
        // Prüfe ob Kurse vorhanden sind
        if (!this.rates || Object.keys(this.rates).length === 0) {
            console.warn('Keine Wechselkurse verfügbar. Versuche Kurse zu laden...');
            console.log('Aktuelle Kurse:', this.rates);
            this.fetchRates(true).then(() => {
                // Nach dem Laden erneut berechnen
                if (Object.keys(this.rates).length > 0) {
                    this.calculateFromMain(amount);
                }
            });
            return;
        }
        
        console.log('Berechne von Hauptwährung:', mainCurrency, 'Betrag:', mainAmount);
        console.log('Verfügbare Kurse:', Object.keys(this.rates).slice(0, 5), '...');
        
        // Standort-Währung
        const locationCurrency = document.getElementById('locationCurrency').value;
        if (locationCurrency && this.rates[locationCurrency]) {
            const locationAmount = mainAmount * this.rates[locationCurrency];
            const locationInput = document.getElementById('locationAmount');
            if (locationInput) {
                locationInput.value = locationAmount.toFixed(2);
                console.log('Standort-Währung berechnet:', locationCurrency, locationAmount.toFixed(2));
            }
        } else if (locationCurrency) {
            console.warn('Kurs für Standort-Währung nicht gefunden:', locationCurrency);
        }
        
        // Zusätzliche Währungen
        let calculatedCount = 0;
        document.querySelectorAll('.additional-currency-amount').forEach(input => {
            const currency = input.dataset.currency;
            if (currency && this.rates[currency]) {
                const converted = mainAmount * this.rates[currency];
                input.value = converted.toFixed(2);
                calculatedCount++;
            } else if (currency) {
                console.warn('Kurs für Währung nicht gefunden:', currency);
            }
        });
        console.log('Berechnete zusätzliche Währungen:', calculatedCount);
    }

    calculateFromLocation(amount) {
        if (!amount || amount === '') {
            this.clearAllAmounts();
            return;
        }
        
        const locationCurrency = document.getElementById('locationCurrency').value;
        const locationAmount = parseFloat(amount);
        
        if (isNaN(locationAmount) || locationAmount <= 0) return;
        
        // Prüfe ob Kurse vorhanden sind
        if (!this.rates || Object.keys(this.rates).length === 0 || !this.rates[locationCurrency]) {
            console.warn('Keine Wechselkurse verfügbar. Versuche Kurse zu laden...');
            this.fetchRates(true);
            return;
        }
        
        // Hauptwährung (inverse Berechnung)
        const mainCurrency = this.getSetting('mainCurrency', 'EUR');
        const mainAmount = locationAmount / this.rates[locationCurrency];
        const mainInput = document.getElementById('mainAmount');
        if (mainInput) {
            mainInput.value = mainAmount.toFixed(2);
        }
        
        // Zusätzliche Währungen
        document.querySelectorAll('.additional-currency-amount').forEach(input => {
            const currency = input.dataset.currency;
            if (currency && this.rates[currency]) {
                const converted = mainAmount * this.rates[currency];
                input.value = converted.toFixed(2);
            }
        });
    }

    calculateFromCurrency(currency, amount) {
        if (!amount || amount === '') {
            this.clearAllAmounts();
            return;
        }
        
        const currencyAmount = parseFloat(amount);
        if (isNaN(currencyAmount) || currencyAmount <= 0) return;
        
        // Prüfe ob Kurse vorhanden sind
        if (!this.rates || Object.keys(this.rates).length === 0 || !this.rates[currency]) {
            console.warn('Keine Wechselkurse verfügbar. Versuche Kurse zu laden...');
            this.fetchRates(true);
            return;
        }
        
        // Hauptwährung (inverse Berechnung)
        const mainCurrency = this.getSetting('mainCurrency', 'EUR');
        const mainAmount = currencyAmount / this.rates[currency];
        const mainInput = document.getElementById('mainAmount');
        if (mainInput) {
            mainInput.value = mainAmount.toFixed(2);
        }
        
        // Standort-Währung
        const locationCurrency = document.getElementById('locationCurrency').value;
        if (locationCurrency && this.rates[locationCurrency]) {
            const locationAmount = mainAmount * this.rates[locationCurrency];
            const locationInput = document.getElementById('locationAmount');
            if (locationInput) {
                locationInput.value = locationAmount.toFixed(2);
            }
        }
        
        // Andere zusätzliche Währungen
        document.querySelectorAll('.additional-currency-amount').forEach(input => {
            if (input.dataset.currency === currency) return;
            const otherCurrency = input.dataset.currency;
            if (otherCurrency && this.rates[otherCurrency]) {
                const converted = mainAmount * this.rates[otherCurrency];
                input.value = converted.toFixed(2);
            }
        });
    }

    clearAllAmounts() {
        document.getElementById('locationAmount').value = '';
        document.querySelectorAll('.additional-currency-amount').forEach(input => {
            input.value = '';
        });
    }

    updateStatus(status) {
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');
        const update = document.getElementById('lastUpdate');
        
        if (status === 'loading') {
            dot.className = 'status-dot';
            text.textContent = 'Lade Kurse...';
            update.textContent = '';
            return;
        }
        
        if (this.isOnline && Object.keys(this.rates).length > 0) {
            dot.className = 'status-dot online';
            text.textContent = 'Live-Kurse aktiv';
            if (this.lastUpdate) {
                const timeStr = this.lastUpdate.toLocaleTimeString('de-DE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                update.textContent = `Aktualisiert: ${timeStr}`;
            }
        } else {
            dot.className = 'status-dot offline';
            text.textContent = 'Offline / Gespeicherte Kurse';
            const storedUpdate = this.getSetting('lastUpdateTime');
            if (storedUpdate) {
                const date = new Date(storedUpdate);
                const timeStr = date.toLocaleTimeString('de-DE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                update.textContent = `Gespeichert: ${timeStr}`;
            }
        }
    }

    handleOnline() {
        this.isOnline = true;
        console.log('Online-Status erkannt, lade Kurse...');
        this.fetchRates(true);
    }

    handleOffline() {
        this.isOnline = false;
        console.log('Offline-Status erkannt');
        this.updateStatus('offline');
        // Versuche gespeicherte Kurse zu verwenden
        if (Object.keys(this.rates).length === 0) {
            this.loadStoredRates();
        }
    }

    setupAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        const autoUpdate = this.getSetting('autoUpdate', true);
        if (autoUpdate && this.isOnline) {
            // Update alle 5 Minuten
            this.updateInterval = setInterval(() => {
                this.fetchRates();
            }, 5 * 60 * 1000);
        }
    }

    openSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.add('active');
        
        // Fülle Checkboxen
        this.populateCurrencyCheckboxes();
    }

    closeSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.remove('active');
    }

    populateCurrencyCheckboxes() {
        const container = document.getElementById('currencyCheckboxes');
        container.innerHTML = '';
        
        const selectedCurrencies = this.getSetting('additionalCurrencies', []);
        const mainCurrency = this.getSetting('mainCurrency', 'EUR');
        const locationCurrency = this.getSetting('locationCurrency');
        
        Object.entries(this.currencies).forEach(([code, name]) => {
            if (code === mainCurrency) return;
            if (code === locationCurrency) return;
            
            const item = document.createElement('div');
            item.className = 'currency-checkbox-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `currency-${code}`;
            checkbox.value = code;
            checkbox.checked = selectedCurrencies.includes(code);
            
            checkbox.addEventListener('change', () => {
                this.saveCurrencySelection();
            });
            
            const label = document.createElement('label');
            label.htmlFor = `currency-${code}`;
            label.textContent = `${code} - ${name}`;
            
            item.appendChild(checkbox);
            item.appendChild(label);
            container.appendChild(item);
        });
    }

    saveCurrencySelection() {
        const checkboxes = document.querySelectorAll('#currencyCheckboxes input[type="checkbox"]');
        const selected = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        this.setSetting('additionalCurrencies', selected);
        this.renderAdditionalCurrencies();
    }

    // LocalStorage Helper
    getSetting(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(`currency_${key}`);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    setSetting(key, value) {
        try {
            localStorage.setItem(`currency_${key}`, JSON.stringify(value));
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
        }
    }

    saveSettings() {
        const mainCurrency = document.getElementById('mainCurrency').value;
        this.setSetting('mainCurrency', mainCurrency);
        
        const autoUpdate = document.getElementById('autoUpdate').checked;
        this.setSetting('autoUpdate', autoUpdate);
        
        const darkMode = document.getElementById('darkMode').checked;
        this.setSetting('darkMode', darkMode);
    }

    async loadSettings() {
        // Einstellungen werden automatisch beim ersten Zugriff geladen
        const mainCurrency = this.getSetting('mainCurrency', 'EUR');
        document.getElementById('mainCurrency').value = mainCurrency;
        
        const autoUpdate = this.getSetting('autoUpdate', true);
        document.getElementById('autoUpdate').checked = autoUpdate;
        
        const darkMode = this.getSetting('darkMode', false);
        document.getElementById('darkMode').checked = darkMode;
        this.toggleDarkMode(darkMode);
    }
    
    toggleDarkMode(enabled) {
        if (enabled) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    async storeRates() {
        try {
            const data = {
                rates: this.rates,
                timestamp: this.lastUpdate.toISOString()
            };
            localStorage.setItem('currency_rates', JSON.stringify(data));
            this.setSetting('lastUpdateTime', this.lastUpdate.toISOString());
        } catch (error) {
            console.error('Fehler beim Speichern der Kurse:', error);
        }
    }

    async loadStoredRates() {
        try {
            const stored = localStorage.getItem('currency_rates');
            if (stored) {
                const data = JSON.parse(stored);
                if (data.rates && Object.keys(data.rates).length > 0) {
                    this.rates = data.rates;
                    if (data.timestamp) {
                        this.lastUpdate = new Date(data.timestamp);
                    }
                    this.updateStatus();
                    
                    // Berechne neu, wenn ein Betrag eingegeben wurde
                    const mainAmount = document.getElementById('mainAmount').value;
                    if (mainAmount && parseFloat(mainAmount) > 0) {
                        this.calculateFromMain(mainAmount);
                    }
                    return true;
                }
            }
        } catch (error) {
            console.error('Fehler beim Laden der gespeicherten Kurse:', error);
        }
        return false;
    }
}

// Initialisiere App
let converter;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swPath = './sw.js';
        navigator.serviceWorker.register(swPath)
            .then(reg => {
                console.log('Service Worker registriert:', reg.scope);
                // Prüfe auf Updates
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('Neue Version verfügbar');
                        }
                    });
                });
            })
            .catch(err => console.log('Service Worker Fehler:', err));
    });
}

// Starte App
document.addEventListener('DOMContentLoaded', () => {
    converter = new CurrencyConverter();
});

