'''
In questo file definiamo i modelli dei nostri oggetti
'''
from sqlalchemy import Column, Integer, String
from database.database import Base

class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)