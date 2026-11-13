EINMALCODE-SYSTEM - SO WIRD ES EINGERICHTET

1. ORDNER BEI NETLIFY HOCHLADEN
   Lade den GESAMTEN Ordner (index.html, admin.html, netlify/, netlify.toml) bei Netlify hoch.
   Am besten: Neues Projekt aus diesem Ordner, oder in dein bestehendes Projekt die neuen Dateien dazu hochladen.
   Wichtig: Die Datei netlify.toml muss im Hauptordner liegen, der Ordner netlify/functions/ daneben.

2. ADMIN-PASSWORT SETZEN
   In Netlify: Site Settings > Environment variables > New variable
   Key: ADMIN_PASSWORD
   Value: dein Master-Passwort (z.B. ein langes Passwort, das nur du kennst)
   Dann: Deploys > Trigger deploy > Deploy site (damit die Functions das neue Passwort nehmen).

3. ABHÄNGIGKEIT PRÜFEN
   Die Functions benutzen @netlify/blobs. In Netlify geht das ohne extra Install, wenn die Functions als ESM laufen.
   Falls Netlify meckert: In Netlify > Site Settings > Functions > oder package.json mit "@netlify/blobs" anlegen.
   Einfachste Variante: Lege im Hauptordner eine Datei package.json an mit:
   { "type": "module", "dependencies": { "@netlify/blobs": "^9.0.0" } }

4. TESTEN
   - Öffne deine Seite normal: Da muss jetzt zuerst das Code-Feld kommen.
   - Öffne /admin (z.B. https://deine-seite.netlify.app/admin) - Master-Passwort eingeben - Neuen Code erstellen - z.B. PAAR-8472
   - Code auf der Hauptseite eingeben - Kalender muss aufgehen.
   - Auf Fertig tippen - Code ist jetzt verbraucht.
   - Gleichen Code nochmal eingeben - muss kommen: "Dieser Code wurde schon benutzt."
   - In /admin: Code wieder freigeben - dann geht er wieder.

5. ETSY-TEXT (Vorschlag)
   "Nach dem Kauf bekommst du per Etsy-Nachricht deinen persönlichen Einmalcode. Damit kannst du deinen Kalender einmalig bauen. Ein Code = ein Kalender."

WICHTIG:
- Der Geschenk-Link selbst ist weiterhin weiterleitbar, aber personalisiert (Name steht drin) und gesperrt (nur Öffnen).
- Der Bearbeitungs-Link ohne Code ist jetzt nutzlos - ohne frischen Code geht nichts auf.
- Wenn ein Käufer aus Versehen auf Fertig tippt, kannst du in /admin den Code wieder freigeben.
