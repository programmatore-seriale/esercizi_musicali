'''
In questo file definiamo i modelli dei nostri oggetti
'''
from sqlalchemy import Column, Integer, String
from database import Base

#ricordiamo gli attributi SQL 
#primary_key=True indica che l'id è la chiave primaria della tabella
#index=True fa sì che l'id si crei automaticamente
#nullable=False indica che il campo non può essere vuoto
'''
#########################################################################################################################
Questions
#########################################################################################################################
'''
"""
    Class: Question
    Description:
        Modello che rappresenta una domanda nel database.
    Attributes:
        id (int): Identificatore unico della domanda.
        composer_id (int): Identificatore del compositore associato alla domanda.
        audio (str): Percorso del file audio associato alla domanda.
        image (str): Percorso dell'immagine associata alla domanda.
        correct (str): Risposta corretta alla domanda.
        explanation (str): Spiegazione della risposta corretta.
"""
class Question(Base):
    __tablename__ = "questions" #NOME DELLA TABELLA CHE ANDREMO A MODIFICARE!!!
    id = Column(Integer, primary_key=True, index=True)
    composer_id = Column(Integer)
    audio = Column(String)
    image = Column(String)
    correct = Column(String)
    explanation = Column(String)
'''
#########################################################################################################################
Composers
#########################################################################################################################
'''
"""
    Class: Composer
    Description:
        Modello che rappresenta un compositore nel database.
    Attributes:
        id (int): Identificatore unico del compositore.
        name (str): Nome del compositore.
        category_id (int): Identificatore della categoria a cui appartiene il compositore.
        image (str): Percorso dell'immagine associata al compositore.
"""
class Composer(Base):
    __tablename__ = "composers" #NOME DELLA TABELLA CHE ANDREMO A MODIFICARE!!!
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, nullable=False)
    image = Column(String, nullable=False)
'''
#########################################################################################################################
Categories
#########################################################################################################################
'''
"""
    Class: Category
    Description:
        Modello che rappresenta una categoria nel database.
    Attributes:
        id (int): Identificatore unico della categoria.
        name (str): Nome della categoria.
"""
class Category(Base):
    __tablename__ = "categories" #NOME DELLA TABELLA CHE ANDREMO A MODIFICARE!!!
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)