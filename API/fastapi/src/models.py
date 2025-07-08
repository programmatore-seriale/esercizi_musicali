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
class Category(Base):
    __tablename__ = "categories" #NOME DELLA TABELLA CHE ANDREMO A MODIFICARE!!!
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)