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
import models  # Importa il file models.py come modulo
import schemas  # Importa il file schemas.py come modulo
from database import SessionLocal
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
object_prefix = "/questions" # definiamo il prefisso per le rotte delle domande

@router.post(object_prefix + "/", response_model=schemas.QuestionsResponse)
def create_question(question: schemas.QuestionsCreate, db: Session = Depends(get_db)):
    print(question)
    new_question = models.Question(
        composer_id=question.composer_id,
        audio=question.audio,
        image=question.image,
        correct=question.correct,
        explanation=question.explanation
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question

@router.get(object_prefix + "/", response_model=List[schemas.QuestionsResponse])
def get_questions(db: Session = Depends(get_db)):
    return db.query(models.Question).all()

@router.get(object_prefix + "/{question_id}", response_model=schemas.QuestionsResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.put(object_prefix + "/{question_id}", response_model=schemas.QuestionsResponse)
def update_question(question_id: int, question: schemas.QuestionsCreate, db: Session = Depends(get_db)):
    db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    for key, value in question.dict().items():
        setattr(db_question, key, value)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete(object_prefix + "/{question_id}", response_model=dict)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(db_question)
    db.commit()
    return {"message": "Question deleted successfully"}

object_prefix = "/pending"  # tutta la parte che segue è commentata in quanto serve a manipolare oggetti non ancora implementati
'''
@router.post(object_prefix + "/", response_model=ObjcetResponse)
def create_object(object: ObjectCreate, db: Session = Depends(get_db)):
    new_object = Object(
        #qua chiaramente dipende dai parametri che abbiamo definito nel modello Object
        # ad esempio, se il modello Object ha i campi name, phone ed email,
        # possiamo creare un nuovo oggetto Object con questi campi
        name=object.name,
        phone=object.phone,
        email=object.email
    )
    db.add(new_object)
    db.commit()
    db.refresh(new_object)
    return new_object

@router.get(object_prefix + "/", response_model=List[ObjectResponse])
def get_objects(db: Session = Depends(get_db)):
    return db.query(Object).all()

@router.get(object_prefix + "/{object_id}", response_model=ObjectResponse)
def get_object(object_id: int, db: Session = Depends(get_db)):
    object = db.query(Object).filter(Object.id == object_id).first()
    if not object:
        raise HTTPException(status_code=404, detail="Object not found")
    return object

@router.put(object_prefix + "/{object_id}", response_model=ObjectResponse)
def update_object(object_id: int, object: ObjectCreate, db: Session = Depends(get_db)):
    db_object = db.query(Object).filter(Object.id == object_id).first()
    if not db_object:
        raise HTTPException(status_code=404, detail="Object not found")
    for key, value in object.dict().items():
        setattr(db_object, key, value)
    db.commit()
    db.refresh(db_object)
    return db_object

@router.delete(object_prefix + "/{object_id}", response_model=dict)
def delete_object(object_id: int, db: Session = Depends(get_db)):
    db_object = db.query(Object).filter(Object.id == object_id).first()
    if not db_object:
        raise HTTPException(status_code=404, detail="Object not found")
    db.delete(db_object)
    db.commit()
    return {"message": "Object deleted successfully"}
'''