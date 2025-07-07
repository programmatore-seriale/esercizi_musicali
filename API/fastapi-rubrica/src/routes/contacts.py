'''
In questo file definiamo le rotte per la gestione dei contatti
Essenzialmente sono delle funzioni che "si attivano" quando andiamo
al tal indirizzo web
'''
from fastapi import APIRouter, HTTPException
from typing import List
'''
Importiamo i modelli delle nostre domande
Notiamo come in entrambe ci siano .. semplicemente vuol dire che torniamo indietro di una cartella nel file system (questa cosa l'ho momentaneamente tolta)
'''
from models.contact import Contact #Recupera il modello contact dal file contact.py nella cartella models
from schemas.contact import ContactCreate, ContactResponse #Recupera le funzioni ConcactCreate e ContactResponse dal file contact.py nella cartella schemas
'''#################################################################################################################'''

'''
Definiamo l'oggetto APIRouter
Esso è fondamentale per qualunque cosa noi vogliamo fare.
In quanto tutte le rotte verranno definite come:
@router.post("address", attributes) ; @router.put("address", attributes) ; @router.get("address", attributes) ; @router.delete("address", attributes)
'''
router = APIRouter()
'''######################################################################################################################'''

'''
Questa riga di codice Python crea un dizionario vuoto chiamato contacts_db che fungerà da database temporaneo in memoria per memorizzare i contatti.
'''
# In-memory storage for contacts
contacts_db = {}
'''################################################################################################################################'''

'''
Qui mettiamo le varie routes
Come già scritto sopra, esse avranno tutte la sintassi:
@router.post("address", attributes) ; @router.put("address", attributes) ; @router.get("address", attributes) ; @router.delete("address", attributes)
'''
@router.post("/", response_model=ContactResponse)
def create_contact(contact: ContactCreate):
    contact_id = len(contacts_db) + 1
    new_contact = Contact(id=contact_id, **contact.dict())
    contacts_db[contact_id] = new_contact
    return new_contact

@router.get("/", response_model=List[ContactResponse])
def get_contacts():
    return list(contacts_db.values())

@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(contact_id: int):
    contact = contacts_db.get(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(contact_id: int, contact: ContactCreate):
    if contact_id not in contacts_db:
        raise HTTPException(status_code=404, detail="Contact not found")
    updated_contact = Contact(id=contact_id, **contact.dict())
    contacts_db[contact_id] = updated_contact
    return updated_contact

@router.delete("/{contact_id}", response_model=dict)
def delete_contact(contact_id: int):
    if contact_id not in contacts_db:
        raise HTTPException(status_code=404, detail="Contact not found")
    del contacts_db[contact_id]
    return {"message": "Contact deleted successfully"}