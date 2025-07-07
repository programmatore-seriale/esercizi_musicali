'''
Questo file definisce schemi Pydantic per la validazione e serializzazione dei dati dei contatti in un'applicazione FastAPI.
Gli schemi fungono da contratti che definiscono la struttura dei dati in ingresso e in uscita dall'API.
'''
from pydantic import BaseModel

'''
1. ContactCreate - Schema per la creazione
Scopo: validare i dati quando si crea un nuovo contatto
Campi: nome, telefono ed email (tutti richiesti)
Uso: negli endpoint POST e PUT per creare contatti
Nota: non include l'id perché viene generato automaticamente dal sistema
'''
class ContactCreate(BaseModel):
    name: str
    phone: str
    email: str
'''##############################################################################################################'''
'''
2. ContactResponse - Schema per le risposte
Scopo: definire il formato dei dati restituiti dall'API
Campi: include anche l'id oltre ai dati del contatto
Uso: nelle risposte di GET, POST, PUT per restituire i contatti
orm_mode = True: permette la conversione automatica da oggetti ORM (database) a JSON
'''
class ContactResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str

    class Config:
        orm_mode = True
'''#####################################################################################################################'''