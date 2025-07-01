# VitaApp - Gestione della Vita da Single

VitaApp è un'applicazione completa per gestire tutti gli aspetti della vita da single in modo organizzato ed efficiente. Dall'amministrazione delle finanze personali alla pianificazione di eventi e alla gestione di documenti importanti, VitaApp è il tuo assistente personale digitale.

## 🚀 Funzionalità Principali

- **Gestione Finanziaria:** Tieni traccia delle tue spese, gestisci i budget e monitora i tuoi investimenti.
- **Scadenze e Appuntamenti:** Non dimenticare mai una scadenza importante o un appuntamento.
- **Archivio Documenti:** Conserva in modo sicuro tutti i tuoi documenti personali, come passaporti, patenti e certificati.
- **Gestione Proprietà e Veicoli:** Amministra le tue proprietà immobiliari e i tuoi veicoli, incluse manutenzioni e assicurazioni.
- **Pianificazione Eventi e Viaggi:** Organizza i tuoi eventi sociali, i viaggi e le prenotazioni.
- **Salute e Benessere:** Tieni traccia dei tuoi allenamenti, delle diete e degli appuntamenti medici.

## 🛠️ Struttura del Progetto

Il progetto è suddiviso in due componenti principali: `frontend` e `backend`.

- **`frontend/`**: Contiene l'applicazione client sviluppata con React e Vite. Questa è l'interfaccia utente con cui interagirai.
- **`backend/`**: Include il server Node.js che gestisce la logica di business e l'interazione con i file di dati JSON.
- **`data/`**: Memorizza i dati dell'applicazione in formato JSON. Ogni file corrisponde a una diversa categoria di informazioni.

## ⚙️ Installazione

Per avviare il progetto, è necessario installare le dipendenze sia per il frontend che per il backend.

1. **Clona il repository:**
   ```bash
   git clone https://github.com/tuo-username/vitadasingle.git
   cd vitadasingle
   ```

2. **Installa le dipendenze del backend:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Installa le dipendenze del frontend:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## ▶️ Esecuzione

Per eseguire l'applicazione, devi avviare sia il server backend che l'applicazione frontend.

1. **Avvia il backend:**
   ```bash
   npm run start-backend
   ```

2. **Avvia il frontend:**
   ```bash
   npm run start-frontend
   ```

Una volta avviati entrambi i servizi, puoi accedere all'applicazione aprendo il tuo browser all'indirizzo fornito dal server di sviluppo Vite (solitamente `http://localhost:5173`).

## 🤝 Contribuire

Se desideri contribuire al progetto, sei il benvenuto! Apri una issue per discutere di nuove funzionalità o correzioni di bug, oppure invia una pull request con le tue modifiche.