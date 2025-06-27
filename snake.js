const canvas = document.getElementById("game"); //Creiamo la costante canvas, dove il nostro gioco verrà disegnato
/*
    Questa riga di codice ottiene il contesto di rendering 2D dal canvas HTML selezionato in precedenza.
    La variabile ctx (abbreviazione di "context") rappresenta l’oggetto che fornisce tutti i metodi e le proprietà necessari
    per disegnare forme, immagini, testo e altri elementi grafici sul canvas.
    In pratica, ogni volta che vogliamo disegnare qualcosa sul canvas (ad esempio, il serpente o il cibo nel gioco Snake),
    useremo i metodi di ctx per farlo.
    Se non si specifica "2d", il canvas non può essere utilizzato per il disegno bidimensionale.
*/
const ctx = canvas.getContext("2d");

/*
    Grazie a queste 3 costanti di gioco siamo in grado di implementare effettivamente la griglia di gioco.
    Abbiamo delle box di larghezza 20px,
    Un canvas di dimesione 400px per 400px,
    e un totale di 20 box (400px / 20px = 20 box).
*/
const box = 20;
const canvasSize = 400;
const totalBoxes = canvasSize / box;

/*
    Inizializziamo il serpente come un array di oggetti, dove ogni oggetto rappresenta una parte del corpo del serpente.
    Iniziamo con un serpente di una sola parte, posizionato al centro del canvas.
*/
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = "RIGHT"; // Direzione iniziale del serpente, verso destra

/*  Array di immagini per il cibo (ordine fisso)
    Ogni immagine rappresenta la scritta di una nota musicale
    Le immagini sono in ordine di apparizione: do, re, mi, fa, sol, la, si
    L'array è ciclico, quindi dopo si torna a do
*/
const foodImages = [
  "immagini/do_scritta.png",
  "immagini/re_scritta.png",
  "immagini/mi_scritta.png",
  "immagini/fa_scritta.png",
  "immagini/sol_scritta.png",
  "immagini/la_scritta.png",
  "immagini/si_scritta.png"
];
/*
    L'array di immagini precedentemente definito dovrà essere scorso, per fare questa cosa creiamo un indice apposta
*/
let foodImageIndex = 0;

/*
    Definiamo un oggetto food.
    Esso rappresenterà tutti i cibi che compariranno nel gioco.
    Sarà definito da una posizione x e y, che saranno calcolate in base alla griglia di gioco,
    e da un'immagine che rappresenta il cibo.
    Come possiamo vedere, gli attributi x e y sono calcolati in modo casuale dal costruttore quando viene chiamato.
    L'immagine è il terzo parametro
*/
let food = {
  x: Math.floor(Math.random() * totalBoxes) * box,
  y: Math.floor(Math.random() * totalBoxes) * box,
  img: new Image()
};
food.img.src = foodImages[foodImageIndex]; // assegniamo l'immagine della nota cui siamo arrivati all'oggetto food

/*
    Implementiamo tutta quella parte che riguarda il controllo della direzione del serpente.
    Chiaramente, dobbiamo stare attenti che il serpente non può cambiare direzione in modo opposto a quella in cui sta andando
    Ad esempio, se il serpente sta andando a destra, non può andare a sinistra.
*/
document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

let foodTimer = null; // Nuova variabile per l'intervallo del cibo

let foods = []; // Array di tutti i cibi attivi

