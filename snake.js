const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
const totalBoxes = canvasSize / box;

let snake = [{ x: 9 * box, y: 9 * box }];
let direction = "RIGHT";

// Array di immagini per il cibo (ordine fisso)
const foodImages = [
  "immagini/do_scritta.png",
  "immagini/re_scritta.png",
  "immagini/mi_scritta.png",
  "immagini/fa_scritta.png",
  "immagini/sol_scritta.png",
  "immagini/la_scritta.png",
  "immagini/si_scritta.png"
];
let foodImageIndex = 0;

// Oggetto cibo con anche l'immagine
let food = {
  x: Math.floor(Math.random() * totalBoxes) * box,
  y: Math.floor(Math.random() * totalBoxes) * box,
  img: new Image()
};
food.img.src = foodImages[foodImageIndex];

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

let foodTimer = null; // Nuova variabile per l'intervallo del cibo

let foods = []; // Array di tutti i cibi attivi

function generateFood() {
  let x, y, overlap;
  do {
    // Genera solo tra 1 e totalBoxes-2 (esclusi i bordi)
    x = Math.floor(Math.random() * (totalBoxes - 2) + 1) * box;
    y = Math.floor(Math.random() * (totalBoxes - 2) + 1) * box;
    overlap = foods.some(f => f.x === x && f.y === y) || snake.some(s => s.x === x && s.y === y);
  } while (overlap);

  foodImageIndex = (foodImageIndex + 1) % foodImages.length;
  const newFood = {
    x,
    y,
    img: new Image()
  };
  newFood.img.src = foodImages[foodImageIndex];
  foods.push(newFood);
}

let nextFoodToEat = 0; // Indice del prossimo cibo da mangiare
let score = 0;

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Disegna serpente
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#0f0" : "#0a0";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Disegna tutti i cibi attivi
  for (const f of foods) {
    ctx.drawImage(f.img, f.x, f.y, box, box);
  }

  // Movimento
  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  // Game over - bordi o corpo
  if (
    head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    clearInterval(game);
    clearInterval(foodTimer);
    showGameOverBox("Game Over!");
    return;
  }

  // Mangia: solo se la testa è sul cibo giusto (quello con indice nextFoodToEat)
  const eatenIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);
  if (eatenIndex !== -1) {
    if (eatenIndex === nextFoodToEat) {
      foods.splice(nextFoodToEat, 1); // Rimuovi il cibo giusto
      nextFoodToEat = 0; // Il prossimo cibo da mangiare sarà sempre il primo dell'array
      score++; // Incrementa il punteggio
      document.getElementById("scoreBox").textContent = score; // Aggiorna la visualizzazione
      // Il serpente si allunga (non togliere la coda)
    } else {
      // Hai mangiato il cibo sbagliato: GAME OVER
      clearInterval(game);
      clearInterval(foodTimer);
      showGameOverBox("Hai mangiato il cibo sbagliato! Game Over!");
      return;
    }
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

let game = null;

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

function showGameOverBox(message) {
  const box = document.getElementById("gameOverBox");
  box.textContent = message;
  box.style.display = "block";
}

function hideGameOverBox() {
  const box = document.getElementById("gameOverBox");
  box.style.display = "none";
}