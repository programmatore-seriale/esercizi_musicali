# File: models.py
# Descrizione:
#   In questo file definiamo i modelli dei nostri oggetti.
#   I modelli sono le classi che rappresentano le tabelle del database.
#
# Importa:
#   - Column, Integer, String: classi di SQLAlchemy per definire le colonne
#   - Base: classe base per i modelli, definita in database.py
#   - database: modulo che contiene la classe Base e la funzione init_db
from sqlalchemy import Column, Integer, String
from database import Base
###########################################################################################

#########################################################################################################################
#Questions
###########################################################################################################################

# Class: Question
# Descrizione:
#       Modello che rappresenta una domanda nel database.
#
# Parametri:
# - id (int, primary_key=True, index=True): Identificatore unico della domanda.
# - composer_id (int): Identificatore del compositore associato alla domanda.
# - audio (str): Percorso del file audio associato alla domanda.
# - image (str): Percorso dell'immagine associata alla domanda.
# - correct (str): Risposta corretta alla domanda.
# - explanation (str): Spiegazione della risposta corretta.
class Question(Base):
    __tablename__ = "questions" #NOME DELLA TABELLA CHE ANDREMO A MODIFICARE!!!
    id = Column(Integer, primary_key=True, index=True)
    composer_id = Column(Integer)
    audio = Column(String)
    image = Column(String)
    correct = Column(String)
    explanation = Column(String)
#########################################################################################################################

#########################################################################################################################
#Composers
#########################################################################################################################

# Class: Composer
# Descrizione: Modello che rappresenta un compositore nel database.
#
# Attributi:
# - id (int, primary_key=True, index=True): Identificatore unico del compositore.
# - name (str, nullable=False): Nome del compositore.
# - category_id (int, nullable=False): Identificatore della categoria a cui appartiene il compositore.
# - image (str, nullable=False): Percorso dell'immagine associata al compositore.
class Composer(Base):
    __tablename__ = "composers" #NOME DELLA TABELLA CHE ANDREMO A MODIFICARE!!!
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, nullable=False)
    image = Column(String, nullable=False)
#########################################################################################################################

#########################################################################################################################
#Categories
#########################################################################################################################

# Class: Category
# Descrizione: Modello che rappresenta una categoria nel database.
# 
# Attributi:
# - id (int): Identificatore unico della categoria.
# - name (str): Nome della categoria.
class Category(Base):
    __tablename__ = "categories" #NOME DELLA TABELLA CHE ANDREMO A MODIFICARE!!!
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)