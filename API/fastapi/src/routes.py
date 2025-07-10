# File: routes.py
# Descrizione:
#   In questo file definiamo le rotte per la gestione delle domande, dei compositori e delle categorie.
#   Le rotte sono definite utilizzando l'oggetto APIRouter di FastAPI.
#   Ogni rotta è associata a una funzione che gestisce le richieste HTTP (GET, POST, PUT, DELETE).
#
# Importa:
#   - APIRouter: classe di FastAPI per definire le rotte dell'API.
#   - HTTPException: classe di FastAPI per gestire le eccezioni HTTP.
#   - Depends: funzione di FastAPI per gestire le dipendenze delle rotte.
#   - Session: classe di SQLAlchemy per gestire le sessioni del database.
#   - List: tipo di Python per definire liste.
#   - I modelli e gli schemi definiti nei file models.py e schemas.py
#   - La sessione del database definita in database.py.
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import models  # Importa il file models.py come modulo
from models import * # serve anche questa riga, Paolino del futuro non la cancellare
import schemas  # Importa il file schemas.py come modulo
from schemas import * # serve anche questa riga, Paolino del futuro non la cancellare
from database import SessionLocal
#################################################################################################################
# Variable: router
# Descrizione: Oggetto APIRouter che ci permette di definire le rotte.
#
# Standard definizione delle rotte::
# - @router.post("address", attributes)
# - @router.put("address", attributes)
# - @router.get("address", attributes)
# - @router.delete("address", attributes)
router = APIRouter()
######################################################################################################################
# Function: get_db()
# Descrizione: Funzione che crea una sessione del database e la chiude quando non serve più.
# Utilizza la classe SessionLocal definita in database.py per creare una sessione del database.
# La funzione viene utilizzata come dipendenza nelle rotte per ottenere una sessione del database.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
################################################################################################################################

#########################################################################################################################
#Questions
#########################################################################################################################

# Variabile: object_prefix
# Descrizione: Definisce il prefisso per le rotte delle domande.
# Utilizzato per creare rotte come "/questions/", "/questions/{question_id}", etc.
# A seconda degli oggetti per cui stiamo creando le rotte, il prefisso cambierà nei valori
# - "/questions"
# - "/composers"
# - "/categories"
object_prefix = "/questions" # definiamo il prefisso per le rotte delle domande
##########################################################################################################################
# Function: router.post("questions/")
# Descrizione: Crea una nuova domanda nel database.
# Utilizza il modello QuestionsCreate definito in schemas.py per validare i dati della richiesta.
# Controlla che il composer_id esista nel database prima di creare la domanda.
# Se il composer_id non esiste, solleva un'eccezione HTTP 400.
# Se la creazione della domanda ha successo, restituisce la domanda creata come risposta.
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
##########################################################################################################################
# Function: router.get("questions/")
# Descrizione: Recupera tutte le domande dal database.
# Utilizza il modello QuestionsResponse definito in schemas.py per restituire le domande come risposta.
# Se non ci sono domande nel database, restituisce una lista vuota.
@router.get(object_prefix + "/", response_model=List[schemas.QuestionsResponse])
def get_questions(db: Session = Depends(get_db)):
    return db.query(models.Question).all()
