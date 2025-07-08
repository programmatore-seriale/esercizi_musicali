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
from models import * # serve anche questa riga, Paolino del futuro non la cancellare
import schemas  # Importa il file schemas.py come modulo
from schemas import * # serve anche questa riga, Paolino del futuro non la cancellare
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
'''
#########################################################################################################################
Questions
#########################################################################################################################
'''
object_prefix = "/questions" # definiamo il prefisso per le rotte delle domande

@router.post(object_prefix + "/", response_model=schemas.QuestionsResponse)
def create_question(question: schemas.QuestionsCreate, db: Session = Depends(get_db)):
    # Controllo che il composer_id esista
    composer = db.query(models.Composer).filter(models.Composer.id == question.composer_id).first()
    if not composer:
        raise HTTPException(status_code=400, detail="Il composer_id non esiste")

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

@router.get(object_prefix + "/by_composer/{composer_id}", response_model=List[schemas.QuestionsResponse])
def get_questions_by_composer(composer_id: int, db: Session = Depends(get_db)):
    return db.query(models.Question).filter(models.Question.composer_id == composer_id).all()

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

'''
#########################################################################################################################
Composers
#########################################################################################################################
'''
object_prefix = "/composers"  # definiamo il prefisso per le rotte dei compositori

@router.post(object_prefix + "/", response_model=ComposersResponse)
def create_composer(composer: ComposersCreate, db: Session = Depends(get_db)):
    new_composer = models.Composer(
        name=composer.name,
        category_id=2, # il category_id sarà sempre 2, in quanto indica la categoria creata dagli utenti
        image=composer.image
    )
    db.add(new_composer)
    db.commit()
    db.refresh(new_composer)
    return new_composer

@router.get(object_prefix + "/", response_model=List[ComposersResponse])
def get_composers(db: Session = Depends(get_db)):
    return db.query(models.Composer).all()

@router.get(object_prefix + "/{composer_id}", response_model=ComposersResponse)
def get_composer(composer_id: int, db: Session = Depends(get_db)):
    composer = db.query(models.Composer).filter(models.Composer.id == composer_id).first()
    if not composer:
        raise HTTPException(status_code=404, detail="Composer not found")
    return composer

@router.get(object_prefix + "/by_category/{category_id}", response_model=List[schemas.ComposersResponse])
def get_composers_by_category(category_id: int, db: Session = Depends(get_db)):
    return db.query(models.Composer).filter(models.Composer.category_id == category_id).all()

@router.put(object_prefix + "/{composer_id}", response_model=ComposersResponse)
def update_composer(composer_id: int, composer: ComposersCreate, db: Session = Depends(get_db)):
    db_composer = db.query(models.Composer).filter(models.Composer.id == composer_id).first()
    if not db_composer:
        raise HTTPException(status_code=404, detail="Composer not found")
    for key, value in composer.dict().items():
        setattr(db_composer, key, value)
    db.commit()
    db.refresh(db_composer)
    return db_composer

@router.delete(object_prefix + "/{composer_id}", response_model=dict)
def delete_composer(composer_id: int, db: Session = Depends(get_db)):
    db_composer = db.query(models.Composer).filter(models.Composer.id == composer_id).first()
    if not db_composer:
        raise HTTPException(status_code=404, detail="Composer not found")
    db.delete(db_composer)
    db.commit()
    return {"message": "Composer deleted successfully"}

'''
#########################################################################################################################
Categories
#########################################################################################################################
'''
object_prefix = "/categories"  # definiamo il prefisso per le rotte delle categorie

@router.post(object_prefix + "/", response_model=schemas.CategoriesResponse)
def create_category(category: schemas.CategoriesCreate, db: Session = Depends(get_db)):
    new_category = models.Category(
        name=category.name
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get(object_prefix + "/", response_model=List[schemas.CategoriesResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.get(object_prefix + "/{category_id}", response_model=schemas.CategoriesResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put(object_prefix + "/{category_id}", response_model=schemas.CategoriesResponse)
def update_category(category_id: int, category: schemas.CategoriesCreate, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in category.dict().items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete(object_prefix + "/{category_id}", response_model=dict)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}

# tutta la parte che segue è commentata in quanto serve a manipolare oggetti non ancora implementati
'''
object_prefix = "/pending"  
@router.post(object_prefix + "/", response_model=ObjectResponse)
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