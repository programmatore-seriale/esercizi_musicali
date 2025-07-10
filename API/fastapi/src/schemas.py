# File: schemas.py
# Descrizione:
#   Questo file definisce gli schemi Pydantic per la validazione e serializzazione
#   dei dati relativi a domande, compositori e categorie in un'applicazione FastAPI.
#   Gli schemi fungono da contratti che definiscono la struttura dei dati in ingresso e in uscita dall'API.
# 
# Importa:
#   - BaseModel: classe base di Pydantic per definire gli schemi
from pydantic import BaseModel


#########################################################################################################################
#Questions
#########################################################################################################################

# Class: QuestionsCreate
# Descrizione:
#   Schema per la creazione di una nuova domanda.
#
# Scopo:
#   Validare i dati quando si crea una nuova domanda.
# 
# Campi:
#   - composer_id
#   - audio
#   - image
#   - correct
#   - explanation
# 
# Uso:
#   Negli endpoint POST e PUT per creare domande.
#
# Nota:
#   Non include l'id perché viene generato automaticamente dal sistema.
class QuestionsCreate(BaseModel):
    composer_id: int
    audio: str
    image: str
    correct: str
    explanation: str
##############################################################################################################
# Class: QuestionsResponse
# Descrizione:
#   Schema per le risposte dell'API riguardanti le domande.
#
# Scopo:
#   Definire il formato dei dati restituiti dall'API.
#
# Campi:
# Include anche l'id oltre ai dati della domanda.
# 
# Uso:
#   Nelle risposte di GET, POST, PUT per restituire le domande.
# 
# orm_mode = True: permette la conversione automatica da oggetti ORM (database) a JSON.
class QuestionsResponse(BaseModel):
    id: int
    composer_id: int
    audio: str
    image: str
    correct: str
    explanation: str

    class Config:
        orm_mode = True
#########################################################################################################################

#########################################################################################################################
#Composers
#########################################################################################################################

# Class: ComposersCreate
# Descrizione:
#   Schema per la creazione di un nuovo compositore.
# 
# Scopo:
#   Validare i dati quando si crea un nuovo compositore.
# 
# Campi (tutti richiesti)::
#   - name: nome del compositore
#   - category_id: id della categoria a cui appartiene il compositore
#   - image: percorso dell'immagine del compositore
# 
# Uso:
#   Negli endpoint POST e PUT per creare compositori.
# 
# Nota:
#   Non include l'id perché viene generato automaticamente dal sistema.
class ComposersCreate(BaseModel):
    name: str
    category_id: int
    image: str
#########################################################################################################################
# Class: ComposersResponse
# Descrizione:
#   Schema per le risposte dell'API riguardanti i compositori.
# 
# Scopo:
#   Definire il formato dei dati restituiti dall'API.
# 
# Campi:
#   Include anche l'id oltre ai dati del compositore.
# 
# Uso:
#   Nelle risposte di GET, POST, PUT per restituire i compositori.
# 
# orm_mode = True: permette la conversione automatica da oggetti ORM (database) a JSON.
class ComposersResponse(BaseModel):
    id: int
    name: str
    category_id: int
    image: str

    class Config:
        orm_mode = True
#########################################################################################################################

#########################################################################################################################
#Categories
#########################################################################################################################
# Class: CategoriesCreate
# Descrizione:
#   Schema per la creazione di una nuova categoria.
#
# Scopo:
#   Validare i dati quando si crea una nuova categoria.
#
# Campi (tutti richiesti)::
#   - name: nome della categoria
#
# Uso:
#   Negli endpoint POST e PUT per creare categorie.
class CategoriesCreate(BaseModel):
    name: str

# Class: CategoriesResponse
# Descrizione:
#   Schema per le risposte dell'API riguardanti le categorie.
#
# Scopo:
#   Definire il formato dei dati restituiti dall'API.
#
# Campi:
#   Include anche l'id oltre al nome della categoria.
#
# Uso:
#   Nelle risposte di GET, POST, PUT per restituire le categorie.
#
# orm_mode = True: permette la conversione automatica da oggetti ORM (database) a JSON.
class CategoriesResponse(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True