/*
    Funzione per generare un nuovo cibo in una posizione casuale.
    La funzione assicura che il nuovo cibo non si sovrapponga al serpente o ad altri cibi già esistenti.
*/
function generateFood() {
  let x, y, overlap;
  do {
    // Genera solo tra 1 e totalBoxes-2 (esclusi i bordi)
    x = Math.floor(Math.random() * (totalBoxes - 2) + 1) * box;
    y = Math.floor(Math.random() * (totalBoxes - 2) + 1) * box;
    /*
        Controlla se la nuova posizione del cibo si sovrappone a un cibo esistente o al corpo del serpente.
        "foods.some(f => f.x === x && f.y === y)" restituisce true se almeno un oggetto nell’array foods ha
        le stesse coordinate x e y specificate, cioè se c’è già del cibo in quella posizione.
        "snake.some(s => s.x === x && s.y === y)" fa lo stesso controllo per ogni segmento del serpente.
    */
    overlap = foods.some(f => f.x === x && f.y === y) || snake.some(s => s.x === x && s.y === y);
  } while (overlap); //finché c'è un overlap, continua a generare nuove coordinate

  foodImageIndex = (foodImageIndex + 1) % foodImages.length; //aumentiamo il contatore dell'immagine del cibo e lo riportiamo a 0 se supera la lunghezza dell'array
  /*
      Creiamo un nuovo oggetto cibo con le coordinate x e y generate casualmente,
      e l'immagine corrispondente all'indice foodImageIndex.
      Questo oggetto viene poi aggiunto all'array foods, che contiene tutti i cibi attivi.
  */
  const newFood = { //costruttore dell'oggetto cibo
    x,
    y,
    img: new Image()
  };
  newFood.img.src = foodImages[foodImageIndex]; // assegniamo l'immagine della nota cui siamo arrivati al nuovo cibo
  foods.push(newFood); //aggiungiamo il nuovo cibo all'array foods
}

let nextFoodToEat = 0; // Indice del prossimo cibo da mangiare
let score = 0;
/*
    La funzione "draw()" gestisce il ciclo principale di disegno e logica del gioco Snake.
    All’inizio, pulisce l’intero canvas per prepararlo al nuovo frame,
    evitando sovrapposizioni tra i disegni precedenti e quelli attuali.
    Successivamente, disegna il serpente:
    per ogni segmento, viene creato un rettangolo verde chiaro per la testa ("#0f0")
    e verde scuro per il corpo ("#0a0"), posizionandoli in base alle coordinate di ciascun segmento.
    Poi, per ogni oggetto cibo presente nell’array "foods",
    viene disegnata l’immagine corrispondente nella posizione specificata.
    La funzione calcola quindi la nuova posizione della testa del serpente in base alla direzione attuale.
    Se la nuova testa esce dai bordi del canvas o si sovrappone a un segmento del corpo, il gioco termina:
    vengono fermati i timer e viene mostrato un messaggio di “Game Over”.
    Per la gestione del cibo, la funzione controlla se la testa del serpente si trova sulla stessa posizione di un cibo.
    Se sì, verifica se si tratta del cibo giusto (quello con indice "nextFoodToEat"):
    se è corretto, il cibo viene rimosso, il punteggio aumenta e il serpente si allunga (non viene rimossa la coda);
    se invece si mangia il cibo sbagliato, il gioco termina con un messaggio specifico.
    Se non viene mangiato nessun cibo, il serpente si muove normalmente:
    la coda viene rimossa per mantenere la lunghezza costante.
    Infine, la nuova testa viene aggiunta all’inizio dell’array "snake",
    aggiornando così la posizione del serpente per il prossimo frame.
    Questa funzione è fondamentale per gestire sia la grafica che la logica di gioco frame per frame.
*/
function draw() {
  /*
    All’inizio, pulisce l’intero canvas per prepararlo al nuovo frame,
    evitando sovrapposizioni tra i disegni precedenti e quelli attuali.
  */
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  /*
    Successivamente, disegna il serpente:
    per ogni segmento, viene creato un rettangolo verde chiaro per la testa ("#0f0")
    e verde scuro per il corpo ("#0a0"), posizionandoli in base alle coordinate di ciascun segmento.
  */
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#0f0" : "#0a0";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  /*
    Poi, per ogni oggetto cibo presente nell’array "foods",
    viene disegnata l’immagine corrispondente nella posizione specificata.
  */
  for (const f of foods) {
    ctx.drawImage(f.img, f.x, f.y, box, box);
  }

  /*
    Questo blocco di codice calcola la nuova posizione della testa del serpente in base alla direzione di movimento attuale.
    Si crea un nuovo oggetto head copiando le coordinate della testa corrente del serpente (snake[0]).
    Poi, a seconda del valore della variabile direction, si aggiorna la coordinata x o y della testa:
    se la direzione è "LEFT", si diminuisce x di una cella (box); se è "UP", si diminuisce y;
    se è "RIGHT", si aumenta x; se è "DOWN", si aumenta y.
    In questo modo, la nuova testa si sposterà nella direzione scelta dal giocatore,
    simulando il movimento del serpente sulla griglia.
  */
  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  /*
    Controllo collisioni
    Questa parte di codice si occupa di verificare se la testa del serpente esce dai bordi del canvas
    o se si sovrappone a un segmento del corpo del serpente.
  */
  if (
    head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || //se la testa esce dai bordi del canvas
    snake.some(seg => seg.x === head.x && seg.y === head.y) //se la testa si sovrappone a un segmento del corpo del serpente
  ) {
    gameOver("Hai perso!"); // Chiama la funzione gameOver con il messaggio
    return; // Esci dalla funzione per non continuare il gioco
  }

  /*
    Questa parte di codice gestisce la logica del cibo:
    La parte fondamentale è il controllo se la testa del serpente si trovi sulla stessa posizione di un cibo.
    Inoltre bisogna verificare se si tratta del cibo giusto (quello con indice "nextFoodToEat").
  */
  /*
    Troviamo, come prima cosa, l'indice della casella "mangiata".
    Idealmente possiamo pensare che il serpente "morda" sempre la casella in cui è arrivato,
    ma che a volte in questa casella non vi sia nulla.
  */
  const eatenIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);
  if (eatenIndex !== -1) { //La funzione findIndex restituisce -1 se non trova nulla
    if (eatenIndex === nextFoodToEat) { //ha mangiato il cibo giusto
      foods.splice(nextFoodToEat, 1); // Rimuovi il cibo giusto
      nextFoodToEat = 0; // Il prossimo cibo da mangiare sarà sempre il primo dell'array
      score++; // Incrementa il punteggio
      document.getElementById("scoreBox").textContent = score; // Aggiorna la visualizzazione
      // Il serpente si allunga (non togliere la coda)
    } else {
      gameOver("Hai mangiato il cibo sbagliato! Game Over!"); // Hai mangiato il cibo sbagliato: GAME OVER
      return; // Esci dalla funzione per non continuare il gioco
    }
  } else { //non hai mangiato nulla
    snake.pop(); // Rimuovi l'ultima parte del serpente per mantenere la lunghezza costante
  }

  snake.unshift(head); // Aggiungi la nuova testa all'inizio del serpente con il metodo unshift che aggiunge un elemento all'inizio di un array
}

