// Seleziona il contenitore di gioco nel DOM
const game = document.getElementById('game');

// Inizializza la griglia come array vuoto
let grid = [];

// Funzione per inizializzare una griglia 4x4
function initGrid() {
  grid = [];
  for (let i = 0; i < 4; i++) {
    grid[i] = [];
    for (let j = 0; j < 4; j++) {
      grid[i][j] = 0; // Imposta ogni cella a 0
    }
  }
  addRandomTile(); // Aggiunge una prima tessera
  addRandomTile(); // Aggiunge una seconda tessera
  render(); // Mostra la griglia a schermo
}

// Funzione per aggiungere una tessera in una posizione casuale vuota
function addRandomTile() {
  let empty = [];
  // Trova tutte le celle vuote (valore 0)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        empty.push([i, j]); // Salva coordinate delle celle vuote
      }
    }
  }
  // Se ci sono celle vuote, sceglie una a caso e inserisce un 2
  if (empty.length > 0) {
    let [x, y] = empty[Math.floor(Math.random() * empty.length)];
    grid[x][y] = 2;
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
// Funzione per aggiornare visivamente la griglia nel DOM
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
      game.appendChild(tile); // Aggiunge il div al DOM
    }
  }
}

// Aggiunge un listener per i tasti premuti dall'utente
document.addEventListener("keydown", (e) => {
  console.log("Hai premuto:", e.key);
});
// Aggiunge un listener per le frecce direzionali
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      moveUp();    // Sposta verso l'alto
      break;
    case 'ArrowDown':
      moveDown();  // Sposta verso il basso
      break;
    case 'ArrowLeft':
      moveLeft();  // Sposta a sinistra
      break;
    case 'ArrowRight':
      moveRight(); // Sposta a destra
      break;
  }
  addRandomTile(); // Aggiunge una nuova tessera dopo ogni mossa
  render();        // Render della nuova griglia
});

// Funzione per trasporre la matrice (utile per movimenti verticali)
function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

// Funzione per invertire righe o colonne (utile per movimenti destra/giù)
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
  row = row.filter(val => val); // Rimuove zeri
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;        // Unisce due tessere uguali
      row[i + 1] = 0;     // La seconda diventa 0
    }
  }
  return row.filter(val => val).concat(Array(4).fill(0)).slice(0, 4); // Riempie con zeri
}

// Funzione per muovere a sinistra
function moveLeft() {
  for (let i = 0; i < 4; i++) {
    grid[i] = operate(grid[i]); // Applica la logica di fusione riga per riga
  }
}

// Funzione per muovere a destra
function moveRight() {
  for (let i = 0; i < 4; i++) {
    grid[i] = reverse(operate(reverse(grid[i]))); // Inverte, opera, poi reinverte
  }
}

// Funzione per muovere verso l'alto
function moveUp() {
  grid = transpose(grid);      // Trasforma righe in colonne
  moveLeft();                  // Applica la logica come se fosse una mossa a sinistra
  grid = transpose(grid);      // Torna alla disposizione originale
}

// Funzione per muovere verso il basso
function moveDown() {
  grid = transpose(grid);      // Trasforma righe in colonne
  moveRight();                 // Applica la logica come se fosse una mossa a destra
  grid = transpose(grid);      // Torna alla disposizione originale
}

// Avvia il gioco all'apertura della pagina
initGrid();
