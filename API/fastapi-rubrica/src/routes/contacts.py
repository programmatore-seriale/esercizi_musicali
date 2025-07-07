'''
In questo file definiamo le rotte per la gestione dei contatti
Essenzialmente sono delle funzioni che "si attivano" quando andiamo
al tal indirizzo web
'''
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
'''
Importiamo i modelli delle nostre domande
Notiamo come in entrambe ci siano .. semplicemente vuol dire che torniamo indietro di una cartella nel file system (questa cosa l'ho momentaneamente tolta)
'''
from models.contact import Contact #Recupera il modello contact dal file contact.py nella cartella models
from schemas.contact import ContactCreate, ContactResponse #Recupera le funzioni ConcactCreate e ContactResponse dal file contact.py nella cartella schemas
from database.database import SessionLocal
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
Questa riga apre il database e lo chiude quando non serve più
'''
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
'''################################################################################################################################'''

'''
Qui mettiamo le varie routes
Come già scritto sopra, esse avranno tutte la sintassi:
@router.post("address", attributes) ; @router.put("address", attributes) ; @router.get("address", attributes) ; @router.delete("address", attributes)
'''
@router.post("/", response_model=ContactResponse)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    new_contact = Contact(
        name=contact.name,
        phone=contact.phone,
        email=contact.email
    )
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@router.get("/", response_model=List[ContactResponse])
def get_contacts(db: Session = Depends(get_db)):
    return db.query(Contact).all()

@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(contact_id: int, contact: ContactCreate, db: Session = Depends(get_db)):
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    for key, value in contact.dict().items():
        setattr(db_contact, key, value)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.delete("/{contact_id}", response_model=dict)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(db_contact)
    db.commit()
    return {"message": "Contact deleted successfully"}