let index = 0;
/* Parte di codice della Home */
function moveSlide(direction) {
  const slides = document.querySelector('.slides');
  const totalSlides = slides.children.length;
  const slide = slides.children[0];
  const slideStyle = getComputedStyle(slide);
  const slideWidth = slide.offsetWidth + parseInt(slideStyle.marginRight || 0);

  const visibleArea = slides.parentElement.offsetWidth;
  const totalWidth = slideWidth * totalSlides;
  const maxTranslate = totalWidth - visibleArea;

  let newIndex = index + direction;
  if (newIndex < 0) newIndex = 0;

  // Calcola la traslazione in pixel
  let translate = newIndex * slideWidth;
  // Se la traslazione supera il massimo, blocca al massimo consentito
  if (translate > maxTranslate) {
    translate = maxTranslate;
    // aggiorna anche l'indice per evitare di andare oltre
    newIndex = Math.floor(maxTranslate / slideWidth);
  }

  index = newIndex;
  slides.style.transform = `translateX(-${translate}px)`;
}
/* ######################## */

/* Codice del quiz */
/* Qui dichiariamo le costanti per manipolare gli elementi HTML */
const scoreText = document.getElementById("score");
const audio_img = document.getElementById('audio-img');
const audio_inside = document.getElementById('audio-inside');
const answer_button_red = document.getElementById('answer-button-red');
const answer_button_green = document.getElementById('answer-button-green');
const answer_button_blue = document.getElementById('answer-button-blue');
const answer_button_orange = document.getElementById('answer-button-orange');
const buttons = [answer_button_red, answer_button_blue, answer_button_orange, answer_button_green];
const next_button = document.getElementById('next-button');
const resultDiv = document.getElementById('result');
/* ########################################################### */

/* Dichiariamo una serie di variabili di ambiente e le impostiamo al valore inziale con la funzione environment*/
let array = [];
let i = 0;
let currentQuestion = 0;
let correctAnswers = 0;
function environment(){
  array = [];
  for (answer of answers) {
    array.push(i);
    i++;
  }
  i = 0;
  currentQuestion = 0;
  correctAnswers = 0;
  buttons.forEach(btn => btn.disabled = false); // Abilita i bottoni dopo la risposta
  next_button.textContent = "Prossima domanda";
  scoreText.textContent = "Buona fortuna!";
  array = array.sort(() => Math.random() - 0.5);
}
/* ################################################################### */

/* La funzione generateQuestion() genera una domanda */
function generateQuestion(i) {
  buttons.forEach(btn => btn.disabled = false);
  

  // Imposta immagine e audio
  images.sort(() => Math.random() - 0.5);
  audio_img.src = images[0];
  audio_inside.src = answers[array[i]][0];

  // Prendi la risposta giusta
  const correctAnswer = {
    text: answers[array[i]][1],
    correct: true,
    explanation: answers[array[i]][2]
  };

  // Prendi le risposte sbagliate (da altre domande)
  let wrongAnswers = [];
  for (let j = 0; j < answers.length; j++) {
    if (j !== array[i]) {
      wrongAnswers.push({
        text: answers[j][1],
        correct: false,
        explanation: answers[j][2]
      });
    }
  }
  // Mischia e prendi le prime 3 sbagliate
  wrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);

  // Unisci e mescola tutte le risposte
  let options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

  // Assegna le risposte ai bottoni
  for (let b = 0; b < 4; b++) {
    buttons[b].textContent = options[b].text;
    buttons[b].setAttribute("data-correct", options[b].correct);
    buttons[b].setAttribute("explanation", options[b].explanation);
    buttons[b].onclick = null;
    buttons[b].onclick = function() {
      const isCorrect = buttons[b].getAttribute('data-correct') == "true";
      const explanation = buttons[b].getAttribute('explanation');
      if (isCorrect) {
        resultDiv.textContent = `✔️ Corretto! ${explanation}`;
        resultDiv.style.color = "lightgreen";
        correctAnswers++;
        buttons.forEach(btn => {
          btn.classList.add('wrong-answer');
          btn.disabled = true;
        });
        this.classList.remove('wrong-answer');
        this.classList.add('right-answer');
      } else {
        resultDiv.textContent = `❌ Risposta sbagliata.`;
        resultDiv.style.color = "red";
      }
      buttons.forEach(btn => btn.disabled = true);
      currentQuestion++;
      scoreText.textContent = `Risposte corrette: ${correctAnswers} su ${currentQuestion}`;
      next_button.style.display = 'block';
      if (currentQuestion == array.length){
          next_button.textContent = "Ricomincia il quiz";
      }
    };
  }
}

/* Funzione che permette di passare alla prossima domanda o di ricominciare il quiz*/
function nextRestart(){
  if (currentQuestion == array.length){
    environment();
  }
  generateQuestion(currentQuestion);
  next_button.style.display = "none";
  resultDiv.textContent = "";
  buttons.forEach(btn => btn.classList.remove('right-answer'));
  buttons.forEach(btn => btn.classList.remove('wrong-answer'));
}
/*#####################################################*/


/* Manipolazione del database ed effettiva esecuzione */
const config = {
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
};

let images = [];
let answers = [];
currentQuestion = 0;

initSqlJs(config).then(SQL => {
  fetch("/quiz/questions.db")  // Assicurati che quiz.db sia servito correttamente dal server
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const db = new SQL.Database(new Uint8Array(buffer));
      const results = db.exec("SELECT * FROM domande");

      if (!results.length) throw new Error("Nessun risultato nella tabella 'domande'");

      const columns = results[0].columns;
      const values = results[0].values;
      const json = values.map(row => Object.fromEntries(row.map((val, i) => [columns[i], val])));

      // Ora json è un "normale" file .json
      images = json.map(q => q.image);
      answers = json.map(q => [
        q.audio,
        q.correct,
        q.explanation
      ]);

      environment();
      generateQuestion(currentQuestion);
    })
    .catch(err => console.error("Errore:", err));
});
/* ############################################################################################## */