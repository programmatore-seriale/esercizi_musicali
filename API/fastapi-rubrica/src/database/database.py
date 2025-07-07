'''
Questo file prepara tutto il necessario per gestire un database SQLite
con una tabella contacts in un'applicazione FastAPI.
'''
'''
Importiamo le librerie necessarie per la gestione del database
create_engine: crea la connessione al database
declarative_base: classe base per definire i modelli (tabelle)
sessionmaker: gestisce le sessioni per le query
'''
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
'''#####################################################################'''

'''
Configurazione del database
Usa SQLite come database (file contacts.db nella directory corrente)
check_same_thread: False permette l'accesso da thread multipli (necessario per FastAPI)
'''
DATABASE_URL = "sqlite:///./contacts.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
'''###############################################################################'''
'''
Configurazione della sessione del database
sessionmaker: le modifiche devono essere confermate manualmente
autocommit: non salva automaticamente ad ogni operazione
autoflush: collega al database configurato sopra
'''
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
''''##########################################################################'''

'''
Base per i modelli del database
Classe base da cui erediteranno tutti i modelli (tabelle)
'''
Base = declarative_base()
'''###############################################################################'''

'''
Inizializza il database
Importa i modelli (definizioni delle tabelle)
Crea tutte le tabelle nel database se non esistono già
'''
def init_db():
    import models.contact  # Import models to create tables
    Base.metadata.create_all(bind=engine)
'''###############################################################################'''