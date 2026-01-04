# ✅ Checkliste für Online-Hosting

Überprüfe diese Checkliste, bevor du die App online hostest:

## 📋 Dateien-Checkliste

- [x] `index.html` - Haupt-HTML-Datei vorhanden
- [x] `app.js` - App-Logik vorhanden
- [x] `styles.css` - Styling vorhanden
- [x] `sw.js` - Service Worker vorhanden
- [x] `manifest.json` - PWA Manifest vorhanden
- [x] `icon-192.png` - App Icon (192x192) vorhanden
- [x] `icon-512.png` - App Icon (512x512) vorhanden

## 🔍 Konfigurations-Checkliste

- [x] **manifest.json** ist korrekt konfiguriert:
  - `start_url` ist auf "/" gesetzt
  - `display` ist auf "standalone" gesetzt
  - Icons sind korrekt referenziert
  - Theme- und Hintergrundfarbe sind gesetzt

- [x] **index.html** verweist korrekt auf:
  - `<link rel="manifest" href="manifest.json">`
  - Service Worker wird registriert

- [x] **Service Worker (sw.js)** ist vorhanden und funktioniert

## 🚀 Vor dem Upload

- [ ] Alle Dateien im Hauptverzeichnis (keine Unterordner für Core-Dateien)
- [ ] Icons sind im gleichen Verzeichnis wie index.html
- [ ] Manifest.json ist im gleichen Verzeichnis wie index.html
- [ ] Service Worker (sw.js) ist im gleichen Verzeichnis wie index.html

## 🌐 Nach dem Online-Hosting

- [ ] App ist über HTTPS erreichbar
- [ ] App lädt ohne Fehler im Browser
- [ ] Manifest.json ist erreichbar (prüfe: `[URL]/manifest.json`)
- [ ] Service Worker ist registriert (prüfe in Browser-Entwicklertools: F12 → Application → Service Workers)
- [ ] Icons werden angezeigt (prüfe: `[URL]/icon-192.png` und `[URL]/icon-512.png`)

## 📱 Test auf dem Handy

- [ ] App lädt im Browser des Handys
- [ ] Installations-Option erscheint (Android: Menü → "Zum Startbildschirm hinzufügen", iOS: Teilen → "Zum Home-Bildschirm")
- [ ] App erscheint auf dem Startbildschirm nach Installation
- [ ] App öffnet sich im Standalone-Modus (ohne Browser-Leiste)
- [ ] Service Worker funktioniert (App lädt auch offline)

## ✨ Status

**Alle Core-Dateien sind vorhanden!** Die App ist bereit für das Online-Hosting.

Nächste Schritte:
1. Wähle einen Hosting-Service (GitHub Pages, Netlify, Vercel, etc.)
2. Lade alle Dateien hoch
3. Folge der Installationsanleitung in `INSTALLATION.md`

