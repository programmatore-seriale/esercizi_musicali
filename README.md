# Esercizi Musicali

## Indice

- [Descrizione del progetto](#descrizione-del-progetto)
- [Struttura della repository](#struttura-della-repository)
- [Installazione e avvio](#installazione-e-avvio)
- [Struttura delle API](#struttura-delle-api)
- [Frontend](#frontend)
- [Accessibilità](#accessibilità)
- [Personalizzazione](#personalizzazione)
- [Testing](#testing)
- [Contributi](#contributi)
- [Licenza](#licenza)

---

## Descrizione del progetto

Esercizi Musicali è una piattaforma web per quiz musicali, con gestione di compositori, domande e risposte.  
Il backend è realizzato con **FastAPI** (Python), il frontend con **HTML, CSS e JavaScript**.  
Il progetto è pensato per essere accessibile e facilmente estendibile.

---

## Struttura della repository
```
C:.
│   2048.html
│   2048.js
│   index.html
│   memory.html
│   memory.js
│   README.md
│   snake.html
│   snake.js
│   style.css
│
├───API
│   ├───fastapi
│       └───src
│               database.py
│               main.py
│               models.py
│               questions.db
│               routes.py
│               schemas.py
│                 
└───quiz
        home.html
        home.js
        questions.db
        quiz.html
        quiz.js
        user_questions.html
        user_questions.js
```

---

## Installazione e avvio

### Requisiti

- Python 3.8+
- Node.js (opzionale, solo se usi strumenti JS avanzati)
- XAMPP o altro server locale per il frontend

### Backend (FastAPI)

1. Vai nella cartella `API/fastapi/src/`
2. Installa le dipendenze:
    ```bash
    pip install fastapi uvicorn sqlalchemy
    ```
3. Avvia il server:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend

- Apri `quiz/home.html` o `quiz/quiz.html` tramite il server locale (es: XAMPP su `localhost`).

---

## Struttura delle API

- Tutte le API sono versionate e organizzate per risorsa.
- Esempi di endpoint:
    - `GET /composers/`
    - `POST /composers/`
    - `DELETE /composers/{id}`
    - `GET /questions/by_composer/{composer_id}`
    - `POST /questions/`
- Documentazione interattiva disponibile su `/docs` (Swagger UI) quando il server FastAPI è attivo.

---

## Frontend

- **home.html**: pagina principale, mostra i compositori e permette di accedere ai quiz.
- **quiz.html**: pagina del quiz musicale, con domande, risposte e punteggio.
- **user_questions.html**: gestione compositori e domande personalizzate.
- **style.css**: stile globale, con attenzione all’accessibilità e alla responsività.

---

## Accessibilità

- Tutte le immagini hanno attributo `alt` descrittivo.
- I bottoni con icone hanno testo alternativo tramite `.sr-only`.
- Le label sono sempre associate agli input.
- Le risposte e i messaggi sono accessibili agli screen reader (`aria-label`, `aria-live`).
- Il progetto segue le linee guida WCAG per i contenuti non testuali.

---

## Personalizzazione

- Puoi aggiungere nuovi compositori e domande tramite l’interfaccia web.
- Per modificare le API, lavora sui file Python in `API/fastapi/src/`.
- Per modificare l’aspetto, lavora su `style.css`.

---

## Testing

- Test manuali tramite l’interfaccia web e Swagger UI.
- (Se presenti) test automatici Python in `API/fastapi/tests/`.

---

## Contributi

Contributi, segnalazioni di bug e suggerimenti sono benvenuti!  
Apri una issue o una pull request su GitHub.

---

## Licenza

Specificare qui la licenza del progetto (MIT, GPL, ecc.).

---
