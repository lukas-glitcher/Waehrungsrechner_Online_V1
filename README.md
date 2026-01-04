# Währungsrechner PWA

Eine Progressive Web App (PWA) für Währungsumrechnung mit Live-Kursen und Offline-Funktionalität.

## Features

- ✅ **Hauptwährung** frei wählbar
- ✅ **Standort-Währung** automatisch ermittelt
- ✅ **Zusätzliche Währungen** frei konfigurierbar
- ✅ **Beidseitige Eingabe** - jede Währung rechnet alle anderen
- ✅ **Live-Kurse** mit Statusanzeige (🟢 Online / 🔴 Offline)
- ✅ **Offline-Funktionalität** mit Service Worker
- ✅ **Touch-optimiert** für mobile Geräte
- ✅ **Installierbar** als PWA

## Installation

### Lokale Entwicklung

1. Öffne die App in einem modernen Browser (Chrome, Edge, Firefox, Safari)
2. Für lokale Entwicklung benötigst du einen lokalen Server:

```bash
# Mit Python 3
python -m http.server 8000

# Mit Node.js (http-server)
npx http-server -p 8000

# Mit PHP
php -S localhost:8000
```

3. Öffne `http://localhost:8000` im Browser

### PWA Installation

1. Öffne die App im Browser
2. Klicke auf das Installations-Icon in der Adressleiste (oder Menü → "Zum Startbildschirm hinzufügen")
3. Die App wird wie eine native App installiert

## Icons erstellen

Für die PWA werden Icons benötigt. Du kannst:

1. **Einfache Lösung**: Erstelle 192x192 und 512x512 PNG-Dateien mit einem Währungs-Symbol
2. **Online Tools**: Nutze Tools wie [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) oder [RealFaviconGenerator](https://realfavicongenerator.net/)
3. **Manuell**: Erstelle Icons mit einem Bildbearbeitungsprogramm

Benötigte Dateien:
- `icon-192.png` (192x192 Pixel)
- `icon-512.png` (512x512 Pixel)

## Technologie

- **HTML5** - Struktur
- **CSS3** - Modernes, responsives Design
- **JavaScript (ES6+)** - App-Logik
- **Service Worker** - Offline-Funktionalität
- **LocalStorage** - Datenpersistenz
- **ExchangeRate API** - Wechselkurse
- **IPAPI** - Standort-Erkennung

## API

Die App nutzt:
- [exchangerate.host](https://exchangerate.host) - Für Wechselkurse
- [ipapi.co](https://ipapi.co) - Für Standort-Währung

## Browser-Kompatibilität

- Chrome/Edge (empfohlen)
- Firefox
- Safari (iOS 11.3+)
- Samsung Internet

## Funktionen im Detail

### Währungsauswahl
- **Hauptwährung**: Wird oben angezeigt, frei wählbar
- **Standort-Währung**: Wird automatisch basierend auf deinem Standort ermittelt
- **Zusätzliche Währungen**: In den Einstellungen auswählbar

### Berechnung
- Eingabe in einer Währung aktualisiert automatisch alle anderen
- Unterstützt Dezimalzahlen
- Echtzeit-Berechnung

### Offline-Modus
- Gespeicherte Kurse werden verwendet, wenn keine Internetverbindung besteht
- Statusanzeige zeigt Offline-Status an
- Letzte Aktualisierung wird angezeigt

## Einstellungen

- Hauptwährung festlegen
- Zusätzliche Währungen auswählen
- Automatische Kursaktualisierung ein/aus
- Manuelle Kursaktualisierung

## Entwicklung

### Projektstruktur

```
Währungsrechner/
├── index.html          # Haupt-HTML
├── styles.css          # Styling
├── app.js              # App-Logik
├── sw.js               # Service Worker
├── manifest.json       # PWA Manifest
├── icon-192.png        # App Icon (192x192)
├── icon-512.png        # App Icon (512x512)
└── README.md           # Diese Datei
```

## Lizenz

Freie Verwendung für private und kommerzielle Zwecke.