let game = null;
/*
  La funzione "startGame()"" serve per avviare una nuova partita di Snake, reimpostando tutto lo stato del gioco.
  All’inizio, azzera il serpente (posizionandolo al centro della griglia), la direzione, l’indice dell’immagine del cibo,
  l’array dei cibi, il prossimo cibo da mangiare e il punteggio,
  aggiornando anche la visualizzazione del punteggio nell’interfaccia.
  Viene poi creato il primo oggetto cibo con coordinate casuali e l’immagine corrispondente,
  che viene aggiunto all’array dei cibi.
  La funzione "hideGameOverBox()" nasconde l’eventuale messaggio di “Game Over” visualizzato in precedenza.
  Infine, se erano già attivi timer di gioco, questi vengono fermati per evitare conflitti.
  Vengono poi avviati due nuovi timer: uno ("game") che richiama la funzione "draw" ogni 100 millisecondi
  per aggiornare la grafica e la logica del gioco, e uno ("foodTimer") che genera nuovo cibo ogni 3 secondi.
  In questo modo, la partita riparte sempre da uno stato pulito e pronto per il giocatore.
*/
function startGame() {
  // Reset stato
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  foodImageIndex = 0;
  foods = [];
  nextFoodToEat = 0;
  score = 0;
  document.getElementById("scoreBox").textContent = score;
  // Aggiungi il primo cibo
  const firstFood = {
    x: Math.floor(Math.random() * totalBoxes) * box,
    y: Math.floor(Math.random() * totalBoxes) * box,
    img: new Image()
  };
  firstFood.img.src = foodImages[foodImageIndex];
  foods.push(firstFood);

  hideGameOverBox();

  if (game) clearInterval(game);
  if (foodTimer) clearInterval(foodTimer);
  game = setInterval(draw, 100);
  foodTimer = setInterval(generateFood, 3000);
}

document.getElementById("startBtn").addEventListener("click", startGame);

function gameOver(message){
  clearInterval(game);
  clearInterval(foodTimer);
  const box = document.getElementById("gameOverBox");
  box.textContent = message;
  box.style.display = "block";
}

function hideGameOverBox() {
  const box = document.getElementById("gameOverBox");
  box.style.display = "none";
}