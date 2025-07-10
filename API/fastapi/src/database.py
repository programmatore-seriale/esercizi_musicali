# File: database.py
# Descrizione:
#   Configura la connessione al database SQLite e prepara le sessioni per
#   le operazioni CRUD (Create, Read, Update, Delete) sulle tabelle.
#
# Importa: SQLAlchemy
#
#   - create_engine: crea la connessione al database
#   - declarative_base: classe base per i modelli (tabelle)
#   - sessionmaker: gestisce le sessioni per le query
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
###########################################################################################
# Variable: DATABASE_URL
# Descrizione:
#   Prima variabile di configurazione del database.
#
#   URL di connessione al database SQLite.
#
# Vedi:
#   engine
DATABASE_URL = "sqlite:///./questions.db" #NOME DEL DATABASE DA MANIPOLARE!!!!!!
# Variable: engine
# Descrizione:
#   Seconda variabile di configurazione del database.
#
#   Oggetto SQLAlchemy che gestisce la connessione al database.
#
#   Utilizzando SQLite "apriamo" il file "questions.db", presente nella directory corrente.
#
# Parametri:
#   - DATABASE_URL: URL di connessione al database.
#   - connect_args: quando impostato a False permette l'accesso da thread multipli (necessario per FastAPI)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# Variable: SessionLocal
# Descrizione:
#   Terza variabile di configurazione del database.
#
#   Gestisce le sessioni per le operazioni CRUD (Create, Read, Update, Delete)
#   sulle tabelle del database.
#
#   Utilizza sessionmaker di SQLAlchemy per creare sessioni.
#
#   Parametri sessionmaker::
#     - autocommit: False, significa che le modifiche devono essere confermate manualmente
#     - autoflush: False, significa che non si esegue automaticamente il flush delle modifiche
#     - bind: engine, associa la sessione al motore del database creato sopra
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Class: Base
# Descrizione:
#   Classe Base da cui erediteranno tutti i modelli (tabelle)
#
#   Creata tramite il costruttore declarative_base() di SQLAlchemy.
#
# Classi Figlie::
#   - Category
#   - Question
#   - Composer
Base = declarative_base()
#################################################################################################
# Function: init_db()
# Description:
#   Inizializza il database dell'applicazione.
#   Importa i modelli delle tabelle e crea tutte le tabelle definite nei modelli,
#   se non esistono già nel database. Questa funzione va chiamata all'avvio
#   dell'applicazione per assicurarsi che la struttura del database sia pronta.
def init_db():
    import models  # Importiamo i modelli per manipolare le tabelle
    Base.metadata.create_all(bind=engine)
####################################################################################