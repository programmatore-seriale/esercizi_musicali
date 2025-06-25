// Seleziona il contenitore di gioco nel DOM
const game = document.getElementById('game');

// Inizializza la griglia come array vuoto
let grid = [];

/* Impostiamo il punteggio iniziale a 0 */
let score = 0;
let score_string;

/* Funzione per inizializzare una griglia 4x4 */
function initGrid() {
  grid = [];
  score = 0; // Impostiamo nuovamente il punteggio a 0, nel caso si stia ricominciando il gioco
  score_string = "";
  for (let i = 0; i < 4; i++) { // Crea 4 righe
    grid[i] = []; // Ogni riga è un array vuoto
    for (let j = 0; j < 4; j++) { // Per ogni riga, crea 4 colonne
      grid[i][j] = 0; // Imposta ogni cella a 0
    }
  }
  addRandomTile(); // Aggiunge una prima tessera
  addRandomTile(); // Aggiunge una seconda tessera
  render(); // Mostra la griglia a schermo
}

/* Funzione per aggiungere una tessera in una posizione casuale vuota */
function addRandomTile() {
  let empty = [];
  // Scorre la griglia per trovare celle vuote
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        empty.push([i, j]); // Salva coordinate delle celle vuote
      }
    }
  }
  // Se ci sono celle vuote, sceglie una a caso e inserisce un "2"(che per noi sarebbe una semifusa)
  if (empty.length > 0) { //quindi se la lunghezza dell'array empty è maggiore di 0, vuol dire che ci sono celle vuote
    let [x, y] = empty[Math.floor(Math.random() * empty.length)]; // Sceglie una cella vuota a caso tra quelle dell'array empty
    grid[x][y] = 2; // Inserisce un "2" in quella cella (semifusa)
  }
}
// Mappa dei valori a Uindirizzo delle immagini
const imageMap = {
  2: "immagini/semifusa.png",
  4: "immagini/fusa.png",
  8: "immagini/semibiscroma.png",
  16: "immagini/biscroma.png",
  32: "immagini/semicroma.png",
  64: "immagini/croma.png",
  128: "immagini/semiminima.png",
  256: "immagini/minima.png",
  512: "immagini/semibreve.png",
  1024: "immagini/breve.png",
  2048: "immagini/lunga.png"
};

/* La funzione render permette di mostrare la griglia nello stato attuale */
function render() {
  game.innerHTML = ''; // Svuota il contenitore del gioco
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const tile = document.createElement('div'); // Crea un div per ogni cella
      tile.className = 'tile';
      tile.dataset.value = grid[i][j]; // Usa il valore per lo stile
      if (grid[i][j] !== 0) {
        const img = document.createElement('img');
        img.src = imageMap[grid[i][j]] || ''; // URL da mappa, vuoto se non trovato
        img.alt = grid[i][j];
        img.classList.add('tile-img');
        tile.appendChild(img);
      }
      game.appendChild(tile); // Aggiunge il div al contenitore game
    }
  }
  document.getElementById("scoreBox").textContent = score_string; // Aggiorna il punteggio a schermo
}

/* Aggiunge un listener per i tasti premuti dall'utente, questa funzione serve solo come debug personale */
document.addEventListener("keydown", (e) => {
  console.log("Hai premuto:", e.key);
});

/* Aggiunge un listener per le frecce direzionali e il pulsante di cheat*/
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      moveUp();
      addRandomTile();
      score_string = calculateScore();
      render();
      break;
    case 'ArrowDown':
      moveDown();
      addRandomTile();
      score_string = calculateScore();
      render();
      break;
    case 'ArrowLeft':
      moveLeft();
      addRandomTile();
      score_string = calculateScore();
      render();
      break;
    case 'ArrowRight':
      moveRight();
      addRandomTile();
      score_string = calculateScore();
      render();
      break;
    case 'Control':
      console.log("Cheat attivato!"); // Messaggio di debug
      cheat(); // Chiama la funzione cheat() se si preme il tasto Control
      score_string = calculateScore(); // Ricalcola il punteggio dopo il cheat
      render(); // Rende la griglia aggiornata
    default:
      break; // Ignora altri tasti
  }
});