##########################################################################################################################
# Function: router.get("questions/{question_id}")
# Descrizione: Recupera una domanda specifica dal database utilizzando il suo ID.
# Utilizza il modello QuestionsResponse definito in schemas.py per restituire la domanda come risposta.
# Se la domanda non esiste, solleva un'eccezione HTTP 404.
# Se la domanda esiste, restituisce la domanda come risposta.
# Utilizza il parametro question_id per filtrare la domanda nel database.
@router.get(object_prefix + "/{question_id}", response_model=schemas.QuestionsResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question
##########################################################################################################################
# Function: router.get("questions/by_composer/{composer_id}")
# Descrizione: Recupera tutte le domande associate a un compositore specifico utilizzando il suo ID.
# Utilizza il modello QuestionsResponse definito in schemas.py per restituire le domande come risposta.
# Se non ci sono domande associate al compositore, restituisce una lista vuota.
# Utilizza il parametro composer_id per filtrare le domande nel database.
@router.get(object_prefix + "/by_composer/{composer_id}", response_model=List[schemas.QuestionsResponse])
def get_questions_by_composer(composer_id: int, db: Session = Depends(get_db)):
    return db.query(models.Question).filter(models.Question.composer_id == composer_id).all()
##########################################################################################################################
# Function: router.put("questions/{question_id}")
# Descrizione: Aggiorna una domanda esistente nel database utilizzando il suo ID.
# Utilizza il modello QuestionsCreate definito in schemas.py per validare i dati della richiesta
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
##########################################################################################################################
# Function: router.delete("questions/{question_id}")
# Descrizione: Elimina una domanda esistente dal database utilizzando il suo ID.
# Se la domanda non esiste, solleva un'eccezione HTTP 404.
# Se la domanda esiste, la elimina dal database e restituisce un messaggio di successo.
# Utilizza il parametro question_id per filtrare la domanda nel database.
@router.delete(object_prefix + "/{question_id}", response_model=dict)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(db_question)
    db.commit()
    return {"message": "Question deleted successfully"}
##########################################################################################################################

#########################################################################################################################
#Composers
#########################################################################################################################

object_prefix = "/composers"  # definiamo il prefisso per le rotte dei compositori
# Function: router.post("composers/")
# Descrizione: Crea un nuovo compositore nel database.
# Utilizza il modello ComposersCreate definito in schemas.py per validare i dati della richiesta.
# Il category_id è impostato a 2, in quanto indica la categoria creata dagli utenti.
# Se la creazione del compositore ha successo, restituisce il compositore creato come risposta.
# Utilizza il parametro db per ottenere una sessione del database tramite la funzione get_db.
# Se il compositore viene creato con successo, restituisce il compositore creato come risposta.
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
##########################################################################################################################
# Function: router.get("composers/")
# Descrizione: Recupera tutti i compositori dal database.
# Utilizza il modello ComposersResponse definito in schemas.py per restituire i compositori come risposta.
# Se non ci sono compositori nel database, restituisce una lista vuota.
# Utilizza il parametro db per ottenere una sessione del database tramite la funzione get_db.
# Se non ci sono compositori nel database, restituisce una lista vuota.
# Se ci sono compositori nel database, restituisce tutti i compositori come risposta.
@router.get(object_prefix + "/", response_model=List[ComposersResponse])
def get_composers(db: Session = Depends(get_db)):
    return db.query(models.Composer).all()
##########################################################################################################################
# Function: router.get("composers/{composer_id}")
# Descrizione: Recupera un compositore specifico dal database utilizzando il suo ID.
# Utilizza il modello ComposersResponse definito in schemas.py per restituire il compositore come risposta.
# Se il compositore non esiste, solleva un'eccezione HTTP 404.
# Utilizza il parametro composer_id per filtrare il compositore nel database.
# Se il compositore esiste, restituisce il compositore come risposta.
@router.get(object_prefix + "/{composer_id}", response_model=ComposersResponse)
def get_composer(composer_id: int, db: Session = Depends(get_db)):
    composer = db.query(models.Composer).filter(models.Composer.id == composer_id).first()
    if not composer:
        raise HTTPException(status_code=404, detail="Composer not found")
    return composer
##########################################################################################################################
# Function: router.get("composers/by_category/{category_id}")
# Descrizione: Recupera tutti i compositori associati a una categoria specifica utilizzando il suo ID.
# Utilizza il modello ComposersResponse definito in schemas.py per restituire i compositori come risposta.
# Se non ci sono compositori associati alla categoria, restituisce una lista vuota.
# Utilizza il parametro category_id per filtrare i compositori nel database.
# Se non ci sono compositori associati alla categoria, restituisce una lista vuota.
# Se ci sono compositori associati alla categoria, restituisce tutti i compositori come risposta.
@router.get(object_prefix + "/by_category/{category_id}", response_model=List[schemas.ComposersResponse])
def get_composers_by_category(category_id: int, db: Session = Depends(get_db)):
    return db.query(models.Composer).filter(models.Composer.category_id == category_id).all()
##########################################################################################################################
# Function: router.put("composers/{composer_id}")
# Descrizione: Aggiorna un compositore esistente nel database utilizzando il suo ID.
# Utilizza il modello ComposersCreate definito in schemas.py per validare i dati della richiesta.
# Se il compositore non esiste, solleva un'eccezione HTTP 404.
# Se il compositore esiste, aggiorna i suoi attributi con i valori forniti nella richiesta.
# Dopo l'aggiornamento, restituisce il compositore aggiornato come risposta.
# Utilizza il parametro composer_id per filtrare il compositore nel database.
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
##########################################################################################################################
# Function: router.delete("composers/{composer_id}")
# Descrizione: Elimina un compositore esistente dal database utilizzando il suo ID.
# Se il compositore non esiste, solleva un'eccezione HTTP 404.
# Se il compositore esiste, lo elimina dal database e restituisce un messaggio di successo.
# Utilizza il parametro composer_id per filtrare il compositore nel database.   
@router.delete(object_prefix + "/{composer_id}", response_model=dict)
def delete_composer(composer_id: int, db: Session = Depends(get_db)):
    db_composer = db.query(models.Composer).filter(models.Composer.id == composer_id).first()
    if not db_composer:
        raise HTTPException(status_code=404, detail="Composer not found")
    db.delete(db_composer)
    db.commit()
    return {"message": "Composer deleted successfully"}
##########################################################################################################################

#########################################################################################################################
#Categories
#########################################################################################################################

object_prefix = "/categories"  # definiamo il prefisso per le rotte delle categorie
# Function: router.post("categories/")
# Descrizione: Crea una nuova categoria nel database.
# Utilizza il modello CategoriesCreate definito in schemas.py per validare i dati della richiesta.
# Se la creazione della categoria ha successo, restituisce la categoria creata come risposta.
@router.post(object_prefix + "/", response_model=schemas.CategoriesResponse)
def create_category(category: schemas.CategoriesCreate, db: Session = Depends(get_db)):
    new_category = models.Category(
        name=category.name
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category
##########################################################################################################################
# Function: router.get("categories/")
# Descrizione: Recupera tutte le categorie dal database.
# Utilizza il modello CategoriesResponse definito in schemas.py per restituire le categorie come risposta.
# Se non ci sono categorie nel database, restituisce una lista vuota.
# Utilizza il parametro db per ottenere una sessione del database tramite la funzione get_db.
# Se non ci sono categorie nel database, restituisce una lista vuota.
# Se ci sono categorie nel database, restituisce tutte le categorie come risposta.
@router.get(object_prefix + "/", response_model=List[schemas.CategoriesResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()
##########################################################################################################################
# Function: router.get("categories/{category_id}")
# Descrizione: Recupera una categoria specifica dal database utilizzando il suo ID.
# Utilizza il modello CategoriesResponse definito in schemas.py per restituire la categoria come risposta.
# Se la categoria non esiste, solleva un'eccezione HTTP 404.
# Utilizza il parametro category_id per filtrare la categoria nel database.
# Se la categoria esiste, restituisce la categoria come risposta.
@router.get(object_prefix + "/{category_id}", response_model=schemas.CategoriesResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category
##########################################################################################################################
# Function: router.put("categories/{category_id}")
# Descrizione: Aggiorna una categoria esistente nel database utilizzando il suo ID.
# Utilizza il modello CategoriesCreate definito in schemas.py per validare i dati della richiesta.
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
##########################################################################################################################
# Function: router.delete("categories/{category_id}")
# Descrizione: Elimina una categoria esistente dal database utilizzando il suo ID.
# Se la categoria non esiste, solleva un'eccezione HTTP 404.
# Se la categoria esiste, la elimina dal database e restituisce un messaggio di successo.
# Utilizza il parametro category_id per filtrare la categoria nel database.
@router.delete(object_prefix + "/{category_id}", response_model=dict)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}
##########################################################################################################################
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