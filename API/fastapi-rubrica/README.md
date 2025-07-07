# FastAPI Rubrica

Questa è un'applicazione API per gestire una rubrica di contatti utilizzando FastAPI. L'API consente di eseguire operazioni CRUD (Create, Read, Update, Delete) sui contatti.

## Struttura del Progetto

Il progetto è organizzato nella seguente struttura:

```
fastapi-rubrica
├── src
│   ├── main.py          # Punto di ingresso dell'applicazione
│   ├── models           # Contiene i modelli dei dati
│   │   └── contact.py   # Modello per i contatti
│   ├── routes           # Contiene le rotte per le operazioni CRUD
│   │   └── contacts.py  # Rotte per gestire i contatti
│   ├── database         # Gestisce la connessione al database
│   │   └── database.py  # Funzioni per l'accesso ai dati
│   └── schemas          # Contiene gli schemi Pydantic
│       └── contact.py   # Schemi per la validazione dei dati
├── requirements.txt     # Dipendenze del progetto
└── README.md            # Documentazione del progetto
```

## Installazione

Per installare le dipendenze necessarie, eseguire il seguente comando:

```
pip install -r requirements.txt
```

## Avvio dell'API

Per avviare l'API, eseguire il seguente comando:

```
uvicorn src.main:app --reload
```

L'API sarà disponibile all'indirizzo `http://127.0.0.1:8000`.

## Utilizzo

L'API offre le seguenti funzionalità:

- **Creare un contatto**: `POST /contacts`
- **Ottenere tutti i contatti**: `GET /contacts`
- **Ottenere un contatto specifico**: `GET /contacts/{contact_id}`
- **Aggiornare un contatto**: `PUT /contacts/{contact_id}`
- **Eliminare un contatto**: `DELETE /contacts/{contact_id}`

## Contributi

I contributi sono benvenuti! Sentiti libero di aprire issue o pull request per migliorare il progetto.