/* Funzione per trasporre la matrice (utile per movimenti verticali) */
function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

/* Funzione per invertire righe o colonne (utile per movimenti destra/giù) */
function reverse(row) {
  if (Array.isArray(row)) {
    return row.slice().reverse();
  } else {
    console.error("reverse(): non è stato passato un array:", row);
    return row;
  }
}

// Funzione per unire e comprimere una singola riga
function operate(row) {
  /*Rimuoviamo tutte le celle vuote della riga, questo permette di comprimere la riga,
  questo accade perché tutti i valori diversi da 0 risulteranno True grazie alla arrow function identità*/
  row = row.filter(val => val); //  Rimuove gli zeri dalla riga
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {//se due tessere adiacenti sono uguali
      row[i] *= 2;        // Unisce le due tessere, raddoppiando il valore di quella più a sinistra
      row[i + 1] = 0;     // La seconda diventa 0, quindi rimossa: rimane solamente la tessera unita
    }
  }
  /* Rimuove gli zeri rimanenti e riempie con zeri fino a raggiungere la lunghezza di 4
  con row.filter(val => val), come abbiamo fatto prima, togliamo tutti gli elementi diversi da 0
  con .concat(Array(4).fill(0)) aggiungiamo 4 zeri in fondo all'array riga, così da assicurarci che essa abbia almeno 4 elementi
  con .slice(0,4) prendiamo solamente i primi 4 elementi, in questa maniera siamo sicuri che la riga abbia esattamente 4 elementi */
  return row.filter(val => val).concat(Array(4).fill(0)).slice(0, 4); // Riempie con zeri la riga
}

/* Funzione per muovere a sinistra, questa funzione applica la funzione operate() in maniera "base" */
function moveLeft() {
  for (let i = 0; i < 4; i++) {
    grid[i] = operate(grid[i]); // Applica la logica di fusione riga per riga
  }
}

/* Funzione per muovere a destra, questa funzione, prima inverte la matrice, poi applica la funzione operate() */
function moveRight() {
  for (let i = 0; i < 4; i++) {
    grid[i] = reverse(operate(reverse(grid[i]))); // Inverte, opera, poi reinverte
  }
}

/* Funzione per muovere verso l'alto */
function moveUp() {
  grid = transpose(grid);      // Trasforma righe in colonne
  moveLeft();                  // Applica la logica come se fosse una mossa a sinistra
  grid = transpose(grid);      // Torna alla disposizione originale
}

/* Funzione per muovere verso il basso */
function moveDown() {
  grid = transpose(grid);      // Trasforma righe in colonne
  moveRight();                 // Applica la logica come se fosse una mossa a destra
  grid = transpose(grid);      // Torna alla disposizione originale
}
/*Funzione atta a calcolare la potenza di 2 di un numero */
function powerOf2(number) {
  let exponent = 0;
  while (number % 2 === 0 && number > 0) {
    number /= 2;
    exponent++;
  }
  return exponent;
}
/* Funzione che semplifica due numeri per il fattore di 2 comune */
function simplify(number1, number2){
    let power = Math.min(powerOf2(number1), powerOf2(number2));
    num = number1/2**power;
    den = number2/2**power;
    switch(den){
      case 2:
        num = num * 2;
        den = den * 2;
        break;
      case 1:
        num = num * 4;
        den = den * 4;
        break;
      default:
        break;  
    }
    return [num, den];
}
/* Funzione per calcolare il punteggio */
function calculateScore() {
  let tempScore = 0;
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      tempScore += grid[i][j]/2;
    }
  }
  let num_den = simplify(tempScore, 256);
  return `${num_den[0]}/${num_den[1]}`;
}
/* Funzione cheat che permette di raddoppiare il valore di ogni tessera presente */
function cheat() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] !== 0) {
        grid[i][j] *= 2;
      }
    }
  }
}
/* Avvia il gioco all'apertura della pagina */
initGrid();
