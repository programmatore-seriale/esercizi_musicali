# venv\Scripts\activate # per attivare l'ambiente virtuale su Windows
# python -m uvicorn main:app --reload #per avviare il server FastAPI in modalità di sviluppo
# uvicorn main:app --reload #per avviare il progetto
# http://127.0.0.1:8000/docs/ per vedere le API con swagger
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router as object_router
from database import init_db

'''
Oggetto FastAPI che ci permette di fare le richieste HTTP e di gestire le rotte.
'''
app = FastAPI(
    title="Esercizi Musicali API",
    version="0.1.0",  # Versione dell'API, può essere cambiata a piacimento
    root_path="/quiz/0.1.0"  # Non può essere utilizzato per cambiare l'indirizzo delle route
)
'''################################################################################'''

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # oppure ["http://localhost", "http://127.0.0.1"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

'''UNICA PARTE A CAMBIARE PER OGNI PROGETTO
OCCHIO A object_router, DEVE ESSERE UGUALE A QUELLO DEFINITO IN routes/contacts.py
'''
# L'indirizzo completo è quindi http://127.0.0.1:8000/objects_prefix
app.include_router(object_router)
'''################################################################################'''

@app.get("/")
def read_root():
    return {"message": "Welcome to Esercizi Musicali API"}

'''
Grazie a questa funzione, il database viene inizializzato all'avvio dell'applicazione.
E verrà salvato sul disco
'''
init_db()
'''###############################################################################'''