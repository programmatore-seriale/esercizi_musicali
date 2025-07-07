'''
In questo file definiamo i modelli dei nostri oggetti
'''
from pydantic import BaseModel

class Contact(BaseModel):
    id: int
    name: str
    phone: str
    email: str