# Workout-Coach

Kurze Halte-Workouts (max. 15 Min.) mit Sprachansage, Kalender, Punkten, Challenges und Ranking.

**App:** https://challenge-your-friends.github.io/ (alt: https://bobby983983.github.io/workout-coach/)

## Backend einrichten (einmalig, ca. 3 Min.)
1. https://script.google.com → **Neues Projekt**, Name „Workout-Coach Backend“.
2. Inhalt von `Code.gs` aus diesem Repo komplett hineinkopieren, speichern.
3. Oben die Funktion **setup** auswählen → **Ausführen** → Berechtigungen erlauben
   („Erweitert“ → „Zu Workout-Coach Backend wechseln“ → Zulassen).
4. **Bereitstellen → Neue Bereitstellung → Typ: Web-App**
   - Ausführen als: **Ich**
   - Zugriff: **Jeder**
5. Die angezeigte **Web-App-URL** (endet auf `/exec`) an Claude schicken – wird in `index.html` bei `API_URL` eingetragen.

Daten liegen in der Google-Tabelle „Workout-Coach Daten“ im Drive des Besitzers.
