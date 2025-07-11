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

/** SEZIONE DALTONICI E DISLESSICI
*   Questa sezione permette di attivare una modalità per i daltonici e per i dislessici
*   banalmente, quando si clicca sull'icona, viene aggiunta una classe al body
*   che quindi applica il realtivo stile CSS a tutti i propri figli
*   cioè a tutto il documento
*/
document.addEventListener('DOMContentLoaded', function() {
  const colorblindIcon = document.getElementById('colorblind-icon');
  const dyslexiaIcon = document.getElementById('dyslexia-icon');
  if (colorblindIcon) {
    colorblindIcon.addEventListener('click', function() {
      document.body.classList.toggle('colorblind-mode');
    });
  }
  if (dyslexiaIcon) {
    dyslexiaIcon.addEventListener('click', function() {
      console.log("Toggling dyslexic mode");
      document.body.classList.toggle('dyslexic-mode');
    });
  }
});
/* ######################################################### */

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

/** Function: generateQuestion()
*   Description:
*     La funzione generateQuestion() genera una domanda
*   Returns:
*     nulla
*/
function generateQuestion(i) {
  buttons.forEach(btn => btn.disabled = false);

  // Imposta immagine e audio
  images.sort(() => Math.random() - 0.5);
  audio_img.src = images[0];
  audio_img.alt = images[0] ? "Immagine della domanda" : "Esercizio senza immagine"; // Alternativa testuale dinamica
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
    buttons[b].setAttribute("aria-label", options[b].text); // Alternativa testuale per screen reader
    // Aggiorna anche il testo sr-only
    let sr = buttons[b].querySelector('.sr-only');
    if (sr) sr.textContent = options[b].text;
    buttons[b].onclick = null;
    buttons[b].onclick = function() {
      const isCorrect = buttons[b].getAttribute('data-correct') == "true";
      const explanation = buttons[b].getAttribute('explanation');
      if (isCorrect) {
        resultDiv.textContent = `✔️ Corretto! ${explanation}`;
        resultDiv.classList.remove('wrong-result');
        resultDiv.classList.add('right-result');
        correctAnswers++;
        buttons.forEach(btn => {
          btn.classList.add('wrong-answer');
          btn.disabled = true;
        });
        this.classList.remove('wrong-answer');
        this.classList.add('right-answer');
      } else {
        resultDiv.textContent = `❌ Risposta sbagliata.`;
        resultDiv.classList.remove('right-result');
        resultDiv.classList.add('wrong-result');
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

/*
Funzione per leggere il compositore dalla URL
Serve a recuperare il nome del compositore selezionato nella pagina precedente (home.html)
tramite il parametro presente nella barra degli indirizzi
*/
function getComposerFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('composer_id');
}
/*######################################################################*/

/*
In questa prima riga ci occupiamo di effettuare la HTTP request che chiami il compositore richiesto
Dopodiché recuperiamo tutte le domande ad egli correlate
Esso, grazie alla sua ultima riga, restituisce un file JSON,
che poi è facilmente manipolabile
*/
const composer_id = getComposerFromURL();
fetch(`http://127.0.0.1:8000/questions/by_composer/${composer_id}`) //HTTP request del compositore
  .then(async res => {
    const json = await res.json();
    if (!res.ok) {
      // Se la risposta HTTP è un errore, lo segnaliamo in console
      console.error("Errore HTTP:", json.detail || json);
      throw new Error(json.detail || "Errore nella richiesta");
    }
    return json;
})
  .then(json => {
    console.log(json);
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
/* ############################################################################################## */