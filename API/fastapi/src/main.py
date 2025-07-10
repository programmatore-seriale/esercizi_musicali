# File: main.py
# Descrizione:
# File principale dell'applicazione FastAPI che gestisce le rotte e l'inizializzazione del database.
#
# Importa:
# - FastAPI: libreria principale che serve a creare e gestire le rotte dell'API.
# - CORSMiddleware: middleware per gestire le richieste CORS (Cross-Origin Resource Sharing).
# - router: oggetto router che definisce le rotte dell'API.
# - init_db: funzione per inizializzare il database, definita in database.py.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router as object_router
from database import init_db
##########################################################################################################
# Variable: app
# Descrizione: Oggetto FastAPI che ci permette di fare le richieste HTTP e di gestire le rotte.
#
# Parametri:
#   - title: Titolo dell'API, può essere cambiato a piacimento.
#   - version: Versione dell'API, può essere cambiata a piacimento.
#   - root_path: Non può essere utilizzato per cambiare l'indirizzo delle route.
#
# Utilizzo:
#   - app.add_middleware():
#       utilizza la funzione della classe FastAPI add_middleware per aggiungere il middleware CORS per gestire le richieste da origini diverse.
#       - Parametri:
#         - allow_origins: Lista di origini che possono fare richieste all'API.
#         - allow_credentials: Permette l'invio di credenziali (cookie, autorizzazioni, etc.) nelle richieste.
#         - allow_methods: Lista di metodi HTTP (GET, POST, PUT, DELETE, etc.) che possono essere utilizzati nelle richieste.
#         - allow_headers: Lista di headers che possono essere utilizzati nelle richieste.
#   - app.include_router():
#       questa riga di codice aggiunge tutte le rotte definite nell’oggetto object_router all’applicazione FastAPI principale tramite il metodo include_router
#       - Parametri:
#         - object_router.
#   - app.get("/"):
#       questa riga di codice "di prova" definisce una rotta GET per la root dell'API, la quale ritorna un messaggio di benvenuto.
app = FastAPI(
    title="Esercizi Musicali API",
    version="0.1.0",  # Versione dell'API, può essere cambiata a piacimento
    root_path="/quiz/0.1.0"  # Non può essere utilizzato per cambiare l'indirizzo delle route
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(object_router) #UNICA PARTE A CAMBIARE PER OGNI PROGETTO OCCHIO A object_router, DEVE ESSERE UGUALE A QUELLO DEFINITO IN routes/contacts.py. L'indirizzo completo è quindi http://127.0.0.1:8000/objects_prefix
@app.get("/")
def read_root():
    return {"message": "Welcome to Esercizi Musicali API"}
################################################################################################################################################################################################
# Function: init_db()
# Descrizione: Inizializza il database dell'applicazione utilizzando la funzione definita in database.py.
init_db()
###############################################################################