# venv\Scripts\activate # per attivare l'ambiente virtuale su Windows
# python -m uvicorn main:app --reload #per avviare il server FastAPI in modalità di sviluppo
# uvicorn main:app --reload #per avviare il progetto
# http://127.0.0.1:8000/docs/ per vedere le API con swagger
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.contacts import router as contacts_router
from database.database import init_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # oppure ["http://localhost", "http://127.0.0.1"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contacts_router, prefix="/contacts")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Contacts API!"}

'''
Grazie a questa funzione, il database viene inizializzato all'avvio dell'applicazione.
E verrà salvato sul disco
'''
init_db()
'''###############################################################################'''