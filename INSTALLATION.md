# 📱 Installationsanleitung - Währungsrechner PWA

Diese Anleitung erklärt, wie du die Währungsrechner-App online hostest und auf deinem Handy installierst, sodass sie **überall funktioniert** - auch ohne Verbindung zu deinem Computer.

---

## ⚠️ Wichtig: Online-Hosting erforderlich

Damit die App auf deinem Handy **ständig verfügbar** ist (ohne dass dein Computer laufen muss), musst du sie auf einem **Online-Server** mit **HTTPS** hosten. Die lokale Installation ist nur für Entwicklung/Tests gedacht.

---

## 🚀 Schritt 1: App online hosten (WICHTIG!)

Wähle einen der folgenden kostenlosen Hosting-Dienste:

### Option 1: GitHub Pages (Empfohlen - kostenlos)

1. **Erstelle ein GitHub-Konto** (falls noch nicht vorhanden): [github.com](https://github.com)
2. **Erstelle ein neues Repository**:
   - Klicke auf "New repository"
   - Name: z.B. `waehrungsrechner-pwa`
   - Wähle "Public"
   - Klicke auf "Create repository"
3. **Lade alle Dateien hoch**:
   ```bash
   # Mit Git (empfohlen)
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[DEIN-USERNAME]/waehrungsrechner-pwa.git
   git push -u origin main
   ```
   
   Oder: Nutze die GitHub-Web-Oberfläche, um Dateien hochzuladen
4. **Aktiviere GitHub Pages**:
   - Gehe zu Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / "/ (root)"
   - Klicke auf "Save"
5. **Warte 1-2 Minuten**, dann ist deine App erreichbar unter:
   `https://[DEIN-USERNAME].github.io/waehrungsrechner-pwa/`

### Option 2: Netlify (Einfach - Drag & Drop)

1. **Gehe zu**: [netlify.com](https://www.netlify.com)
2. **Erstelle ein kostenloses Konto**
3. **Drag & Drop**: Ziehe einfach den gesamten Projektordner in den Netlify-Bereich
4. **Fertig!** Die App ist sofort online mit HTTPS

### Option 3: Vercel (Schnell - CLI oder Web)

1. **Gehe zu**: [vercel.com](https://vercel.com)
2. **Erstelle ein kostenloses Konto**
3. **Installiere Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   vercel
   ```
4. Oder nutze die Web-Oberfläche für Drag & Drop

### Option 4: Firebase Hosting (Google)

1. **Installiere Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```
2. **Login und Setup**:
   ```bash
   firebase login
   firebase init hosting
   ```
3. **Deploy**:
   ```bash
   firebase deploy
   ```

---

## 📱 Schritt 2: App auf dem Handy installieren

Nachdem die App online ist, installiere sie auf deinem Handy:

### 📱 Android (Chrome/Edge)

1. **Öffne Chrome oder Edge** auf deinem Android-Handy
2. **Navigiere zur App-URL** (z.B. `https://dein-username.github.io/waehrungsrechner-pwa/`)
3. **Warte, bis die Seite vollständig geladen ist**
4. **Tippe auf das Menü** (drei Punkte oben rechts) oder
   - Es erscheint automatisch eine Installationsanzeige
5. **Wähle "Zum Startbildschirm hinzufügen"** oder **"App installieren"**
6. **Bestätige die Installation** mit "Hinzufügen" oder "Installieren"
7. **Fertig!** Die App erscheint auf deinem Startbildschirm

### 🍎 iPhone/iPad (Safari)

1. **Öffne Safari** auf deinem iPhone/iPad
   - ⚠️ **Wichtig:** Nur Safari funktioniert für PWA-Installation auf iOS!
2. **Navigiere zur App-URL** (z.B. `https://dein-username.github.io/waehrungsrechner-pwa/`)
3. **Warte, bis die Seite vollständig geladen ist**
4. **Tippe auf das Teilen-Symbol** (Quadrat mit Pfeil nach oben) am unteren Bildschirmrand
5. **Scrolle nach unten** und tippe auf **"Zum Home-Bildschirm"**
6. **Passe den App-Namen an** (optional)
7. **Tippe auf "Hinzufügen"** (oben rechts)
8. **Fertig!** Die App erscheint auf deinem Home-Bildschirm

---

## ✅ Nach der Installation

Die App funktioniert jetzt:
- ✅ **Überall** - auch ohne Internet (mit gespeicherten Kursen)
- ✅ **Wie eine native App** - kein Browser sichtbar
- ✅ **Schnell** - direkt vom Startbildschirm erreichbar
- ✅ **Offline** - Service Worker cacht die App

---

## 🧪 Lokale Entwicklung (NUR für Tests)

Für die Entwicklung kannst du die App lokal testen:

1. **Starte einen lokalen Server**:
   ```bash
   python -m http.server 8080
   ```
2. **Öffne auf dem Handy** (im gleichen WLAN): `http://[COMPUTER-IP]:8080`
3. **Installiere die App** wie oben beschrieben

⚠️ **Hinweis:** Die lokale Version funktioniert nur, wenn:
- Dein Computer läuft
- Handy und Computer im gleichen WLAN sind
- Der Server aktiv ist

---

## 🐛 Problembehandlung

### Problem: "Zum Startbildschirm hinzufügen" ist ausgegraut

**Lösung:**
- Stelle sicher, dass die App über **HTTPS** erreichbar ist (nicht HTTP)
- Prüfe, ob alle Dateien vorhanden sind (manifest.json, sw.js, Icons)
- Leere den Browser-Cache und lade die Seite neu
- Prüfe die Browser-Konsole auf Fehler (F12 → Console)

### Problem: Service Worker wird nicht registriert

**Lösung:**
- Öffne die Browser-Entwicklertools (F12)
- Gehe zum "Application" Tab → Service Workers
- Prüfe auf Fehlermeldungen
- Stelle sicher, dass sw.js im Hauptverzeichnis liegt

### Problem: App lädt nicht offline

**Lösung:**
- Öffne die App einmal online, damit der Service Worker aktiviert wird
- Prüfe, ob der Service Worker registriert ist (F12 → Application → Service Workers)
- Leere den Cache und lade die Seite neu

### Problem: Installation funktioniert nicht auf iOS

**Lösung:**
- ⚠️ **Wichtig:** Auf iOS funktioniert die Installation **nur mit Safari**
- Andere Browser können PWAs nicht installieren
- Stelle sicher, dass du Safari verwendest

---

## 📋 Checkliste für Online-Hosting

- [ ] GitHub/Netlify/Vercel Konto erstellt
- [ ] Alle Dateien hochgeladen (index.html, app.js, styles.css, sw.js, manifest.json, icon-192.png, icon-512.png)
- [ ] App ist über HTTPS erreichbar
- [ ] App lädt ohne Fehler im Browser
- [ ] Service Worker ist registriert (prüfe in Browser-Entwicklertools)

---

## 🎉 Fertig!

Nach erfolgreicher Online-Installation:
- ✅ App funktioniert **überall** auf deinem Handy
- ✅ **Kein Computer nötig** - die App läuft auf dem Server
- ✅ **Offline verfügbar** - Service Worker cacht alles
- ✅ **App-ähnliche Erfahrung** - wie eine native App

Viel Erfolg! 🚀

